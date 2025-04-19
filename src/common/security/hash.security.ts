import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

export const hash = (
  plainText: string,
  saltRound: number = new ConfigService().get('SALT_ROUND')!,
) => bcrypt.hashSync(plainText, Number(saltRound));

export const comparehash = (plainText: string, hash: string) =>
  bcrypt.compareSync(plainText, hash);
