import { useState, useEffect } from "react";
import { quizData } from "../data/data";
import { saveAttempt } from "../db/db";

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState([]);
  const [integerAnswer, setIntegerAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (timeLeft > 0 && !showScore) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showScore) {
      handleNextQuestion();
    }
  }, [timeLeft, showScore]);

  const handleAnswerClick = async (selectedAnswer) => {
    const isCorrect =
      selectedAnswer === quizData[currentQuestion].correctAnswer;
    showFeedback(isCorrect, selectedAnswer);
  };

  const handleIntegerSubmit = async (e) => {
    e.preventDefault();
    const userAnswer = parseInt(integerAnswer, 10);
    const isCorrect = userAnswer === quizData[currentQuestion].correctAnswer;
    showFeedback(isCorrect, userAnswer);
    setIntegerAnswer("");
  };

  const showFeedback = (isCorrect, answer) => {
    setFeedback({
      isCorrect,
      message: isCorrect ? "Correct!" : "Incorrect!",
      correctAnswer: !isCorrect
        ? quizData[currentQuestion].correctAnswer
        : null,
    });

    // Proceed to next question after 2 seconds
    setTimeout(() => {
      handleAnswer(answer, isCorrect);
      setFeedback(null);
    }, 2000);
  };

  const handleAnswer = async (answer, isCorrect) => {
    const newAnswers = [
      ...answers,
      {
        question: currentQuestion + 1,
        answer: answer,
        correct: isCorrect,
      },
    ];

    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      const attempt = {
        score,
        totalQuestions: quizData.length,
        answers: newAnswers,
      };
      await saveAttempt(attempt);
      setShowScore(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setTimeLeft(30);
    setAnswers([]);
    setIntegerAnswer("");
    setFeedback(null);
  };

  if (showScore) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center mt-6">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl mb-4">
          You scored {score} out of {quizData.length}
        </p>
        <button
          onClick={restartQuiz}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  const currentQuestionData = quizData[currentQuestion];
  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto mt-4">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-lg font-semibold">
          Question {currentQuestion + 1}/{quizData.length}
        </span>
        <span className="text-lg font-semibold text-blue-600">
          Time Left: {timeLeft}s
        </span>
      </div>
      <h2 className="text-xl mb-6">{currentQuestionData.question}</h2>

      {feedback && (
        <div
          className={`p-4 mb-4 rounded ${
            feedback.isCorrect
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <p className="font-bold">{feedback.message}</p>
          {feedback.correctAnswer && (
            <p className="mt-2">
              The correct answer was: {feedback.correctAnswer}
            </p>
          )}
        </div>
      )}

      {!feedback &&
        (currentQuestionData.type === "multiple-choice" ? (
          <div className="grid gap-4">
            {currentQuestionData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                className="bg-gray-100 p-4 rounded text-left hover:bg-gray-200 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleIntegerSubmit} className="space-y-4">
            <input
              type="number"
              value={integerAnswer}
              onChange={(e) => setIntegerAnswer(e.target.value)}
              className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your answer"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Submit Answer
            </button>
          </form>
        ))}
    </div>
  );
}
export default Quiz;
