import { NextFunction, Request, Response } from "express";
import AuthenticationService from "../services/authentication.service";
import AuthorizedUser from "../middlewares/guard.middleware";
import { ErrorResponseHandler, ValidationError } from "../utils/errors.utils";
import IUser from "../interfaces/user.interface";
import { hashSync } from "bcryptjs";

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
      const user: { id: string, password: string } = {
        id: req.body.id,
        password: hashSync(req.body.password, 3)
      }

      const authService = new AuthenticationService(user)
      if (!user.password)
        throw new ValidationError('Password required');

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
}

export default AuthController;