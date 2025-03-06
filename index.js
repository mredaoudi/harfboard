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
    "t": "ت",
    "c": "ث",
    "j": "ج",
    "H": "ح",
    "x": "خ",
    "d": "د",
    "C": "ذ",
    "r": "ر",
    "z": "ز",
    "s": "س",
    "X": "ش",
    "S": "ص",
    "D": "ض",
    "T": "ط",
    "Z": "ظ",
    "g": "ع",
    "R": "غ",
    "f": "ف",
    "q": "ق",
    "k": "ك",
    "l": "ل",
    "m": "م",
    "n": "ن",
    "h": "ه",
    "w": "و",
    "i": "ي",
    "y": "ى",
    "p": "ة",
    "A": "أ",
    "o": "ؤ",
    "e": "إ",
    "I": "ئ",
    "u": "ء",
    ",": "،",
    "?": "؟",
};

for (const [key, value] of Object.entries(arabKeys)) {
    const keyCont = document.createElement('div');
    
    const kbdAlpha = document.createElement('span');
    kbdAlpha.textContent = key;
    kbdAlpha.classList.add("text-xs", "font-semibold", "text-gray-400");

    const kbdArab = document.createElement('button');
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
        if (currentTime - lastChange > TYPING_THRESHOLD) {
            changes.push(currentValue);
        } else {
            changes[changes.length - 1] = currentValue;
        }
        lastChange = currentTime;
    }
    undoButton.disabled = changes.length == 0;    
});

textbox.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        changes.pop();
        if (changes.length > 0) {
            textbox.value = changes.at(-1);
        }
        else {
            textbox.value = '';
            undoButton.disabled = true;
        }
    }
});

function isValidString(str) {
    return typeof str?.trim === 'function' && str.trim() !== '';
}