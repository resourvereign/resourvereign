export type ApiModel<P> = P & { id: string };

export type PageMeta = {
  page: number;
  pageSize: number;
  total: number;
};
