// DOM Elements
const sourceText = document.getElementById('sourceText');
const targetText = document.getElementById('targetText');
const sourceLanguage = document.getElementById('sourceLanguage');
const targetLanguage = document.getElementById('targetLanguage');
const translateBtn = document.getElementById('translateBtn');
const listenSourceBtn = document.getElementById('listenSource');
const listenTargetBtn = document.getElementById('listenTarget');
const copySourceBtn = document.getElementById('copySource');
const copyTargetBtn = document.getElementById('copyTarget');
const charCount = document.getElementById('charCount');
const swapLanguagesBtn = document.getElementById('swapLanguages');

const languageCodes = {
    'English': 'en',
    'French': 'fr',
    'Japanese': 'ja',
    'Chinese': 'zh',
    'Korean': 'ko',
    'Spanish': 'es',
    'German': 'de',
    'Italian': 'it',
    'Russian': 'ru'
};


charCount.textContent = sourceText.value.length;

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

sourceText.addEventListener('input', () => {
    charCount.textContent = sourceText.value.length;
});

async function translate() {
    const text = sourceText.value;
    const sourceLang = sourceLanguage.value;
    const targetLang = targetLanguage.value;

    if (!text) return;

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
        const data = await response.json();
        
        if (data.responseData) {
            targetText.value = data.responseData.translatedText;
        } else {
            targetText.value = 'Translation failed. Please try again.';
        }
    } catch (error) {
        targetText.value = 'Error occurred during translation. Please try again.';
        console.error('Translation error:', error);
    }
}

function speak(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Text copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function swapLanguages() {
    const tempLang = sourceLanguage.value;
    sourceLanguage.value = targetLanguage.value;
    targetLanguage.value = tempLang;
    
    const tempText = sourceText.value;
    sourceText.value = targetText.value;
    targetText.value = tempText;
    
    translate();
}

translateBtn.addEventListener('click', translate);
swapLanguagesBtn.addEventListener('click', swapLanguages);

sourceText.addEventListener('input', debounce(translate, 500));

sourceLanguage.addEventListener('change', translate);
targetLanguage.addEventListener('change', translate);


listenSourceBtn.addEventListener('click', () => {
    const lang = sourceLanguage.value === 'auto' ? 'en' : sourceLanguage.value;
    speak(sourceText.value, lang);
});

listenTargetBtn.addEventListener('click', () => {
    speak(targetText.value, targetLanguage.value);
});

copySourceBtn.addEventListener('click', () => {
    copyToClipboard(sourceText.value);
});

copyTargetBtn.addEventListener('click', () => {
    copyToClipboard(targetText.value);
});

translate(); 