export interface CreateTokenReq {
  email: string;
  password: string;
}

export type CreateTokenRes = {
  token: string;
};
