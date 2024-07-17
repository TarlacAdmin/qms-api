import jwt from "jsonwebtoken";
import { config } from "../config/config";

interface User {
  id: string;
  email: string;
  role?: string;
  type?: string;
  firstname?: string;
  lastname?: string;
}

const generateRefreshToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET || config.JWTCONFIG.SECRET,
    {
      expiresIn: user.type === "user" ? config.JWTCONFIG.EXPIRESIN : "1d",
    }
  );
};

const generateToken = (user: User): string => {
  return jwt.sign(
    {
      user: { id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname },
    },
    process.env.ACCESS_TOKEN_SECRET || config.JWTCONFIG.SECRET
  );
};

const sendResponseCookie = (res: any, token: string): any => {
  return res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

export { generateRefreshToken, generateToken, sendResponseCookie };
