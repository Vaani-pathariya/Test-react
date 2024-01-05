// In your React component where you handle messaging
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from "axios";
const socket = io('http://localhost:8000', {
  withCredentials: true,
});
function YourMessagingComponent() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [id,setId]=useState('');
  const [email,setEmail]=useState('')
  const [password,setPass]=useState('')
  useEffect(() => {
    // Listen for incoming messages
    socket.on('message', (message) => {
      console.log(message)
    });

    // Clean up the socket connection when the component unmounts

  }, [messages]);
  const handleLogin = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/login`, {
        email,
        password
      });
      localStorage.setItem("token", response.data.token);
      socket.emit('authenticate', localStorage.getItem("token"));
      console.log(response.data)
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
    }
  };
  const handleSignup = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/signup`, {
        email,
        password
      });
      localStorage.setItem("token", response.data.token);
      socket.emit('authenticate', localStorage.getItem("token"));
      console.log(response.data)
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
    }
  };
  const sendMessage = () => {
    // Emit a 'message' event to the server
    socket.emit('message', {
      senderToken:localStorage.getItem("token"),
      receiver: id, // Provide the receiver's ID
      text: newMessage,
    });

    // Update the local state or clear the input field
    setNewMessage('');
  };
  const msg=async()=>{
    try {
      const response = await axios.post(`http://localhost:8000/unread-messages`,{
        user2IdString:id
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(response.data)
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
    }
  }
  return (
    <div>
      {/* Display your messages */}
      <ul>
        {messages.map((message) => (
          <li key={message._id}>
            {message.sender}<br></br>
            {message.text}
          </li>
        ))}
      </ul>

      {/* Input field and send button */}
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={handleLogin}>signup</button>
      Enter the id
      <input
        type="text"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      Enter the login email 
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      Pass
      <input
        type="text"
        value={password}
        onChange={(e) => setPass(e.target.value)}
      />
      <button onClick={msg}>Get msg</button>
    </div>
  );
}

export default YourMessagingComponent;
