# JART Group Repository for COMP SCI 2207/7207 Web & Database Computing Web Application Project (2023 Semester 1)


### Resources:

- Project Specifications [HERE](https://myuni.adelaide.edu.au/courses/85266/pages/2023-web-application-group-project-specification)
- Collaborating on Github Repos [HERE](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
- Live share extension [HERE](https://code.visualstudio.com/learn/collaboration/live-share)


### Install and Run:
To setup the project after cloning, simply run ``npm install`` in the project directory. This will download all the necessary node packages needed to run the app. This assumes that node.js is installed.

In order to start the webserver, run one of the following commands in the terminal:
 - ``npm run start`` - this will start the server normally.
 - ``npm run dev`` - This will start the server, and any time a file is changed in the `src/` directory, it will automatically be reloaded.

The server will now be accessible in the browser at ``http://localhost:8080``.


### Directory Structure

 - `config` - contains configuration files for application settings, such as database connections.
 - `public` - stores static assets (e.g., CSS, JavaScript, images) accessible directly by clients.
 - `routes` - contains files defining routes and associated logic for handling requests.
 - `views`  - holds templates or html files for sending to the client.