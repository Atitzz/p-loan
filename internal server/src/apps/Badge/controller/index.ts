import { LessThanOrEqual } from "typeorm";
import { orm } from "../../../data-source";
import { ContactUS } from "../../ContactUS/entities/contactus";
import { Loan } from "../../Loan/entities/loan";
import { LoanContractNonUser } from "../../Loan_non_user/entities/loan_contract";
import { Users } from "../../Users/entities";
import { status } from "../../Utils/enum";

export const badge = async (req,res) =>{
   
    const loan_new = await orm(Loan).count({where:{status:"Pending"}});
    const loan_due = await orm(Loan).count({where:{  installment_due: LessThanOrEqual(new Date()),
        status: "Running",}});
    const user_mobile_unverfied = await orm(Users).count({where:{sv:"unverified"}});
    const user_kyc_unverfied = await orm(Users).count({where:{kyc:"unverified"}});
    const user_kyc_pending = await orm(Users).count({where:{kyc:"pending"}});
    const loan_apply_now = await orm(LoanContractNonUser).count({where:{is_read:"0"}});
    const contact_us = await orm(ContactUS).count({where:{is_read:"0"}});
    const loans = loan_new > 0 ||loan_due>0 ? 1: 0 ;
    const users = user_mobile_unverfied > 0 ||user_kyc_unverfied>0||user_kyc_pending>0? 1 : 0 ;
    return res.success("Dashboard", {
        loans,
        users,
        loan_new,
        loan_due,
        user_mobile_unverfied,
        user_kyc_unverfied,
        user_kyc_pending,
        loan_apply_now,
        contact_us
    });
}