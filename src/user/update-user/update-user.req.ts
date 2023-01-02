import { IsNotEmpty, IsEmail } from 'class-validator';
import { ValidateReq } from '$share/validator';

@ValidateReq((irq) => irq.body.user)
export class UpdateUserReq {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  image: string;

  bio: string;
}
