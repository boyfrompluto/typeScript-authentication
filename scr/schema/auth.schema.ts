import { object, string, TypeOf } from "zod";

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: " email is required",
    }).email("invalid invalid email or password"),
    password: string({
      required_error: " password is required",
    }).min(6, "invalid invalid email or password"),
  }),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"];
