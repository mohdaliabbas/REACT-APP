import React, { useState, useEffect } from 'react';
import { OpenAIApi } from '@openai/api';

const api = new OpenAIApi('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');

const chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    addMessage('Bot', 'Hello! How can I assist you today?');
  }, []);

  const addMessage = (sender, text) => {
    setMessages((prevMessages) => [...prevMessages, { sender, text }]);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;

    addMessage('User', inputText);

    try {
      const response = await api.chat.create({
        messages: messages.map((message) => ({
          role: message.sender === 'User' ? 'system' : 'user',
          content: message.text,
        })),
      });

      const botReply = response.choices[0].message.content;
      addMessage('Bot', botReply);
    } catch (error) {
      console.error('Error:', error);
    }

    setInputText('');
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <span>{message.sender}: </span>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleFormSubmit}>
        <input type="text" value={inputText} onChange={handleInputChange} placeholder="Type your message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default chatbot;
