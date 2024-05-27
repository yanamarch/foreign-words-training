'use strict';

// Необходимые элементы
const totalWordElement = document.getElementById('total-word');
const currentWordElement = document.getElementById('current-word');
const wordsProgressElement = document.getElementById('words-progress');
const studyCards = document.querySelector('.study-cards');
const flipCards = document.getElementsByClassName('flip-card');
const cardFrontElement = document.getElementById('card-front').querySelector('h1');
const cardBackElement = document.getElementById('card-back').querySelector('h1');
const cardBackExampleElement = document.getElementById('card-back').querySelector('span');
const shuffleButton = document.getElementById('shuffle-words');
const backButton = document.getElementById('back');
const nextButton = document.getElementById('next');
const examButton = document.getElementById('exam');
const examCards = document.getElementById('exam-cards');
const examProgressElement = document.getElementById('exam-progress');
const correctPercentElement = document.getElementById('correct-percent');
const timerElement = document.getElementById('timer');
const motivationElement = document.querySelector('.motivation');
const resultsModal = document.querySelector('.results-modal');

let currentWordIndex = 0;
let correctWords = 0;
let totalWords = 5;
let timer = 0;
let isExamMode = false;

//Список слов и их перевод
const words = [
    { foreignWord: "Hello", translation: "Привет", example: "Hello, Masha!" },
    { foreignWord: "Dog", translation: "Собака", example: "I love my dog." },
    { foreignWord: "Mother", translation: "Мама", example: "My mother is a doctor." },
    { foreignWord: "Summer", translation: "Лето", example: "My favorite season is summer." },
    { foreignWord: "Blue", translation: "Синий", example: "My favorite color is blue." },
];

//Обработчик клика по карточке для переворота
for (let card of flipCards) {
    card.addEventListener('click', function() {
        this.classList.toggle('active');
    });
}

//Функция для обновления слова на карточке
function updateCard(index) {
    if (index < 0 || index >= words.length) {
        return;
    }
    const word = words[index];
    cardFrontElement.textContent = word.foreignWord;
    cardBackElement.textContent = word.translation;
    cardBackExampleElement.textContent = word.example;
}

updateCard(currentWordIndex);

//Функция для обновления прогресса прохождения заданий
function updateProgress() {
    totalWordElement.textContent = totalWords;
    currentWordElement.textContent = currentWordIndex;
    wordsProgressElement.value = (currentWordIndex / totalWords) * 100;
}

//Функция для перемешивания слов
function shuffleWords() {
    words.sort(() => Math.random() - 0.5);
    updateCard(0);
    currentWordIndex = 0;
}

//Функция для переключения между режимами
function switchMode() {
    isExamMode = !isExamMode;
    studyCards.classList.toggle('hidden');
    examCards.classList.toggle('hidden');
    examCards.innerHTML = '';
    if (isExamMode) {
        shuffleWords();
    }
}

//Обработчики событий для кнопок и карточек
shuffleButton.addEventListener('click', shuffleWords);
backButton.addEventListener('click', () => {
    if (currentWordIndex > 1) {
        currentWordIndex--;
        updateCard(currentWordIndex);
        updateProgress();
        stopSlider();
    }
});
nextButton.addEventListener('click', () => {
    if (currentWordIndex < totalWords) {
        currentWordIndex++;
        updateCard(currentWordIndex - 1);
        updateProgress();
        stopSlider();
    }
});
const stopSlider = () => {
    backButton.disabled = currentWordIndex === 0;
    nextButton.disabled = currentWordIndex === words.length;
};

//Режим тестирования

let dictionary = {};

function fillDictionary() {
    words.forEach((item) => {
        dictionary[item.foreignWord] = item.translation;
        dictionary[item.translation] = item.foreignWord;
    });
}

fillDictionary();

//Обработчик события для кнопки "Тестирование"
examButton.addEventListener('click', function() {

    switchMode();
    isExamMode = true;

    //Отображение карточек в случайном порядке
    examCards.innerHTML = '';

    const allWords = [];
    words.forEach(word => {
        allWords.push(word.foreignWord);
        allWords.push(word.translation);
    });

    console.log(allWords, 'allWords');

    const shuffledWords = allWords.sort(() => Math.random() - 0.5);

    let selectedCard;

    shuffledWords.forEach(word => {
        const card = document.createElement('div');
        card.classList.add('exam-card');
        card.classList.add('card');

        card.textContent = word;

        examCards.appendChild(card);

        card.addEventListener('click', function(e) {
            if (!selectedCard) {
                selectedCard = e.target;
                selectedCard.classList.add('correct');
                return;
            }

            if (dictionary[this.textContent] === selectedCard.textContent) {
                this.classList.add('correct');
                selectedCard.classList.add('fade-out');
                this.classList.add('fade-out');
                setTimeout(checkEndGame, 500);

            } else {
                this.classList.add('wrong');
                const correctCards = document.querySelectorAll(".correct");
                const inCorrectCards = document.querySelectorAll(".wrong");

                setTimeout(() => {
                    [...correctCards, ...inCorrectCards].forEach((card) => {
                        if (!card.classList.contains("fade-out")) {
                            card.className = "card";
                        }
                    });
                }, 500);
            }
            const fadeOutCard = document.querySelectorAll(".fade-out");
            fadeOutCard.forEach(card => {
                card.style.pointerEvents = "none";
            })
            selectedCard = null;
        })

    });
});

function checkEndGame() {
    const fadeOutCard = document.querySelectorAll(".fade-out");
    if (fadeOutCard.length === Object.keys(dictionary).length) {
        alert('Поздравляю! Вы успешно прошли тестирование')
    }
}