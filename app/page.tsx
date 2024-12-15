'use client';

import React, { useState } from 'react';
import AlertComponent from './components/AlertComponent';

type Message = {
  sender: 'user' | 'brian';
  content: string;
};

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);  // State for alert message

  const sendMessage = async () => {
    if (!input.trim()) return;

    const apiKey = process.env.NEXT_PUBLIC_BRIAN_API_KEY;

    if (!apiKey) {
      throw new Error("Brian API key is not set.");
    }

    try {
      const response = await fetch('https://api.brianknows.org/api/v0/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Brian-Api-Key': apiKey,
        },
        body: JSON.stringify({
          prompt: input,
          address: '0x96FB13A9eE7Fd51f0af168d1D2bEa2D0331cAcb6',
          messages: messages.map((msg) => ({
            sender: msg.sender,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      const newMessage: Message = { sender: 'user', content: input };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      if (data.error) {
        if (data.conversationHistory) {
          const newMessage: Message = { sender: 'brian', content: data.error };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else {
          setAlertMessage(data.error);
        }
        setInput('');
      } else if (data.result) {
        console.log("Inside data.result")
        const resultData = await data.result[0];
        let rcvdMsg = "";
        if (resultData?.data?.description) {
          rcvdMsg = await resultData.data.description;
        } else if (resultData?.answer) {
          console.log(resultData.answer)
          console.log("Inside answer")
          rcvdMsg = await resultData.answer;
        } else {
          console.error('Unexpected response format:', data);
          setAlertMessage('Unexpected response from the API.');
        }
      
        const newMessage: Message = { sender: 'brian', content: rcvdMsg };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInput('');
      }
    } catch (error) {
      console.error('Error fetching from API:', error);
    }
  };

  const handleCloseAlert = () => {
    setAlertMessage(null);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-96 h-[600px] bg-white bg-opacity-80 border border-gray-300 rounded-lg shadow-2xl flex flex-col">
        <div className="bg-blue-500 text-white text-center py-3 rounded-t-lg border-b border-gray-300">
          <h1 className="text-lg font-semibold">Ask Me - An AI ChatBot</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 border-b border-gray-300 space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`my-2 p-3 max-w-xs rounded-lg transition-all duration-300 ease-in-out transform ${message.sender === 'user'
                ? 'bg-blue-500 text-white self-end ml-auto hover:scale-105'
                : 'bg-gray-400 text-black self-start mr-auto hover:scale-105'}`}
            >
              {message.content}
            </div>
          ))}
        </div>

        <div className="flex items-center p-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-black shadow-md hover:shadow-lg transition-all duration-300"
          />
          <button
            onClick={sendMessage}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 shadow-lg transform transition duration-300 hover:scale-105"
          >
            Send
          </button>
        </div>
      </div>
      {alertMessage && (
        <AlertComponent message={alertMessage} onClose={handleCloseAlert} />
      )}
    </div>
  );
};

export default ChatPage;
