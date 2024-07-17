import IUser from "../interfaces/user.interface";
import AuthorizationToken from "../middlewares/guard.middleware";
import UserModel from "../models/user. model";
import AuthenticationRepository from "../repositories/authentication.repository";
import MongooseValidationErrorHandler, { NotFoundError } from "../utils/errors.utils";
import bcrypt from 'bcryptjs';
import Mailer from "./email.service";

class AuthenticationService {
  private user: IUser;
  private authRepository = new AuthenticationRepository();

  constructor(user: any) {
    this.user = user;
  }

  /**
   * Authorize a user
   * @returns user payload
   */
  async authorizeUser() {
    return await this.authRepository.login(this.user)
      .then(user => {
        if (!user)
          throw new NotFoundError('Invalid email or password');

        const password = bcrypt.compareSync(this.user.password, user.password);
        if (password) {
          return {
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        }
        throw new NotFoundError('Invalid email or password');
      })
  }

  /**
   * Creates a new user
   * @returns User payload
   */
  async createUser() {
    await this.authRepository.register(this.user)
      .then(user => {
        const payload = {
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          email: user.email,
          balance: user.walletBalance
        }
        new AuthorizationToken(payload);
        new Mailer('One step to Unlimited Wins', payload);
        return payload;
      })
      .catch((e: Error) => {
        console.log(e.name)
        new MongooseValidationErrorHandler(e, UserModel)
      })
  }
}

export default AuthenticationService;