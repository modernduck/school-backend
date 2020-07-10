import * as express from 'express'
import { AirtableBase } from "../airtable.service"

const base = new AirtableBase('Classes');
const app = express();

app.get('/', async (req, res) => {
    
    if(req.query.view)
        res.json((await base.fetch({view:req.query.view as string })).map(item => item.fields))
    else
        res.json((await base.fetch()).map(item => item.fields))
})

export const ClassApp = app;