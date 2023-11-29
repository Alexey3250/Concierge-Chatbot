import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';


@Injectable()
export class OpenAIChatService {
  private openai: OpenAI;
  private assistantId: string;

  constructor() {
    // Загрузка ключа API из переменных окружения
    const secretKey = "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";
    // Создание экземпляра OpenAI
    this.openai = new OpenAI({ apiKey: secretKey });
    // Идентификатор помощника OpenAI
    this.assistantId = "asst_CjvyFIeraCLKB8NTAqF0FhqG"; // Замените на идентификатор вашего помощника
  }

  // Метод отправки сообщения в OpenAI и получения ответа
  async sendMessageToOpenAI(userInput: string, existingThreadId: string | null): Promise<{threadId: string, response: string | null}> {
    let threadId = existingThreadId;

    // Создание нового треда, если он еще не существует
    if (!threadId) {
      const thread = await this.openai.beta.threads.create();
      threadId = thread.id;
    }

    // Отправка сообщения пользователя в OpenAI
    await this.openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userInput,
    });

    // Запуск процесса обработки сообщения
    const run = await this.openai.beta.threads.runs.create(threadId, { assistant_id: this.assistantId });

    // Ожидание ответа от помощника
    let runStatus;
    do {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
    } while (runStatus.status !== "completed");

    // Получение сообщений от помощника
    const messages = await this.openai.beta.threads.messages.list(threadId);
    const assistantMessages = messages.data.filter(m => m.role === "assistant" && m.run_id === run.id);
    // Выбор последнего сообщения от помощника
    const lastMessage = assistantMessages.length > 0 && assistantMessages[0].content[0].type === 'text' 
                        ? assistantMessages[0].content[0].text?.value 
                        : null;

    // Возвращение ID треда и ответа помощника
    return { threadId, response: lastMessage };
  }
}
