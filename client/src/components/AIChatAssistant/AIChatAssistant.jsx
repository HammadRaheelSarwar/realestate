import React, { useState, useEffect, useRef } from "react";
import { BsFillChatSquareDotsFill } from "react-icons/bs";
import { AiOutlineClose, AiOutlineSend } from "react-icons/ai";
import { initialProperties } from "../../utils/propertiesData";
import "./AIChatAssistant.css";

const COHERE_API_KEY = "AQ.Ab8RN6JxGyct4x2PVImrXQvTboUCKF3iJpISVmfnKHMZXj6siA";
const COHERE_API_URL = "https://api.cohere.ai/v1/chat";

// Build property context from site data
const buildPropertyContext = () => {
  const props =
    JSON.parse(localStorage.getItem("properties0") || "null") ||
    initialProperties;
  return props
    .map(
      (p) =>
        `- "${p.title}" in ${p.city}, ${p.address}. Price: $${p.price}/mo. Bedrooms: ${p.facilities?.bedrooms ?? "N/A"}, Bathrooms: ${p.facilities?.bathrooms ?? "N/A"}, Parking: ${p.facilities?.parkings ?? "N/A"}.`
    )
    .join("\n");
};

const PREAMBLE = () => `You are a helpful AI real estate assistant for Homyz, a property listing website.
You ONLY answer questions based on the property listings below. Do NOT invent properties or prices that are not listed.
If asked about something not in the data, say you only have information about the listed properties.
Keep answers concise, friendly, and helpful. Mention property title, city, price, and facilities when relevant.

AVAILABLE PROPERTIES ON THIS WEBSITE:
${buildPropertyContext()}`;

// ── Local fallback (if API fails) ────────────────────────────────────────────
const localFallback = (text) => {
  const t = text.toLowerCase();
  const props =
    JSON.parse(localStorage.getItem("properties0") || "null") ||
    initialProperties;

  // city match
  const matched = props.filter((p) => t.includes(p.city.toLowerCase()));
  if (matched.length) {
    return (
      `I found ${matched.length} listing(s) in that area:\n` +
      matched.map((p) => `• ${p.title} — $${p.price}/mo`).join("\n")
    );
  }

  if (t.includes("price") || t.includes("cost") || t.includes("cheap"))
    return `Our listings range from $${Math.min(...props.map((p) => p.price))} to $${Math.max(...props.map((p) => p.price))}/mo. Ask about a specific city to narrow it down!`;

  if (t.includes("book") || t.includes("visit"))
    return "To book a visit, open any property page and click 'Book your visit'. You'll need to log in first.";

  if (t.includes("hi") || t.includes("hello") || t.includes("hey"))
    return "Hi! Ask me about properties, pricing, cities, or bedrooms — I'll help you find your dream home 🏠";

  const prop = props.find((p) => t.includes(p.title.toLowerCase()));
  if (prop)
    return `"${prop.title}" is in ${prop.city} at ${prop.address}. It has ${prop.facilities?.bedrooms} bed, ${prop.facilities?.bathrooms} bath, priced at $${prop.price}/mo.`;

  return "I can only answer questions about properties listed on this website. Try asking about a city, price range, or property name!";
};
// ─────────────────────────────────────────────────────────────────────────────

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your AI real estate assistant. Ask me about properties, pricing, cities, or bedrooms available on this site!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Build Cohere v1 chat_history (all turns except the last user message)
  const buildHistory = (currentMessages) =>
    currentMessages
      .filter((m) => m.sender !== "error")
      .map((m) => ({
        role: m.sender === "user" ? "USER" : "CHATBOT",
        message: m.text,
      }));

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue("");

    const updatedMessages = [...messages, { sender: "user", text: userText }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const history = buildHistory(messages); // exclude current message from history

      const res = await fetch(COHERE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${COHERE_API_KEY}`,
        },
        body: JSON.stringify({
          model: "command-r",
          message: userText,
          preamble: PREAMBLE(),
          chat_history: history,
          temperature: 0.3,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error("Cohere API error:", res.status, errBody);
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data?.text || localFallback(userText);
      setMessages([...updatedMessages, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error("Cohere fetch error:", err);
      // Graceful fallback — still gives a useful answer
      const fallback = localFallback(userText);
      setMessages([...updatedMessages, { sender: "bot", text: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat-container">
      {!isOpen && (
        <button className="chat-bubble-btn" onClick={() => setIsOpen(true)}>
          <BsFillChatSquareDotsFill className="chat-btn-icon" />
        </button>
      )}

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
