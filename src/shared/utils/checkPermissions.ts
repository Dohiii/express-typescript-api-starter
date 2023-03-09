import { TokenUserIntrface, UserInterface } from "../../interfaces";
import { ForbiddenError } from "../errors";

export const checkPermissions = (
  requestUser: TokenUserIntrface,
  id: string
) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userId === id) return;
  throw new ForbiddenError("Administrator right are required");
};
