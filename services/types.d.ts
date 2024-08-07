import { Request } from "express";
import { UserModel } from "../models/userModel";

export interface CustomRequest extends Request {
  user?: UserModel;
}
