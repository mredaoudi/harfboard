let changes = [];
let lastChange = 0;

const TYPING_THRESHOLD = 1000;
const textbox = document.getElementById('textbox');
const keyboard = document.getElementById('keyboard');

textbox.style.height = textbox.scrollHeight + "px";
textbox.style.overflowY = "hidden";

const arabKeys = {
    "a": "ا",
    "b": "ب",
    "p": "پ",
    "t": "ت",
    "c": "ث",
    "j": "ج",
    "H": "ح",
    "R": "خ",
    "d": "د",
    "C": "ذ",
    "r": "ر",
    "z": "ز",
    "s": "س",
    "x": "ش",
    "S": "ص",
    "D": "ض",
    "T": "ط",
    "Z": "ظ",
    "g": "ع",
    "G": "غ",
    "f": "ف",
    "q": "ق",
    "k": "ك",
    "K": "گ",
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
};

for (const [key, value] of Object.entries(arabKeys)) {
    const keyCont = document.createElement('div');
    const kbdAlpha = document.createElement('span');
    const kbdArab = document.createElement('button');

    kbdAlpha.textContent = key;
    kbdAlpha.classList.add("text-xs", "font-semibold", "text-gray-400");
    kbdArab.textContent = value;
    kbdArab.style.fontFamily = 'Scheherazade New';
    kbdArab.classList.add("py-2", "w-16", "font-semibold", "text-gray-900", "bg-white", "border", "border-gray-300", "rounded-md", "shadow-xs");
    keyCont.classList.add('flex', 'flex-col', 'items-center', 'gap-1');
    keyCont.appendChild(kbdAlpha);
    keyCont.appendChild(kbdArab);
    keyboard.appendChild(keyCont);
};

textbox.addEventListener('beforeinput', function(event) {
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
});

textbox.addEventListener('input', function(event) {
    textbox.style.height = "auto";
    textbox.style.height = textbox.scrollHeight + "px";

    const currentValue = event.target.value;
    const currentTime = Date.now();
    if (isValidString(currentValue)) {
        changes[changes.length - (currentTime - lastChange <= TYPING_THRESHOLD)] = currentValue;
        lastChange = currentTime;
    }
});

textbox.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        changes.pop();
        textbox.value = changes.at(-1) || '';
    }
});

function isValidString(str) {
    return typeof str?.trim === 'function' && str.trim() !== '';
}