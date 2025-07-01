import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! Ask me anything about our store or services.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // toggle open/close

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post('/api/gemini/chat', { message: input });
      const botMessage = { sender: 'bot', text: res.data.reply || 'No response.' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          💬 Chat
        </button>
      ) : (
        <div className="bg-white border rounded-lg shadow-lg w-80 max-h-[70vh] flex flex-col overflow-hidden">
          {/* Header with Minimize Button */}
          <div className="flex items-center justify-between bg-blue-600 text-white px-3 py-2">
            <span className="font-bold">Ask Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white text-xl leading-none">
              ×
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-auto p-3 space-y-2 text-sm bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded max-w-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-100 text-right ml-auto'
                    : 'bg-gray-200 text-left'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="text-gray-500">Gemini is typing...</div>}
          </div>

          {/* Input Area */}
          <div className="flex border-t bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-2 text-sm outline-none"
              placeholder="Ask something..."
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
