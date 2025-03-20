import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Roles } from '../enums/user.enum';
import { HydratedDocument } from 'mongoose';
import { hash } from 'src/common/security/hash.security';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Boolean, default: false })
  accountAcctivated: boolean;

  @Prop({ type: String, default: Roles.USER })
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = hash(this.password);
  }
  return next();
});

export const UserModelName = User.name;
export const UserModel = MongooseModule.forFeature([
  { name: UserModelName, schema: UserSchema },
]);
export type UserDocument = HydratedDocument<User>;
