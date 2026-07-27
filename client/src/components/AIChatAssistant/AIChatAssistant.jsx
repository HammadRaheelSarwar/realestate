import React, { useState, useEffect, useRef } from "react";
import { BsFillChatSquareDotsFill } from "react-icons/bs";
import { AiOutlineClose, AiOutlineSend } from "react-icons/ai";
import { initialProperties } from "../../utils/propertiesData";
import "./AIChatAssistant.css";

const COHERE_API_KEY = "AQ.Ab8RN6JxGyct4x2PVImrXQvTboUCKF3iJpISVmfnKHMZXj6siA";
const COHERE_API_URL = "https://api.cohere.ai/v1/chat";

const getProps = () =>
  JSON.parse(localStorage.getItem("properties0") || "null") || initialProperties;

const buildPreamble = () => {
  const props = getProps();
  const list = props
    .map(
      (p) =>
        `- "${p.title}" | City: ${p.city} | Price: $${p.price}/mo | Beds: ${p.facilities?.bedrooms ?? "?"} | Baths: ${p.facilities?.bathrooms ?? "?"} | Parking: ${p.facilities?.parkings ?? "?"}`
    )
    .join("\n");
  return `You are a helpful AI real estate assistant for Homyz. ONLY answer using the property data below.
Do not make up properties. If something is not in the data, say so. Be concise and friendly.

PROPERTY LISTINGS:
${list}`;
};

// ── Smart local engine (runs when API is unavailable) ────────────────────────
const smartLocalResponse = (text) => {
  const t = text.toLowerCase().replace(/,/g, "");
  const props = getProps();

  // Extract any number from the query
  const numMatch = t.match(/\$?\s*(\d{3,6})/);
  const queryNum = numMatch ? parseInt(numMatch[1]) : null;

  // "under / below / less than X"
  if (queryNum && (t.includes("under") || t.includes("below") || t.includes("less than") || t.includes("max") || t.includes("budget"))) {
    const found = props.filter((p) => p.price <= queryNum);
    if (found.length)
      return `Here are ${found.length} propert${found.length > 1 ? "ies" : "y"} under $${queryNum}/mo:\n` +
        found.map((p) => `• ${p.title} — ${p.city} — $${p.price}/mo`).join("\n");
    return `No properties found under $${queryNum}/mo. Our cheapest listing is $${Math.min(...props.map((p) => p.price))}/mo.`;
  }

  // "above / more than / minimum X"
  if (queryNum && (t.includes("above") || t.includes("more than") || t.includes("over") || t.includes("min"))) {
    const found = props.filter((p) => p.price >= queryNum);
    if (found.length)
      return `Here are ${found.length} propert${found.length > 1 ? "ies" : "y"} above $${queryNum}/mo:\n` +
        found.map((p) => `• ${p.title} — ${p.city} — $${p.price}/mo`).join("\n");
    return `No properties found above $${queryNum}/mo. Our most expensive listing is $${Math.max(...props.map((p) => p.price))}/mo.`;
  }

  // "around / about / near X price"
  if (queryNum && (t.includes("around") || t.includes("about") || t.includes("near") || t.includes("close to"))) {
    const margin = queryNum * 0.25;
    const found = props.filter((p) => Math.abs(p.price - queryNum) <= margin);
    if (found.length)
      return `Properties around $${queryNum}/mo:\n` +
        found.map((p) => `• ${p.title} — ${p.city} — $${p.price}/mo`).join("\n");
    return `No properties found around $${queryNum}/mo. Try asking for "under $${queryNum}" for more results.`;
  }

  // Bare number — treat as price search
  if (queryNum) {
    const margin = queryNum * 0.3;
    const exact = props.filter((p) => p.price === queryNum);
    if (exact.length)
      return `I found ${exact.length} propert${exact.length > 1 ? "ies" : "y"} at exactly $${queryNum}/mo:\n` +
        exact.map((p) => `• ${p.title} — ${p.city}`).join("\n");
    const close = props.filter((p) => Math.abs(p.price - queryNum) <= margin);
    if (close.length)
      return `No exact match for $${queryNum}, but here are closest listings:\n` +
        close.map((p) => `• ${p.title} — ${p.city} — $${p.price}/mo`).join("\n");
    return `No properties found near $${queryNum}/mo.\nPrice range on site: $${Math.min(...props.map((p) => p.price))} – $${Math.max(...props.map((p) => p.price))}/mo.`;
  }

  // Bedroom search
  const bedMatch = t.match(/(\d)\s*(?:bed|bedroom|br)/);
  if (bedMatch) {
    const beds = parseInt(bedMatch[1]);
    const found = props.filter((p) => p.facilities?.bedrooms === beds);
    if (found.length)
      return `${found.length} propert${found.length > 1 ? "ies" : "y"} with ${beds} bedroom(s):\n` +
        found.map((p) => `• ${p.title} — ${p.city} — $${p.price}/mo`).join("\n");
    return `No properties found with exactly ${beds} bedrooms. Available: ${[...new Set(props.map((p) => p.facilities?.bedrooms).filter(Boolean))].sort().join(", ")} bedrooms.`;
  }

  // City search
  const cities = [...new Set(props.map((p) => p.city.toLowerCase()))];
  const matchedCity = cities.find((c) => t.includes(c));
  if (matchedCity) {
    const found = props.filter((p) => p.city.toLowerCase() === matchedCity);
    return `${found.length} listing(s) in ${found[0].city}:\n` +
      found.map((p) => `• ${p.title} — $${p.price}/mo — ${p.facilities?.bedrooms} bed, ${p.facilities?.bathrooms} bath`).join("\n");
  }

  // Property name search
  const matchedProp = props.find((p) => t.includes(p.title.toLowerCase()));
  if (matchedProp)
    return `"${matchedProp.title}" is located in ${matchedProp.city} at ${matchedProp.address}.\n💰 Price: $${matchedProp.price}/mo\n🛏 Beds: ${matchedProp.facilities?.bedrooms} | 🚿 Baths: ${matchedProp.facilities?.bathrooms} | 🚗 Parking: ${matchedProp.facilities?.parkings}`;

  // Show all / list
  if (t.includes("all") || t.includes("list") || t.includes("show") || t.includes("available")) {
    return `We have ${props.length} properties listed:\n` +
      props.map((p) => `• ${p.title} — ${p.city} — $${p.price}/mo`).join("\n");
  }

  // Price range query
  if (t.includes("price") || t.includes("cost") || t.includes("how much") || t.includes("cheap") || t.includes("expensive")) {
    const min = Math.min(...props.map((p) => p.price));
    const max = Math.max(...props.map((p) => p.price));
    return `💰 Price range on this site: $${min} – $${max}/mo.\n\nYou can ask:\n• "Properties under $3000"\n• "Properties in New York"\n• "2 bedroom properties"\n• Property name for details`;
  }

  // Booking
  if (t.includes("book") || t.includes("visit") || t.includes("schedule") || t.includes("appointment"))
    return "To book a visit:\n1. Click on any property\n2. Click 'Book your visit'\n3. Choose a date\n4. Log in to confirm";

  // Greetings
  if (t.includes("hello") || t.includes("hi") || t.includes("hey") || t.includes("good"))
    return `Hello! 👋 I can help you find properties on Homyz.\n\nTry asking:\n• "Properties under $5000"\n• "3 bedroom properties"\n• "Properties in Chicago"\n• "Show all listings"`;

  // Fallback
  return `I can help you search our ${props.length} property listings! Try asking:\n\n• "Properties under $4000"\n• "2 bedroom apartments"\n• "Properties in [city name]"\n• "Show all properties"`;
};
// ─────────────────────────────────────────────────────────────────────────────

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your real estate assistant for Homyz.\n\nAsk me about:\n• Properties under a budget (e.g. 'under $5000')\n• City listings (e.g. 'in New York')\n• Bedrooms (e.g. '3 bedroom')\n• Any property by name!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const buildHistory = (msgs) =>
    msgs
      .filter((m) => m.sender !== "error")
      .map((m) => ({ role: m.sender === "user" ? "USER" : "CHATBOT", message: m.text }));

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userText = inputValue.trim();
    setInputValue("");
    const updatedMessages = [...messages, { sender: "user", text: userText }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch(COHERE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${COHERE_API_KEY}`,
        },
        body: JSON.stringify({
          model: "command-r",
          message: userText,
          preamble: buildPreamble(),
          chat_history: buildHistory(messages),
          temperature: 0.3,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data?.text || smartLocalResponse(userText);
      setMessages([...updatedMessages, { sender: "bot", text: reply }]);
    } catch {
      // API unavailable — use smart local engine silently
      setMessages([...updatedMessages, { sender: "bot", text: smartLocalResponse(userText) }]);
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
            {messages.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.sender}`}>
                <div className="message-text" style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
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
              placeholder="e.g. properties under $4000"
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
