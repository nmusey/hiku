export enum Controller {
    Auth = "auth",
    Post = "post",
    User = "user"
}

export interface Endpoint {
    controller: Controller;
    action: string;
}

export const Endpoints: Record<string, Endpoint> = {
    Register:            { controller: Controller.Auth, action: "register"            },
    ConfirmRegistration: { controller: Controller.Auth, action: "confirmRegistration" },
    Login:               { controller: Controller.Auth, action: "login"               },
    Logout:              { controller: Controller.Auth, action: "logout"              },

    ListPosts:           { controller: Controller.Post, action: ""                    },
    CreatePost:          { controller: Controller.Post, action: "create"              },
    Snap:                { controller: Controller.Post, action: "snap"                },
    Unsnap:              { controller: Controller.Post, action: "unsnap"              },
             
    Search:              { controller: Controller.User, action: "search"              },
    UserDetails:         { controller: Controller.User, action: ":username"           },
    Follow:              { controller: Controller.User, action: "follow"              },
    Unfollow:            { controller: Controller.User, action: "unfollow"            }
};