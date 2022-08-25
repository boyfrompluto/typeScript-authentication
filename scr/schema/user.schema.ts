import { object, string, TypeOf } from 'zod'

export const createUserSchema = object({
    body: object({
        firstName: string({
            required_error: "first name is required "
        }),
        lastName: string({
            required_error: "last name is required "
        }),
        password: string({
            required_error: "password is required "
        }).min(6, "password is too short"),
        passwordConfirmation: string({
            required_error: "password confirmation  is required "
        }),
        email: string({
            required_error: "email is required "
        }).email("not a valid email")
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "password do not match",
        path: ["passwordConfirmation"]
    }),
});

export const forgotUserPasswordSchema = object({
    body: object({
        email: string({
            required_error:"email is required"
        }).email("not a valid email")
    })
})

export const verifyUserSchema = object({
    params: object({
        id: string(),
        verificationToken: string()
    }),
});

export const resetUserPasswordSchema = object({
    params: object({
        id: string(),
        resetToken:string()
    }),
    body:object({
        password: string({
            required_error: "password is required "
        }).min(6, "password is too short"),
        passwordConfirmation: string({
            required_error: "password confirmation  is required "
        })
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: "password do not match",
        path: ["passwordConfirmation"]
    }),
})

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];
export type ForgotUserPasswordInput= TypeOf<typeof forgotUserPasswordSchema>["body"];
export type ResetUserPasswordInput = TypeOf<typeof resetUserPasswordSchema>;