import * as dotenv from 'dotenv';
import { OpenAI } from "openai";

dotenv.config();

const openai = new OpenAI({
    apikey: process.env.OPENAI_API_KEY
});


// const assistant = await openai.beta.assistants.create({
//     name: "Economics Tutor",
//     instructions: "You are an economics tutor",
//     tools: [
//       {
//         type: "code_interpreter"
//       },
//     ],
//     model: "gpt-4-1106-preview"
//   });
  
// Accessing the assistant
const assistant = await openai.beta.assistants.retrieve("asst_CjvyFIeraCLKB8NTAqF0FhqG");


// Threads
// // Create Thread
// const thread = await openai.beta.threads.create();

// // Create a new message 
// const message = await openai.beta.threads.messages.create(thread.id, {
//     role: "user",
//     content: "Здрасте",
// });

// // Run assistant
// const run = await openai.beta.threads.runs.create(thread.id, {
//     assistant_id: assistant.id,
//     instructions: "Adress user as Lionel Messi",
// });

// Get status of run - need to store it in the database and retrieve it
const run = await openai.beta.threads.runs.retrieve(
    "thread_dP3QRK85tkSUpsopX4LunFLA", // this is a thread id
    "run_8wUdenkwI3odAQFXFSRO3QeJ" // this is a run id
);

// const messages = await openai.beta.threads.messages.list(
//     "thread_dP3QRK85tkSUpsopX4LunFLA" // this is a thread id
// );

// messages.body.data.forEach((message) => {
//     console.log(message.content);
// });

const logs = await openai.beta.threads.runs.steps.list(
    "thread_dP3QRK85tkSUpsopX4LunFLA", // this is a thread id
    "run_8wUdenkwI3odAQFXFSRO3QeJ" // this is a run id
);

logs.body.data.forEach((log) => {
    console.log(log.step_details);
});

console.log(logs);