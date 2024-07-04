import { Schema, model } from "mongoose";
import IUser, { Role } from "../interfaces/user.interface";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, '{PATH} is required']
  },
  lastName: {
    type: String,
    required: [true, '{PATH} is required']
  },
  role: {
    type: String,
    enum: Role,
    default: Role.REGULAR
  },
  email: {
    type: String,
    unique: true,
    required: [true, '{PATH} is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function (data: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);
      },
      message: "{VALUE} is not a valid email address",
    }
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    maxlength: [11, '{VALUE} is not a valid phone number'],
    validate: {
      validator: function (tel: string) {
        return /^([08],[09],[07])\d{9}$/.test(tel);
      },
      message: "{VALUE} isn\'t a valid phone number"
    }
  },
  password: {
    type: String,
    required: [true, '{PATH} is required']
  },
  token: String,
  walletBalance: {
    type: Number,
    default: 0.00
  }
}, { timestamps: true, versionKey: false })

const UserModel = model<IUser>('User', userSchema, 'RegisteredUser');
export default UserModel;