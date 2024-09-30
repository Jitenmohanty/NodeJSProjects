import { Worker } from "bullmq";

const sendEmail = () =>
  new Promise((res, rej) =>
    setTimeout(() => res(), 5000)
  );

const worker = new Worker("email_queue", async (job) => {
  console.log(`Message recoded id ${job.id}`);
  console.log("Processing message");
  console.log(`Sending email to ${job.data.email}`);
  await sendEmail();
  console.log("Email sent!")
});

