
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");
const feedbackElement = document.getElementById("feedback");
const scoreElement = document.getElementById("score");

// Sample questions in case the API is unavailable
const fallbackQuestions = [
    {
        question: "Which language is used to style web pages?",
        answers: ["HTML", "CSS", "Python", "Java"],
        correct: "CSS"
    },
    {
        question: "Which language adds interactivity to websites?",
        answers: ["CSS", "HTML", "JavaScript", "SQL"],
        correct: "JavaScript"
    },
    {
        question: "What does HTML stand for?",
        answers: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Tool Multi Language",
            "Home Text Markup Language"
        ],
        correct: "Hyper Text Markup Language"
    },
    {
        question: "Which company developed Java?",
        answers: ["Microsoft", "Sun Microsystems", "Google", "Apple"],
        correct: "Sun Microsystems"
    },
    {
        question: "Which symbol is used for an ID selector in CSS?",
        answers: [".", "#", "*", "&"],
        correct: "#"
    }
];

let questions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;

// Load questions from a public API
async function loadQuestions() {
    questionElement.textContent = "Loading questions...";
    nextButton.disabled = true;

    try {
        const response = await fetch(
            "https://opentdb.com/api.php?amount=5&type=multiple&encode=url3986"
        );

        if (!response.ok) {
            throw new Error("Could not fetch questions");
        }

        const data = await response.json();

        if (data.response_code !== 0 || !data.results.length) {
            throw new Error("No questions available");
        }

        questions = data.results.map(item => {
            const decode = value => decodeURIComponent(value);

            const correct = decode(item.correct_answer);
            const answers = [
                ...item.incorrect_answers.map(decode),
                correct
            ];

            // Shuffle the answer options
            answers.sort(() => Math.random() - 0.5);

            return {
                question: decode(item.question),
                answers: answers,
                correct: correct
            };
        });
    } catch (error) {
        console.log("Using sample questions:", error.message);
        questions = [...fallbackQuestions];
    }

    currentQuestion = 0;
    score = 0;
    showQuestion();
}

// Display the current question
function showQuestion() {
    answered = false;

    const item = questions[currentQuestion];

    questionElement.textContent =
        `${currentQuestion + 1}. ${item.question}`;

    answersElement.replaceChildren();
    feedbackElement.textContent = "";
    scoreElement.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    item.answers.forEach(answer => {
        const button = document.createElement("button");

        button.className = "answer-btn";
        button.textContent = answer;

        button.addEventListener("click", () => {
            checkAnswer(button, answer);
        });

        answersElement.appendChild(button);
    });

    nextButton.disabled = true;
    nextButton.textContent =
        currentQuestion === questions.length - 1
            ? "See Results"
            : "Next Question";
}

// Check the selected answer
function checkAnswer(selectedButton, answer) {
    if (answered) return;

    answered = true;

    const correctAnswer = questions[currentQuestion].correct;
    const buttons = answersElement.querySelectorAll(".answer-btn");

    buttons.forEach(button => {
        button.disabled = true;

        if (button.textContent === correctAnswer) {
            button.classList.add("correct");
        }
    });

    if (answer === correctAnswer) {
        score++;
        feedbackElement.textContent = "Correct answer!";
        feedbackElement.style.color = "green";
    } else {
        selectedButton.classList.add("incorrect");
        feedbackElement.textContent =
            "Incorrect! The correct answer is " + correctAnswer;
        feedbackElement.style.color = "red";
    }

    nextButton.disabled = false;
}

// Move to the next question or show results
nextButton.addEventListener("click", () => {
    if (!answered) return;

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        showResults();
    }
});

// Display the final score
function showResults() {
    questionElement.textContent = "Quiz Completed!";
    answersElement.replaceChildren();
    feedbackElement.textContent = "Great job! Keep learning.";
    feedbackElement.style.color = "#563dce";

    const percentage = Math.round(
        (score / questions.length) * 100
    );

    scoreElement.textContent =
        `Your score: ${score}/${questions.length} (${percentage}%)`;

    nextButton.textContent = "Play Again";
    nextButton.disabled = false;

    nextButton.onclick = () => {
        nextButton.onclick = null;
        loadQuestions();
    };
}

// Image carousel
const images = [
    "https://picsum.photos/id/20/600/300",
    "https://picsum.photos/id/24/600/300",
    "https://picsum.photos/id/180/600/300"
];

let imageIndex = 0;

const carouselImage = document.getElementById("carousel-image");

function changeImage(direction) {
    imageIndex =
        (imageIndex + direction + images.length) % images.length;

    carouselImage.src = images[imageIndex];
}

document.getElementById("prev-btn").addEventListener("click", () => {
    changeImage(-1);
});

document.getElementById("next-image-btn").addEventListener("click", () => {
    changeImage(1);
});

// Start the quiz
loadQuestions();
