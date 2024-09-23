import axios from 'axios';
import express from 'express'
import client from './client.js';

const app = express();

app.get('/',async(req,res)=>{
    const casheValue = await client.get("todos");
    if(casheValue){
        return res.json(JSON.parse(casheValue))
    }
    const {data} = await axios.get("https://jsonplaceholder.typicode.com/todos");

    await client.set("todos",JSON.stringify(data))
    await client.expire('todos',100)
    return res.send(data)
})

app.listen(8000)