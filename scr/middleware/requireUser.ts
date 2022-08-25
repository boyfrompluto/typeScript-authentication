import { Request, Response, NextFunction } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(403).send("ACCESS DENIED___ GOAT CHEESE");
  }
  next();
};

export default requireUser;
