import { Request, Response } from "express";
import AuthenticationService from "../services/authentication.service";
import Guard from "../middlewares/guard.middleware";
import { ValidationError } from "../utils/errors.utils";

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
      switch (e.name) {
        case 'NotFoundError':
          return res.status(403).json({
            success: false,
            message: e.message
          });
        case 'ValidationError':
          return res.status(400).json({
            success: false,
            message: e.message
          });
        default:
          return res.status(501).json({
            success: false,
            message: `Something went wrong: ${e.message}`
          })
      }
    }
  }

  /**
   * Creates a new user record
   * @param req Client request object
   * @param res Server response object
   */
  async register(req: Request, res: Response) {
    try {

    } catch (e: unknown | any) {

    }
  }
}

export default AuthController;