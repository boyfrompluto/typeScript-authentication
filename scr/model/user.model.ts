import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
  pre,
  DocumentType,
  index,
} from "@typegoose/typegoose";
import argon2 from "argon2";
const nanoid = require("nanoid");
import log from "../utils/logger";

export const privateFields = [
  "password",
  "__v",
  "verificationToken",
  "resetToken",
  "iat",
];

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const hash = await argon2.hash(this.password);
  this.password = hash;
  return;
})
@index({ email: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;
  @prop({ required: true })
  lastName: string;
  @prop({ required: true })
  password: string;
  @prop({ required: true, default: () => nanoid() })
  verificationToken: string;
  @prop()
  resetToken: string | null;
  @prop({ default: false })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      log.error(e, "could ot validate password");
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
