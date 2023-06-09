# JART Group Repository for COMP SCI 2207/7207 Web & Database Computing Web Application Project (2023 Semester 1)


### Resources:

- Project Specifications [HERE](https://myuni.adelaide.edu.au/courses/85266/pages/2023-web-application-group-project-specification)
- Collaborating on Github Repos [HERE](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
- Live share extension [HERE](https://code.visualstudio.com/learn/collaboration/live-share)


### MARKING INSTRUCTIONS:

To start the server, run the following commands in the terminal:
 - ``npm install`` - Installs required node modules.
 - ``npm run setup`` - Starts and loads the database from `schema.sql`. **WARNING:** *All existing data will be lost.*
 - ``npm run start`` - Starts the node server on port 8080.
The server will now be accessible in the browser at ``http://localhost:8080``.


### Directory Structure

 - `config` - Contains config files for application settings, such as database connections and various libraries.
 - `public` - Stores static assets (e.g., CSS, JavaScript, images) accessible directly by clients.
 - `routes` - Contains any files defining routes and associated logic for handling requests.
 - `pages`  - Contains any .html files to send to the client through routes

