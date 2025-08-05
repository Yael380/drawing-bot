// import React from 'react';
// import './ChatWindow.css';

// type Message = {
//   role: 'user' | 'bot' | 'loading';
//   content: string;
// };

// interface Props {
//   messages: Message[];
//   style?: React.CSSProperties;
// }

// const ChatWindow: React.FC<Props> = ({ messages, style }) => {
//   return (
//     <div className="chat-window" style={style}>
//       {messages.map((msg, i) => {
//         const isUser = msg.role === 'user';
//         const isBot = msg.role === 'bot';

//         const avatarSrc =
//           isUser ? '/images/user.png' :
//           isBot ? '/images/bot.png' :
//           '';

//         return (
//           <div key={i} className={`message-row ${msg.role}`}>
//             {!isUser && avatarSrc && (
//               <img src={avatarSrc} alt={msg.role} className="avatar" />
//             )}
//             <div className={`message-bubble ${msg.role}`}>
//               {msg.content}
//             </div>
//             {isUser && avatarSrc && (
//               <img src={avatarSrc} alt={msg.role} className="avatar" />
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default ChatWindow;
import React from 'react';
import './ChatWindow.css';

type Message = {
  role: 'user' | 'bot' | 'loading';
  content: string;
};

interface Props {
  messages: Message[];
  style?: React.CSSProperties;
}

const ChatWindow: React.FC<Props> = ({ messages, style }) => {
  return (
    <div className="chat-window" style={style}>
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`message-row ${msg.role}`}
        >
          <div className={`message-bubble ${msg.role}`}>
            {msg.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
