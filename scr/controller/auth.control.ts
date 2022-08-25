import { Request, Response } from "express";
import { findUserByEmail, findUserById } from "../sevice/user.service";
import {
  signAccessToken,
  signRefreshToken,
  findSessionById,
} from "../sevice/auth.service";
import { CreateSessionInput } from "../schema/auth.schema";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  const { email, password } = req.body;

  const message = "INVALID EMAIL OR PASSWORD";
  const message2 = "PLEASE VERIFY YOU EMAIL";

  const user = await findUserByEmail(email);
  if (!user) return res.send(message);

  if (!user.verified) {
    res.send(message2);
  }

  const isValid = await user.validatePassword(password);
  if (!isValid) return res.send(message);

  //sign an  access token
  const accessToken = signAccessToken(user);
  //sign an  access token
  const refreshToken = await signRefreshToken({
    userId: user._id,
  });

  return res.send({
    accessToken,
    refreshToken,
  });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const refreshToken = get(req, "headers.x-refresh");

  const decode = verifyJwt<{ session: string }>(refreshToken, "secret");
  if (!decode) {
    return res.status(401).send("GOATCHEESE_____could not refresh");
  }
  const session = await findSessionById(decode.session);

  if (!session || !session.valid) {
    return res.status(401).send("GOATCHEESE_____could not refresh");
  }
  const user = await findUserById(String(session.user));
  if (!user) {
    return res.status(401).send("GOATCHEESE_____could not refresh");
  }
  const accessToken = signAccessToken(user);

  return res.send(`accessToken : ${signAccessToken}`);
}
