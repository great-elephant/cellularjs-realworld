import { IsNotEmpty } from 'class-validator';
import { ValidateReq } from '$share/validator';

@ValidateReq((irq) => irq.body.article)
export class CreateArticleReq {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  tagList: string[];
}
