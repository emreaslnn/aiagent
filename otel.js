// Aslan Otel Chat Widget - AI Agent Uyumlu
class AslanOtelChatWidget {
    constructor(options = {}) {
        this.webhookUrl = options.webhookUrl || 'https://wasakem.app.n8n.cloud/webhook/3976077b-e02a-43bd-b679-34a469ba36b6/chat';
        this.position = options.position || 'left'; // left veya right
        this.isOpen = false;
        this.isTyping = false;
        this.sessionId = this.generateSessionId(); // Memory için session ID
        
        this.createWidget();
        this.initializeEvents();
        this.addWelcomeMessage();
    }
    
    generateSessionId() {
        return 'aslan-chat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    
    createWidget() {
        // CSS stilleri ekle
        this.injectStyles();
        
        // Widget HTML'i oluştur
        const widgetHTML = `
            <div class="aslan-chat-widget aslan-chat-${this.position}">
                <button class="aslan-chat-button" id="aslanChatButton">
                    💬
                </button>
                
                <div class="aslan-chat-container" id="aslanChatContainer">
                
                    
                    <div class="aslan-chat-messages" id="aslanChatMessages">
                        <div class="aslan-welcome-message">
                            <p>Merhaba! Size nasıl yardımcı olabilirim?</p>
                        </div>
                    </div>
                    
                    <div class="aslan-typing-indicator" id="aslanTypingIndicator">
                        <span>Yazıyor</span>
                        <div class="aslan-typing-dots">
                            <div class="aslan-typing-dot"></div>
                            <div class="aslan-typing-dot"></div>
                            <div class="aslan-typing-dot"></div>
                        </div>
                    </div>
                    
                    <div class="aslan-chat-input-container">
                        <input type="text" class="aslan-chat-input" id="aslanChatInput" placeholder="Mesajınızı yazın..." maxlength="500">
                        <button class="aslan-send-button" id="aslanSendButton">➤</button>
                    </div>
                </div>
            </div>
        `;
        
        // Widget'ı sayfaya ekle
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
        
        // Element referanslarını al
        this.chatButton = document.getElementById('aslanChatButton');
        this.chatContainer = document.getElementById('aslanChatContainer');
        this.chatMessages = document.getElementById('aslanChatMessages');
        this.chatInput = document.getElementById('aslanChatInput');
        this.sendButton = document.getElementById('aslanSendButton');
        this.typingIndicator = document.getElementById('aslanTypingIndicator');
    }
    
    injectStyles() {
        const styles = `
            <style>
                .aslan-chat-widget {
                    position: fixed;
                    bottom: 20px;
                    z-index: 10000;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                .aslan-chat-left {
                    left: 20px;
                }
                
                .aslan-chat-right {
                    right: 20px;
                }
                
                .aslan-chat-button {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    color: white;
                    font-size: 24px;
                    outline: none;
                }
                
                .aslan-chat-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
                }
                
                .aslan-chat-button.active {
                    background: #ff4757;
                }
                
                .aslan-chat-container {
                    position: absolute;
                    bottom: 80px;
                    width: 350px;
                    height: 500px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    animation: aslanChatSlideIn 0.3s ease;
                }
                
                .aslan-chat-left .aslan-chat-container {
                    left: 0;
                }
                
                .aslan-chat-right .aslan-chat-container {
                    right: 0;
                }
                
                .aslan-chat-container.active {
                    display: flex;
                }
                
                @keyframes aslanChatSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                .aslan-chat-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    text-align: center;
                }
                
                .aslan-chat-header h3 {
                    margin: 0;
                    font-size: 1.2em;
                }
                
                .aslan-chat-header p {
                    margin: 5px 0 0 0;
                    font-size: 0.9em;
                    opacity: 0.9;
                }
                
                .aslan-chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: #f8f9fa;
                }
                
                .aslan-message {
                    margin-bottom: 15px;
                    display: flex;
                    align-items: flex-start;
                }
                
                .aslan-message.user {
                    justify-content: flex-end;
                }
                
                .aslan-message.bot {
                    justify-content: flex-start;
                }
                
                .aslan-message-bubble {
                    max-width: 80%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.4;
                    word-wrap: break-word;
                }
                
                .aslan-message.user .aslan-message-bubble {
                    background: #667eea;
                    color: white;
                    border-bottom-right-radius: 4px;
                }
                
                .aslan-message.bot .aslan-message-bubble {
                    background: white;
                    color: #333;
                    border: 1px solid #e0e0e0;
                    border-bottom-left-radius: 4px;
                }
                
                .aslan-chat-input-container {
                    padding: 20px;
                    background: white;
                    border-top: 1px solid #e0e0e0;
                    display: flex;
                    gap: 10px;
                }
                
                .aslan-chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 25px;
                    outline: none;
                    font-size: 14px;
                    transition: border-color 0.3s ease;
                }
                
                .aslan-chat-input:focus {
                    border-color: #667eea;
                }
                
                .aslan-send-button {
                    width: 44px;
                    height: 44px;
                    background: #667eea;
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s ease;
                    outline: none;
                }
                
                .aslan-send-button:hover {
                    background: #5a6fd8;
                }
                
                .aslan-send-button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                
                .aslan-typing-indicator {
                    display: none;
                    align-items: center;
                    gap: 5px;
                    color: #666;
                    font-size: 12px;
                    margin-left: 20px;
                    margin-bottom: 10px;
                }
                
                .aslan-typing-dots {
                    display: flex;
                    gap: 2px;
                }
                
                .aslan-typing-dot {
                    width: 4px;
                    height: 4px;
                    background: #666;
                    border-radius: 50%;
                    animation: aslanTypingBounce 1.4s infinite ease-in-out;
                }
                
                .aslan-typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .aslan-typing-dot:nth-child(2) { animation-delay: -0.16s; }
                
                @keyframes aslanTypingBounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
                
                .aslan-welcome-message {
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                    margin-top: 20px;
                }
                
                @media (max-width: 768px) {
                    .aslan-chat-container {
                        width: 320px;
                        height: 450px;
                    }
                    
                    .aslan-chat-widget {
                        bottom: 15px;
                    }
                    
                    .aslan-chat-left {
                        left: 15px;
                    }
                    
                    .aslan-chat-right {
                        right: 15px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    initializeEvents() {
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Dışarı tıklanınca chat'i kapat
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.aslan-chat-widget') && this.isOpen) {
                this.closeChat();
            }
        });
    }
    
    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }
    
    openChat() {
        this.isOpen = true;
        this.chatContainer.classList.add('active');
        this.chatButton.classList.add('active');
        this.chatButton.innerHTML = '✕';
        this.chatInput.focus();
    }
    
    closeChat() {
        this.isOpen = false;
        this.chatContainer.classList.remove('active');
        this.chatButton.classList.remove('active');
        this.chatButton.innerHTML = '💬';
    }
    
    addWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('Merhaba! 🦁 Aslan Otel\'e hoş geldiniz!', 'bot');
            setTimeout(() => {
                this.addMessage('Size nasıl yardımcı olabilirim? Rezervasyon yapmak, hesaplama yapmak veya otel hizmetleri hakkında bilgi almak için benimle konuşabilirsiniz.', 'bot');
            }, 1000);
        }, 500);
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;
        
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.sendButton.disabled = true;
        
        this.showTyping();
        
        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatInput: message,
                    sessionId: this.sessionId
                })
            });
            
            if (response.ok) {
                const responseData = await response.json();
                this.hideTyping();
                
                // AI Agent response formatını kontrol et
                const botResponse = responseData.output || responseData.response || responseData.text || 'Üzgünüm, yanıt alınamadı.';
                this.addMessage(botResponse, 'bot');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Chat hatası:', error);
            this.hideTyping();
            this.addMessage('Üzgünüm, şu anda bir teknik sorun yaşıyoruz. Lütfen daha sonra tekrar deneyin. 🔧', 'bot');
        }
        
        this.sendButton.disabled = false;
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `aslan-message ${sender}`;
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'aslan-message-bubble';
        bubbleDiv.textContent = text;
        
        messageDiv.appendChild(bubbleDiv);
        this.chatMessages.appendChild(messageDiv);
        
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    showTyping() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'flex';
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    hideTyping() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
    }
    
    // Widget'ı kaldır
    destroy() {
        const widget = document.querySelector('.aslan-chat-widget');
        if (widget) {
            widget.remove();
        }
    }
}

// Global fonksiyon olarak dışa aktar
window.AslanOtelChatWidget = AslanOtelChatWidget;