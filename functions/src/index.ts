import * as functions from 'firebase-functions';
import { UserApp } from "./controllers/user"
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
export const users = functions.https.onRequest(UserApp);
