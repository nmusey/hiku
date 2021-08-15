import { Request, Response, Router } from "express";
import { registerValidators } from "../validators/auth/register.validators.js";
import { RegisterRequest, RegisterResponse } from "../../../common/dtos/auth/Register.js";
import { validationMiddleware } from "../middlewares/validation.middleware.js";
import { comparePasswordToHashed, createRegistrationToken } from "../utils/cryptography.utils.js";
import { sendRegistrationEmail } from "../utils/mail.utils.js";
import { confirmRegistrationValidators } from "../validators/auth/confirmRegistration.validators.js";
import { ConfirmRegistrationRequest, ConfirmRegistrationResponse } from "../../../common/dtos/auth/ConfirmRegistration.js";
import { setInvalidJWTOnResponse, setJWTOnResponse } from "../utils/jwt.utils.js";
import { loginValidators } from "../validators/auth/login.validators.js";
import { LoginResponse } from "../../../common/dtos/auth/Login.js";
import { Endpoints } from "../../../common/constants/Endpoints.js";
import { createUser, deleteRegistrationTokenForUser, deleteUser, doesUserAlreadyExist, findUserByEmail, findUserByUsername } from "../utils/database/user.utils.js";

export const authRouter = Router();

authRouter.post("/" + Endpoints.Register.action, registerValidators, validationMiddleware, async (req: Request, res: Response) => {
    const {email, username, password} = req.body as RegisterRequest;

    if (await doesUserAlreadyExist(email, username)) {
        return res.status(400).json({ errors: ["That username or email already exists, please use another one."] });
    }

    const registrationToken = createRegistrationToken();
    const newUser = await createUser(email, username, password, registrationToken);

    const emailSent = sendRegistrationEmail(email, username, registrationToken);
    if (!emailSent) {
        deleteUser(newUser.id);
        return 
    }
    
    const responseBody: RegisterResponse = { email };
    return res.send(responseBody);

});

authRouter.post("/" + Endpoints.ConfirmRegistration.action, confirmRegistrationValidators, validationMiddleware, async (req: Request, res: Response) => {
    const { username, token } = req.body as ConfirmRegistrationRequest;

    const user = await findUserByUsername(username);

    if (!user) {
        return res.status(400).json({ errors: [ "Please try registering again." ] });
    }

    const responseBody = {
        id: user.id,
        username: user.username,
        followers: 0,
        doesCurrentUserFollow: false
    } as ConfirmRegistrationResponse;

    if (!user.registrationToken) {
        setJWTOnResponse(res, user);     

        return res.status(204).json(responseBody);
    }

    if (user.registrationToken === token) {
        await deleteRegistrationTokenForUser(user.id);        
        setJWTOnResponse(res, user);        
        return res.send(responseBody);
    } else {
        return res.status(401);
    }
});

authRouter.post("/" + Endpoints.Login.action, loginValidators, validationMiddleware, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const genericMessage = "Invalid email or password.";

    const user = await findUserByEmail(email);

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

    setJWTOnResponse(res, user);
    return res.json(responseBody);
});

authRouter.post("/" + Endpoints.Logout.action, async (req: Request, res: Response) => {
    setInvalidJWTOnResponse(res);
    return res.send({});
});