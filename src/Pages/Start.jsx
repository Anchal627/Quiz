import { useNavigate } from "react-router-dom";

function Start() {
  const navigate = useNavigate();

  const StartQuiz = () => {
    navigate("/Quiz");
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center mt-6">
      <h2 className="text-3xl font-bold mb-2">QuizApp!</h2>
      <p className="text-xl mb-4">Test your knowledge with this quiz..!!❓</p>
      <p className="text-xl mb-4"></p>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        onClick={StartQuiz}
      >
        Start Quiz
      </button>
    </div>
  );
}
export default Start;
