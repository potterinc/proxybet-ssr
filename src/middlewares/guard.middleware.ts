import { Request, Response, NextFunction, response } from 'express';
import jwt from 'jsonwebtoken';
import AppConfig from '../configs/app.config';
import IUser from '../interfaces/user.interface';

/**
 * @description Module for handling authentication and authorization 
 * with JSON web token and server cookies
 */
class Guard {
	constructor(payload: IUser | object | any, response: Response) {
		this.SIGN_TOKEN(payload, AppConfig.authorization.KEY, response);
	};

	/**
	 * Verifies authentication token
	 * @param req request body
	 * @param res server response
	 * @param next 
	 * @returns 
	 */
	VERIFY_TOKEN(req: Request, res: Response, next: NextFunction,) {

		const token = req.cookies.session;
		if (token !== undefined) {
			jwt.verify(token, AppConfig.authorization.KEY, (err: any, payload: any) => {
				if (!err) {
					res.locals = payload
					next();
				}
				else {
					switch (err.name) {
						case 'TokenExpiredError': {
							err.message = 'Session expired!: Login and try again';
							res.status(403).json({
								status: false,
								message: err.message
							});
							break;
						}

						// Invalid token
						case 'JsonWebTokenError': {
							err.message = 'Invalid token!: Login and try again';
							res.status(401).json({
								status: false,
								message: err.message
							});
							break;
						}

						//Inactive token
						case 'NotBeforeError': {
							err.message = 'Inactive token!: Login and try again';
							res.status(401).json({
								status: false,
								message: err.message
							});
							break;
						}

						default:
							res.sendStatus(403);
							break;
					}
				}
			})
		} else {
			res.clearCookie('session');
			return res.status(401).json({
				status: false,
				message: 'Unauthorized: Authentication token required'
			});
		}
	}


	/**
	 * Authorized a user session on the server
	 * @param payload user object to be encrypted
	 * @param key JWT authorization key
	 * @returns 
	 */
	private SIGN_TOKEN(payload: object | string | Buffer, key: string, res: Response) {
		const token = jwt.sign({ payload }, key, {
			expiresIn: '1d'
		});
		return res.cookie('session', token, {
			httpOnly: true
		})
	}
}

export default Guard;