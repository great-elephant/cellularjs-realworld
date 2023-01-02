import { Auth } from '$share/auth';
import { SignInData } from '$share/auth/sign-in-data';
import { Forbidden, NotFound } from '$share/msg';
import { Transactional } from '$share/typeorm';
import { IRQ, Service, ServiceHandler } from '@cellularjs/net';
import { CommentRepository } from 'article/$inner/comment.data';

@Auth()
@Transactional()
@Service({ scope: 'publish' })
export class DeleteCommentCmd implements ServiceHandler {
  constructor(
    private signInData: SignInData,
    private commentRepository: CommentRepository,
    private irq: IRQ,
  ) { }

  async handle() {
    const { signInData, commentRepository, irq } = this;
    const comment = await commentRepository.findOneBy({ id: irq.body.commentId });

    if (!comment) {
      throw NotFound();
    }

    if (comment.authorId !== signInData.userId) {
      throw Forbidden();
    }

    await commentRepository.delete(comment.id);
  }
}
