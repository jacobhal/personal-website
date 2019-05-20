This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The project contains an Express server that can be used if running on a Node.js host and modifying the "POST" call in Contact.js. The current version uses mailer.php to send emails since my hosting service uses Apache.

To modify the content of this page, modify files in the MAMP/git/personal-website folder. Use npm start in the folder to see the rendered webpage at localhost:3000/. When finished, go into client folder and run npm run build. This will produce a build folder. The content of the build folder can now be uploaded into public_html of the host website. The easiest way to do it is to establish and save a site manager FTP connection using Filezilla or similar tools.

## Available Scripts

cd to the client directory to be able to run the following scrips:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
