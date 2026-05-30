(function() {
  // 1. Setup & Configuration
  const scriptTag = document.currentScript || document.querySelector('script[data-chatbot-id]');
  const chatbotId = scriptTag ? scriptTag.getAttribute('data-chatbot-id') : null;
  
  if (!chatbotId) {
    console.error("[PaperChat Widget] data-chatbot-id is missing. Widget disabled.");
    return;
  }

  // State
  let isPanelOpen = false;
  let hasProactiveTriggered = false;
  let hasExitIntentTriggered = false;
  let leadQualificationStep = 0; // 0 = idle, 1 = budget, 2 = company, 3 = use case, 4 = complete
  let leadData = { name: "", email: "", phone: "", budget: "", company: "", useCase: "" };
  let messages = [];
  const sessionId = 'session_' + Math.random().toString(36).substring(2, 12);

  // Styles Injection
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    #paperchat-widget-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #paperchat-launcher {
      width: 56px;
      height: 56px;
      border-radius: 28px;
      background: linear-gradient(180deg, #7c5eff 0%, #6c47ff 100%);
      box-shadow: 0 4px 12px rgba(108, 71, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      border: 1px solid #5b3ce0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    }
    #paperchat-launcher:hover {
      transform: scale(1.05);
    }
    #paperchat-launcher svg {
      width: 24px;
      height: 24px;
      fill: white;
    }
    #paperchat-panel {
      position: absolute;
      bottom: 72px;
      right: 0;
      width: 360px;
      height: 500px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      border: 1px solid #e4e4e7;
      display: none;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    #paperchat-header {
      background: linear-gradient(180deg, #7c5eff 0%, #6c47ff 100%);
      padding: 14px 16px;
      color: white;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #5b3ce0;
    }
    #paperchat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #f8fafc;
    }
    .paperchat-msg {
      max-width: 80%;
      padding: 8px 12px;
      font-size: 13px;
      line-height: 1.4;
      border-radius: 12px;
    }
    .paperchat-msg.user {
      background: #6c47ff;
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 2px;
    }
    .paperchat-msg.assistant {
      background: white;
      color: #1f2937;
      align-self: flex-start;
      border-bottom-left-radius: 2px;
      border: 1px solid #e5e7eb;
    }
    #paperchat-input-area {
      padding: 12px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
      background: white;
    }
    #paperchat-input {
      flex: 1;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 13px;
      outline: none;
    }
    #paperchat-input:focus {
      border-color: #6c47ff;
    }
    #paperchat-send {
      background: #6c47ff;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    #paperchat-handover-btn {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 4px 8px;
      font-size: 11px;
      cursor: pointer;
      text-align: center;
      margin-top: 4px;
      font-weight: 500;
    }
    #paperchat-handover-btn:hover {
      background: #e5e7eb;
    }
  `;
  document.head.appendChild(styleTag);

  // 2. Render Widget HTML Structure
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'paperchat-widget-container';
  
  widgetContainer.innerHTML = `
    <div id="paperchat-panel">
      <div id="paperchat-header">
        <span>AI Assistant</span>
        <button style="background:transparent; border:none; color:white; cursor:pointer; font-size:16px;" id="paperchat-close">×</button>
      </div>
      <div id="paperchat-messages"></div>
      <div id="paperchat-input-area">
        <input type="text" id="paperchat-input" placeholder="Type a message..." />
        <button id="paperchat-send">Send</button>
      </div>
    </div>
    <div id="paperchat-launcher">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
    </div>
  `;
  document.body.appendChild(widgetContainer);

  const launcher = document.getElementById('paperchat-launcher');
  const panel = document.getElementById('paperchat-panel');
  const closeBtn = document.getElementById('paperchat-close');
  const sendBtn = document.getElementById('paperchat-send');
  const inputEl = document.getElementById('paperchat-input');
  const messagesContainer = document.getElementById('paperchat-messages');

  // Helper: Append Message to panel
  function appendMessage(role, text) {
    const msgEl = document.createElement('div');
    msgEl.className = `paperchat-msg ${role}`;
    msgEl.textContent = text;
    messagesContainer.appendChild(msgEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    messages.push({ role, content: text });
  }

  // Helper: API Send Call
  async function apiSendChat(userMsg, options = {}) {
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          sessionId: sessionId,
          history: messages.slice(-10),
          ...options
        })
      });
      const data = await res.json();
      return data.reply;
    } catch (err) {
      console.error("[PaperChat Widget] Chat API failed:", err);
      return "Sorry, I am having trouble connecting to the server.";
    }
  }

  // Handle Send logic
  async function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";
    
    appendMessage("user", text);

    // Conversational Lead Qualification Wizard logic (Module 2 Feature C)
    if (leadQualificationStep > 0) {
      processLeadQualification(text);
      return;
    }

    const reply = await apiSendChat(text);
    appendMessage("assistant", reply);

    // Suggest Handover button if not in lead qual
    if (messages.length > 2 && !document.getElementById('paperchat-handover-btn')) {
      const handoverBtn = document.createElement('button');
      handoverBtn.id = 'paperchat-handover-btn';
      handoverBtn.textContent = '⚡ Request Human Agent';
      handoverBtn.onclick = startLeadQualification;
      messagesContainer.appendChild(handoverBtn);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // Pre-Chat Lead Qualification Wizard (Module 2 Feature C)
  function startLeadQualification() {
    // Remove the human agent button once clicked
    const oldBtn = document.getElementById('paperchat-handover-btn');
    if (oldBtn) oldBtn.remove();

    leadQualificationStep = 1;
    appendMessage("assistant", "Sure, I can connect you to a human agent. First, please tell me: What is your estimated monthly budget for customer support tools?");
  }

  async function processLeadQualification(text) {
    if (leadQualificationStep === 1) {
      leadData.budget = text;
      leadQualificationStep = 2;
      appendMessage("assistant", "Thanks. Second: What is your company name?");
    } else if (leadQualificationStep === 2) {
      leadData.company = text;
      leadQualificationStep = 3;
      appendMessage("assistant", "Got it. Finally: What is your main use case or goal with PaperChat?");
    } else if (leadQualificationStep === 3) {
      leadData.useCase = text;
      leadQualificationStep = 4;
      appendMessage("assistant", "Thank you. Let me register your details and notify our agents...");
      
      // Auto fill mock details for lead registration
      leadData.name = "Prospect via Pre-Chat Qual";
      leadData.email = "prospect@example.com";
      leadData.phone = "1-800-DEMO";

      // Sync lead qualification data directly to API
      await apiSendChat("Finished pre-chat qualification", { leadData });
      
      appendMessage("assistant", "✅ Done! You are now queued to speak with a human agent. An representative will follow up via email shortly.");
      leadQualificationStep = 0; // reset
    }
  }

  // 3. Proactive Triggers

  // A. Time-on-Page Trigger (Module 2 Feature A)
  // Triggers after 30 seconds (or 5 seconds if query parameter ?demo=true is detected)
  const urlParams = new URLSearchParams(window.location.search);
  const timeThreshold = urlParams.get('demo') === 'true' ? 5000 : 30000;
  
  setTimeout(() => {
    if (!isPanelOpen && !hasProactiveTriggered) {
      hasProactiveTriggered = true;
      openWidget();
      appendMessage("assistant", "👋 Hi there! I noticed you've been reviewing our platform for a bit. Do you need help finding standard integrations, or pricing details?");
    }
  }, timeThreshold);

  // B. Exit Intent Trigger (Module 2 Feature B)
  // Triggers if mouse leaves viewport (cursor goes to address/tabs bar)
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 15 && !hasExitIntentTriggered) {
      hasExitIntentTriggered = true;
      openWidget();
      appendMessage("assistant", "🎁 Wait before you go! Get a 10% discount on your first subscription with code 'EXTRA10'. Do you have any questions before starting?");
    }
  });

  // Toggle handlers
  function openWidget() {
    isPanelOpen = true;
    panel.style.display = 'flex';
    if (messages.length === 0) {
      appendMessage("assistant", "Hi there! I am your AI Support teammate. How can I help you take actions or schedule info today?");
    }
  }

  function closeWidget() {
    isPanelOpen = false;
    panel.style.display = 'none';
  }

  launcher.addEventListener('click', () => {
    if (isPanelOpen) closeWidget();
    else openWidget();
  });

  closeBtn.addEventListener('click', closeWidget);
  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
})();
