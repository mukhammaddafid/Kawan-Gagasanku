document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Constants and DOM Elements
    const chatBox = document.getElementById('chat-box');
    const form = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    // Koreksi Minor: Lebih aman menggunakan getElementById jika ID unik tersedia
    const submitButton = form.querySelector('button[type="submit"]'); 

    /**
 * Copies the text content of an element to the clipboard.
 */
function copyTextToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied successfully!');
            // Opsi: Tampilkan notifikasi kecil di UI
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    } else {
        // Fallback untuk browser lama
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

    const API_ENDPOINT = '/api/chat';

    /**
     * Helper function to convert simple Markdown (like **bold**, *italic*, and new lines) to HTML.
     * @param {string} markdownText - Text containing simple markdown.
     * @returns {string} HTML string.
     */
    function renderMarkdown(markdownText) {
        if (!markdownText) return '';
        let html = markdownText
            // Replace newlines with <br>
            .replace(/\n/g, '<br>')
            // **Bold** to <strong> (Diperbaiki untuk menghindari konflik dengan *Italics*)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // *Italics* to <em>
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
        return html;
    }


    // 2. DOM Helper Function: Adds a message to the chat box
    /**
     * Creates and adds a chat message element.
     * @param {string} role - 'user' or 'bot'.
     * @param {string} text - The message content.
     * @param {boolean} isTemporary - If true, adds a class for easy identification/replacement.
     * @returns {HTMLElement} The created message wrapper element.
     */
    function addMessage(role, text, isTemporary = false) {
        const messageWrapper = document.createElement('div');
        // Use Tailwind-like classes for basic styling hooks
        messageWrapper.className = `message-wrapper ${role}-wrapper`;

        const messageBubble = document.createElement('div');
        messageBubble.className = `message-bubble ${role}-bubble`;

        // Add Bot Icon (Flask/Potion) for futuristic aesthetic
if (role === 'bot') {
    // ... Icon code remains the same ...
    
    messageWrapper.appendChild(iconElement);
    messageWrapper.appendChild(messageBubble); // Bubble ditambahkan dulu

    // Tambahkan Tombol Salin (Copy Button) setelah bubble
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = '📋'; // Ikon clipboard
    copyButton.title = 'Copy response';

    copyButton.addEventListener('click', () => {
        // Ambil text content asli (tanpa HTML)
        const plainText = text.replace(/\*\*/g, '').replace(/\*/g, ''); 
        copyTextToClipboard(plainText);
        copyButton.innerHTML = '✅'; // Ubah ikon menjadi ceklis
        setTimeout(() => {
            copyButton.innerHTML = '📋';
        }, 1500);
    });

    // Jangan tampilkan tombol salin untuk pesan 'Thinking...'
    if (!isTemporary) {
        messageWrapper.appendChild(copyButton);
    }
}

        if (role === 'bot') {
            // RENDER MARKDOWN FOR BOT MESSAGES
            messageBubble.innerHTML = renderMarkdown(text);
        } else {
            messageBubble.textContent = text;
        }

        if (isTemporary) {
            // Use a unique ID for easy retrieval of the "Thinking..." message
            messageWrapper.id = 'temporary-bot-message';
            messageWrapper.classList.add('temporary-message');
        }

        // Add Bot Icon (Flask/Potion) for futuristic aesthetic
        if (role === 'bot') {
            const iconElement = document.createElement('div');
            iconElement.className = 'bot-icon';
            // SVG Icon for a futuristic 'bottle'/'flask' (representing AI intelligence/potion)
            iconElement.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flask-icon">
                    <path d="M14.4 12V6a2.4 2.4 0 0 0-4.8 0v6M12 2v2M8 2h8"/>
                    <path d="M11 22a2 2 0 0 0 2 0"/>
                    <path d="M14 12a7 7 0 0 0-4 0v4.73c.12.72.74 1.27 1.48 1.27h1.04c.74 0 1.36-.55 1.48-1.27V12z"/>
                </svg>
            `;
            // Icon before the message bubble
            messageWrapper.appendChild(iconElement);
        }

        messageWrapper.appendChild(messageBubble);
        chatBox.appendChild(messageWrapper);

        // Scroll to the bottom to show the newest message
        chatBox.scrollTop = chatBox.scrollHeight;

        return messageWrapper;
    }

    // 3. Main Chat Handler Function
async function handleChat(event) {
    event.preventDefault();

    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // 3a. Add user's message
    addMessage('user', userMessage);

    // 3b. Show temporary "Thinking..." message and get its reference
    const thinkingMessageElement = addMessage('bot', 'Thinking...', true);

    // Clear the input and disable the form
    userInput.value = '';
    submitButton.disabled = true;

    try {
        // --- MODIFIKASI DIMULAI DI SINI ---
        
        // Simulasikan penundaan jaringan (1500 ms)
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        // Tentukan respons dummy berdasarkan pesan pengguna (opsional)
        let aiResponse;
        if (userMessage.toLowerCase().includes('css')) {
            aiResponse = `**CSS** (Cascading Style Sheets) adalah bahasa yang digunakan untuk mendeskripsikan presentasi dokumen yang ditulis dalam bahasa markup seperti HTML.

* **Properti Utama:** Warna, font, layout.
* **Fungsi:** Memisahkan konten (HTML) dari desain visual.

Gaya futuristik Anda menggunakan properti seperti:
1.  \`box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);\`
2.  \`stroke: #00FF8C;\` (Neon Green Icon)`;
        } else if (userMessage.toLowerCase().includes('error')) {
            // Simulasikan respons error yang formatnya masih 200 OK tapi isinya kosong
            aiResponse = null; 
        } else {
            aiResponse = `Halo! Pesan Anda: **"${userMessage}"** telah diterima. 

Saya adalah AI yang dirancang dengan antarmuka *futuristik* nan elegan. 

Bagaimana cara saya membantu Anda *lebih lanjut*?`;
        }
        
        // Simulasi data yang diterima (sesuai format {result: "..."})
        const data = { result: aiResponse };

        // 3e. Extract AI response and update message
        if (data && data.result) {
            const botBubble = thinkingMessageElement.querySelector('.message-bubble');

            if (botBubble) {
                botBubble.innerHTML = renderMarkdown(data.result);
                thinkingMessageElement.removeAttribute('id');
                thinkingMessageElement.classList.remove('temporary-message');
            }
        } else {
            // Simulasi error jika respons server valid tapi datanya kosong
            throw new Error('Sorry, no content was generated by the AI.');
        }

        // --- MODIFIKASI SELESAI DI SINI ---

    } catch (error) {
        console.error('Chat error:', error);

        // 3f. Show an appropriate error message
        let errorMessage = `[ERROR] Failed to get response: ${error.message}`;

        const botBubble = thinkingMessageElement.querySelector('.message-bubble');
        if (botBubble) {
            // Hapus marker sementara dan tampilkan pesan error
            thinkingMessageElement.removeAttribute('id');
            thinkingMessageElement.classList.remove('temporary-message');

            botBubble.textContent = errorMessage;
            botBubble.style.cssText = 'background-color: #991b1b; color: #fee2e2;'; // Gaya error
        }
    } finally {
        // 3g. Re-enable input and ensure scroll is at the bottom
        submitButton.disabled = false;
        userInput.focus();
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

    // 4. Attach Event Listener
    form.addEventListener('submit', handleChat);



});