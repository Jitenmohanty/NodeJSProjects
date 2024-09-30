import { Queue } from "bullmq";

const whatsappMessagesQueue = new Queue("whatsapp_queue", {
  connection: {
    host: "127.0.0.1",
    port: "6379",
  },
});

export async function addMessages(whatsappNumber, msg) {
  try {
    const res = whatsappMessagesQueue.add("What'sapp message", {
            number: whatsappNumber,
            message:msg
    });
  } catch (error) {
    console.log(error,"Error on adding messages on queue")
  }
}
