import { NextFunction, Request, Response } from "express";
import AuthenticationService from "../services/authentication.service";
import AuthorizedUser from "../middlewares/guard.middleware";
import { ErrorResponseHandler, ValidationError } from "../utils/errors.utils";
import IUser from "../interfaces/user.interface";
import { hashSync } from "bcryptjs";
import crypto from 'crypto';
import Mailer from "../services/email.service";

class AuthController {

  /** @description User login and authorization */
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const authService = new AuthenticationService(req.body);

    try {
      if (!email || !password) {
        throw new ValidationError('Email or password is required')
      }
      await authService.login()
        .then(user => {
          new AuthorizedUser(user, res);
          res.status(200).json({
            success: true,
            message: user
          })
        })
    } catch (e: unknown | any) {
      new ErrorResponseHandler(e, res)
    }
  }

  /** @description Creates a new user */
  async register(req: Request, res: Response) {
    const { password }: IUser = req.body;

    try {
      if (!password)
        throw new ValidationError('Password is required');
      req.body.password = hashSync(password, 3);

      const authService = new AuthenticationService(req.body);
      await authService.register()
        .then(user => {
          new AuthorizedUser(user, res)
          return res.status(201).json({
            success: true,
            message: 'Account Created',
            user: user
          })
        })
    } catch (e: unknown | any) {
      new ErrorResponseHandler(e, res)
    }
  }

  /** @description Update new password */
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.password)
        throw new ValidationError('Password required');

      const user: { id: string, password: string } = {
        id: req.body.id,
        password: hashSync(req.body.password, 3)
      }

      const authService = new AuthenticationService(user);
      await authService.updatePassword()
        .then(() => {
          res.status(202).json({
            success: true,
            message: "Password updated"
          })
        });
    } catch (e: unknown | any) {
      new ErrorResponseHandler(e, res);
    }
  }

  /**@description Terminates user session */
  logout(req: Request, res: Response) {
    res.clearCookie('session');
    return res.status(200).json({
      success: true,
      message: 'Logged out'
    })
  }

  // Email reset code
  async emailResetCode(req: Request, res: Response) {
    const user = {
      email: req.body.email,
      resetCode: `BET-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
    }

    try {
      if (!user.email)
        throw new ValidationError('Email is required');

      const authService = new AuthenticationService(user);
      await authService.validateEmail()
        .then(data => {
          return res.status(200).json({
            success: true,
            userId: data,
            message: `Reset code has been sent to ${user.email}`
          })
        })
    } catch (e: unknown | any) {
      new ErrorResponseHandler(e, res);
    }
  }

  // Authenticate Reset Token
  async validateToken(req: Request, res: Response) {
    const { } = req.body;
    const authService = new AuthenticationService(req.body);
    try {
      await authService.validateToken()
        .then(user => {
          res.status(200).json({
            success: true,
            message: 'Validation successful'
          })
        })
    } catch (e: unknown | any) {
      new ErrorResponseHandler(e, res)
    }
  }
}

export default AuthController;