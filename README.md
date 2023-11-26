# Руководство по использованию OpenAI API для создания чат-бота с помощью Node.js

<img src="https://i.imgur.com/F43Db9m.jpg" alt="OpenAI">

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
// Получение статуса выполнения - необходимо сохранить его в базу данных и извлечь
const run = await openai.beta.threads.runs.retrieve(
    "thread_dP3QRK85tkSUpsopX4LunFLA", // это идентификатор потока
    "run_8wUdenkwI3odAQFXFSRO3QeJ" // это идентификатор выполнения
);
console.log(run);
```

```javascript
{
  id: 'run_8wUdenkwI3odAQFXFSRO3QeJ',
  object: 'thread.run',
  created_at: 1701017576,
  assistant_id: 'asst_CjvyFIeraCLKB8NTAqF0FhqG',
  thread_id: 'thread_dP3QRK85tkSUpsopX4LunFLA',
  status: 'failed',
  started_at: 1701017576,
  expires_at: null,
  cancelled_at: null,
  failed_at: 1701017581,
  completed_at: null,
  last_error: {
    code: 'rate_limit_exceeded',
    message: 'Your account is not active, please check your billing details on our website.'
  },
  model: 'gpt-4-1106-preview',
  instructions: 'Adress user as Lionel Messi',
  tools: [],
  file_ids: [],
  metadata: {}
}
```

Вот так, друзья, иногда даже лучшие из нас сталкиваются с провалом. Но не волнуйтесь, это всего лишь программное обеспечение, капризничающее как ребенок, которому не купили мороженое. А еще это отличная возможность убедиться, что вы не забыли заплатить за сервис, который дает вам такую замечательную возможность общаться со своим персональным ИИ-Консьержем.
