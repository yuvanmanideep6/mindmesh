import { useState, useRef, useEffect } from "react";

function App() {

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTkzYWM5YWE3NzAxZDBkNzNlNzUyMSIsImlhdCI6MTc3MzkxMDMzNSwiZXhwIjoxNzczOTk2NzM1fQ.jfT7vmAj_g2tJswhDCeLEwMnDjhQE64lncfHKw_uFWM";

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");

  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, typingMessage]);

  useEffect(() => {

  if (!activeWorkspace) return;

  const loadMessages = async () => {

    const res = await fetch(
      `http://localhost:5000/api/messages/${activeWorkspace}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const data = await res.json();

    setChat(data);

  };

  loadMessages();

}, [activeWorkspace]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    setLoading(true);

    try {

      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTkzYWM5YWE3NzAxZDBkNzNlNzUyMSIsImlhdCI6MTc3MjY5ODM0NywiZXhwIjoxNzcyNzg0NzQ3fQ.WDKXWt66psl6CN1m7rf6X7RdUBb413oMIpgyLi7HaFo"
        },
        body: JSON.stringify({
          workspaceId: "69a7ea4331eef816002d0f6e",
          content: message
        })
      });

      const data = await res.json();

      // add user message first
      setChat(prev => [...prev, data.userMessage]);

      const fullText = data.aiMessage.content;

      let index = 0;

      const interval = setInterval(() => {

        setTypingMessage(fullText.slice(0, index));
        index++;

        if (index > fullText.length) {

          clearInterval(interval);

          setChat(prev => [...prev, {
            sender: "ai",
            content: fullText
          }]);

          setTypingMessage("");

        }

      }, 20);

      setMessage("");

    } catch (err) {
      console.error(err);
    }

    setLoading(false);

  };

  useEffect(() => {

  const loadWorkspaces = async () => {

    const res = await fetch("http://localhost:5000/api/workspaces", {
     headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
}
    });

    const data = await res.json();

    setWorkspaces(Array.isArray(data) ? data : []);

    if(data.length > 0){
      setActiveWorkspace(data[0]._id);
    }

  };

  loadWorkspaces();

}, []);

  return (

    <div className="h-screen flex bg-[#121212] text-[#f1f1f1]" style={{fontFamily:"Poppins"}}>

      {/* SIDEBAR */}
      <div className="w-64 border-r border-gray-800 flex flex-col">

        <div className="p-4 text-lg font-semibold border-b border-gray-800">
          MindMesh
        </div>

        <button
          className="m-4 p-2 rounded-lg"
          style={{background:"#e63946"}}
        >
          + New Chat
        </button>

        <div className="flex-1 overflow-y-auto px-4 space-y-2">

          <div className="p-2 rounded hover:bg-gray-800 cursor-pointer">
            Workspace 1
          </div>

          <div className="p-2 rounded hover:bg-gray-800 cursor-pointer">
            Workspace 2
          </div>

          <div className="p-2 rounded hover:bg-gray-800 cursor-pointer">
            Workspace 3
          </div>

        </div>

      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="p-4 border-b border-gray-800 text-xl font-semibold">
          MindMesh AI
        </div>

        {/* CHAT WINDOW */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {chat.map((msg, i) => (
            <div
              key={i}
              className={`max-w-xl p-3 rounded-xl shadow ${
                msg.sender === "user" ? "ml-auto" : ""
              }`}
              style={{
                background: msg.sender === "user" ? "#e63946" : "#1e1e1e"
              }}
            >
              {msg.content}
            </div>
          ))}

          {typingMessage && (
            <div
              className="max-w-xl p-3 rounded-xl"
              style={{background:"#1e1e1e"}}
            >
              {typingMessage}
            </div>
          )}

          {loading && (
            <div
              className="max-w-xs p-3 rounded-xl"
              style={{background:"#1e1e1e"}}
            >
              MindMesh is thinking...
            </div>
          )}

          <div ref={chatEndRef}></div>

        </div>

        {/* INPUT AREA */}
        <div className="p-4 border-t border-gray-800 flex gap-3">

          <input
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key === "Enter"){
                sendMessage();
              }
            }}
            placeholder="Ask MindMesh..."
            className="flex-1 p-3 rounded-lg outline-none"
            style={{
              background:"#1e1e1e",
              color:"#f1f1f1"
            }}
          />

          <button
            onClick={sendMessage}
            className="px-6 py-2 rounded-lg font-medium"
            style={{
              background:"#e63946",
              color:"#fff"
            }}
          >
            Send
          </button>

        </div>

      </div>

    </div>

  ); 
}
export default App;