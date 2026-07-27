import React, { useState, useEffect, useRef } from "react";
import { BsFillChatSquareDotsFill } from "react-icons/bs";
import { AiOutlineClose, AiOutlineSend } from "react-icons/ai";
import { initialProperties } from "../../utils/propertiesData";
import "./AIChatAssistant.css";

const COHERE_API_KEY = "AQ.Ab8RN6JxGyct4x2PVImrXQvTboUCKF3iJpISVmfnKHMZXj6siA";
const COHERE_API_URL = "https://api.cohere.com/v2/chat";

// Build a compact property context from site data
const buildPropertyContext = () => {
  const props = JSON.parse(localStorage.getItem("properties0") || "null") || initialProperties;
  return props
    .map(
      (p) =>
        `ID:${p.id} | Title:${p.title} | City:${p.city} | Address:${p.address} | Price:$${p.price}/mo | Bedrooms:${p.facilities?.bedrooms ?? "N/A"} | Bathrooms:${p.facilities?.bathrooms ?? "N/A"} | Parking:${p.facilities?.parkings ?? "N/A"} | Description:${p.description?.slice(0, 120) ?? ""}`
    )
    .join("\n");
};

const SYSTEM_PROMPT = `You are a helpful AI real estate assistant for Homyz, a property listing website.
You ONLY answer questions based on the property listings provided below.
Do NOT make up properties or prices not listed here.
If the user asks about something not in the data, say you only have information about the listed properties.
Keep answers concise, friendly, and helpful.
If relevant, mention the property title, city, price, and facilities.

AVAILABLE PROPERTIES ON THIS WEBSITE:
${buildPropertyContext()}`;

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your AI real estate assistant powered by Cohere. Ask me about properties, pricing, cities, bedrooms, or anything about listings on this site!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Build chat history for Cohere (only user/assistant turns)
  const buildChatHistory = () =>
    messages
      .filter((m) => m.sender !== "error")
      .map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsLoading(true);

    try {
      const history = buildChatHistory();

      const response = await fetch(COHERE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "X-Client-Name": "homyz-real-estate",
        },
        body: JSON.stringify({
          model: "command-r-plus",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history,
            { role: "user", content: userText },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const botReply =
        data?.message?.content?.[0]?.text ||
        data?.text ||
        "Sorry, I couldn't get a response. Please try again.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("Cohere API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat-container">
      {/* Chat bubble icon */}
      {!isOpen && (
        <button className="chat-bubble-btn" onClick={() => setIsOpen(true)}>
          <BsFillChatSquareDotsFill className="chat-btn-icon" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-status-dot" />
              <h3>AI Real Estate Assistant</h3>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <AiOutlineClose />
            </button>
          </div>
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.sender}`}>
                <div className="message-text">{msg.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper bot">
                <div className="message-text typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Ask about properties, cities, prices..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
            />
            <button className="send-btn" onClick={handleSend} disabled={isLoading}>
              <AiOutlineSend />
            </button>
          </div>
          <div className="chat-powered-by">Powered by Cohere AI · Only answers from this site</div>
        </div>
      )}
    </div>
  );
};

export default AIChatAssistant;
