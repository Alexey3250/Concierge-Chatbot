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

// Потоки
// Создание потока
// const thread = await openai.beta.threads.create();

// Создание нового сообщения
// const message = await openai.beta.threads.messages.create(thread.id, {
//     role: "user",
//     content: "Здрасте",
// });

// Запуск ассистента
// const run = await openai.beta.threads.runs.create(thread.id, {
//     assistant_id: assistant.id,
//     instructions: "Обращаться к пользователю как к Лионелю Месси",
// });

// Получение статуса выполнения - необходимо сохранить его в базу данных и извлечь
const run = await openai.beta.threads.runs.retrieve(
    "thread_dP3QRK85tkSUpsopX4LunFLA", // это идентификатор потока
    "run_8wUdenkwI3odAQFXFSRO3QeJ" // это идентификатор выполнения
);

// const messages = await openai.beta.threads.messages.list(
//     "thread_dP3QRK85tkSUpsopX4LunFLA" // это идентификатор потока
// );

// messages.body.data.forEach((message) => {
//     console.log(message.content);
// });

const logs = await openai.beta.threads.runs.steps.list(
    "thread_dP3QRK85tkSUpsopX4LunFLA", // это идентификатор потока
    "run_8wUdenkwI3odAQFXFSRO3QeJ" // это идентификатор выполнения
);

logs.body.data.forEach((log) => {
    console.log(log.step_details);
});

console.log(logs);
