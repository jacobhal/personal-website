This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project introduction and instructions for deploying

The project contains an Express server that can be used if running on a Node.js host and modifying the "POST" call in Contact.js. The current version uses mailer.php to send emails since my hosting service uses Apache.

To modify the content of this page, modify files in the MAMP/git/personal-website folder. Use npm start in the folder to see the rendered webpage at localhost:3000/. When finished, go into client folder and run npm run build. This will produce a build folder. The content of the build folder can now be uploaded into public_html of the host website. The easiest way to do it is to establish and save a site manager FTP connection using Filezilla or similar tools.

## Bulma and Bootstrap
This project is using Bulma and Bulma React components for CSS styling. However, some things have been brought in from Bootstrap, such as Tab functionality. In order to prevent clashing between Bulma and Bootstrap, the pieces needed for tabs were selected here https://getbootstrap.com/docs/3.4/customize/ and downloaded as a min.css file.

## Available Scripts

cd to the client directory to be able to run the following scrips:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Deploying with git-ftp

Run npm run build in the client directory as usual.
Then setup git-ftp variables for username, password, url, syncroot, and remote-root.
You can create different scopes. For example, I have a testing scope to test that everything works and a production scope
that I use when everything is setup correctly.

List config variables with: `git config --local -l`

Initialise git-ftp with: `git ftp init -s production`

Push to deployment server with: `git ftp push -s production --all`
