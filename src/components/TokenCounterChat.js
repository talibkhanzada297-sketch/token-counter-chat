import React, { useState, useRef, useEffect } from 'react';
import { encoding_for_model } from 'js-tiktoken';
import '../styles/TokenCounterChat.css';

const TokenCounterChat = () => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [tokenInfo, setTokenInfo] = useState({
    currentMessage: 0,
    totalConversation: 0,
  });
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [isLoading, setIsLoading] = useState(false);

  const AVAILABLE_MODELS = [
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo' },
    { id: 'claude-3-sonnet', name: 'Claude 3' },
  ];

  const PRICING = {
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
    'claude-3-sonnet': { input: 0.003, output: 0.015 },
  };

  const countTokens = (text, model) => {
    try {
      if (!text) return 0;
      const enc = encoding_for_model(model);
      return enc.encode(text).length;
    } catch (error) {
      return Math.ceil(text.length / 4);
    }
  };

  const calculateTotalTokens = (msgs) => {
    return msgs.reduce((total, msg) => total + countTokens(msg.content, selectedModel), 0);
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setCurrentInput(text);
    setTokenInfo({
      currentMessage: countTokens(text, selectedModel),
      totalConversation: calculateTotalTokens(messages),
    });
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    setIsLoading(true);

    const userMessage = {
      id: Date.now(),
      content: currentInput,
      role: 'user',
      timestamp: new Date(),
      tokens: countTokens(currentInput, selectedModel),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        content: 'Hello! This is a mock response.',
        role: 'assistant',
        timestamp: new Date(),
        tokens: 0,
      };
      assistantMessage.tokens = countTokens(assistantMessage.content, selectedModel);
      setMessages([...updatedMessages, assistantMessage]);
      setIsLoading(false);
    }, 1000);

    setCurrentInput('');
    setTokenInfo({
      currentMessage: 0,
      totalConversation: calculateTotalTokens(updatedMessages),
    });
  };

  const estimateCost = () => {
    const prices = PRICING[selectedModel] || PRICING['gpt-3.5-turbo'];
    return ((tokenInfo.totalConversation / 1000) * prices.input).toFixed(4);
  };

  return (
    <div className="token-counter-chat">
      <div className="control-panel">
        <div className="model-selector">
          <label>Select Model:</label>
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="model-dropdown">
            {AVAILABLE_MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <p className="token-count">{tokenInfo.currentMessage}</p>
          <span>Current</span>
        </div>
        <div className="stat-box">
          <p className="token-count">{tokenInfo.totalConversation}</p>
          <span>Total</span>
        </div>
        <div className="stat-box">
          <p className="token-count">${estimateCost()}</p>
          <span>Cost</span>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <p>No messages yet. Start typing!</p>
        ) : (
          <div className="messages-list">
            {messages.map((msg) => (
              <div key={msg.id} className={'message message-' + msg.role}>
                <strong>{msg.role.toUpperCase()}</strong>: {msg.content} ({msg.tokens} tokens)
              </div>
            ))}
          </div>
        )}
      </div>

      <textarea value={currentInput} onChange={handleInputChange} placeholder="Type message..." className="input-textarea" disabled={isLoading} />
      <button onClick={handleSendMessage} disabled={isLoading || !currentInput.trim()} className="send-button">
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
};

export default TokenCounterChat;