import { Router } from "express";
import AuthController from "../controllers/authentication.controller";

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);

export default authRouter;
