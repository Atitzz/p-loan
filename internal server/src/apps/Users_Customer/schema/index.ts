import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class Register {
 
    @Length(4,30)
    password: string;

    @IsNotEmpty()
    mobile: string;
}

export class CheckChangePassword {
 
    @Length(4,30)
    password: string;

    @Length(4,30)
    newPassword: string;
}

export class CheckSetPassword {
 
    @Length(4,30)
    password: string;

}


export class CheckSetPIN {
 
    @Length(6,6)
    pin: string;

}

export class Login {
    @Length(4,30)
    mobile: string;

    @Length(4,30)
    password: string;
}

export class AdminUpdate {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    mobile: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    country: string;
}

export class AdminCreateUser {
    @IsNotEmpty()
    imgFront: string;
    @IsNotEmpty()
    imgBack: string;
    @IsNotEmpty()
    imgBook: string;

    @IsNotEmpty()
    titlename: string;

    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    mobile: string;

    @IsNotEmpty()
    salary: string;

    @IsNotEmpty()
    job: string;
}