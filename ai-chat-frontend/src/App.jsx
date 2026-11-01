import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your AI assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();

    const userMessage = input.trim();
    if (!userMessage || loading) return;

    const assistantId = `${Date.now()}-${Math.random()}`;

    setInput('');
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage },
      { id: assistantId, role: 'assistant', content: '' },
    ]);

    const appendText = (text) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId ? { ...msg, content: msg.content + text } : msg
        )
      );
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        const body = await response.text();
        let detail = body;

        try {
          detail = JSON.parse(body).error || body;
        } catch {
          // Keep the response body as the error detail.
        }

        throw new Error(detail || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('The server did not provide a response stream.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processLine = (line) => {
        if (!line.trim()) return;

        const item = JSON.parse(line);
        if (item.error) throw new Error(item.error);
        if (typeof item.text === 'string') appendText(item.text);
      };

      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          processLine(buffer.slice(0, newlineIndex));
          buffer = buffer.slice(newlineIndex + 1);
        }

        if (done) break;
      }

      if (buffer.trim()) processLine(buffer);
    } catch (error) {
      console.error('Chat request failed:', error);
      const detail = error instanceof Error ? error.message : String(error);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: msg.content
                  ? `${msg.content}\n\n[Response interrupted: ${detail}]`
                  : `Request failed: ${detail}`,
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#151515',
        color: '#f5f5f5',
        padding: '40px 20px',
        fontFamily: 'sans-serif',
      }}
    >
      <section style={{ width: '100%', maxWidth: '650px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 24px' }}>
          AI Chatbot Project
        </h2>

        <div
          style={{
            background: 'rgba(5, 5, 5, 0.78)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            height: '400px',
            overflowY: 'auto',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              style={{
                textAlign: msg.role === 'user' ? 'right' : 'left',
                margin: '10px 0',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '10px 14px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  background:
                    msg.role === 'user'
                      ? 'rgba(65, 65, 65, 0.88)'
                      : 'rgba(35, 35, 35, 0.88)',
                  color: '#f5f5f5',
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content ||
                  (loading && msg.id === messages[messages.length - 1]?.id
                    ? 'AI is thinking...'
                    : '')}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              minWidth: 0,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #383838',
              background: '#202020',
              color: '#fff',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #404040',
              background: loading ? '#242424' : '#303030',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            Send
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;