import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { registerValidator } from "../validators/auth/register.validator";
import { RegisterRequest, RegisterResponse } from "../../../common/dtos/auth/Register";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { createRegistrationToken, hashPassword } from "../utils/cryptography.utils";
import { sendRegistrationEmail } from "../utils/mail.utils";

export const authRouter = Router();
const prisma = new PrismaClient();

authRouter.post("/register", registerValidator, validationMiddleware, async (req: Request, res: Response) => {
    const {email, username, password} = req.body as RegisterRequest;
    const hashedPassword = await hashPassword(password);

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [ { email }, { username } ]
        }
    });

    if (existingUser) {
        return res.status(400).send(["That username or email already exists, please use another one."]);
    }

    const registrationToken = createRegistrationToken();

    const newUser = await prisma.user.create({
        data: { email, username, password: hashedPassword, registrationToken }
    });

    const emailSent = sendRegistrationEmail(email, newUser.id, registrationToken);
    if (!emailSent) {
        prisma.user.delete({ where: { id: newUser.id } });
    }

    const responseBody: RegisterResponse = { email };
    return res.send(responseBody);
});