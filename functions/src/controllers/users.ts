import { BaseAuthApp } from "./baseAuth"
import { AirtableBase } from "../airtable.service"

const base = new AirtableBase('Students');
const app = BaseAuthApp;

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


export const UserApp = app;