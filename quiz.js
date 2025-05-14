document.addEventListener('DOMContentLoaded', function() {
            // Quiz data - questions, options, and correct answers
            const quizData = [
                {
                    question: "What programming language is primarily used for adding interactivity to websites?",
                    options: ["HTML", "CSS", "JavaScript", "Python"],
                    correctAnswer: 2,
                    explanation: "JavaScript is the primary language for adding interactivity to web pages. HTML is for structure and CSS is for styling."
                },
                {
                    question: "Which of the following is NOT a JavaScript data type?",
                    options: ["String", "Boolean", "Character", "Object"],
                    correctAnswer: 2,
                    explanation: "JavaScript doesn't have a dedicated Character data type. Single characters are represented as strings."
                },
                {
                    question: "What does DOM stand for in web development?",
                    options: ["Document Object Model", "Data Object Model", "Document Oriented Module", "Digital Output Mechanism"],
                    correctAnswer: 0,
                    explanation: "DOM stands for Document Object Model, which is a programming interface for web documents."
                },
                {
                    question: "Which method is used to add an element at the end of an array in JavaScript?",
                    options: ["push()", "append()", "addToEnd()", "insert()"],
                    correctAnswer: 0,
                    explanation: "The push() method adds one or more elements to the end of an array and returns the new length."
                },
                {
                    question: "What does the '===' operator check for in JavaScript?",
                    options: ["Value equality only", "Reference equality only", "Both value and type equality", "None of the above"],
                    correctAnswer: 2,
                    explanation: "The strict equality operator (===) checks both value and type equality without performing type conversion."
                },
                {
                    question: "Which of these is a valid way to declare a variable in modern JavaScript?",
                    options: ["variable x = 5;", "var x = 5;", "const x = 5;", "int x = 5;"],
                    correctAnswer: 2,
                    explanation: "const is used to declare a constant variable in modern JavaScript, along with let for variables that can be reassigned."
                },
                {
                    question: "What is a callback function in JavaScript?",
                    options: ["A function that is called automatically when the page loads", "A function passed as an argument to another function", "A function that calls itself", "A function that is stored in a variable"],
                    correctAnswer: 1,
                    explanation: "A callback function is a function passed into another function as an argument, which is then invoked inside the outer function."
                },
                {
                    question: "What is the output of: console.log(typeof [])?",
                    options: ["array", "object", "undefined", "null"],
                    correctAnswer: 1,
                    explanation: "In JavaScript, arrays are actually objects, so typeof [] returns 'object'."
                },
                {
                    question: "Which method is used to remove the last element from an array?",
                    options: ["pop()", "shift()", "remove()", "delete()"],
                    correctAnswer: 0,
                    explanation: "The pop() method removes the last element from an array and returns that element."
                },
                {
                    question: "How do you check if a variable is an array in JavaScript?",
                    options: ["typeof variable === 'array'", "variable.isArray()", "Array.isArray(variable)", "variable instanceof Array"],
                    correctAnswer: 2,
                    explanation: "Array.isArray(variable) is the most reliable way to check if a variable is an array."
                }
            ];

            // DOM elements
            const questionText = document.getElementById('question-text');
            const optionsContainer = document.getElementById('options-container');
            const feedbackContainer = document.getElementById('feedback');
            const feedbackText = document.getElementById('feedback-text');
            const explanationText = document.getElementById('explanation-text');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const currentQuestionSpan = document.getElementById('current-question');
            const totalQuestionsSpan = document.getElementById('total-questions');
            const totalQuestionsResultSpan = document.getElementById('total-questions-result');
            const totalQuestionsDetailSpan = document.getElementById('total-questions-detail');
            const progressBar = document.getElementById('progress-bar');
            const resultsContainer = document.getElementById('results-container');
            const questionContainer = document.getElementById('question-container');
            const correctAnswersSpan = document.getElementById('correct-answers');
            const correctAnswersTextSpan = document.getElementById('correct-answers-text');
            const percentageSpan = document.getElementById('percentage');
            const restartBtn = document.getElementById('restart-btn');
            const reviewBtn = document.getElementById('review-btn');

            // Quiz state
            let currentQuestionIndex = 0;
            let score = 0;
            let userAnswers = Array(quizData.length).fill(null);
            let answeredQuestions = Array(quizData.length).fill(false);
            let inReviewMode = false;

            // Initialize the quiz
            function initQuiz() {
                // Set total questions count
                totalQuestionsSpan.textContent = quizData.length;
                totalQuestionsResultSpan.textContent = quizData.length;
                totalQuestionsDetailSpan.textContent = quizData.length;
                
                // Load first question
                loadQuestion(0);
                
                // Reset state
                score = 0;
                userAnswers = Array(quizData.length).fill(null);
                answeredQuestions = Array(quizData.length).fill(false);
                inReviewMode = false;
                
                // Hide results container
                resultsContainer.style.display = 'none';
                questionContainer.style.display = 'block';
                
                // Update buttons
                prevBtn.disabled = true;
                nextBtn.disabled = true;
            }

            // Load a specific question
            function loadQuestion(index) {
                currentQuestionIndex = index;
                const question = quizData[index];
                
                // Update question text
                questionText.textContent = question.question;
                
                // Clear previous options
                optionsContainer.innerHTML = '';
                
                // Add options
                question.options.forEach((option, i) => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'option';
                    optionElement.textContent = option;
                    optionElement.dataset.index = i;
                    
                    // If this question has been answered or in review mode
                    if (answeredQuestions[index] || inReviewMode) {
                        if (i === userAnswers[index]) {
                            optionElement.classList.add('selected');
                            if (i === question.correctAnswer) {
                                optionElement.classList.add('correct');
                            } else {
                                optionElement.classList.add('incorrect');
                            }
                        } else if (i === question.correctAnswer) {
                            optionElement.classList.add('correct');
                        }
                        
                        // Disable clicking in review mode
                        if (inReviewMode) {
                            optionElement.style.cursor = 'default';
                        } else {
                            optionElement.addEventListener('click', handleOptionClick);
                        }
                    } else {
                        // Normal mode - add click event
                        optionElement.addEventListener('click', handleOptionClick);
                        
                        // If user previously selected this option but hasn't submitted
                        if (userAnswers[index] === i) {
                            optionElement.classList.add('selected');
                        }
                    }
                    
                    optionsContainer.appendChild(optionElement);
                });
                
                // Update progress
                currentQuestionSpan.textContent = index + 1;
                progressBar.style.width = `${((index + 1) / quizData.length) * 100}%`;
                
                // Hide feedback if moving to a new question
                if (!answeredQuestions[index]) {
                    feedbackContainer.style.display = 'none';
                } else {
                    // Show feedback if question was already answered
                    showFeedback(index);
                }
                
                // Update button states
                prevBtn.disabled = index === 0 || inReviewMode;
                
                if (inReviewMode) {
                    nextBtn.disabled = index === quizData.length - 1;
                    nextBtn.textContent = 'Next Question';
                } else if (answeredQuestions[index]) {
                    nextBtn.disabled = false;
                    nextBtn.textContent = index === quizData.length - 1 ? 'Finish Quiz' : 'Next Question';
                } else {
                    nextBtn.disabled = true;
                    nextBtn.textContent = index === quizData.length - 1 ? 'Finish Quiz' : 'Next Question';
                }
            }

            // Handle option click
            function handleOptionClick(e) {
                if (answeredQuestions[currentQuestionIndex]) return;
                
                // Remove selected class from all options
                const options = optionsContainer.querySelectorAll('.option');
                options.forEach(option => {
                    option.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                e.target.classList.add('selected');
                
                // Store user's answer
                const selectedOptionIndex = parseInt(e.target.dataset.index);
                userAnswers[currentQuestionIndex] = selectedOptionIndex;
                
                // Check answer and provide feedback
                const currentQuestion = quizData[currentQuestionIndex];
                const isCorrect = selectedOptionIndex === currentQuestion.correctAnswer;
                
                // Mark as answered
                answeredQuestions[currentQuestionIndex] = true;
                
                // Update score if correct
                if (isCorrect) {
                    score++;
                }
                
                // Show feedback
                showFeedback(currentQuestionIndex);
                
                // Mark options as correct/incorrect
                options.forEach((option, index) => {
                    if (index === selectedOptionIndex) {
                        if (isCorrect) {
                            option.classList.add('correct');
                        } else {
                            option.classList.add('incorrect');
                        }
                    } else if (index === currentQuestion.correctAnswer) {
                        option.classList.add('correct');
                    }
                });
                
                // Enable next button
                nextBtn.disabled = false;
            }

            // Show feedback for a question
            function showFeedback(index) {
                const selectedOption = userAnswers[index];
                const correctOption = quizData[index].correctAnswer;
                
                if (selectedOption === correctOption) {
                    feedbackContainer.className = 'feedback correct';
                    feedbackText.textContent = 'Correct! Well done!';
                } else {
                    feedbackContainer.className = 'feedback incorrect';
                    feedbackText.textContent = 'Incorrect. The correct answer is: ' + quizData[index].options[correctOption];
                }
                
                explanationText.textContent = quizData[index].explanation;
                feedbackContainer.style.display = 'block';
            }

            // Show results
            function showResults() {
                questionContainer.style.display = 'none';
                resultsContainer.style.display = 'block';
                
                correctAnswersSpan.textContent = score;
                correctAnswersTextSpan.textContent = score;
                
                const percentage = Math.round((score / quizData.length) * 100);
                percentageSpan.textContent = percentage;
                
                // Hide navigation buttons
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }

            // Enter review mode
            function enterReviewMode() {
                inReviewMode = true;
                currentQuestionIndex = 0;
                
                // Show question container
                questionContainer.style.display = 'block';
                resultsContainer.style.display = 'none';
                
                // Show navigation buttons
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
                
                // Load first question in review mode
                loadQuestion(0);
            }

            // Event listeners
            nextBtn.addEventListener('click', function() {
                if (currentQuestionIndex === quizData.length - 1) {
                    // Show results if on last question
                    showResults();
                } else {
                    // Go to next question
                    loadQuestion(currentQuestionIndex + 1);
                }
            });

            prevBtn.addEventListener('click', function() {
                if (currentQuestionIndex > 0) {
                    loadQuestion(currentQuestionIndex - 1);
                }
            });

            restartBtn.addEventListener('click', function() {
                initQuiz();
                
                // Show navigation buttons
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
            });

            reviewBtn.addEventListener('click', enterReviewMode);

            // Initialize the quiz
            initQuiz();
        });
