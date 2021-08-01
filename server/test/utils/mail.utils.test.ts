import { sendRegistrationEmail, transport } from "../../src/utils/mail.utils";

describe("mail utils", () => {
    beforeAll(() => {
        jest.mock("nodemailer");
    });

    describe("sendRegistrationEmail", () => {
        test("sends an email", async () => {
            const sendMailStub = jest.fn();
            transport.sendMail = sendMailStub;

            await sendRegistrationEmail("email", "username", "token");

            expect(sendMailStub).toHaveBeenCalled();
        });

        test("returns true on success", async () => {
            const sendMailStub = jest.fn();
            transport.sendMail = sendMailStub;

            const result = await sendRegistrationEmail("email", "username", "token");

            expect(result).toBe(true);
        });

        test("handles an error by returning false", async () => {
            const sendMailErrorStub = jest.fn(() => { throw Error("") });
            transport.sendMail = sendMailErrorStub;

            console.error = () => {};
            const result = await sendRegistrationEmail("email", "username", "token");

            expect(sendMailErrorStub).toHaveBeenCalled();
            expect(result).toBe(false);
        })
    });
});