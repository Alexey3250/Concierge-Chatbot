// Импорт необходимых зависимостей
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { promises as fsPromises } from 'fs';
import readlineModule from 'readline';
const readline = readlineModule.createInterface({
  input: process.stdin,
  output: process.stdout,
});

dotenv.config();

// Создание соединения с OpenAI
const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
});

// Функция для задавания вопроса пользователю через командную строку
async function askQuestion(question) {
  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Основная функция скрипта
async function main() {
  try {
    let assistantId;
    const assistantFilePath = "./assistant.json";

    // Проверка наличия файла assistant.json и чтение из него данных
    try {
      const assistantData = await fsPromises.readFile(
        assistantFilePath,
        "utf8"
      );
      assistantDetails = JSON.parse(assistantData);
      assistantId = assistantDetails.assistantId;
      console.log("\nОбнаружен существующий помощник.\n");
    } catch (error) {
      console.log("Существующий помощник не обнаружен, создание нового.\n");
      const assistantConfig = {
        name: "Murder mystery helper",
        instructions:
          "You're a murder mystery assistant, helping solve murder mysteries.",
        tools: [{ type: "retrieval" }],
        model: "gpt-4-1106-preview",
      };

      const assistant = await openai.beta.assistants.create(assistantConfig);
      assistantDetails = { assistantId: assistant.id, ...assistantConfig };

      // Сохранение деталей помощника в файл assistant.json
      await fsPromises.writeFile(
        assistantFilePath,
        JSON.stringify(assistantDetails, null, 2)
      );
      assistantId = assistantDetails.assistantId;
    }

    // Вывод приветственного сообщения
    console.log(
      `Привет, я твой личный помощник. Ты дал мне такие инструкции:\n${assistantDetails.instructions}\n`
    );

    // Создание потока общения с помощником
    const thread = await openai.beta.threads.create();
    let keepAsking = true;
    while (keepAsking) {
      const action = await askQuestion(
        "Что вы хотите сделать?\n1. Поговорить с помощником\nВведите ваш выбор: "
      );

      if (action === "1") {
        // Обработка взаимодействия с помощником
        let continueAskingQuestion = true;

        while (continueAskingQuestion) {
          const userQuestion = await askQuestion("\nКакой у вас вопрос? ");

          await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: userQuestion,
          });

          const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistantId,
          });

          let runStatus = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
          );

          // Проверка статуса выполнения
          while (runStatus.status !== "completed") {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(
              thread.id,
              run.id
            );

            if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
              console.log(
                `Статус выполнения '${runStatus.status}'. Невозможно выполнить запрос.`
              );
              break;
            }
          }

          // Получение и вывод последнего сообщения от помощника
          const messages = await openai.beta.threads.messages.list(thread.id);

          const lastMessageForRun = messages.data
            .filter(
              (message) =>
                message.run_id === run.id && message.role === "assistant"
            )
            .pop();

          if (lastMessageForRun) {
            console.log(`${lastMessageForRun.content[0].text.value} \n`);
          } else if (
            !["failed", "cancelled", "expired"].includes(runStatus.status)
          ) {
            console.log("Ответ от помощника не получен.");
          }

          // Запрос на продолжение задавания вопросов
          const continueAsking = await askQuestion(
            "Хотите задать еще один вопрос? (да/нет) "
          );
          continueAskingQuestion =
            continueAsking.toLowerCase() === "да" ||
            continueAsking.toLowerCase() === "yes";
        }
      }

      // Запрос на продолжение работы с помощником
      const continueOverall = await askQuestion(
        "Хотите выполнить еще какое-нибудь действие? (да/нет) "
      );
      keepAsking =
        continueOverall.toLowerCase() === "да" ||
        continueOverall.toLowerCase() === "yes";

      if (!keepAsking) {
        console.log("Хорошо, до следующей встречи!\n");
      }
    }
    readline.close();
  } catch (error) {
    console.error(error);
  }
}

main();
