import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserModelName } from './user.model';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Schema({ timestamps: true })
export class Token {
  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  user: Types.ObjectId;

  @Prop({ type: Date })
  expiredAt: Date;

  @Prop({ type: Boolean, default: true })
  isValid: boolean;

  // @Prop({ type: String })
  // agent: string;

  // @Prop({ type: String })
  // ip: string;

  // @Prop({ type: String })
  // type: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

TokenSchema.pre('save', function (next) {
  if (this.isNew) {
    const jwtService = new JwtService();
    const configService = new ConfigService();

    try {
      const payload = jwtService.verify(this.token, {
        secret: configService.get<string>('JWT_SECRET'),
      });

      this.expiredAt = new Date(payload.exp * 1000);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export const TokenModelName = Token.name;
export const TokenModel = MongooseModule.forFeature([
  { name: TokenModelName, schema: TokenSchema },
]);

export type TokenDocument = HydratedDocument<Token>;
