import AppConfig from "../configs/app.config";
import IUser from "../interfaces/user.interface";
import Guard from "../middlewares/guard.middleware";
import AuthenticationRepository from "../repositories/authentication.repository";
import { NotFoundError } from "../utils/errors.utils";
import bcrypt from 'bcryptjs';

class AuthenticationService {
  private user: IUser;
  private authRepository = new AuthenticationRepository();

  constructor(user: IUser) {
    this.user = user;
  }

  /**
   * Authorize user
   * @param credentials User login credentials
   * @returns return User object
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
            email: user.email,
            role: user.role
          }
        }
        throw new NotFoundError('Invalid email or password');
      })
  }

  Register(user: IUser) {

  }
}

export default AuthenticationService;