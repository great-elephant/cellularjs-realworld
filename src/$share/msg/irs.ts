import { IRS } from "@cellularjs/net";

export function Success(body: any = {}) {
  return new IRS({ status: 200 }, body);
}

export function BadRequest(body: any = {}) {
  return new IRS({ status: 400 }, { err: 'BAD_REQUEST', ...body });
}

export function UnAuthorized(body: any = {}) {
  return new IRS({ status: 401 }, { err: 'UNAUTHORIZED', ...body });
}

export function Forbidden(body: any = {}) {
  return new IRS({ status: 403 }, { err: 'FORBIDDEN', ...body });
}

export function NotFound(body: any = {}) {
  return new IRS({ status: 404 }, { err: 'NOT_FOUND', ...body });
}

export function Unprocessable(body: any = {}) {
  return new IRS({ status: 422 }, { err: 'UNPROCESSABLE', ...body });
}
