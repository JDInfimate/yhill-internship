$(document).ready(function() {
  const quizData = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      answer: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      answer: "Mars"
    },
    {
      question: "Who is the author of the book 'To Kill a Mockingbird'?",
      options: ["F. Scott Fitzgerald", "Harper Lee", "Jane Austen", "J.K. Rowling"],
      answer: "Harper Lee"
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Ag", "Au", "Hg", "Pb"],
      answer: "Au"
    },
    {
      question: "Which musician is known as the 'King of Rock and Roll'?",
      options: ["Elvis Presley", "Chuck Berry", "Little Richard", "Jerry Lee Lewis"],
      answer: "Elvis Presley"
    }
  ];

  let currentQuiz = 0;
  let score = 0;

  const quizContainer = $("#quiz-container");
  const nextButton = $("#next-question");
  const submitButton = $("#submit-quiz");
  const quizResult = $("#quiz-result");

  function loadQuiz() {
    const currentQuizData = quizData[currentQuiz];
    quizContainer.html(`
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${currentQuizData.question}</h5>
          ${currentQuizData.options.map((option, index) => {
            return `
              <div>
                <input type="radio" name="answer" id="${String.fromCharCode(97 + index)}" value="${option}">
                <label for="${String.fromCharCode(97 + index)}">${option}</label>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `);
  }

  function getSelected() {
    const answers = document.querySelectorAll("input[name='answer']");
    let selectedAnswer;
    answers.forEach(answer => {
      if (answer.checked) {
        selectedAnswer = answer.value;
      }
    });
    return selectedAnswer;
  }

  nextButton.click(function() {
    const selectedAnswer = getSelected();
    if (selectedAnswer) {
      if (selectedAnswer === quizData[currentQuiz].answer) {
        score++;
      }
      currentQuiz++;
      if (currentQuiz < quizData.length) {
        loadQuiz();
      } else {
        nextButton.addClass("d-none");
        submitButton.removeClass("d-none");
      }
    }
  });

  submitButton.click(function() {
    const result = `You answered ${score}/${quizData.length} questions correctly.`;
    quizResult.text(result);

    // Add AJAX request to submit quiz results
    $.ajax({
      type: "POST",
      url: "/submit-quiz", // replace with your server-side endpoint
      data: {
        score: score,
        quizData: quizData
      },
      success: function(response) {
        console.log("Quiz submitted successfully!");
        // Display a success message or redirect to a new page
        alert("Quiz submitted successfully!");
      },
      error: function(xhr, status, error) {
        console.log("Error submitting quiz:", error);
      }
    });
  });

  loadQuiz();

  // Feedback Form Submission
  const feedbackForm = $("#feedback-form");
  const feedbackToast = $("#feedback-toast");

  feedbackForm.submit(function(event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "/feedback", // replace with your server-side endpoint
      data: feedbackForm.serialize(),
      success: function() {
        feedbackToast.fadeIn().delay(2000).fadeOut();
        feedbackForm[0].reset();
      }
    });
  });

  // Add timer functionality
  let timer = 30; // 30 seconds
  let intervalId = setInterval(function() {
    timer--;
    $("#timer").text(`Time remaining: ${timer} seconds`);
    if (timer === 0) {
      clearInterval(intervalId);
      submitButton.click(); // auto-submit the quiz when time runs out
    }
  }, 1000);

  // Add score tracking
  let scoreTracker = $("#score-tracker");
  scoreTracker.text(`Score: ${score}/${quizData.length}`);

  nextButton.click(function() {
    scoreTracker.text(`Score: ${score}/${quizData.length}`);
  });

  submitButton.click(function() {
    scoreTracker.text(`Final Score: ${score}/${quizData.length}`);
  });
});