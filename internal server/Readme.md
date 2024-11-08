# คู่มือใช้งาน 

**โครงสร้าง**
/src/apps/{controllerName}

**โครงสร้างภายใน controller ที่ถูกสร้าง (ที่ต้องมี)**
/src/apps/{controllerName}/controller (ใช้สำหรับเขียน คำสั่งควบคุมและ method ต่างๆ)
/src/apps/{controllerName}/entities (ใช้สำหรับสร้างฐานข้อมูล)
/src/apps/{controllerName}/routes (ใช้สำหรับสร้าง link เข้าถึง controller จากภายนอก หรือ เว็บไซร์)

รูปแบบ การเขียน controller 

export async function list(req, res) {
    // เรียก ข้อมูลแบบ query www.test.com/part?search=a&page=1&limit=1 
    // search จะ มี value = a page มี value = 1 เป็นต้น
  const { search, page, limit } = req.query;

    // parseInt(Number) ใช้สำหรับตรวจสอบชนิดข้อมูลว่าเป็นตัวเลขหรือไม่ ถ้าไม่ จะทำงาน หลัง || (หรือ) แทน
  const perPage = parseInt(limit) || 20;
  const offset = (parseInt(page) - 1) * perPage || 0;
  let whereClause: any = {};

    //
  if (search) {
    whereClause.name = Like(`%${search}%`);
  }
  const _total = await orm(DataBase).count();
  const existed = await orm(DataBase).find({
    where: whereClause,
    take: perPage,
    skip: offset,
  });
  try {
    return res.success("Get Successfully", existed, {
      page: parseInt(page) || 1,
      total: _total,
      limit: parseInt(limit) || 20,
    });
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
}