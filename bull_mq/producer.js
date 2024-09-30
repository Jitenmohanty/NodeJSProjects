import {Queue} from "bullmq";

const notificationQueue = new Queue('email_queue',{
    connection: {
        host: '127.0.0.1',
        port: '6379',
      },
})



async function init() {
   const res = await notificationQueue.add("email to jitu",{
        email:"jiten.dev",
        subject:"Welecome devs",
        body:"Hey welcome you man"
    })
    console.log("Job added to the queue", res.id)
}

init();