import { useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

// Put your Open AI API KEY here
const API_KEY = "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";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    'Do the Intent and Entity Recognition for the message.  If detected entities are Date or a Date range, format them with reference to toda\'s date. Please give me the Intent, Entities, and formatted date in the following form only: "Intents:, Entities:, Formatted Date:"',
};

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Employee Copilot!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  function checkIntent(responseMessage) {
    // List of known intents
    const intents = [
      "clear_calendar",
      "cancel_meetings",
      "clear calendar",
      "cancel meetings",
      "cancel_calendar",
      "clearing calendar",
      "clearing a calendar event",
    ];

    const message = responseMessage.toLowerCase();

    // Iterate through the intents and check if the response message contains any of them
    for (const intent of intents) {
      if (message.includes(intent)) {
        // const dateRangeRegex = /Formatted Date: (\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})/;
        // const dateRangeMatch = responseMessage.match(dateRangeRegex);

        // if (dateRangeMatch) {
        //   const startDate = dateRangeMatch[1];
        //   const endDate = dateRangeMatch[2];

        //   if (startDate === endDate) {
        //     return `Looks like you want to Clear your Calendar on ${startDate}`;
        //   }

        //   return (
        //     "Looks like you want to Clear your Calendar from " +
        //     startDate +
        //     " to " +
        //     endDate
        //   );
        // }
        return "Looks like you want to Clear your Calendar?";
      }
    }

    // If none of the intents match, return null
    return "Sorry I don't have this capability yet!";
  }

  async function processMessageToChatGPT(chatMessages) {
    // The processMessageToChatGPT function takes an array of messages (chatMessages) as input, formats them, sends them to the OpenAI API,
    // and then processes the response from the API.
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    // parse response JSON and extract message
    const responseData = await response.json();
    const responseMessage = responseData.choices[0].message.content;
    //Intent: clear_calendar
    // Entities: date - today
    console.log(responseMessage);
    const taskMessage = checkIntent(responseMessage);

    // update messages state
    const newMessages = [
      ...chatMessages,
      {
        message: taskMessage,
        sender: "ChatGPT",
      },
    ];
    setMessages(newMessages);
    setIsTyping(false);
  }

  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="Employee Copilot is typing" />
                ) : null
              }
            >
              {messages.map((message, i) => {
                console.log(message);
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
