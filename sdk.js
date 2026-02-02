/**
 * AI Agent SDK v1.0.0
 * Умный ИИ помощник для вашего сайта
 * 
 * Подключение:
 * <script src="https://vriskasYT.github.io/agent/sdk.js"></script>
 * <script>
 *   AIAgent.init({ apiKey: 'ваш_ключ' });
 * </script>
 */

(function(window) {
    'use strict';

    // =====================================================
    // СТИЛИ ДЛЯ АГЕНТА
    // =====================================================
    const STYLES = `
        :root {
            --ai-primary: #6366f1;
            --ai-primary-dark: #4f46e5;
            --ai-accent: #22d3ee;
            --ai-bg: #1a1a2e;
            --ai-bg-card: #252542;
            --ai-text: #e2e8f0;
            --ai-text-muted: #94a3b8;
            --ai-border: #2d2d4a;
        }

        #ai-agent-container * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        #ai-agent-btn {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            border-radius: 18px;
            background: linear-gradient(135deg, var(--ai-primary), #8b5cf6);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px rgba(99, 102, 241, 0.5);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            z-index: 999999;
        }

        #ai-agent-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 40px rgba(99, 102, 241, 0.6);
        }

        #ai-agent-btn svg {
            width: 28px;
            height: 28px;
            fill: white;
        }

        #ai-agent-btn.hidden {
            transform: scale(0);
            opacity: 0;
            pointer-events: none;
        }

        #ai-chat-window {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 400px;
            max-width: calc(100vw - 48px);
            height: 520px;
            max-height: calc(100vh - 100px);
            background: var(--ai-bg);
            border-radius: 20px;
            border: 1px solid var(--ai-border);
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 999999;
            transform: scale(0) translateY(100px);
            opacity: 0;
            transform-origin: bottom right;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        #ai-chat-window.open {
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        .ai-chat-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem 1.25rem;
            background: linear-gradient(135deg, var(--ai-primary), #8b5cf6);
            color: white;
        }

        .ai-chat-header-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .ai-chat-avatar {
            width: 36px;
            height: 36px;
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .ai-chat-avatar svg {
            width: 20px;
            height: 20px;
            fill: white;
        }

        .ai-chat-title {
            font-weight: 700;
            font-size: 0.9375rem;
        }

        .ai-chat-status {
            font-size: 0.7rem;
            opacity: 0.8;
        }

        .ai-chat-close {
            background: rgba(255,255,255,0.2);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }

        .ai-chat-close:hover {
            background: rgba(255,255,255,0.3);
        }

        .ai-chat-close svg {
            width: 18px;
            height: 18px;
            stroke: white;
        }

        .ai-chat-messages {
            flex: 1;
            padding: 1.25rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 0.875rem;
            background: var(--ai-bg);
        }

        .ai-chat-message {
            max-width: 85%;
            padding: 0.875rem 1.125rem;
            border-radius: 16px;
            font-size: 0.875rem;
            line-height: 1.5;
            animation: aiMessageIn 0.3s ease;
        }

        @keyframes aiMessageIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .ai-chat-message.bot {
            background: rgba(99, 102, 241, 0.15);
            border: 1px solid rgba(99, 102, 241, 0.3);
            color: var(--ai-text);
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }

        .ai-chat-message.user {
            background: linear-gradient(135deg, var(--ai-primary), #8b5cf6);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }

        .ai-chat-message.thinking {
            display: flex;
            gap: 5px;
            padding: 1.125rem 1.25rem;
        }

        .ai-thinking-dot {
            width: 7px;
            height: 7px;
            background: var(--ai-primary);
            border-radius: 50%;
            animation: aiThinking 1.4s infinite;
        }

        .ai-thinking-dot:nth-child(2) { animation-delay: 0.2s; }
        .ai-thinking-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes aiThinking {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1.2); opacity: 1; }
        }

        .ai-chat-input-area {
            padding: 1rem 1.25rem 1.25rem;
            border-top: 1px solid var(--ai-border);
            display: flex;
            gap: 0.625rem;
            background: var(--ai-bg);
        }

        #ai-chat-input {
            flex: 1;
            padding: 0.875rem 1rem;
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--ai-border);
            border-radius: 12px;
            color: var(--ai-text);
            font-size: 0.875rem;
            resize: none;
            transition: all 0.3s;
        }

        #ai-chat-input:focus {
            outline: none;
            border-color: var(--ai-primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        #ai-chat-input::placeholder {
            color: var(--ai-text-muted);
        }

        #ai-chat-send {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, var(--ai-primary), #8b5cf6);
            border: none;
            border-radius: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }

        #ai-chat-send:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        #ai-chat-send:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        #ai-chat-send svg {
            width: 20px;
            height: 20px;
            fill: white;
        }

        /* AI Cursor */
        #ai-cursor {
            position: fixed;
            z-index: 9999999;
            pointer-events: none;
            display: none;
        }

        #ai-cursor.active {
            display: block;
        }

        .ai-cursor-pointer {
            width: 26px;
            height: 26px;
            position: relative;
        }

        .ai-cursor-pointer svg {
            width: 100%;
            height: 100%;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
        }

        .ai-cursor-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 46px;
            height: 46px;
            border: 2px solid var(--ai-primary);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: aiCursorPulse 1.5s ease-in-out infinite;
        }

        @keyframes aiCursorPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
            50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.3; }
        }

        .ai-cursor-tooltip {
            position: absolute;
            top: -46px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, var(--ai-primary), #8b5cf6);
            color: white;
            padding: 0.625rem 1rem;
            border-radius: 10px;
            font-size: 0.8125rem;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
        }

        .ai-cursor-tooltip::after {
            content: '';
            position: absolute;
            bottom: -7px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            border-top: 7px solid var(--ai-primary);
        }

        .ai-click-effect {
            position: fixed;
            width: 36px;
            height: 36px;
            border: 3px solid var(--ai-accent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999998;
            animation: aiClickRipple 0.6s ease-out forwards;
        }

        @keyframes aiClickRipple {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }

        .ai-highlight {
            position: fixed;
            border: 3px solid var(--ai-accent);
            border-radius: 8px;
            pointer-events: none;
            z-index: 9999997;
            animation: aiHighlightPulse 1s ease-in-out infinite;
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.5);
        }

        @keyframes aiHighlightPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .ai-chat-messages::-webkit-scrollbar {
            width: 6px;
        }

        .ai-chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .ai-chat-messages::-webkit-scrollbar-thumb {
            background: var(--ai-border);
            border-radius: 3px;
        }
    `;

    // =====================================================
    // HTML РАЗМЕТКА
    // =====================================================
    const HTML = `
        <div id="ai-agent-container">
            <button id="ai-agent-btn" aria-label="Открыть ИИ агента">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4-8c.79 0 1.5-.71 1.5-1.5S8.79 9 8 9s-1.5.71-1.5 1.5S7.21 12 8 12zm8 0c.79 0 1.5-.71 1.5-1.5S16.79 9 16 9s-1.5.71-1.5 1.5.71 1.5 1.5 1.5zm-4 4c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z"/>
                </svg>
            </button>

            <div id="ai-chat-window">
                <div class="ai-chat-header">
                    <div class="ai-chat-header-info">
                        <div class="ai-chat-avatar">
                            <svg viewBox="0 0 24 24"><path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/></svg>
                        </div>
                        <div>
                            <div class="ai-chat-title">AI Agent</div>
                            <div class="ai-chat-status">Claude • Онлайн</div>
                        </div>
                    </div>
                    <button class="ai-chat-close" id="ai-chat-close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="ai-chat-messages" id="ai-chat-messages"></div>
                <div class="ai-chat-input-area">
                    <textarea id="ai-chat-input" placeholder="Напиши что сделать..." rows="1"></textarea>
                    <button id="ai-chat-send">
                        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                </div>
            </div>

            <div id="ai-cursor">
                <div class="ai-cursor-tooltip" id="ai-cursor-tooltip">Выполняю...</div>
                <div class="ai-cursor-pointer">
                    <div class="ai-cursor-ring"></div>
                    <svg viewBox="0 0 24 24" fill="#6366f1">
                        <path d="M4 4l16 6.5-6.5 2-2 6.5z"/>
                    </svg>
                </div>
            </div>
        </div>
    `;

    // =====================================================
    // ОСНОВНОЙ КЛАСС AI AGENT
    // =====================================================
    class AIAgentSDK {
        constructor() {
            this.config = {
                // Зашифрованный API ключ (base64) - используется по умолчанию
                _defaultKey: 'c2tfTUlySm9Wbmdnc01lR3RWaGZBYm1ZRmxSdk9BSENsbHFj',
                apiKey: '',
                apiUrl: 'https://text.pollinations.ai/',
                model: 'claude',
                position: 'bottom-right',
                theme: 'dark',
                language: 'ru',
                greeting: '👋 Привет! Я ИИ агент. Скажи что нужно сделать, и я помогу!',
                cursorSpeed: 600,
                streamResponse: false,
                onReady: null,
                onAction: null,
                onError: null
            };

            this.state = {
                isOpen: false,
                isExecuting: false,
                messages: [],
                initialized: false
            };

            this.elements = {};
        }

        /**
         * Инициализация агента
         * @param {Object} options - Настройки
         */
        init(options = {}) {
            if (this.state.initialized) {
                console.warn('AI Agent уже инициализирован');
                return this;
            }

            // Merge config
            this.config = { ...this.config, ...options };

            // Используем зашифрованный ключ по умолчанию если не указан
            if (!this.config.apiKey && this.config._defaultKey) {
                this.config.apiKey = atob(this.config._defaultKey);
            }

            // Inject styles
            this.injectStyles();

            // Inject HTML
            this.injectHTML();

            // Cache elements
            this.cacheElements();

            // Bind events
            this.bindEvents();

            // Add greeting
            this.addMessage(this.config.greeting, 'bot');

            this.state.initialized = true;

            if (this.config.onReady) {
                this.config.onReady();
            }

            console.log('🤖 AI Agent SDK initialized');
            return this;
        }

        injectStyles() {
            const style = document.createElement('style');
            style.id = 'ai-agent-styles';
            style.textContent = STYLES;
            document.head.appendChild(style);
        }

        injectHTML() {
            const container = document.createElement('div');
            container.innerHTML = HTML;
            document.body.appendChild(container.firstElementChild);
        }

        cacheElements() {
            this.elements = {
                container: document.getElementById('ai-agent-container'),
                btn: document.getElementById('ai-agent-btn'),
                chatWindow: document.getElementById('ai-chat-window'),
                closeBtn: document.getElementById('ai-chat-close'),
                messages: document.getElementById('ai-chat-messages'),
                input: document.getElementById('ai-chat-input'),
                sendBtn: document.getElementById('ai-chat-send'),
                cursor: document.getElementById('ai-cursor'),
                cursorTooltip: document.getElementById('ai-cursor-tooltip')
            };
        }

        bindEvents() {
            this.elements.btn.addEventListener('click', () => this.toggle());
            this.elements.closeBtn.addEventListener('click', () => this.close());
            this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
            
            this.elements.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            this.elements.input.addEventListener('input', () => {
                this.elements.input.style.height = 'auto';
                this.elements.input.style.height = Math.min(this.elements.input.scrollHeight, 100) + 'px';
            });
        }

        /**
         * Открыть чат
         */
        open() {
            this.state.isOpen = true;
            this.elements.btn.classList.add('hidden');
            this.elements.chatWindow.classList.add('open');
            this.elements.input.focus();
            return this;
        }

        /**
         * Закрыть чат
         */
        close() {
            this.state.isOpen = false;
            this.elements.chatWindow.classList.remove('open');
            setTimeout(() => {
                this.elements.btn.classList.remove('hidden');
            }, 300);
            return this;
        }

        /**
         * Переключить состояние чата
         */
        toggle() {
            if (this.state.isOpen) {
                this.close();
            } else {
                this.open();
            }
            return this;
        }

        /**
         * Отправить сообщение программно
         * @param {string} message - Текст сообщения
         */
        send(message) {
            if (!message || this.state.isExecuting) return this;
            
            this.elements.input.value = message;
            this.sendMessage();
            return this;
        }

        /**
         * Добавить сообщение в чат
         */
        addMessage(text, type = 'bot') {
            const msg = document.createElement('div');
            msg.className = `ai-chat-message ${type}`;
            msg.textContent = text;
            this.elements.messages.appendChild(msg);
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
            this.state.messages.push({ text, type, timestamp: Date.now() });
            return msg;
        }

        addThinking() {
            const msg = document.createElement('div');
            msg.className = 'ai-chat-message bot thinking';
            msg.id = 'ai-thinking-msg';
            msg.innerHTML = '<div class="ai-thinking-dot"></div><div class="ai-thinking-dot"></div><div class="ai-thinking-dot"></div>';
            this.elements.messages.appendChild(msg);
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
        }

        removeThinking() {
            const el = document.getElementById('ai-thinking-msg');
            if (el) el.remove();
        }

        async sendMessage() {
            const text = this.elements.input.value.trim();
            if (!text || this.state.isExecuting) return;

            this.elements.input.value = '';
            this.elements.input.style.height = 'auto';
            this.addMessage(text, 'user');
            this.state.isExecuting = true;
            this.elements.sendBtn.disabled = true;

            this.addThinking();

            try {
                await this.processWithAI(text);
            } catch (error) {
                console.error('AI Agent Error:', error);
                this.removeThinking();
                this.addMessage('Произошла ошибка. Попробуй ещё раз!', 'bot');
                
                if (this.config.onError) {
                    this.config.onError(error);
                }
            }

            this.state.isExecuting = false;
            this.elements.sendBtn.disabled = false;
        }

        /**
         * Собрать ПОЛНЫЙ контекст страницы
         */
        getPageContext() {
            const elements = [];
            
            // Собираем ВСЕ интерактивные элементы
            const interactiveSelectors = [
                'button:not([disabled])',
                'a[href]',
                'input:not([type="hidden"])',
                'select',
                'textarea',
                '[role="button"]',
                '[onclick]',
                '[contenteditable="true"]',
                'details',
                'summary',
                '[tabindex]:not([tabindex="-1"])',
                'audio',
                'video',
                'iframe',
                'embed',
                'object',
                '.clickable',
                '[data-action]',
                '[data-click]'
            ];

            let elementIndex = 0;
            document.querySelectorAll(interactiveSelectors.join(',')).forEach((el) => {
                // Пропускаем элементы агента
                if (el.closest('#ai-agent-container')) return;

                const rect = el.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) return;

                const tagName = el.tagName.toLowerCase();
                const id = el.id ? `#${el.id}` : '';
                const classesArr = el.className && typeof el.className === 'string' 
                    ? el.className.split(' ').filter(c => c && !c.includes(':')) 
                    : [];
                const classes = classesArr.length ? `.${classesArr.join('.')}` : '';
                const text = (el.textContent || el.value || el.placeholder || el.alt || el.title || el.ariaLabel || '').trim().slice(0, 100);
                const inputType = el.type || '';
                
                // Собираем дополнительные атрибуты
                const attrs = {
                    name: el.name || null,
                    value: el.value || null,
                    checked: el.checked || null,
                    disabled: el.disabled || null,
                    required: el.required || null,
                    placeholder: el.placeholder || null,
                    href: el.href || null,
                    src: el.src || null
                };

                // Определяем уникальный селектор
                let selector = '';
                if (id) {
                    selector = id;
                } else if (el.name && tagName === 'input') {
                    selector = `${tagName}[name="${el.name}"]`;
                } else if (classes && document.querySelectorAll(classes).length === 1) {
                    selector = classes;
                } else {
                    selector = `[data-ai-idx="${elementIndex}"]`;
                    el.setAttribute('data-ai-idx', elementIndex);
                }
                
                elementIndex++;

                elements.push({
                    tag: tagName,
                    type: inputType || tagName,
                    text: text,
                    selector: selector,
                    visible: rect.top >= 0 && rect.top < window.innerHeight,
                    position: { x: Math.round(rect.left), y: Math.round(rect.top) },
                    size: { w: Math.round(rect.width), h: Math.round(rect.height) },
                    attrs: Object.fromEntries(Object.entries(attrs).filter(([k, v]) => v !== null))
                });
            });

            // Добавляем информацию о формах
            const forms = [];
            document.querySelectorAll('form').forEach((form, idx) => {
                if (form.closest('#ai-agent-container')) return;
                forms.push({
                    id: form.id || null,
                    name: form.name || null,
                    action: form.action || null,
                    method: form.method || 'get',
                    fieldsCount: form.elements.length,
                    selector: form.id ? `#${form.id}` : `form:nth-of-type(${idx + 1})`
                });
            });

            // Получаем текущий скролл и размеры
            const pageInfo = {
                url: window.location.href,
                title: document.title,
                scrollY: window.scrollY,
                scrollX: window.scrollX,
                viewportHeight: window.innerHeight,
                viewportWidth: window.innerWidth,
                pageHeight: document.documentElement.scrollHeight,
                pageWidth: document.documentElement.scrollWidth
            };

            return {
                page: pageInfo,
                elements: elements.slice(0, 80),
                forms: forms,
                totalElements: elements.length
            };
        }

        async processWithAI(userMessage) {
            const context = this.getPageContext();
            
            const systemPrompt = `Ты — ИИ агент. Ты ВЫПОЛНЯЕШЬ действия на странице!

ЭЛЕМЕНТЫ НА СТРАНИЦЕ:
${JSON.stringify(context.elements.slice(0, 30), null, 2)}

ВАЖНО! ОТВЕЧАЙ ТОЛЬКО JSON БЕЗ MARKDOWN:
{"message": "текст для пользователя", "actions": [...]}

ТИПЫ ДЕЙСТВИЙ:
- click: нажать кнопку/ссылку
- input: ввести текст (value = текст)
- select: выбрать опцию (value = текст)
- check: отметить checkbox/radio
- clear: очистить поле

ПРАВИЛА:
1. ВСЕГДА отвечай ТОЛЬКО JSON
2. Используй ТОЧНЫЕ селекторы из списка элементов
3. Для разговора — actions пустой []
4. message — краткий и дружелюбный
5. НЕ пиши ничего кроме JSON!`;

            // Используем бесплатный API endpoint
            const prompt = encodeURIComponent(systemPrompt + '\n\nЗапрос пользователя: ' + userMessage);
            const response = await fetch(`https://text.pollinations.ai/${prompt}?model=openai&json=true`);
            const fullResponse = await response.text();

            this.removeThinking();

            try {
                // Clean response
                let cleanResponse = fullResponse.trim();
                if (cleanResponse.startsWith('```json')) cleanResponse = cleanResponse.slice(7);
                if (cleanResponse.startsWith('```')) cleanResponse = cleanResponse.slice(3);
                if (cleanResponse.endsWith('```')) cleanResponse = cleanResponse.slice(0, -3);
                cleanResponse = cleanResponse.trim();

                const aiResponse = JSON.parse(cleanResponse);
                this.addMessage(aiResponse.message, 'bot');

                if (aiResponse.actions && aiResponse.actions.length > 0) {
                    setTimeout(() => {
                        this.elements.chatWindow.classList.remove('open');
                        this.executeActions(aiResponse.actions);
                    }, 800);
                }
            } catch (e) {
                console.error('Parse error:', e, fullResponse);
                this.addMessage(fullResponse || 'Не удалось распознать ответ.', 'bot');
            }
        }

        async executeActions(actions) {
            this.elements.cursor.classList.add('active');

            for (const action of actions) {
                await this.executeAction(action);
                await this.sleep(400);
            }

            this.elements.cursor.classList.remove('active');

            setTimeout(() => {
                this.elements.btn.classList.remove('hidden');
                this.addMessage('✅ Готово! Нужно что-то ещё?', 'bot');
            }, 300);
        }

        async executeAction(action) {
            const element = document.querySelector(action.selector);
            if (!element) {
                console.warn('Element not found:', action.selector);
                return;
            }

            if (action.tooltip) {
                this.elements.cursorTooltip.textContent = action.tooltip;
            }

            await this.moveCursorTo(element);
            this.highlightElement(element);
            await this.sleep(300);

            if (this.config.onAction) {
                this.config.onAction(action);
            }

            switch (action.type) {
                case 'click':
                    this.createClickEffect(element);
                    await this.sleep(200);
                    element.click();
                    break;

                case 'doubleClick':
                    this.createClickEffect(element);
                    await this.sleep(100);
                    this.createClickEffect(element);
                    element.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
                    break;

                case 'rightClick':
                    this.createClickEffect(element);
                    element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
                    break;

                case 'input':
                case 'type':
                    await this.handleInput(element, action.value || '');
                    break;

                case 'clear':
                    element.focus();
                    element.value = '';
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    break;

                case 'select':
                    await this.handleSelect(element, action.value || '');
                    break;

                case 'check':
                case 'uncheck':
                case 'toggle':
                    await this.handleCheckbox(element, action.type);
                    break;

                case 'focus':
                    element.focus();
                    element.dispatchEvent(new FocusEvent('focus'));
                    break;

                case 'blur':
                    element.blur();
                    element.dispatchEvent(new FocusEvent('blur'));
                    break;

                case 'hover':
                    element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
                    element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                    await this.sleep(action.duration || 1000);
                    element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
                    break;

                case 'scroll':
                    await this.handleScroll(element, action.direction || 'down');
                    break;

                case 'scrollTo':
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    await this.sleep(500);
                    break;

                case 'drag':
                    await this.handleDrag(element, action.targetSelector);
                    break;

                case 'pressKey':
                    await this.simulateKeyPress(element, action.key, action.modifiers);
                    break;

                case 'copy':
                    const textToCopy = element.value || element.textContent;
                    if (textToCopy) await navigator.clipboard.writeText(textToCopy);
                    break;

                case 'paste':
                    if (action.value) {
                        element.focus();
                        document.execCommand('insertText', false, action.value);
                    }
                    break;

                case 'wait':
                    await this.sleep(action.duration || 1000);
                    break;

                case 'highlight':
                    await this.sleep(1500);
                    break;

                case 'submit':
                    // Submit form
                    if (element.tagName === 'FORM') {
                        element.submit();
                    } else {
                        const form = element.closest('form');
                        if (form) form.submit();
                    }
                    break;

                case 'reset':
                    // Reset form
                    if (element.tagName === 'FORM') {
                        element.reset();
                    } else {
                        const form = element.closest('form');
                        if (form) form.reset();
                    }
                    break;

                case 'setAttribute':
                    // Set any attribute
                    if (action.attr && action.value !== undefined) {
                        element.setAttribute(action.attr, action.value);
                    }
                    break;

                case 'removeAttribute':
                    // Remove attribute
                    if (action.attr) {
                        element.removeAttribute(action.attr);
                    }
                    break;

                case 'addClass':
                    // Add CSS class
                    if (action.value) {
                        element.classList.add(...action.value.split(' '));
                    }
                    break;

                case 'removeClass':
                    // Remove CSS class
                    if (action.value) {
                        element.classList.remove(...action.value.split(' '));
                    }
                    break;

                case 'toggleClass':
                    // Toggle CSS class
                    if (action.value) {
                        element.classList.toggle(action.value);
                    }
                    break;

                case 'setStyle':
                    // Set inline style
                    if (action.property && action.value !== undefined) {
                        element.style[action.property] = action.value;
                    }
                    break;

                case 'playMedia':
                    // Play audio/video
                    if (element.play) await element.play();
                    break;

                case 'pauseMedia':
                    // Pause audio/video
                    if (element.pause) element.pause();
                    break;

                case 'setMediaTime':
                    // Set media currentTime
                    if (element.currentTime !== undefined && action.value !== undefined) {
                        element.currentTime = parseFloat(action.value);
                    }
                    break;

                case 'setMediaVolume':
                    // Set media volume (0-1)
                    if (element.volume !== undefined && action.value !== undefined) {
                        element.volume = Math.max(0, Math.min(1, parseFloat(action.value)));
                    }
                    break;

                case 'muteMedia':
                    if (element.muted !== undefined) element.muted = true;
                    break;

                case 'unmuteMedia':
                    if (element.muted !== undefined) element.muted = false;
                    break;

                case 'fullscreen':
                    // Enter fullscreen
                    if (element.requestFullscreen) {
                        await element.requestFullscreen();
                    }
                    break;

                case 'exitFullscreen':
                    if (document.exitFullscreen) {
                        await document.exitFullscreen();
                    }
                    break;

                case 'editContent':
                    // Edit contenteditable element
                    if (element.contentEditable === 'true' || element.isContentEditable) {
                        element.focus();
                        element.innerHTML = action.value || '';
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    break;

                case 'appendText':
                    // Append text to input or contenteditable
                    if (element.value !== undefined) {
                        element.value += action.value || '';
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (element.isContentEditable) {
                        element.innerHTML += action.value || '';
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    break;

                case 'selectText':
                    // Select text in input
                    if (element.select) {
                        element.focus();
                        element.select();
                    }
                    break;

                case 'selectRange':
                    // Select range of text
                    if (element.setSelectionRange && action.start !== undefined && action.end !== undefined) {
                        element.focus();
                        element.setSelectionRange(action.start, action.end);
                    }
                    break;

                case 'screenshot':
                    // Take screenshot using html2canvas (if available)
                    if (window.html2canvas) {
                        const canvas = await window.html2canvas(element);
                        const link = document.createElement('a');
                        link.download = 'screenshot.png';
                        link.href = canvas.toDataURL();
                        link.click();
                    }
                    break;

                case 'print':
                    window.print();
                    break;

                case 'navigateBack':
                    window.history.back();
                    break;

                case 'navigateForward':
                    window.history.forward();
                    break;

                case 'navigateTo':
                    if (action.value) {
                        window.location.href = action.value;
                    }
                    break;

                case 'reload':
                    window.location.reload();
                    break;

                case 'openTab':
                    if (action.value) {
                        window.open(action.value, '_blank');
                    }
                    break;

                case 'dispatchEvent':
                    // Dispatch custom event
                    if (action.eventName) {
                        const customEvent = new CustomEvent(action.eventName, {
                            bubbles: true,
                            detail: action.eventData || {}
                        });
                        element.dispatchEvent(customEvent);
                    }
                    break;

                default:
                    console.warn('Unknown action type:', action.type);
            }

            await this.sleep(300);
            this.removeHighlights();
        }

        async handleInput(element, value) {
            element.focus();
            element.dispatchEvent(new FocusEvent('focus'));
            
            if (element.value) {
                const len = element.value.length;
                for (let i = 0; i < len; i++) {
                    element.value = element.value.slice(0, -1);
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    await this.sleep(20);
                }
            }
            
            await this.typeText(element, value);
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }

        async handleSelect(element, value) {
            element.focus();
            this.createClickEffect(element);
            await this.sleep(200);
            
            const options = Array.from(element.querySelectorAll('option'));
            const valueLower = value.toLowerCase();
            
            let bestMatch = options.find(opt => 
                opt.textContent.toLowerCase() === valueLower ||
                opt.value.toLowerCase() === valueLower
            ) || options.find(opt => 
                opt.textContent.toLowerCase().includes(valueLower) ||
                opt.value.toLowerCase().includes(valueLower)
            );
            
            if (bestMatch) {
                element.value = bestMatch.value;
                element.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        async handleCheckbox(element, actionType) {
            this.createClickEffect(element);
            await this.sleep(200);
            
            if (actionType === 'check') element.checked = true;
            else if (actionType === 'uncheck') element.checked = false;
            else element.checked = !element.checked;
            
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }

        async handleScroll(element, direction) {
            const scrollAmount = 300;
            const opts = { behavior: 'smooth' };
            
            switch (direction) {
                case 'up': element.scrollBy({ top: -scrollAmount, ...opts }); break;
                case 'down': element.scrollBy({ top: scrollAmount, ...opts }); break;
                case 'left': element.scrollBy({ left: -scrollAmount, ...opts }); break;
                case 'right': element.scrollBy({ left: scrollAmount, ...opts }); break;
                case 'top': element.scrollTo({ top: 0, ...opts }); break;
                case 'bottom': element.scrollTo({ top: element.scrollHeight, ...opts }); break;
            }
            await this.sleep(500);
        }

        async handleDrag(element, targetSelector) {
            if (!targetSelector) return;
            const target = document.querySelector(targetSelector);
            if (!target) return;
            
            element.dispatchEvent(new DragEvent('dragstart', { bubbles: true }));
            await this.moveCursorTo(target);
            target.dispatchEvent(new DragEvent('drop', { bubbles: true }));
            element.dispatchEvent(new DragEvent('dragend', { bubbles: true }));
        }

        async simulateKeyPress(element, key, modifiers = {}) {
            const eventProps = {
                key, code: key, bubbles: true, cancelable: true,
                ctrlKey: modifiers.ctrl || false,
                shiftKey: modifiers.shift || false,
                altKey: modifiers.alt || false,
                metaKey: modifiers.meta || false
            };
            
            element.dispatchEvent(new KeyboardEvent('keydown', eventProps));
            element.dispatchEvent(new KeyboardEvent('keypress', eventProps));
            element.dispatchEvent(new KeyboardEvent('keyup', eventProps));
        }

        async moveCursorTo(element) {
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            this.elements.cursor.style.transition = `all ${this.config.cursorSpeed}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            this.elements.cursor.style.left = x + 'px';
            this.elements.cursor.style.top = y + 'px';

            await this.sleep(this.config.cursorSpeed);
        }

        async typeText(element, text) {
            for (const char of text) {
                element.value += char;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                await this.sleep(40 + Math.random() * 40);
            }
        }

        highlightElement(element) {
            const rect = element.getBoundingClientRect();
            const highlight = document.createElement('div');
            highlight.className = 'ai-highlight';
            highlight.style.left = (rect.left - 4) + 'px';
            highlight.style.top = (rect.top - 4) + 'px';
            highlight.style.width = (rect.width + 8) + 'px';
            highlight.style.height = (rect.height + 8) + 'px';
            document.body.appendChild(highlight);
        }

        removeHighlights() {
            document.querySelectorAll('.ai-highlight').forEach(el => el.remove());
        }

        createClickEffect(element) {
            const rect = element.getBoundingClientRect();
            const effect = document.createElement('div');
            effect.className = 'ai-click-effect';
            effect.style.left = (rect.left + rect.width / 2) + 'px';
            effect.style.top = (rect.top + rect.height / 2) + 'px';
            document.body.appendChild(effect);
            setTimeout(() => effect.remove(), 600);
        }

        /**
         * Выполнить действие напрямую
         */
        execute(action) {
            return this.executeAction(action);
        }

        /**
         * Получить состояние агента
         */
        getState() {
            return { ...this.state };
        }

        /**
         * Уничтожить агента
         */
        destroy() {
            if (this.elements.container) {
                this.elements.container.remove();
            }
            const style = document.getElementById('ai-agent-styles');
            if (style) style.remove();
            this.state.initialized = false;
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // =====================================================
    // ЭКСПОРТ
    // =====================================================
    const instance = new AIAgentSDK();

    window.AIAgent = {
        init: (options) => instance.init(options),
        open: () => instance.open(),
        close: () => instance.close(),
        toggle: () => instance.toggle(),
        send: (message) => instance.send(message),
        execute: (action) => instance.execute(action),
        getState: () => instance.getState(),
        destroy: () => instance.destroy()
    };

    // AMD/CommonJS support
    if (typeof define === 'function' && define.amd) {
        define('AIAgent', [], function() { return window.AIAgent; });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = window.AIAgent;
    }

})(window);
