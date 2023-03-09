import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError, NotFoundError } from "../../shared/errors";
import { checkPermissions } from "../../shared/utils/checkPermissions";
import { createTokenUser } from "../../shared/utils/createTokenUser";
import { attachCookiesToResponse } from "../../shared/utils/jwt";
import { User, UserInterface } from "./users.models";

// route to get a list of ALL users
export const getAllUsers = async (req: Request, res: Response) => {
  console.log(req.user);

  const users: UserInterface[] = await User.find({}).select(
    "-password"
  );

  res.status(StatusCodes.OK).json(users);
};

// get one user by ID
export const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new NotFoundError("User is not found");
  }

  if (req.user) {
    checkPermissions(req.user, id);
  }

  res.status(StatusCodes.OK).json(user);
};

//Show current loged in user
export const showCurrentUser = (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new NotFoundError("User is not found");
  }

  res.status(StatusCodes.OK).json({ user });
};
export const updateUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name) {
    throw new CustomAPIError(
      "MissingEmail",
      "Please provide a name",
      400,
      true
    );
  }
  if (!email) {
    throw new CustomAPIError(
      "MissingPassword",
      "Please provide a email",
      400,
      true
    );
  }

  // update user with findOneAndUpdate
  // const user = await User.findOneAndUpdate(
  //   { _id: req.user?.userId },
  //   { email, name },
  //   {
  //     new: true,
  //     runValidators: true,
  //   }
  // );

  // update user with user.save()
  const user = await User.findOne({ _id: req.user?.userId });

  if (!user) {
    throw new CustomAPIError(
      "WrongPassword",
      "Sorry no user",
      400,
      true
    );
  }

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse(res, tokenUser);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//update logged in users password controller
export const updateUserPassword = async (
  req: Request,
  res: Response
) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword) {
    throw new CustomAPIError(
      "MissingPassword",
      "Please provide current Password",
      400,
      true
    );
  }
  if (!newPassword) {
    throw new CustomAPIError(
      "MissingPassword",
      "Please provide a new password",
      400,
      true
    );
  }

  const user: UserInterface | null = await User.findOne({
    _id: req.user?.userId,
  });

  if (!user) {
    throw new CustomAPIError(
      "WrongPassword",
      "Sorry password is wrong",
      400,
      true
    );
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomAPIError(
      "WrongPassword",
      "Sorry password is wrong",
      400,
      true
    );
  }

  user.password = newPassword;
  user.save();
  res
    .status(StatusCodes.OK)
    .json({ message: "Password is updatet succesfully" });
};
