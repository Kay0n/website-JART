# JART Group Repository for COMP SCI 2207/7207 Web & Database Computing Web Application Project (2023 Semester 1)


### Resources:

- Project Specifications [HERE](https://myuni.adelaide.edu.au/courses/85266/pages/2023-web-application-group-project-specification)
- Collaborating on Github Repos [HERE](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
- Live share extension [HERE](https://code.visualstudio.com/learn/collaboration/live-share)


### Install and Run:
To setup the project after cloning, simply run ``npm install`` in the project directory. This will download all the necessary node packages needed to run the app. This assumes that node.js has already been installed.

In order to start the webserver, first setup the mysql server by running the following in the terminal;:
 - ``npm run setup`` - This will reset and initialize the mysql server with the default schema **WARNING:** *All existing data will be lost.*

Then run one of the following commands in the terminal:
 - ``npm run start`` - This will start the server normally.
 - ``npm run dev`` - This will start the server in watch mode. Any time a file is changed in the `src/` directory, the server will reload. Any changes must be saved in order to come into effect.
The server will now be accessible in the browser at ``http://localhost:8080``.


### Directory Structure

 - `config` - Contains config files for application settings, such as database connections and various libraries.
 - `public` - Stores static assets (e.g., CSS, JavaScript, images) accessible directly by clients.
 - `routes` - Contains any files defining routes and associated logic for handling requests.
 - `pages`  - Contains any .html files to send to the client through routes

### Dev Notes
 - If you recieve any type errors resembling `Property 'given_name' does not exist on type 'User'`, just open the `types.ts` file. VSCode should reload all typechecking for the User object and this should go away.
 - If you get an error like this in `app.js`, close and reopen VSCode. `Property 'use' does not exist on type 'Function'.`