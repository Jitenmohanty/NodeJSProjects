import mongoose from "mongoose";
import {client} from 'twilio'
import { addMessages } from "../Queue/producer";

export const messageHandler = async(req,res)=>{
    try {

        const message = req.body.message;
        const canditatesNumber = await Candidate.find().select(whatsappNo)
        if(!canditatesNumber){
            return res.json({
                status:400,
                message:"No user found"
            })
        }
        for(let number of canditatesNumber ){
           await addMessages(number,message)
        }
        res.json({ status: 200,message:"Messages are being sent." });
        
    } catch (error) {
        console.error('Error sending messages:', error);
        res.json({status:500, error: 'Failed to send messages' });
    }
}