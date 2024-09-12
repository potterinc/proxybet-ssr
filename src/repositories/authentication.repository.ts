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
    }, { new: true })
  }
}

export default AuthenticationRepository;