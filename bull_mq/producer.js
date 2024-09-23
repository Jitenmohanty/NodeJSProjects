import {Queue} from "bullmq";

const notificationQueue = new Queue('email_queue')

async function init() {
   const res =  notificationQueue.add("email to jitu",{
        email:"jiten.dev",
        subject:"Welecome devs",
        body:"Hey welcome you man"
    })
    console.log("Job added to the queue",await res.id)
}

init();