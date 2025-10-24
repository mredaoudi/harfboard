let changes = [];
let lastChange = 0;

const TYPING_THRESHOLD = 1000;
const textbox = document.getElementById('textbox');
const keyboard = document.getElementById('keyboard');
const transliterateButton = document.getElementById('transliterate-button');
const transliterateContent = document.getElementById('transliterate-content');
const textboxTransliterate = document.getElementById('textbox-transliterate');
const transliterateSpinner = document.getElementById('transliterate-spinner');
const deepseekAPIKeyInput = document.getElementById('deepseek-api-key');

textbox.style.height = textbox.scrollHeight + "px";
textbox.style.overflowY = "hidden";

const arabKeys = {
    "a": "ا",
    "à": "آ",
    "b": "ب",
    "p": "پ",
    "t": "ت",
    "c": "ث",
    "j": "ج",
    "X": "چ",
    "H": "ح",
    "R": "خ",
    "d": "د",
    "C": "ذ",
    "r": "ر",
    "z": "ز",
    "J": "ژ",
    "s": "س",
    "x": "ش",
    "S": "ص",
    "D": "ض",
    "T": "ط",
    "Z": "ظ",
    "g": "ع",
    "Q": "غ",
    "f": "ف",
    "q": "ق",
    "k": "ک",
    "K": "ك",
    "G": "گ",
    "l": "ل",
    "m": "م",
    "n": "ن",
    "h": "ه",
    "w": "و",
    "i": "ي",
    "e": "ة",
    "y": "ي",
    "Y": "ى",
    "A": "أ",
    "o": "و",
    "O": "ؤ",
    "E": "إ",
    "I": "ئ",
    "u": "ء",
    ",": "،",
    "?": "؟",
    "=": "\u200C"
};

for (const [key, value] of Object.entries(arabKeys)) {
    const keyCont = document.createElement('div');
    const kbdAlpha = document.createElement('span');
    const kbdArab = document.createElement('button');

    kbdAlpha.textContent = key;
    kbdAlpha.classList.add("text-xs", "font-semibold", "text-slate-500");
    kbdArab.textContent = value;
    kbdArab.style.fontFamily = 'Scheherazade New';
    kbdArab.classList.add("py-2", "w-16", "font-semibold", "text-slate-800", "bg-white", "border", "border-slate-300", "rounded-md", "shadow-xs");
    keyCont.classList.add('flex', 'flex-col', 'items-center', 'gap-1');
    keyCont.appendChild(kbdAlpha);
    keyCont.appendChild(kbdArab);
    keyboard.appendChild(keyCont);
};

textbox.addEventListener('beforeinput', function (event) {
    const letter = event.data;

    if (letter && arabKeys[letter]) {
        event.preventDefault();

        const start = textbox.selectionStart;
        const end = textbox.selectionEnd;
        const arabLetter = arabKeys[letter];
        const newValue = textbox.value.slice(0, start) + arabLetter + textbox.value.slice(end);

        textbox.value = newValue;
        textbox.setSelectionRange(start + arabLetter.length, start + arabLetter.length);
    }
    updateTransliterateButtonState();
});

textbox.addEventListener('input', function (event) {
    textbox.style.height = "auto";
    textbox.style.height = textbox.scrollHeight + "px";

    const currentValue = event.target.value;
    const currentTime = Date.now();
    if (isValidString(currentValue)) {
        changes[changes.length - (currentTime - lastChange <= TYPING_THRESHOLD)] = currentValue;
        lastChange = currentTime;
    }
    updateTransliterateButtonState();
});

textbox.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        changes.pop();
        textbox.value = changes.at(-1) || '';
    }
    updateTransliterateButtonState();
});

transliterateButton.addEventListener('click', async function () {
    if (textbox.value !== '' && deepseekAPIKeyInput.value !== '') {
        transliterateContent.classList.remove('hidden');
        textboxTransliterate.textContent = '';
        transliterateSpinner.classList.remove('invisible');
        try {
            const response = await askDeepSeekToTransliterate(textbox.value, deepseekAPIKeyInput.value);
            textboxTransliterate.textContent = response;
        } catch (error) {
            textboxTransliterate.textContent = 'Error occurred during transliteration';
            transliterateContent.classList.add('text-red-500');
        } finally {
            transliterateSpinner.classList.add('invisible');
        }
    }
});

deepseekAPIKeyInput.addEventListener('input', function () {
    updateTransliterateButtonState();
});

function updateTransliterateButtonState() {
    transliterateButton.disabled = !(textbox.value !== '' && deepseekAPIKeyInput.value !== '');
}

function isValidString(str) {
    return typeof str?.trim === 'function' && str.trim() !== '';
}

async function askDeepSeekToTransliterate(text, apiKey) {
    const prompt = `
        Please transliterate the following Arabic text into English using standard academic romanization.
        Include diacritics (ā, ḥ, ū, etc.) and follow proper formatting rules.
        Only provide the transliteration, no additional explanation. Capitalize the first letter of the sentence. Don't put the transliteration in quotes.
        Do not include any Arabic script in the response.
        
        Arabic Text: "${text}"
        
        Transliteration:`;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "You are a transliteration assistant."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            stream: false,
            max_tokens: 1000
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

updateTransliterateButtonState();