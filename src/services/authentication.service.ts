import IUser from "../interfaces/user.interface";
import UserModel from "../models/user. model";
import AuthenticationRepository from "../repositories/authentication.repository";
import MongooseValidationErrorHandler, { NotFoundError, ServerError, ValidationError } from "../utils/errors.utils";
import bcrypt from 'bcryptjs';
import Mailer from "./email.service";
import Guard from "../middlewares/guard.middleware";
import { response } from "express";
import { removeInactiveToken } from "../utils/index.utils";

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
  async login() {
    return await this.authRepository.login(this.user)
      .then(user => {
        if (!user)
          throw new NotFoundError('Invalid email or password');

        const password = bcrypt.compareSync(this.user.password, user.password);
        if (password) {
          return {
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
  async register() {
    return await this.authRepository.register(this.user)
      .then(user => {
        const payload = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        }
        new Mailer('One step to Unlimited Wins', user, 'WELCOME');
        return payload
      })
      .catch((e: Error) => {
        new MongooseValidationErrorHandler(e, UserModel)
      })
  }

  /**
   * Update user password
   * @returns Updated user object
   */
  async updatePassword() {
    return await this.authRepository.updatePassword(this.user.id, this.user.password)
      .then(user => {
        if (!user)
          throw new NotFoundError('User not found');
      })
  }

  async validateEmail() {
    return await this.authRepository.validateEmail(this.user)
      .then(user => {
        if (user) {
          new Mailer('Password Reset', user, 'PASSWORD_RESET');
          removeInactiveToken(String(user._id));
          return user._id;
        }
      })
  }

  /**
   * Validated user token
   * @returns 
   */
  async validateToken() {
    return await this.authRepository.validateToken(this.user.id)
      .then((user: any) => {
        if (user) {
          if (user.token !== this.user.token)
            throw new ValidationError('Invalid token');
          return user._id;
        }
        else
          throw new ValidationError('Invalid token');
      })
  }
}

export default AuthenticationService;