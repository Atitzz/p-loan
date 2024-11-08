import { IsNotEmpty } from "class-validator";

export class VerifyMobile {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    mobile: string;

    @IsNotEmpty()
    otp_code: string;
}