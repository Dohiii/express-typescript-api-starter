import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, CustomAPIError } from "../../shared/errors";
import { User, UserInterface } from "../users/users.models";
import { validateUser } from "../users/users.models";
import { attachCookiesToResponse } from "../../shared/utils/jwt";
import _ from "lodash";
import { createTokenUser } from "../../shared/utils/createTokenUser";

export const allUsers = async (req: Request, res: Response) => {
  const users = await User.find({});

  res.json(users);
};

// register controller
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const emailAlreadyExist = await User.findOne({ email });

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const userData = { name, email, password, role };
  const validateUserData = validateUser(userData);

  if (emailAlreadyExist) {
    throw new CustomAPIError(
      "DuplicationError",
      "Email already taken",
      400,
      true
    );
  }

  const user: UserInterface = await User.create(validateUserData);

  // creating token for the user, we create tokenUser to not pass full user with password around
  const tokenUser = createTokenUser(user);

  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

// login controller
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    throw new CustomAPIError(
      "MissingEmail",
      "Please provide a email",
      400,
      true
    );
  }
  if (!password) {
    throw new CustomAPIError(
      "MissingPassword",
      "Please provide a password",
      400,
      true
    );
  }

  const user: UserInterface | null = await User.findOne({ email });

  if (!user) {
    throw new CustomAPIError(
      "UserNotFoundError",
      "User not found",
      400,
      true
    );
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomAPIError(
      "AuthenticationError",
      "Invalid email or password",
      401,
      true
    );
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//logout controller
export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.json({ msg: "user is logged out" });
};
