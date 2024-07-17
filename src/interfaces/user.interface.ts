import { Document } from "mongoose";

enum Role {
  REGULAR = 'Regular',
  ADMIN = 'Admin'
}

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  token?: string;
  walletBalance?: number;
}

export default IUser;
export { Role };