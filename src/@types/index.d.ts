import "express";

import "express";

declare module "express" {
  interface Request {
    user?: {
      name: string;
      userId: string;
      role: string;
    };
  }
}

// Rest of the code

declare module "jsonwebtoken" {
  export interface JwtPayload {
    name: string;
    userId: string;
    role: string;
  }
}
