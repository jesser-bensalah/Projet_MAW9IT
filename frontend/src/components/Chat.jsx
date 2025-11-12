import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Chatbot from './Chatbot/Chatbot';

const socket = io('http://localhost:3000'); // URL explicite

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const randomUser = 'User' + Math.floor(Math.random() * 1000);
    setUsername(randomUser);
    console.log('👤 Username:', randomUser);
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    socket.on('messageReceived', (message) => {
      console.log('📩 Received:', message);
      setMessages(prev => [...prev, message]);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected');
    });

    return () => {
      socket.off('messageReceived');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      const messageData = { 
        sender: username, 
        content: input,
        timestamp: new Date().toLocaleTimeString()
      };
      
      console.log('📤 Sending:', messageData);
      socket.emit('sendMessage', messageData);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center' }}>💬 Chat Room</h2>
      
      <div style={{ 
        border: '2px solid #007bff',
        height: '400px', 
        overflowY: 'auto', 
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '15px',
        backgroundColor: '#f8f9fa'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ 
            marginBottom: '15px',
            textAlign: msg.sender === username ? 'right' : 'left'
          }}>
            <div style={{ 
              display: 'inline-block',
              padding: '10px 15px',
              borderRadius: '15px',
              backgroundColor: msg.sender === username ? '#007bff' : '#e9ecef',
              color: msg.sender === username ? 'white' : 'black',
              maxWidth: '80%'
            }}>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                {msg.sender} {msg.sender === username ? '(moi)' : ''}
              </div>
              <div style={{ margin: '5px 0' }}>{msg.content}</div>
              <div style={{ fontSize: '10px', opacity: 0.6 }}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Écrivez votre message..."
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '20px',
            fontSize: '16px'
          }}
        />
        <button 
          onClick={sendMessage}
          disabled={!input.trim()}
          style={{
            padding: '12px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          ➤
        </button>
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '10px', 
        fontSize: '12px', 
        color: '#666' 
      }}>
        Vous êtes: <strong>{username}</strong>
      </div>
      <Chatbot />
    </div>
  );
}

export default Chat;