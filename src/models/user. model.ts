import { Schema, model } from "mongoose";
import IUser, { Role } from "../interfaces/user.interface";

const NGNPhoneNumberPattern = /^((080|070|090|081|091|071|701|702|703|704|705|706|707|708|709)\d{7}\d{7})$/;
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
    maxLength: [11, '{VALUE} not a valid number']
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