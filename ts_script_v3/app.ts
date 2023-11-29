import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';
import * as readlineModule from 'readline';
const readline = readlineModule.createInterface({
  input: process.stdin,
  output: process.stdout,
});

dotenv.config();

const secretKey = process.env.OPENAI_API_KEY as string;
const openai = new OpenAI({ apiKey: secretKey });
const assistantId = "asst_CjvyFIeraCLKB8NTAqF0FhqG"; // Replace with your assistant's ID

async function askUser(question: string): Promise<string> {
  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  try {
    let threadId: string | null = null;
    console.log("Здравствуйте, чем я могу вам помочь?");

    while (true) {
      const userInput = await askUser("Введите ваш ответ (или введите 'выход' для завершения): ");
      if (userInput.toLowerCase() === 'выход') {
        break;
      }

      if (!threadId) {
        const thread = await openai.beta.threads.create();
        threadId = thread.id;
        console.log("Thread ID created:", threadId);
      }

      console.log("Current Thread ID:", threadId);
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: userInput,
      });

      const run = await openai.beta.threads.runs.create(threadId, { assistant_id: assistantId });

      let runStatus;
      do {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      } while (runStatus.status !== "completed");

      const messages = await openai.beta.threads.messages.list(threadId);
      const assistantMessages = messages.data.filter(m => m.role === "assistant" && m.run_id === run.id);
      if (assistantMessages.length > 0 && assistantMessages[0].content[0].type === 'text') {
        console.log("Ответ помощника:", assistantMessages[0].content[0].text?.value);
      } else {
        console.log("Assistant did not respond in time.");
      }
    }

    readline.close();
  } catch (error) {
    console.error(error);
  }
}

main();