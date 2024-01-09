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
  const [email,setEmail]=useState('vpppcasfe@gmail.com')
  const [password,setPass]=useState('ABCDEF')
  const [name,setName]=useState('Vaani')
  const [zealId,setZealId]=useState('3')
  const [scannedCode,setCode]=useState('65993fd348ca164f23952fc6')
  const [teamIdStr,setTeamId]=useState('65999d9ccd59de25d66ab7a8')
  const [images, setImages] = useState([]);
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
        zealId,
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
        password,
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
    socket.emit('assignTeams');
  };
  const msg=async()=>{
    try {
      const response = await axios.post(`http://localhost:8000/scan-qrcode`,
      { scannedCode,
        teamIdStr
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(response.data)
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
    }
  }
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const response = await axios.post('http://localhost:8000/upload-images', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      console.log(data.message);

      // Fetch the updated image URLs after successful upload
      await fetchImageURLs();
    } catch (error) {
      console.error('Error uploading images:', error.response ? error.response.data : error.message);
    }
  };
  
  const fetchImageURLs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get-image', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data;
      console.log(data.imageUrls);

      // Update the state with the retrieved image URLs
      setImages(data.imageUrls);
    } catch (error) {
      console.error('Error fetching image URLs:', error.response ? error.response.data : error.message);
    }
  };
  return (
    <div>

      {/* Input field and send button */}
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={handleSignup}>signup</button>
      
      <button onClick={msg}>Scan</button>
      <div>
      <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
        {images.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Uploaded ${index + 1}`} style={{ maxWidth: '100%' }} />
        ))}
    </div>
    </div>
  );
}

export default YourMessagingComponent;
