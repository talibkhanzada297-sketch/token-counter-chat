import React, { useState } from 'react';
import '../styles/TokenCounterChat.css';

export default function TokenCounterChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');

  // Simple token estimation: ~4 characters = 1 token
  const estimateTokens = (text) => {
    return Math.ceil(text.length / 4);
  };

  const totalTokens = messages.reduce((sum, m) => sum + estimateTokens(m.text), 0);
  const currentTokens = estimateTokens(input);

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, type: 'user' }]);
    setInput('');
  };

  return (
    <div className="token-counter-chat">
      <div className="control-panel">
        <label>Model:</label>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
        </select>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <p className="token-count">{currentTokens}</p>
          <span>Current Tokens</span>
        </div>
        <div className="stat-box">
          <p className="token-count">{totalTokens}</p>
          <span>Total Tokens</span>
        </div>
      </div>

      <div className="messages-container">
        <div className="empty-state">No messages yet</div>
        {messages.map(msg => (
          <div key={msg.id} className={'message message-' + msg.type}>
            <strong>{msg.type.toUpperCase()}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <textarea 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Type message..."
        className="input-textarea"
      />
      <button onClick={send} className="send-button">Send</button>
    </div>
  );
}