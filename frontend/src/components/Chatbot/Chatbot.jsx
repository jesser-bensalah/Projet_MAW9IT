import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import { useState } from "react";
import ChatMessage from "./ChatMessage";

const Chatbot = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [showChatbot, setShowChatbot] = useState(false);

    const generateBotResponse = async (history) => {
        const updateHistory = (text) => {
            setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: "model", text}]);
        };

        try {
            const apiKey = "AIzaSyDPn0F_3DKb52aUW807K4sQivnRCvGgRnM";
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: history[history.length - 1].text }]
                    }]
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            updateHistory(apiResponseText);
        } catch (error) {
            console.log(error);
            updateHistory("Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer.");
        }
    };
    
    return(
        <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
        <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
            <span className="material-symbols-rounded">mode_comment</span>
            <span className="material-symbols-rounded">close</span>
        </button>
            <div className="chatbot-popup">
                {/* Header */}
                <div className="chat-header">
                    <div className="header-info">
                        <ChatbotIcon />
                        <h2 className="logo-text">Chatbot</h2>
                        <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
keyboard_arrow_down
</button>
                    </div>
                </div>

                {/* Body */}
                <div className="chat-body">
                    <div className="message bot-message">
                        <ChatbotIcon />
                        <p className="message-text">
                            Bonjour <br /> Comment je vous aide aujourd'hui?
                        </p>
                    </div>

                    {}
                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}
                    
                </div>
                {/* Footer */}
                <div className="chat-footer">
                    <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
                </div>
            </div>
        </div>
    );
};

export default Chatbot;