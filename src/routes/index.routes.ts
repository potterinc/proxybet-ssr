import { Request, Response, Router } from "express";
import AppConfig from "../configs/app.config";

const RouterModule: Router = Router();

/** @description API BASE ROUTE */
RouterModule.get('', (req: Request, res: Response) => {
  res.redirect(`${AppConfig.server.BASE_URL}`)
})

RouterModule.get(`${AppConfig.server.BASE_URL}`, (req: Request, res: Response) => {
  res.status(200).send('<h1>Welcome to the ProxyBET API service</h1> Ensure you study the <a href="https://www.postman.com/harryp30/workspace/proxybet-api" target="_blank">documentation</a> properly before using this service')
})

export default RouterModule;