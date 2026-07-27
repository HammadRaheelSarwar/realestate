import React, { useState, useEffect, useRef } from "react";
import { BsFillChatDotsFill } from "react-icons/icons"; // Wait, BsFillChatDotsFill is in react-icons/bs!
// Let's use react-icons/bs instead
import { BsFillChatSquareDotsFill } from "react-icons/bs";
import { AiOutlineClose, AiOutlineSend } from "react-icons/ai";
import { initialProperties } from "../../utils/propertiesData";
import "./AIChatAssistant.css";

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your AI assistant. How can I help you find your dream home today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = { sender: "user", text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    setTimeout(() => {
      const response = generateAIResponse(inputValue);
      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
    }, 1000);
  };

  const generateAIResponse = (input) => {
    const text = input.toLowerCase();

    // Check for cities
    const cities = ["chicago", "multan", "karachi", "san diego", "phoenix", "tampa", "denver", "tokyo", "delhi", "los angeles", "new york", "lahore", "mumbai"];
    const matchedCity = cities.find((city) => text.includes(city));

    if (matchedCity) {
      const cityProps = initialProperties.filter(
        (p) => p.city.toLowerCase().trim() === matchedCity
      );
      if (cityProps.length > 0) {
        return `I found ${cityProps.length} properties in ${matchedCity.toUpperCase()}:\n` +
          cityProps.map((p) => `- ${p.title} ($${p.price})`).join("\n") +
          "\n\nLet me know if you want to know more about any of these!";
      } else {
        return `Currently, we don't have any listings in ${matchedCity.toUpperCase()}. Would you like to check out another city?`;
      }
    }

    if (text.includes("price") || text.includes("cost") || text.includes("how much")) {
      return "Property prices range from $2,000 to $10,000. You can type the name of a city (e.g. 'New York') or a property title to see specific pricing.";
    }

    if (text.includes("hello") || text.includes("hi ") || text.includes("hey")) {
      return "Hi there! Feel free to ask about our properties, cities, pricing, or how to book a visit!";
    }

    if (text.includes("book") || text.includes("visit")) {
      return "To book a visit, select a property and click the 'Book your visit' button on the property details page. You will need to log in to complete the booking.";
    }

    // Direct property search
    const matchedProperty = initialProperties.find((p) =>
      text.includes(p.title.toLowerCase())
    );
    if (matchedProperty) {
      return `"${matchedProperty.title}" is located at ${matchedProperty.address}, ${matchedProperty.city}. It features ${matchedProperty.facilities.bedrooms} bedrooms and ${matchedProperty.facilities.bathrooms} bathrooms, priced at $${matchedProperty.price}/month. Would you like to know more?`;
    }

    return "I'm not sure I understand that. You can ask me about properties in a specific city (e.g. 'properties in New York'), pricing details, or how to book a visit!";
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
            <h3>AI Real Estate Assistant</h3>
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
            <div ref={chatEndRef} />
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Ask about properties, cities..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="send-btn" onClick={handleSend}>
              <AiOutlineSend />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatAssistant;
