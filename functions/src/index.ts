import * as functions from 'firebase-functions';
import { UserApp } from "./controllers/users"
import { ClassApp } from "./controllers/classes"
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
export const users = functions.https.onRequest(UserApp);
export const classes = functions.https.onRequest(ClassApp);
