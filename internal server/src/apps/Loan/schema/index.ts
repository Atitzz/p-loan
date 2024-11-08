import { Type } from "class-transformer";
import { IsArray, IsDate, IsDecimal, IsEmail, isJSON, IsNotEmpty, IsNumber, IsObject, Length } from "class-validator";

export class takeLoan {
    @IsNotEmpty()
    user_id: Number;

    @IsNotEmpty()
    plan_id: Number;

    @IsNumber()
    amount: Number;

    @IsNumber()
    installment: Number;

    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @IsDate()
    @Type(() => Date)
    createDate: Date;

    @IsObject()
    appForm: string;
}

export class Payment {
    @IsNotEmpty()
    loan_id: Number;

    @IsNotEmpty()
    type: string;

    @IsNumber()
    paidAmount: Number;

    @IsDate()
    @Type(() => Date)
    paymentDate: Date;
}

export class createLoanPlan {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    minimum_amount: Number;

    @IsNotEmpty()
    maximum_amount: Number;
}