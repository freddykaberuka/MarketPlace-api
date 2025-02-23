import { IsString } from "class-validator";
import { EStatus } from "../enums/status.enum";

export enum ESellerOrCustomer {
  SELLER = "SELLER",
  CUSTOMER = "CUSTOMER",
}

export class RegisterDto {
  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  role?: ESellerOrCustomer;

  status?: EStatus;
}
