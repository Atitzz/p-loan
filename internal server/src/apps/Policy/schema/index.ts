import { IsNotEmpty } from "class-validator";

export class isPolicy {
   @IsNotEmpty()
    message: string;

    @IsNotEmpty()
    version: string;
}