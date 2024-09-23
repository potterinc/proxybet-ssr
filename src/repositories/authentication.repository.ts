import IUser from "../interfaces/user.interface";
import UserModel from "../models/user. model";


class AuthenticationRepository {
  constructor() { }

  /**
   * Login a user to the server
   * @param user User login credentials
   */
  async login(user: IUser) {
    return await UserModel.findOne({ email: user.email }).exec()
  }

  /**
   * Creates a new user
   * @param payload User registration information
   */
  async register(payload: IUser) {
    return await UserModel.create(payload)
  }

  /**
   * Updates user password
   * @param id userId
   * @param password password
   * @returns 
   */
  async updatePassword(id: string, password: any) {
    return await UserModel.findByIdAndUpdate(id, {
      password,
      $unset: { token: '' }
    }, { new: true }).exec()
  }

  /**
   * Email validataion for password reset
   * @param email Email address
   * @param resetCode Authentication code
   * @returns 
   */
  async validateEmail(user: { email?: string; resetCode?: string }) {
    return await UserModel.findOneAndUpdate({ email: user.email }, {
      token: user.resetCode
    }, { new: true }).exec();
  }

  async validateToken(id: string) {
    return await UserModel.findOne({ _id: id }, {
      token: 1,
      _id: 1
    }).exec();
  }
}

export default AuthenticationRepository;