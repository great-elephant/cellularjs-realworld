import { IsNotEmpty } from 'class-validator';
import { ValidateReq } from '$share/validator';

@ValidateReq((irq) => ({
  ...irq.body.article,
  slug: irq.body.slug,
}))
export class UpdateArticleReq {
  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  body: string;
}
