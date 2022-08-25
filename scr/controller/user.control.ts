import { Request, Response } from "express";
import {
  CreateUserInput,
  ForgotUserPasswordInput,
  ResetUserPasswordInput,
  VerifyUserInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserById,
  findUserByEmail,
} from "../sevice/user.service";
import sendEmail from "../utils/mailer";

const nanoid = require("nanoid");

import log from "../utils/logger";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;

  try {
    const user = await createUser(body);

    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "please verify your account",
      text: ` verification code ${user.verificationToken}. Id ${user._id}`,
    });

    return res.send("user is successfully created");
  } catch (e: any) {
    if (e.code === 11000) {
      return res.status(409).json(" account already exists");
    }
    return res.status(500).send(e);
  }
}

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  const verificationToken = req.params.verificationToken;

  const user = await findUserById(id);
  //find user with
  try {
    if (!user) return res.send("could not verify user");
  } catch (err) {
    return res.send("unable to verify");
  }

  //check if user is verified already
  if (user.verified) return res.send("user already verified");
  console.log("0002");

  //check to see if  verificationToken matches
  if (user.verificationToken === verificationToken) {
    user.verified = true;

    await user.save();
    return res.send(" user verified now");
  }
  return res.json("could not verify user");
}

export async function forgotUserPasswordHandler(
  req: Request<{}, {}, ForgotUserPasswordInput>,
  res: Response
) {
  const message = "if a user with that email is registered you will get a mail";
  const email = req.body.email;

  const user = await findUserByEmail(email);
  if (user === null) {
    log.debug(`user with email ${email} does ot exist`);
    res.send(message);
  } else
    try {
      if (!user.verified) return res.send("GOAT CHEESE_____VERIFY USER");

      const passwordReset = nanoid();
      try {
        user.resetToken = passwordReset;
        await user.save();
        console.log("0000");
      } catch (err) {
        console.log("000bug");
      }

      await sendEmail({
        from: "test@example.com",
        to: user.email,
        subject: "YOUR RESET PASSWORD",
        text: `password reset code: ${passwordReset}  user Id: ${user._id}`,
      });
      log.debug(`password sent ${email}`);

      return res.send(message);
    } catch (e) {
      log.debug("error 0011");
    }
}

export async function resetUserPasswordHandler(
  req: Request<
    ResetUserPasswordInput["params"],
    {},
    ResetUserPasswordInput["body"]
  >,
  res: Response
) {
  const { id, resetToken } = req.params;

  const { password, passwordConfirmation } = req.body;

  const user = await findUserById(id);

  if (!user || !user.resetToken || user.resetToken !== resetToken) {
    res.send("ACCESS DENIED___GOAT CHEESE");
    log.debug("id or token error, invalid");
  } else
    try {
      user.resetToken = null;
      user.password = password;
      await user.save();

      return res.send("password updated");
    } catch (e) {}
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user);
}
