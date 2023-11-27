import * as dotenv from 'dotenv';
import { OpenAI } from "openai";

dotenv.config();

const openai = new OpenAI({
    apikey: process.env.OPENAI_API_KEY
});

// Создание ассистента
// const assistant = await openai.beta.assistants.create({
//     name: "Экономический Репетитор",
//     instructions: "Вы экономический репетитор",
//     tools: [
//       {
//         type: "code_interpreter"
//       },
//     ],
//     model: "gpt-4-1106-preview"
//   });

// Доступ к ассистенту
const assistant = await openai.beta.assistants.retrieve("asst_CjvyFIeraCLKB8NTAqF0FhqG");
// console.log(assistant);

// // Потоки
// // Создание потока
// const thread = await openai.beta.threads.create();
// console.log(thread);

// // Создание нового сообщения
// const message = await openai.beta.threads.messages.create(thread.id, {
//     role: "user",
//     content: "Здрасте",
// });

// // Запуск ассистента
// const run = await openai.beta.threads.runs.create(thread.id, {
//     assistant_id: assistant.id,
//     instructions: "Обращаться к пользователю как к Лионелю Месси",
// });
// console.log(run);


// Получение статуса выполнения - необходимо сохранить его в базу данных и извлечь
const run = await openai.beta.threads.runs.retrieve(
    "thread_eFMnBg3RryJ87yUSfQe5aXyr", // это идентификатор потока
    "run_1IQwh3Nfkml2eBGlUkQAW2aX" // это идентификатор выполнения
);
console.log(run);

const messages = await openai.beta.threads.messages.list(
    "thread_dP3QRK85tkSUpsopX4LunFLA" // это идентификатор потока
);

messages.body.data.forEach((message) => {
    console.log(message.content);
});

const logs = await openai.beta.threads.runs.steps.list(
    "thread_dP3QRK85tkSUpsopX4LunFLA", // это идентификатор потока
    "run_8wUdenkwI3odAQFXFSRO3QeJ" // это идентификатор выполнения
);

logs.body.data.forEach((log) => {
    console.log(log.step_details);
});

console.log(logs);


// // Create an array to store the messages
// let assistantResponses = [];

// // Iterate through each message and add it to the array
// messages.body.data.forEach((message) => {
//     if(message.role === 'assistant') { // Check if the message is from the assistant
//         assistantResponses.push(message.content);
//     }
// });

// // Print the responses
// console.log("Assistant Responses:");
// assistantResponses.forEach((response, index) => {
//     console.log(`Response ${index + 1}: ${response}`);
// });