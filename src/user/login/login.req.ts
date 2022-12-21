import { IsNotEmpty, IsEmail } from 'class-validator';
import { ValidateReq } from '$share/validator';

@ValidateReq((irq) => irq.body.user)
export class LoginReq {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
