import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

const API_KEY = "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";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello I Am chatgpt",
      sender: "ChatGPT"
    }
  ])

  const handleSend = async(message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage]; //

    setMessages(newMessages);

    setTyping(true)

    await processMessagesToChatgpt(newMessages);
  }

  async function processMessagesToChatgpt(chatMessages){
    
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if(messageObject.sender == "ChatGPT"){
        role: "assistant"
      }else{
        role: "user"
      }
      return {role: role, content: messageObject.message }
    })

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like i am 10 year old"
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data)
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]
      );
      setTyping(false)
    });
  
  }

  return (
    <div className='App'>
      <div style={{ position: 'relative',  height:"900px", width: "900px" }}>
      <MainContainer>
        <ChatContainer>
          <MessageList typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null} >
            {messages.map((message) => {
              return <Message model={message} />
            })}
          </MessageList>
          <MessageInput placeholder='Type message here' onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
      </div>
      
    </div>
  )
}

export default App
