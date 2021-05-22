import { Request, Response, Router } from "express";
import { registerValidator } from "../validators/auth/register.validator";
import { RegisterRequest } from "../../../common/dtos/auth/Register";
import { validationMiddleware } from "../middlewares/validationMiddleware";

export const authRouter = Router();

authRouter.post("/register", registerValidator, validationMiddleware, async (req: Request, res: Response) => {
    const {email, username, password} = req.body as RegisterRequest;

    console.log(`register with ${email} ${username} ${password}`);
    console.log("body", req.body);

    res.sendStatus(200);
});