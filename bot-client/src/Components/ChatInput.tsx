import React, { useState } from 'react';
import './ChatInput.css';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<Props> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const send = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        marginTop: 'auto',
        padding: 12,
        backgroundColor: '#f0f0f0',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingBottom: '0px',
      }}
    >
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={disabled}
        placeholder="כתוב הוראה לציור..."
        style={{
          flex: 1,
          padding: '12px 16px',
          fontSize: 16,
          borderRadius: 10,
          border: '1px solid #ccc',
          outline: 'none',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
          transition: 'border-color 0.3s ease',
          height: '47px',
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') send();
        }}
        onFocus={e => (e.currentTarget.style.borderColor = '#456f78ff')}
        onBlur={e => (e.currentTarget.style.borderColor = '#ccc')}
      />
      <button
        onClick={send}
        disabled={disabled}
        style={{
          marginLeft: 8,
          padding: '12px 24px',
          backgroundColor: disabled ? '#888' : '#82c0cc',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          fontSize: 16,
          width: '75px',
          height: '47px',
          boxShadow: disabled ? 'none' : '0 2px 8px #82c0cc',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={e => {
          if (!disabled) e.currentTarget.style.backgroundColor = '#82c0cc';
        }}
        onMouseLeave={e => {
          if (!disabled) e.currentTarget.style.backgroundColor = '#82c0cc';
        }}
      >
        שלח
      </button>
    </div>
  );
};

export default ChatInput;
