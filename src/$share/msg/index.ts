import { IRS } from "@cellularjs/net";

export function BadRequest(body: any = {}) {
  return new IRS({ staus: 400 }, { err: 'BAD_REQUEST', ...body });
}

export function Unprocessable(body: any = {}) {
  return new IRS({ staus: 422 }, { err: 'UNPROCESSABLE', ...body });
}
