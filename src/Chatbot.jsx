import axios from "axios";

import { useState, useRef, useEffect } from "react";

const Chatbot = ({email}) => {

  const [question, setQuestion] = useState("");
  const [messages, setMessages]=useState(()=>{
    return JSON.parse(localStorage.getItem('chats'))||
    [
    {
      sender: "bot",
      text: "Hello! How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]
  })
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to the newest message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('chats',JSON.stringify(messages));
  }, [messages, loading]);

  const chatbots = async (e) => {
    e?.preventDefault();
    if (!question.trim() || loading) return;

    const userText = question.trim();
    const timeStamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // 1. Append user message to state & clear input
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText, time: timeStamp },
    ]);
    setQuestion("");
    setLoading(true);

    try {
      const payload = {
        question: userText,
        applicationEmai:email, // Kept original property name
      };

      const res = await axios.post("https://localhost:7077/api/AIChat", payload);

      // 2. Append bot response to state
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data?.answer || res.data || "No response received.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error("Error", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I couldn't process your request. Please check your backend connection.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
   
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.avatar}>AI</div>
        <div>
          <h3 style={styles.title}>AI Assistant</h3>
          <span style={styles.status}>● Online</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div style={styles.chatArea}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.messageWrapper,
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.bubble,
                ...(msg.sender === "user" ? styles.userBubble : styles.botBubble),
                ...(msg.isError ? styles.errorBubble : {}),
              }}
            >
              <p style={styles.messageText}>{msg.text}</p>
              <span
                style={{
                  ...styles.timestamp,
                  color: msg.sender === "user" ? "rgba(255,255,255,0.7)" : "#888",
                }}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Spinner / Indicator */}
        {loading && (
          <div style={{ ...styles.messageWrapper, justifyContent: "flex-start" }}>
            <div style={{ ...styles.bubble, ...styles.botBubble, ...styles.loadingBubble }}>
              <span style={styles.dot}></span>
              <span style={{ ...styles.dot, animationDelay: "0.2s" }}></span>
              <span style={{ ...styles.dot, animationDelay: "0.4s" }}></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={chatbots} style={styles.inputForm}>
        <input
          type="text"
          name="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button
          type="submit"
          disabled={!question.trim() || loading}
          style={{
            ...styles.button,
            opacity: !question.trim() || loading ? 0.6 : 1,
            cursor: !question.trim() || loading ? "not-allowed" : "pointer",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

// --- Embedded UI Styles ---
const styles = {
  container: {
    width: "100%",
    maxWidth: "2050px",
    height: "600px",
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    overflow: "hidden",
    border: "1px solid #eef2f6",
  },
  header: {
    padding: "16px 20px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
  },
  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
  },
  status: {
    fontSize: "12px",
    color: "#a3d5ff",
  },
  chatArea: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    backgroundColor: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  messageWrapper: {
    display: "flex",
    width: "100%",
  },
  bubble: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    wordBreak: "break-word",
  },
  userBubble: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    borderBottomRightRadius: "4px",
  },
  botBubble: {
    backgroundColor: "#e9ecef",
    color: "#212529",
    borderBottomLeftRadius: "4px",
  },
  errorBubble: {
    backgroundColor: "#ffe3e3",
    color: "#dc3545",
  },
  loadingBubble: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "6px",
    padding: "14px 18px",
  },
  dot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#6c757d",
    borderRadius: "50%",
    display: "inline-block",
  },
  messageText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.4",
  },
  timestamp: {
    fontSize: "10px",
    alignSelf: "flex-end",
  },
  inputForm: {
    display: "flex",
    padding: "14px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #eef2f6",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "24px",
    border: "1px solid #ced4da",
    outline: "none",
    fontSize: "14px",
  },
  button: {
    padding: "12px 20px",
    borderRadius: "24px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background-color 0.2s",
  },
};

export default Chatbot;