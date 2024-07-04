import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppConfig from '../configs/app.config';
import IUser from '../interfaces/user.interface';

class Guard{
	constructor(payload: IUser | object) {
		this.SIGN_TOKEN(payload, AppConfig.authorization.KEY);
	 };

	VERIFY_TOKEN(req: Request, res: Response, next: NextFunction,) {

		const token = req.cookies.access_token;
		if (token !== undefined) {
			jwt.verify(token, AppConfig.authorization.KEY, (err: any, payload: any) => {
				if (!err) {
					res.cookie('token', payload, {
						httpOnly: true
					});
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
			res.clearCookie('access_token');
			return res.status(401).json({
				status: false,
				message: 'Unauthorized: Authentication token required'
			});
		}
	}

	/**
	 * Issue authorization token
	 * @param {String|Buffer|object} payload - Payload data
	 * @param {string} key - JWT Secret key
	 * @return - Base64 string
	 */
	private SIGN_TOKEN(payload: object | string | Buffer, key: string) {
		return jwt.sign({ payload }, key, {
			expiresIn: '1d'
		});
	}
}

export default Guard;