import { IsNotEmpty } from 'class-validator';
import { ValidateReq } from '$share/validator';

@ValidateReq((irq) => ({
  ...irq.body.comment,
  slug: irq.body.slug,
}))
export class AddCommentReq {
  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  body: string;
}
