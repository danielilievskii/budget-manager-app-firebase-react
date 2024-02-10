# Budget Manager App (React + Firebase)

The Budget Manager App is a web application built using React and Firebase. It allows users to manage their expenses and track their budget effectively.

## Features
* Budget Management: Users can input and track their income and expenses from each wallet.
* Firebase Integration: The app uses Firebase for data storage and authentication.
* Authentication: Secure user authentication using Firebase Authentication.
* Redux State Management: Redux is employed to manage the app’s state.
* Real-time Updates: Expenses are synced in real-time across devices.
* Thunk Middleware: Used for asynchronous actions.

## Getting Started

### Installation
1. Clone this repository:
### `git clone https://github.com/danielilievskii/budget-manager-app-firebase-react.git`

2. Navigate to the project directory:
### `cd react-budget-app`

3. Install dependencies:
### `npm install`

4. Configuration
* Create a Firebase project at Firebase Console.
* Obtain your Firebase configuration (API key, project ID, etc.).
* Create `.env` file and fill in you Firebase API keys:


`REACT_APP_APIKEY=YOUR_API_KEY`

`REACT_APP_AUTHDOMAIN=YOUR_AUTH_DOMAIN`

`REACT_APP_DATABASEURL=YOUR_DATABASE_URL`

`REACT_APP_PROJECTID=YOUR_PROJECT_ID`

`REACT_APP_STORAGEBUCKET=YOUR_STORAGE_BUCKET`

`REACT_APP_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID`

5. Start the app:
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

Feel free to customize this README to include any additional information specific to your project. Good luck with your Budget Manager App! 📊💰


## Additional Commands

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.


