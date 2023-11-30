export type WithParsedDate<T, DateField extends string = 'date'> = Omit<T, DateField> & {
  [K in DateField]: Date;
};
