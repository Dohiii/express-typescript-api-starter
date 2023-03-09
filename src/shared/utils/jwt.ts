import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { TokenUserIntrface } from "../../interfaces";
import { Response } from "express";

dotenv.config();

export const createJWT = (tokenUser: TokenUserIntrface) => {
  return jwt.sign(
    tokenUser,
    process.env.JWT_SECRET || "JFhjd23sfasASF@$!@fdsafa@#!123dsaSAFF2",
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const isTikenValid = (token: string): string | JwtPayload =>
  jwt.verify(
    token,
    process.env.JWT_SECRET || "JFhjd23sfasASF@$!@fdsafa@#!123dsaSAFF2"
  );

export const attachCookiesToResponse = (
  res: Response,
  user: TokenUserIntrface
) => {
  const token = createJWT(user);

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};
