import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: secretKey });
const assistantId = "asst_kCSrKaHjh589gbKr2fphQ93T"; // Replace with your assistant's ID

async function fetchAndSummarizeConversation(threadId) {
  try {
    const messages = await openai.beta.threads.messages.list(threadId);
    const conversationText = messages.data
      .map(m => m.content[0].text?.value)
      .join("\n");

    const response = await openai.createCompletion({
      model: "text-davinci-003", // You can choose a different model as required
      prompt: "Summarize the following conversation:\n\n" + conversationText,
      max_tokens: 150
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error fetching and summarizing conversation:", error);
    return null;
  }
}

async function createThreadWithSummary(summary) {
  try {
    const run = await openai.beta.threads.createAndRun({
      assistant_id: assistantId,
      thread: {
        messages: [
          { role: "user", content: summary },
        ],
      },
    });

    console.log("New Thread and Run Created:", run);
  } catch (error) {
    console.error("Error creating thread with summary:", error);
  }
}

// Example usage
(async () => {
  const threadId = "thread_N6opDHqR0LOFvJ2yWnlUWHQg"; // Replace with the original thread ID
  const summary = await fetchAndSummarizeConversation(threadId);
  
  if (summary) {
    console.log("Conversation Summary:", summary);
    await createThreadWithSummary(summary);
  } else {
    console.log("No summary available.");
  }
})();
