import * as functions from 'firebase-functions';
import Airtable = require('airtable');
import * as showdown from 'showdown';

export const base = new Airtable({apiKey: functions.config().airtable.api_key}).base(functions.config().airtable.base);

export class AirtableBase{
    constructor(public baseName:string){

    }

    create(data:any){
        return base(this.baseName).create(data);
    }

    update(data:any){
        return base(this.baseName).update([data]);
    }

    get(id:string){
       return base(this.baseName).find(id)
    }

    //beta kinda stupid one
    findOne(fields:{[key:string]:any}){
        const filterFormula = Object.keys(fields).map(keyField =>{
            if(typeof(fields[keyField]) == "number")
                return  `{${keyField}} = ${fields[keyField]}`
            else
                return `{${keyField}} = '${fields[keyField]}'`
        }).join(' AND ');
        return base(this.baseName).select({filterByFormula:filterFormula}).all()
    }

    delete(param:string | Array<string>){
        let ids:Array<string> = [];
        if(typeof param === 'string')
            ids.push(param);
        else
            ids = param;
        
            
        
        return  base(this.baseName).destroy(ids)
    }

    fetch(opt?:Airtable.SelectOptions | undefined){
        return base(this.baseName).select(opt).all();
    };
    
}

export const fullLoadChild = async (record:Airtable.Record<any>, childField:string, parentTableName?:string, markupFields?:Array<string>) => {
    let tableName = childField
    if(parentTableName)
        tableName = parentTableName;
    return  Promise.all( (record.fields[childField] as Array<string>).map(async (portKey:string) => {
            let portRec = await (new AirtableBase(tableName)).get(portKey)
            console.log('portRec', portRec.fields)
            if(!markupFields)
                return {...portRec.fields};
            else{
                let answer:any = {...portRec.fields};
                markupFields.forEach(key => {
                    answer[key] = markupToHtml(answer[key]);
                })
                return answer;
            }
        }));
    
    
}

export const markupToHtml = (markup:string) => {
    const converter = new showdown.Converter();
    return converter.makeHtml(markup).replace(/\n/g,"<br/>");
}

export class Attachments{
    urls:Array<string> = [];
    constructor( param:Array<string> | string){
        if(typeof param === "string")
            this.urls.push(param)
        else
            this.urls = param
    }
    public getField(){
        return this.urls.map(url => ({url:url}));
    }
}