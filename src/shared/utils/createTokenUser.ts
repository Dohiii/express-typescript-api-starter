import { TokenUserIntrface, UserInterface } from "../../interfaces";

export const createTokenUser = (
  user: UserInterface
): TokenUserIntrface => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
  };
};
