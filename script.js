'use strict';

// Необходимые элементы
const totalWordElement = document.getElementById('total-word');
const currentWordElement = document.getElementById('current-word');
const wordsProgressElement = document.getElementById('words-progress');
const shuffleButton = document.getElementById('shuffle-words');
const backButton = document.getElementById('back');
const nextButton = document.getElementById('next');
const examButton = document.getElementById('exam');
const flipCards = document.getElementsByClassName('flip-card');
const cardFrontElement = document.getElementById('card-front').querySelector('h1');
const cardBackElement = document.getElementById('card-back').querySelector('h1');
const cardBackExampleElement = document.getElementById('card-back').querySelector('span');
const examCards = document.getElementById('exam-cards');
const examProgressElement = document.getElementById('exam-progress');
const correctPercentElement = document.getElementById('correct-percent');
const timerElement = document.getElementById('timer');
const motivationElement = document.querySelector('.motivation');
const resultsModal = document.querySelector('.results-modal');

let currentWordIndex = 1;
let correctWords = 0;
let totalWords = 5;
let timer = 0;
let isExamMode = false;

//Список слов и их перевод
const words = [
    { foreignWord: "Hello", translation: "Привет", example: "Hello, Masha ?" },
    { foreignWord: "Dog", translation: "Собака", example: "I love my dog" },
    { foreignWord: "Mother", translation: "Мама", example: "My mother is a doctor" },
    { foreignWord: "Summer", translation: "Лето", example: "My favorite season is summer" },
    { foreignWord: "Blue", translation: "Синий", example: "My favorite color is blue" },
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
    currentWordIndex = 1;
    updateProgress();
}

//Функция для переключения между режимами
function switchMode() {
    isExamMode = !isExamMode;
    document.getElementById('study-mode').classList.toggle('hidden');
    document.getElementById('exam-mode').classList.toggle('hidden');
    examCards.innerHTML = '';
    if (isExamMode) {
        shuffleWords();
        startExamTimer();
    }
}

//Обработчики событий для кнопок и карточек
shuffleButton.addEventListener('click', shuffleWords);
backButton.addEventListener('click', () => {
    if (currentWordIndex > 1) {
        currentWordIndex--;
        updateCard(currentWordIndex - 1);
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
    nextButton.disabled = currentWordIndex === flipCards.length - 1;
};
examButton.addEventListener('click', switchMode);


//Обработчик события для кнопки "Тестирование" ???
examButton.addEventListener('click', function() {
    isExamMode = true;

    // Отображение карточек в случайном порядке
    const shuffledWords = words.sort(() => Math.random() - 0.5);
    examCards.innerHTML = '';

    shuffledWords.forEach(word => {
        const card = document.createElement('div');
        card.classList.add('exam-card');
        card.innerHTML = `
            <div class="foreign-word">${word.foreignWord}</div>
            <div class="translation">${word.translation}</div>`;

        card.addEventListener('click', function() {
            this.classList.add('correct');
            const selectedCards = document.querySelectorAll('.exam-card.correct');

            if (selectedCards.length === 2) {
                const [firstCard, secondCard] = selectedCards;

                if (firstCard.querySelector('.foreign-word').innerText === secondCard.querySelector('.translation').innerText) {
                    setTimeout(() => {
                        firstCard.classList.add('fade-out');
                        secondCard.classList.add('fade-out');
                        examCards.removeChild(firstCard);
                        examCards.removeChild(secondCard);
                    }, 500);
                } else {
                    setTimeout(() => {
                        secondCard.classList.add('wrong');
                        setTimeout(() => {
                            secondCard.classList.remove('wrong');
                        }, 500);
                    }, 500);
                }

                selectedCards.forEach(card => card.classList.remove('correct'));
            }
        });
        examCards.appendChild(card);
    });
    alert('Поздравляем! Тестирование успешно завершено!');
});

//Функция Таймера
function startExamTimer() {
    const startTime = new Date().getTime();
    setInterval(() => {
        const currentTime = new Date().getTime();
        timer = (currentTime - startTime) / 1000;
        const minutes = Math.floor(timer / 60);
        const seconds = Math.floor(timer % 60);
        timerElement.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

//Функция для окна с результатами
function showResultsModal() {
    resultsModal.classList.remove('hidden');
    resultsModal.querySelector('.time').textContent = timerElement.textContent;
    const wordStatsTemplate = document.getElementById('word-stats');
    words.forEach((word, index) => {
        const wordStats = wordStatsTemplate.content.cloneNode(true);
        wordStats.querySelector('.word span').textContent = word.word;
        wordStats.querySelector('.attempts span').textContent = index % 2 === 0 ? '1' : '0';
        resultsModal.querySelector('.results-content').appendChild(wordStats);
    });
}