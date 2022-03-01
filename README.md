# Hiku

Hiku is a social media site where users can post haikus. It was built to practice developing a full-stack app from the ground up until it is deployed. You can test it out yourself by going to [hiku.ca](https://hiku.ca) or by following the instructions in the "Development" section to clone this repo and run it yourself.

## Project Overview
The app is built using a simple client and server structure. 

### Frontend tech stack
React is used for the frontend, along with the Ant Design UI library. All frontend code lives in the `client/src` directory. Functional components are used over class components for simplicity, and so hooks can be shared.

#### Frontend patterns
##### Forms
Each form is built using the Ant Design `Form` components for simplicity. Documentation on these elements can be found [here](https://ant.design/components/form/). Both controlled and uncontrolled forms are used within the app. 

##### Pages and layouts
Pages live within the `client/src/pages` directory. It is expected that each page uses one of the layout components defined in `client/src/components/layouts` directory. The `AuthenticatedLayout` component will enforce authentication and should be used for any pages outside of authentication, while `UnauthenticatedLayout` is used for authentication pages such as login, logout, and registration.

#### Frontend comilation
From here the code is compiled using Webpack into the build, where it is served by the server. This approach allows the app to run identically in development and production environments. The disadvantage to doing this is that hot module reloading is unavailable. This means that after changes are made to frontend files, compilation will run for a short time and the server will restart. After a page refresh the changes should be visible.

#### Styling
Styling and theming is done through `less` files. The important files are `theme.less` for overriding default Ant Design styles, `layout.less` for creating global layout classes, and `text.less` for creating global text classes.

### Backend tech stack
The backend of this app is built using Express as a base. Postgres and Prisma are used as the database and object-relational mapper respectively. 

The object model of the app is kept basic, with the only objects being `User`s and `Post`s. A `User` represents an end user who can login and interact with posts. A `Post` is a haiku which can be interacted with. Each post can be "Snapped", which is equivalent to a like on other social media platforms. 

## Development
### Setting up your environment
You will need to install [Node](https://nodejs.org/en/), which will also install NPM. To verify you've installed them correctly, run `node -v` and `npm -v` and ensure both commands give you a version number.

Clone the app using `git clone https://github.com/nmusey/hiku.git` and then `cd hiku` to change to the repo's main directory. From here run `npm install` to install all dependencies.

Hiku uses PostgreSQL, which can be installed from [here](https://www.postgresql.org). The database must be running for you to run the project. After starting the PostgreSQL server, create the tables by running `npx prisma migrate dev`. 
After installing Postgres, create a `hiku` user using the following command: `psql --command="CREATE USER hiku CREATEDB"`.

You will also need a `.env` file to run the project. To start, run `cp .env.example .env` and then open `.env` in a text editor to fill in all values. You will need access to an email server, but this may require extra configuration if it's not the hiku.ca server. That can be configured in `server/src/utils/mail.utils.ts`. 

### Running the app locally
To run the app you'll need a build. Get this by runnin `npm run build`.
After installing all dependencies, the server can be started with `npm run dev`. The server will start at `localhost:PORT` where PORT is specified in your `.env` file.
There may be a few errors the first time you start up the server, if these prevent the app from running just rerun `npm run dev` after a minute.

### Deploying the app
To deploy the app just run `deploy.sh`. This will build and upload the code as well as run it on the server. It does require SSH access, which must be set up from a machine with existing SSH capabilities.