import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export enum GenderEnum {
  male = "male",
  female = "female",
}

export enum RoleEnum {
  admin = "admin",
  user = "user",
}

export interface IUser {
  _id: Types.ObjectId;

  firstName: string;
  lastName: string;
  username?: string;

  email: string;
  confirmEmailOtp?: string;
  confirmedAt?: Date;

  password: string;
  resetPasswordOtp?: string;
  changeCredentialsTime: Date;

  gender: GenderEnum;
  role: RoleEnum;

  phone?: string;
  address?: string;

  createdAt: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, minLength: 2, maxLength: 20 },
    lastName: { type: String, required: true, minLength: 2, maxLength: 20 },

    email: { type: String, required: true, unique: true },
    confirmEmailOtp: { type: String },
    confirmedAt: { type: Date },

    password: { type: String, required: true },
    resetPasswordOtp: { type: String },
    changeCredentialsTime: { type: Date },

    gender: { type: String, enum: GenderEnum, default: GenderEnum.female },
    role: { type: String, enum: RoleEnum, default: RoleEnum.user },

    phone: { type: String },
    address: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
userSchema
  .virtual("username")
  .set(function (value: string) {
    const [firstName, lastName] = value.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return this.firstName + " " + this.lastName;
  });
export const UserModel = models.User || model<IUser>("User", userSchema);
export type HUserDocument = HydratedDocument<IUser>;
