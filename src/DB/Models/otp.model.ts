import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'src/common/security/hash.security';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class OTP {
  @Prop({ type: String, required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ type: String, required: true })
  otp: string;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);

OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });

OTPSchema.pre('save', function (next) {
  if (this.isModified('otp')) {
    this.otp = hash(this.otp);
  }
  return next();
});

export const OTPModelName = OTP.name;
export const OTPModel = MongooseModule.forFeature([
  { name: OTPModelName, schema: OTPSchema },
]);
export type OTPDocument = HydratedDocument<OTP>;
