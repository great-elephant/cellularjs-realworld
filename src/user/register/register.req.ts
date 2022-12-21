import { IsNotEmpty, IsEmail } from 'class-validator';
import { ValidateReq } from '$share/validator';

@ValidateReq((irq) => irq.body.user)
export class RegisterReq {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  username: string;
}
