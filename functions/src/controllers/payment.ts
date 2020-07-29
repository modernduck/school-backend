import * as express from 'express'
import * as bodyParser from 'body-parser'
import { AirtableBase } from "../airtable.service"
const classBase = new AirtableBase('Classes');
const base = new AirtableBase('Payments');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', async(req, res) => {
    let userAirtableId = req.body.userId;
    let classes =  await Promise.all((req.body.classes as Array<string>).map(classId => classBase.get(classId)));
    let canAttend =  classes.map(item => item.fields as any).map(item => item['Full'] == "Available").reduce((prev, current) => prev && current, true);
    if(canAttend){
        base.create({
            "Name":(new Date()).toISOString(),
            "Type":"Transfers",
            "Paid":req.body.paid
        }).catch(err => console.log(err))
    }
})


export const PaymentApp = app;