import { Document } from "mongoose";

enum Role {
  REGULAR = 'REGULAR',
  ADMIN = 'ADMIN'
}

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  token?: string;
  walletBalance: number;
}

export default IUser;
export { Role };