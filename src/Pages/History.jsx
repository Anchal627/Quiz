import { useState, useEffect } from "react";
import { getAttempts } from "../db/db";

function History() {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const loadAttempts = async () => {
      const attemptHistory = await getAttempts();
      setAttempts(attemptHistory.reverse());
    };
    loadAttempts();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-6">Quiz History</h2>
      {attempts.length === 0 ? (
        <p className="text-gray-600">No attempts yet</p>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt, index) => (
            <div key={index} className="border p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">
                  Score: {attempt.score}/{attempt.totalQuestions}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(attempt.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Percentage:{" "}
                {((attempt.score / attempt.totalQuestions) * 100).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
