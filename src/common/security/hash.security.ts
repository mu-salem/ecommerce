import * as bcrypt from 'bcrypt';

export const hash = (
  plainText: string,
  saltRound: number = Number(process.env.SALT_ROUND),
) => bcrypt.hashSync(plainText, saltRound);

export const comparehash = (plainText: string, hash: string) =>
  bcrypt.compareSync(plainText, hash);
