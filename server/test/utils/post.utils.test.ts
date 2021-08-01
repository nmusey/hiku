import { mapPostToPostInfo, PostWithConnectedData } from "../../src/utils/post.utils";

describe("post utils", () => {
    describe("mapPostToPostInfo", () => {
        const mockPost: PostWithConnectedData = {
            id: 1,
            firstLine: "first",
            secondLine: "second",
            thirdLine: "third",
            authorId: 1,
            createdAt: new Date(),
            author: {
                id: 1,
                email: "email",
                username: "username",
                password: "password",
                registeredDate: new Date(),
                registrationToken: "token"
            },
            snappers: []
        };

        test("Only includes snap count if requesting user is the author", () => {
            const resultForAuthor = mapPostToPostInfo(mockPost, 1);
            const resultForOtherUser=  mapPostToPostInfo(mockPost, 2);

            expect(resultForAuthor.snappers).toBeDefined();
            expect(resultForOtherUser.snappers).toBeUndefined();
        });
    });
})