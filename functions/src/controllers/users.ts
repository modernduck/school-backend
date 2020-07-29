//import { BaseAuthApp } from "./baseAuth"// for production
import { AirtableBase } from "../airtable.service"
import * as express from 'express'
const app = express();
const base = new AirtableBase('Students');
//const app = BaseAuthApp; // for production

app.get('/hello', (req, res) => {
  res.send(`Hello ${(req as any).user.name}`);
});

app.get('/',async (req, res) => {
    let users = await base.fetch()
    let result = users.map(item => item.fields)
    res.json(result);
})

app.get('/:id', async (req, res) => {
    let user = await base.get(req.params.id)
    res.json(user.fields);
})

app.get('/profile', async (req, res) => {
  const firebaseId = req.query.firebaseId // testing
  //const firebaseId = req.user;
  let currentUser = await base.findOne({"FirebaseID":firebaseId})
  res.json(currentUser);
})


export const UserApp = app;