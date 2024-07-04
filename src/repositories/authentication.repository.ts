import IUser from "../interfaces/user.interface";
import UserModel from "../models/user. model";


class AuthenticationRepository {
  constructor() {
  }

  /**
   * Login a user to the server
   * @param user User login credentials
   */
  async login(user: IUser) {
    return await UserModel.findOne({ email: user.email })
  }

  register(user: IUser) {

  }
}

export default AuthenticationRepository;