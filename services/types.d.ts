import { Request } from "express";
import { IUser } from "../models/userModel";

export interface CustomRequest extends Request {
  user?: IUser;
}
