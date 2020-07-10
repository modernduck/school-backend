import * as express from 'express'
import { FirebaseAdmin } from "../firebase.service"
import * as cors from 'cors'
import * as cookieParser from 'cookie-parser';
const validateFirebaseIdToken = async (req:express.Request, res:express.Response, next:express.NextFunction) => {
    console.log('Check if request is authorized with Firebase ID token');
  
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
      console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
          'Make sure you authorize your request by providing the following HTTP header:',
          'Authorization: Bearer <Firebase ID Token>',
          'or by passing a "__session" cookie.');
      res.status(403).send('Unauthorized');
      return;
    }
  
    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else if(req.cookies) {
      console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    } else {
      // No cookie
      res.status(403).send('Unauthorized');
      return;
    }
  
    try {
      const decodedIdToken = await FirebaseAdmin.auth().verifyIdToken(idToken);
      console.log('ID Token correctly decoded', decodedIdToken);
      (req as any).user = decodedIdToken;
      next();
      return;
    } catch (error) {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
      return;
    }
  };

const app = express();
app.use(cors({origin:true}));
app.use(cookieParser());
app.use(validateFirebaseIdToken);

export const BaseAuthApp = app;