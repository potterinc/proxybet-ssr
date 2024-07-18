import IUser from "../interfaces/user.interface";
import UserModel from "../models/user. model";
import AuthenticationRepository from "../repositories/authentication.repository";
import MongooseValidationErrorHandler, { NotFoundError } from "../utils/errors.utils";
import bcrypt from 'bcryptjs';
import Mailer from "./email.service";
import Guard from "../middlewares/guard.middleware";
import { response } from "express";

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
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
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
    return await this.authRepository.register(this.user)
      .then(user => {
        const payload = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        }
        new Mailer('One step to Unlimited Wins', payload);
        return payload
      })
      .catch((e: Error) => {
        new MongooseValidationErrorHandler(e, UserModel)
      })
  }
}

export default AuthenticationService;