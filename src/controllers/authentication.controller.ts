import { Request, Response } from "express";
import AuthenticationService from "../services/authentication.service";
import Guard from "../middlewares/guard.middleware";
import { ErrorResponseHandler, ValidationError } from "../utils/errors.utils";
import IUser from "../interfaces/user.interface";
import { hashSync } from "bcryptjs";

class AuthController {

  /**
   * User authentication and authorization
   * @param req Client request object
   * @param res Server response object
  */
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const authService = new AuthenticationService(req.body);

    try {
      if (!email || !password) {
        throw new ValidationError('Email or password is required')
      }
      await authService.authorizeUser()
        .then(user => {
          const token = new Guard(user);
          console.log('user', user, 'TOKEN', token)//HARRY REMOVE AFTER TESTING

          res.status(200).json({
            success: true,
            message: user
          })
        })
    } catch (e: unknown | any) {

    }
  }

  /**
   * Creates a new user record
   * @param req Client request object
   * @param res Server response object
   */
  async register(req: Request, res: Response) {
    const { password }: IUser = req.body;

    try {
      if (!password)
        throw new ValidationError('Password is required');
      req.body.password = hashSync(password, 3);

      const authenticate = new AuthenticationService(req.body);
      await authenticate.createUser()
        .then(response => {
          console.log('ctrl-t', response)
          return res.status(201).json({
            success: true,
            message: 'Account Created',
            user: response
          })
        })
    } catch (e: unknown | any) {
      new ErrorResponseHandler(e, res)
    }
  }
}

export default AuthController;