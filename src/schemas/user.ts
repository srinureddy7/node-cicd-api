import { createHash } from "crypto";
import { Model, Schema, model } from "mongoose";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser, Model<IUser>>({
  displayName: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  gender: String,
  dateOfBirth: String,
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  countryCode: String,
  country: String,
  state: String,
  district: String,
  pinCode: String,
  address: String,
  password: String,
  token: String,
  verificationInfo: {
    otp: {
      type: Number,
    },
    validity: {
      type: Number,
    },
  },
  photoUrl: String,
  photoPath: String,
  fcmTokens: {
    web: String,
    android: String,
    ios: String,
  },
  role: String,
  isOnline: {
    type: Boolean,
    default: false,
  },
  blockStatus: String,
  geoCode: [
    {
      LAT: String,
      LONG: String,
    },
  ],
  phoneNumberVerified: {
    type: Boolean,
    default: false,
  },
  lastLoginTime: Date,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  googleId: String,
  githubId: String,
  githubAccessToken: String,
  googleAccessToken: String,
  googleSecretToken: String,
  githubSecretToken: String,
});

userSchema
  .virtual("rawPassword")
  .set(function (rawPassword) {
    this.password = this.encryptPassword(rawPassword);
  })
  .get(function () {
    return this.password;
  });

userSchema.methods.authenticate = function (rawPassword: string) {
  return this.encryptPassword(rawPassword) === this.password;
};
userSchema.methods.encryptPassword = function (rawPassword: string) {
  if (!rawPassword) {
    return "";
  }
  try {
    return createHash("sha256").update(rawPassword).digest("hex");
  } catch (error) {
    return "";
  }
};

export const UserModel = model<IUser, Model<IUser>>("User", userSchema);
