import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const QuestionTest = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const storedQuestions = localStorage.getItem('questions');
    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions);
      setQuestions(parsedQuestions);
      // Initialize selected answers object
      const initialAnswers = {};
      parsedQuestions.forEach((_, index) => {
        initialAnswers[index] = null;
      });
      setSelectedAnswers(initialAnswers);
    }
  }, []);

  const handleAnswer = (questionIndex, answerIndex) => {
    if (!showResults) {  // Only allow answer changes if results are not shown
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answerIndex
      }));
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  if (!questions.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            No questions available. Please import questions first.
          </p>
        </CardContent>
      </Card>
    );
  }

  const allQuestionsAnswered = Object.values(selectedAnswers).every(answer => answer !== null);

  return (
    <div className="space-y-8">
      {questions.map((q, questionIndex) => (
        <Card key={questionIndex}>
          <CardHeader>
            <CardTitle>Question {questionIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswer(questionIndex, optionIndex)}
                  disabled={showResults}  // Disable buttons after submission
                  className={`w-full p-3 text-left rounded border ${
                    selectedAnswers[questionIndex] === optionIndex
                      ? 'bg-blue-100 border-blue-500 border-2'
                      : 'hover:bg-gray-50'
                  } ${
                    showResults && (
                      optionIndex === q.correct
                        ? 'bg-green-100 border-green-500'
                        : selectedAnswers[questionIndex] === optionIndex
                          ? 'bg-red-100 border-red-500'
                          : ''
                    )
                  } ${
                    showResults ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {showResults && (
              <div className="mt-4 p-4 rounded bg-gray-50">
                <p className="font-semibold">
                  {selectedAnswers[questionIndex] === q.correct 
                    ? '✓ Correct!' 
                    : `✗ Incorrect. The correct answer is: ${q.options[q.correct]}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      <div className="sticky bottom-4 bg-white p-4 rounded-lg shadow-lg">
        {!showResults ? (
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold ${
              allQuestionsAnswered
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {allQuestionsAnswered ? 'Submit Answers' : 'Please answer all questions'}
          </button>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-xl font-bold">Your Results</p>
              <p className="text-lg">Score: {calculateScore()} out of {questions.length}</p>
              <p className="text-lg">Percentage: {((calculateScore() / questions.length) * 100).toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionTest;