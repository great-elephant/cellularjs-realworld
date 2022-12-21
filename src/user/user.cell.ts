import { CommonModule } from '$share/common';
import { Cell } from '@cellularjs/net';

@Cell({
  imports: [CommonModule],
  providers: ['./'],
  listen: './'
})
export class User { }
