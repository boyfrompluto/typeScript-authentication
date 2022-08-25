import { User } from "../model/user.model";
import { DocumentType } from "@typegoose/typegoose";
import { signJwt } from "../utils/jwt";
import SessionModel from "../model/session.model";
import privateFields from "../model/user.model";

const _ = require("lodash");

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId });
}

export async function signRefreshToken({ userId }: { userId: string }) {
  const session = await createSession({
    userId,
  });
  const refreshToken = signJwt(
    {
      session: session._id,
    },
    "accessTokenPublicKey",
    { expiresIn: "1y" }
  );
  return refreshToken;
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = _.omit(user.toJSON(), privateFields);

  const accessToken = signJwt(payload, "refreshTokenPublicKey", {
    expiresIn: "30m",
  });

  return accessToken;
}
export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}
