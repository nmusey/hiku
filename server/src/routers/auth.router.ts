import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { registerValidators } from "../validators/auth/register.validator";
import { RegisterRequest, RegisterResponse } from "../../../common/dtos/auth/Register";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { createRegistrationToken, hashPassword } from "../utils/cryptography.utils";
import { sendRegistrationEmail } from "../utils/mail.utils";
import { confirmRegistrationValidators } from "../validators/auth/confirmRegistration.validator";
import { ConfirmRegistrationRequest, ConfirmRegistrationResponse } from "../../../common/dtos/auth/ConfirmRegistration";
import { setJwt } from "../utils/jwt.utils";

export const authRouter = Router();
const prisma = new PrismaClient();

authRouter.post("/register", registerValidators, validationMiddleware, async (req: Request, res: Response) => {
    const {email, username, password} = req.body as RegisterRequest;
    const hashedPassword = await hashPassword(password);

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [ { email }, { username } ]
        }
    });

    if (existingUser) {
        return res.status(400).json(["That username or email already exists, please use another one."]);
    }

    const registrationToken = createRegistrationToken();

    const newUser = await prisma.user.create({
        data: { email, username, password: hashedPassword, registrationToken }
    });

    const emailSent = sendRegistrationEmail(email, username, registrationToken);
    if (!emailSent) {
        prisma.user.delete({ where: { id: newUser.id } });
    }

    const responseBody: RegisterResponse = { email };
    return res.send(responseBody);
});

authRouter.post("/confirmRegistration", confirmRegistrationValidators, validationMiddleware, async (req: Request, res: Response) => {
    const { username, token } = req.body as ConfirmRegistrationRequest;

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
        return res.status(400).json(["Please try registering again."]);
    }

    if (user.registrationToken === token) {
        prisma.user.update({
            where: { id: user.id },
            data: { registrationToken: "" }
        });

        setJwt(res, user);        

        const responseBody = {} as ConfirmRegistrationResponse;
        return res.status(200).send(responseBody);
    } else {
        return res.status(401);
    }
});