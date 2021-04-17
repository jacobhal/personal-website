This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project introduction and instructions for deploying

The project contains an Express server that can be used if running on a Node.js host and modifying the "POST" call in Contact.js. The current version uses mailer.php to send emails since my hosting service uses Apache.

> The server folder of this project is not used at all in production since that part requires Node.js on the server as mentioned. The client folder contains all code and the relevant package.json / package-lock.json files.

To modify the content of this page, modify files in the MAMP/git/personal-website folder. Use npm start in the folder to see the rendered webpage at localhost:3000/. When finished, go into client folder and run npm run build. This will produce a build folder. The content of the build folder can now be uploaded into public_html of the host website. The easiest way to do it is to establish and save a site manager FTP connection using Filezilla or similar tools.

## Bootstrap

This project uses react-bootstrap and boostrap for all styling. Bulma was used before but I have changed to Bootstrap since it is more stable in general.

### Bulma (old)

This project is using Bulma and Bulma React components for CSS styling. However, some things have been brought in from Bootstrap, such as Tab functionality. In order to prevent clashing between Bulma and Bootstrap, the pieces needed for tabs were selected here https://getbootstrap.com/docs/3.4/customize/ and downloaded as a min.css file.

## Deploying with git-ftp

Run npm run build in the client directory as usual.
Then setup git-ftp variables for username, password, url, syncroot, and remote-root.
You can create different scopes. For example, I have a testing scope to test that everything works and a production scope
that I use when everything is setup correctly.

List config variables with: `git config --local -l`

Initialise git-ftp with: `git ftp init -s production`

Push to deployment server with: `git ftp push -s production --all`

### Automate deployment

I have setup an Azure DevOps pipeline for automatic deployment whenever I push new code to the master branch. Check out the YAML pipeline in the azure-pipelines.yml file if you want to see how this is done. Variables such as $FTP_HOST are set as environment variables in Azure DevOps.
