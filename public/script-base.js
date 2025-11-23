// script.js

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// --- Fungsionalitas Chat ---
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (message) {
        appendMessage(message, 'user');
        userInput.value = ''; // Kosongkan input
        
        // Simulasikan balasan Bot setelah jeda
        setTimeout(() => {
            const botResponse = generateBotResponse(message);
            appendMessage(botResponse, 'bot');
        }, 1000); 
    }
});

/**
 * Menambahkan pesan baru ke chat box.
 * @param {string} text - Konten pesan.
 * @param {string} sender - 'user' atau 'bot'.
 */
function appendMessage(text, sender) {
    // Menggunakan template literal dan kelas Tailwind
    let messageHTML = '';

    if (sender === 'bot') {
        messageHTML = `
            <div class="message-wrapper bot-wrapper flex mb-4 items-start relative group">
                <div class="bot-icon w-8 h-8 flex items-center justify-center bg-primary-cyan rounded-full p-1 mr-3 flex-shrink-0">
                    <svg class="text-bg-dark w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14.4 12V6a2.4 2.4 0 0 0-4.8 0v6M12 2v2M8 2h8"/>
                        <path d="M11 22a2 2 0 0 0 2 0"/>
                        <path d="M14 12a7 7 0 0 0-4 0v4.73c.12.72.74 1.27 1.48 1.27h1.04c.74 0 1.36-.55 1.48-1.27V12z"/>
                    </svg>
                </div>
                <div class="message-bubble bot-bubble bg-bot-bubble p-3 rounded-xl rounded-tl-none max-w-[75%]">
                    ${text}
                </div>
                <button class="copy-button absolute bottom-[-8px] right-0 bg-transparent border-none text-gray-500 cursor-pointer p-1 text-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100" onclick="copyMessage(this)">
                    <i class="fas fa-copy"></i>
                </button>
                <span class="copied-message absolute bottom-[-20px] right-8 text-xs text-green-500 opacity-0 transition-opacity duration-500">Tersalin!</span>
            </div>
        `;
    } else { // sender === 'user'
        messageHTML = `
            <div class="message-wrapper user-wrapper flex mb-4 justify-end">
                <div class="message-bubble user-bubble bg-user-bubble p-3 rounded-xl rounded-tr-none max-w-[75%] text-bg-dark ml-auto">
                    ${text}
                </div>
            </div>
        `;
    }
    
    chatBox.insertAdjacentHTML('beforeend', messageHTML);
    
    // Scroll ke pesan terbaru
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Simulasi Balasan Bot sederhana
function generateBotResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes('halo') || lowerCaseMessage.includes('hai')) {
        return 'Halo juga! Anda menggunakan Tailwind CSS! Interface Anda terlihat jauh lebih modern.';
    } else if (lowerCaseMessage.includes('tailwind') || lowerCaseMessage.includes('css')) {
        return 'Tailwind menggunakan utility-first approach, yang membuat styling lebih cepat dan terorganisir langsung di HTML.';
    } else if (lowerCaseMessage.includes('salin')) {
        return 'Fitur salin bekerja dengan baik. Cukup arahkan kursor ke pesan Bot, dan klik ikon copy yang muncul.';
    } else {
        return 'Terima kasih atas pesan Anda. Kami selalu siap membantu dengan pengembangan UI Anda!';
    }
}

// --- Fungsionalitas Salin Pesan (Copy Message) ---
function copyMessage(button) {
    // Dapatkan elemen bubble pesan 
    const wrapper = button.parentElement;
    const bubble = wrapper.querySelector('.message-bubble');
    const messageText = bubble.innerText;

    const copiedIndicator = wrapper.querySelector('.copied-message');

    // Gunakan API Clipboard
    navigator.clipboard.writeText(messageText).then(() => {
        // Tampilkan notifikasi
        copiedIndicator.style.opacity = 1;
        setTimeout(() => {
            copiedIndicator.style.opacity = 0;
        }, 1500);

    }).catch(err => {
        console.error('Gagal menyalin teks: ', err);
        alert('Gagal menyalin pesan.');
    });
}