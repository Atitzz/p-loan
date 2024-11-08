import { AppDataSource, orm } from "../../../data-source";
import { Coupon } from "../entities/coupon";
import { v4 as uuidv4 } from 'uuid';
import { Not, IsNull } from "typeorm"


// สร้างคูปอง
export const create_coupons = async (req, res) => {
    const { code, expiry_date, ...obj } = req.body;

    if (obj.discount_amount <= 0) return res.error('Discount amount must be greater than zero');
    if (obj.total_coupons <= 0) return res.error('Number of coupons must be greater than zero');
    if (new Date(expiry_date) <= new Date()) return res.error('Expiry date must be in the future');

    try {
        // สร้างตามจำนวนที่ระบุ (total_coupons)
        const coupons = [];
        for (let i = 0; i < obj.total_coupons; i++) {
            const coupon = new Coupon();
            coupon.code = uuidv4();
            coupon.coupon_type = obj.coupon_type;
            coupon.description = obj.description;
            coupon.discount_amount = obj.discount_amount;
            coupon.expiry_date = new Date(expiry_date);
            coupon.total_coupons = obj.total_coupons;
            const save = await orm(Coupon).save(coupon);
            coupons.push(save);
        }

        return res.success('Created Coupons Successfully', coupons);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};

// รับคูปอง
export const claim_coupon_code = async (req, res) => {
    const userId = req.user.id;
    const _userId = parseInt(userId) || -1;
    const { coupon_type } = req.body;
    try {
        // เช็คว่า user เคยใช้คูปองนี้ไปแล้วหรือยัง
        const usedCoupon = await orm(Coupon).findOne({ where: { user_id: _userId, used: true, coupon_type } });
        if (usedCoupon) return res.error('คุณใช้สิทธินี้ไปแล้ว');

        // เช็คว่า user กดรับไปแล้วหรือยัง
        const existingCoupon = await orm(Coupon).findOne({ where: { user_id: _userId, used: false, claimed_at: Not(IsNull()) } });

        if (existingCoupon) return res.error('คุณเคยกดรับโค้ดนี้ไปแล้ว');

        // ค้นหาคูปองที่ยังไม่ถูกใช้
        const coupon = await orm(Coupon).findOne({ where: { used: false, coupon_type } });

        if (!coupon) return res.error('No available coupons');

        // เช็คว่าแพคเกจนี้หมดอายุแล้วหรือยัง
        const now = new Date();
        const expiryDate = new Date(coupon.expiry_date);
        if (now > expiryDate) return res.error('แพคเกจนี้หมดอายุแล้ว');

        // บันทึกเวลารับสิทธิ และ ผู้รับสิทธิ
        coupon.claimed_at = new Date();
        coupon.user_id = _userId;

        await orm(Coupon).save(coupon);

        return res.success('Coupon Claimed Successfully', coupon);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.detail || err.routine });
    }
};


// ใช้คูปอง
export const use_coupon = async (req, res) => {
    const userId = req.user.id;
    const _userId = parseInt(userId) || -1;
    const { code } = req.body;
    try {
        const coupon = await orm(Coupon).findOne({ where: { code, user_id: _userId, used: false } });
        if (!coupon) return res.error('คูปองนี้ถูกใช้ไปแล้ว');

        const now = new Date();
        const expiryDate = new Date(coupon.expiry_date);
        const COUPON_EXPIRATION_TIME = 1000 * 60 * 30;

        // ปรับปรุงการเปรียบเทียบวันหมดอายุ
        if (now > expiryDate) return res.error('แพคเกจนี้หมดอายุแล้ว');

        if (coupon.claimed_at && (now.getTime() - new Date(coupon.claimed_at).getTime() > COUPON_EXPIRATION_TIME)) {
            await orm(Coupon).remove(coupon);

            const newCoupon = new Coupon();
            newCoupon.code = uuidv4();
            newCoupon.coupon_type = coupon.coupon_type;
            newCoupon.description = coupon.description;
            newCoupon.discount_amount = coupon.discount_amount;
            newCoupon.expiry_date = coupon.expiry_date;
            newCoupon.total_coupons = coupon.total_coupons;
            await orm(Coupon).save(newCoupon);

            return res.error('คูปองหมดอายุ กรุณากดรับใหม่');
        }
        coupon.used = true;
        await orm(Coupon).save(coupon);

        return res.success('Used Coupon Successfully', coupon);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.detail || err.routine });
    }
};

// ดูจำนวนที่เหลือ และประวัติการใช้
export const get_coupon_status = async (req, res) => {
    const { coupon_type } = req.body
    try {
        const coupons = await orm(Coupon).find({ where: { coupon_type } });

        const totalCoupons = coupons.length;
        const usedCoupons = coupons.filter(coupon => coupon.used).length;

        const stats = {
            TotalCoupon: totalCoupons,
            UsedCoupon: usedCoupons,
            availableCoupons: totalCoupons - usedCoupons
        }

        const detail = coupons.map((item) => {
            return {
                user_id: item.user_id,
                code: item.code,
                claimed_at: item.claimed_at,
                used: item.used,
            }
        })

        return res.success('Get Status Coupon', { stats, detail })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.detail || err.routine });
    }
};

export const delete_coupon = async (req, res) => {
    const { coupon_type } = req.body;
    try {
        const coupon = await orm(Coupon).find({ where: { coupon_type: coupon_type } })
        await orm(Coupon).remove(coupon)

        return res.success('remove successfully', coupon)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.detail || err.routine });
    }
}
