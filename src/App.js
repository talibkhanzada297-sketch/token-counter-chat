import React from 'react';
import TokenCounterChat from './components/TokenCounterChat';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 AI Token Counter Dashboard</h1>
        <p className="subtitle">Monitor your API token usage in real-time</p>
      </header>
      <main className="app-main">
        <TokenCounterChat />
      </main>
      <footer className="app-footer">
        <p>© 2024 Token Counter Chat | Open Source Project</p>
      </footer>
    </div>
  );
}

export default App;
