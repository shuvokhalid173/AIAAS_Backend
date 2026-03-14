(function () {
    // --- CONFIGURATION ---
    const CONFIG = {
        apiEndpoint: "http://localhost:4444/api/chat", // Change this to your local server URL
        botName: "AI Assistant",
        primaryColor: "#4F46E5", // Indigo color
        textColor: "#ffffff",
    };

    // --- STYLES ---
    const style = document.createElement('style');
    style.innerHTML = `
        .ai-widget-container * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        /* Floating Button */
        .ai-widget-trigger {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background-color: ${CONFIG.primaryColor};
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: transform 0.2s;
        }
        .ai-widget-trigger:hover {
            transform: scale(1.05);
        }
        .ai-widget-icon {
            width: 30px;
            height: 30px;
            fill: ${CONFIG.textColor};
        }

        /* Chat Window */
        .ai-chat-window {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            z-index: 9999;
            opacity: 0;
            transform: translateY(20px);
            pointer-events: none;
            transition: all 0.3s ease;
            overflow: hidden;
        }
        .ai-chat-window.open {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
        }

        /* Header */
        .ai-chat-header {
            background-color: ${CONFIG.primaryColor};
            color: ${CONFIG.textColor};
            padding: 15px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ai-close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
        }

        /* Messages Area */
        .ai-chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background-color: #f9fafb;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .message {
            max-width: 80%;
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 14px;
            line-height: 1.4;
        }
        .message.user {
            align-self: flex-end;
            background-color: ${CONFIG.primaryColor};
            color: white;
            border-bottom-right-radius: 2px;
        }
        .message.bot {
            align-self: flex-start;
            background-color: #e5e7eb;
            color: #1f2937;
            border-bottom-left-radius: 2px;
        }
        .typing-indicator {
            font-size: 12px;
            color: #6b7280;
            margin-left: 10px;
            display: none;
        }

        /* Input Area */
        .ai-chat-input-area {
            padding: 15px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 10px;
            background: white;
        }
        .ai-chat-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            outline: none;
        }
        .ai-chat-input:focus {
            border-color: ${CONFIG.primaryColor};
        }
        .ai-send-btn {
            background-color: ${CONFIG.primaryColor};
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
        }
        .ai-send-btn:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

    // --- HTML STRUCTURE ---
    const container = document.createElement('div');
    container.className = 'ai-widget-container';
    
    container.innerHTML = `
        <div class="ai-widget-trigger" id="ai-trigger">
            <svg class="ai-widget-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
        </div>

        <div class="ai-chat-window" id="ai-window">
            <div class="ai-chat-header">
                <span>${CONFIG.botName}</span>
                <button class="ai-close-btn" id="ai-close">&times;</button>
            </div>
            <div class="ai-chat-messages" id="ai-messages">
                <div class="message bot">Hello! How can I help you today?</div>
            </div>
            <div class="typing-indicator" id="ai-typing">AI is typing...</div>
            <div class="ai-chat-input-area">
                <input type="text" class="ai-chat-input" id="ai-input" placeholder="Type a message...">
                <button class="ai-send-btn" id="ai-send">Send</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // --- LOGIC ---
    const triggerBtn = document.getElementById('ai-trigger');
    const chatWindow = document.getElementById('ai-window');
    const closeBtn = document.getElementById('ai-close');
    const sendBtn = document.getElementById('ai-send');
    const inputField = document.getElementById('ai-input');
    const messagesContainer = document.getElementById('ai-messages');
    const typingIndicator = document.getElementById('ai-typing');

    // Toggle Window
    triggerBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) inputField.focus();
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    // Add Message to DOM
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.textContent = text;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Handle Sending
    async function handleSend() {
        const text = inputField.value.trim();
        if (!text) return;

        // 1. Add user message
        addMessage(text, 'user');
        inputField.value = '';
        inputField.disabled = true;
        sendBtn.disabled = true;
        typingIndicator.style.display = 'block';

        try {
            // 2. Send to Backend
            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }) 
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            
            // 3. Add AI response (assumes server returns { reply: "..." })
            addMessage(data.reply || "I received your message, but the server response format was unexpected.", 'bot');

        } catch (error) {
            console.error('Chat Error:', error);
            addMessage("Sorry, I couldn't reach the server.", 'bot');
        } finally {
            typingIndicator.style.display = 'none';
            inputField.disabled = false;
            sendBtn.disabled = false;
            inputField.focus();
        }
    }

    // Event Listeners for Send
    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

})();