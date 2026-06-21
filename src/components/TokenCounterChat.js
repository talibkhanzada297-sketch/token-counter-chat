import React, { useState } from 'react';
import { encoding_for_model } from 'js-tiktoken';
import '../styles/TokenCounterChat.css';

export default function TokenCounterChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');

  const getTokens = (text) => {
    try {
      const enc = encoding_for_model(model);
      return enc.encode(text).length;
    } catch (e) {
      return Math.ceil(text.length / 4);
    }
  };

  const totalTokens = messages.reduce((sum, m) => sum + getTokens(m.text), 0);
  const currentTokens = getTokens(input);

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, type: 'user' }]);
    setInput('');
  };

  return (
    <div className="token-counter-chat">
      <div className="control-panel">
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-3.5-turbo">GPT-3.5</option>
          <option value="gpt-4">GPT-4</option>
          <option value="claude-3-sonnet">Claude 3</option>
        </select>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <p className="token-count">{currentTokens}</p>
          <span>Current</span>
        </div>
        <div className="stat-box">
          <p className="token-count">{totalTokens}</p>
          <span>Total</span>
        </div>
      </div>

      <div className="messages-container">
        {messages.map(msg => (
          <div key={msg.id} className="message">
            <strong>{msg.type}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type..." />
      <button onClick={send}>Send</button>
    </div>
  );
}