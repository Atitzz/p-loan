import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class Register {
    @IsEmail()
    email: string;

    @Length(4,30)
    username: string;

    @Length(4,30)
    password: string;
}

export class Login {
    @Length(4,30)
    username: string;

    @Length(4,30)
    password: string;
}