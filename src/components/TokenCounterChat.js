import React, { useState, useRef } from 'react';
import { encoding_for_model } from 'js-tiktoken';
import '../styles/TokenCounterChat.css';

const TokenCounterChat = () => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [isLoading, setIsLoading] = useState(false);

  const MODELS = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5' },
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'claude-3-sonnet', name: 'Claude 3' },
  ];

  const PRICING = {
    'gpt-3.5-turbo': 0.0005,
    'gpt-4': 0.03,
    'claude-3-sonnet': 0.003,
  };

  const countTokens = (text, model) => {
    try {
      const enc = encoding_for_model(model);
      return enc.encode(text).length;
    } catch {
      return Math.ceil(text.length / 4);
    }
  };

  const totalTokens = messages.reduce((sum, msg) => sum + countTokens(msg.content, selectedModel), 0);
  const currentTokens = countTokens(currentInput, selectedModel);
  const estimatedCost = (totalTokens / 1000 * PRICING[selectedModel]).toFixed(4);

  const handleSend = () => {
    if (!currentInput.trim()) return;
    
    setMessages([...messages, 
      { id: Date.now(), role: 'user', content: currentInput, tokens: currentTokens }
    ]);

    setIsLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev,
        { id: Date.now() + 1, role: 'assistant', content: 'Hello! How can I help?', tokens: 8 }
      ]);
      setIsLoading(false);
    }, 1000);

    setCurrentInput('');
  };

  return (
    <div className="token-counter-chat">
      <div className="control-panel">
        <label>Model:</label>
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
          {MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      <div className="stats-container">
        <div className="stat-box"><p>{currentTokens}</p><span>Current</span></div>
        <div className="stat-box"><p>{totalTokens}</p><span>Total</span></div>
        <div className="stat-box"><p>${estimatedCost}</p><span>Cost</span></div>
      </div>

      <div className="messages-container">
        {messages.map(msg => (
          <div key={msg.id} className={'message message-' + msg.role}>
            <strong>{msg.role}</strong>: {msg.content} ({msg.tokens} tokens)
          </div>
        ))}
      </div>

      <textarea value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} placeholder="Type..." />
      <button onClick={handleSend} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default TokenCounterChat;