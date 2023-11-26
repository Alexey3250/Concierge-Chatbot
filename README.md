# Руководство по использованию OpenAI API для создания чат-бота с помощью Node.js

<img src="https://i.imgur.com/4HTiE3j.jpg" alt="OpenAI">

## Введение

Вот мы и в мире Node.js, где каждый NPM пакет — как снежинка, уникальный и незаменим, до следующего обновления.

## Начало работы

Перед тем, как забрести слишком далеко в джунгли асинхронности, удостоверьтесь, что у вас установлены Node.js и npm. Если нет, то скорее всего, вы читаете это на печатной машинке.

```javascript
import * as dotenv from 'dotenv';
import { OpenAI } from "openai";
```

Начинаем с импорта `dotenv` и `OpenAI`, потому что мы любим, когда наш код похож на пазл из зависимостей.

## Конфигурация

```javascript
dotenv.config();

const openai = new OpenAI({
    apikey: process.env.OPENAI_API_KEY
});
```

Здесь мы достаем API ключ из хранилища тайн (`.env` файла). Надеюсь, вы не храните его прямо в коде, верно?

## Создание ассистента

```javascript
const assistant = await openai.beta.assistants.create({
    name: "Экономический Репетитор",
    instructions: "Вы экономический репетитор",
    tools: [
      {
        type: "code_interpreter"
      },
    ],
    model: "gpt-4-1106-preview"
  });
```

## Взаимодействие с существующим ассистентом

```javascript
// Доступ к ассистенту
const assistant = await openai.beta.assistants.retrieve("asst_CjvyFIeraCLKB8NTAqF0FhqG");
console.log(assistant); // Вывод в консоль
```

```javascript
{
  id: 'asst_CjvyFIeraCLKB8NTAqF0FhqG',
  object: 'assistant',
  created_at: 1699681739,
  name: 'ИИ - Консьерж',
  description: null,
  model: 'gpt-4-1106-preview',
  instructions: "Ты- ассистент, ну и отвечай как положено ... ",
  tools: [],
  file_ids: [],
  metadata: {}
}
```

## Создание треда

```javascript
const thread = await openai.beta.threads.create();
console.log(thread); // Вывод в консоль
```

Создаём тред, айди которого будет использоваться для взаимодействия с ассистентом.

```javascript
{
  id: 'thread_XcTr8vYKquaqZM7TKX6r16NP',
  object: 'thread',
  created_at: 1701034193,
  metadata: {}
}
```

## Создание запроса

```javascript
// Создание нового сообщения
const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: "Здрасте",
});

// Запуск ассистента
const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    instructions: "Обращаться к пользователю как к Лионелю Месси",
});
console.log(run);
```

Тут мы получаем 2 главых значения:
    - id - это run id, который будет использоваться запуска конкретного обращения к ассистенту
    - status - статус выполнения запроса
      - queued - запрос в очереди

```javascript
{
  id: 'run_72WNcpyKq1fyCkH8LSqBjSWV',
  object: 'thread.run',
  created_at: 1701034354,
  assistant_id: 'asst_CjvyFIeraCLKB8NTAqF0FhqG',
  thread_id: 'thread_FhT2RTK03wrBThUQSjh9zTSl',
  status: 'queued',
  started_at: null,
  expires_at: 1701034954,
  cancelled_at: null,
  failed_at: null,
  completed_at: null,
  last_error: null,
  model: 'gpt-4-1106-preview',
  instructions: 'Обращаться к пользователю как к Лионелю Месси',
  tools: [],
  file_ids: [],
  metadata: {}
}
```

## Получение статуса выполнения

```javascript


## Запросы и логи

```javascript
// Получение статуса выполнения - необходимо сохранить его в базу данных и извлечь
const run = await openai.beta.threads.runs.retrieve(
    "thread_dP3QRK85tkSUpsopX4LunFLA",
    "run_8wUdenkwI3odAQFXFSRO3QeJ"
);

console.log(run);
```

Заметьте, как мы спокойно обрабатываем статус `failed`. Не беспокойтесь, это просто еще одна возможность для роста... вашего стека технологий.

## Вывод в консоль

```javascript
// Тут будет ваш вывод из консоли, который наверняка не содержит никаких ошибок.
```

Добавьте вывод из консоли здесь, чтобы продемонстрировать, что даже искусственный интеллект иногда теряется в мыслях.

## Заключение

И помните, кодирование с AI — это как танец с роботами: оно может вас научить, оно может вас поддержать, но если что-то идет не так, оно определенно скажет, что это вы наступили ему на ногу.
```

Replace `image-url-here` with the URL of the image you've uploaded, and add the actual console output to the designated section when you have it ready. The sarcasm is retained, providing a light-hearted take on the trials and tribulations of programming with AI.