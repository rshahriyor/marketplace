export interface IResponse<T> {
  status: {
    code: number;
    message: string;
  }
  message?: string;
  data: T;
  meta: IResponseMeta;
}

export interface IResponseMeta {
  access_token?: string;
  refresh_token?: string;
  permissions?: string[];
}
