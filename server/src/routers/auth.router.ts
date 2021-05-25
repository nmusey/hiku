import Prisma from "@prisma/client";
import { Request, Response, Router } from "express";
import { registerValidators } from "../validators/auth/register.validators.js";
import { RegisterRequest, RegisterResponse } from "../../../common/dtos/auth/Register.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { comparePasswordToHashed, createRegistrationToken, hashPassword } from "../utils/cryptography.utils.js";
import { sendRegistrationEmail } from "../utils/mail.utils.js";
import { confirmRegistrationValidators } from "../validators/auth/confirmRegistration.validators.js";
import { ConfirmRegistrationRequest, ConfirmRegistrationResponse } from "../../../common/dtos/auth/ConfirmRegistration.js";
import { setInvalidJwt, setJwt } from "../utils/jwt.utils.js";
import { loginValidators } from "../validators/auth/login.validators.js";
import { LoginResponse } from "../../../common/dtos/auth/Login.js";
import { Endpoints } from "../../../common/constants/Endpoints.js";

export const authRouter = Router();
const prisma = new Prisma.PrismaClient();

authRouter.post("/" + Endpoints.Register.action, registerValidators, validationMiddleware, async (req: Request, res: Response) => {
    const {email, username, password} = req.body as RegisterRequest;
    const hashedPassword = await hashPassword(password);

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [ { email }, { username } ]
        }
    });

    if (existingUser) {
        return res.status(400).json({ errors: ["That username or email already exists, please use another one."] });
    }

    const registrationToken = createRegistrationToken();

    const newUser = await prisma.user.create({
        data: { 
            email, 
            username, 
            password: hashedPassword, 
            registrationToken,
            following: {
                connect: { email }
            }
         }
    });

    const emailSent = sendRegistrationEmail(email, username, registrationToken);
    if (!emailSent) {
        prisma.user.delete({ where: { id: newUser.id } });
    }

    const responseBody: RegisterResponse = { email };
    return res.send(responseBody);
});

authRouter.post("/" + Endpoints.ConfirmRegistration.action, confirmRegistrationValidators, validationMiddleware, async (req: Request, res: Response) => {
    const { username, token } = req.body as ConfirmRegistrationRequest;

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
        return res.status(400).json({ errors: [ "Please try registering again." ] });
    }

    if (!user.registrationToken) {
        const responseBody = {
            id: user.id,
            username: user.username,
            followers: 0,
            doesCurrentUserFollow: false
        } as ConfirmRegistrationResponse;

        setJwt(res, user);     

        return res.status(204).json(responseBody);
    }

    if (user.registrationToken === token) {
        await prisma.user.update({
            where: { id: user.id },
            data: { registrationToken: "" }
        });

        setJwt(res, user);        

        const responseBody = {
            id: user.id,
            username: user.username,
            followers: 0,
            doesCurrentUserFollow: false
        } as ConfirmRegistrationResponse;
        return res.send(responseBody);
    } else {
        return res.status(401);
    }
});

authRouter.post("/" + Endpoints.Login.action, loginValidators, validationMiddleware, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const genericMessage = "Invalid email or password.";

    const user = await prisma.user.findUnique({ 
        where: { email },
        include: { followers: true }
    });

    if (!user) {
        return res.status(401).json({ errors: [ genericMessage ] });
    }

    if (user.registrationToken) {
        return res.status(400).json({ errors: [ "Please confirm your email before logging in." ] });
    }

    const doPasswordsMatch = await comparePasswordToHashed(user.password, password);
    if (!doPasswordsMatch) {
        return res.status(401).json({ errors: [ genericMessage ] });
    }

    const responseBody: LoginResponse = {
        id: user.id,
        username: user.username,
        followers: user.followers.length,
        doesCurrentUserFollow: false
    };

    setJwt(res, user);
    return res.json(responseBody);
});

authRouter.post("/" + Endpoints.Logout.action, async (req: Request, res: Response) => {
    setInvalidJwt(res);
    return res.send({});
});