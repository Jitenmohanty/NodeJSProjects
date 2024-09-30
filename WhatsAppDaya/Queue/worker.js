import { Worker } from "bullmq";
import {client} from 'twilio';

const worker = new Worker("whatsapp_queue",async(job)=>{
    try {
        const {number,message} = job.data;
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: number,
          });
          console.log(`Message sent to ${number}`);
    } catch (error) {
        console.log(error,"Error on sending messages from whatsapp queue!")
    }
}).run();