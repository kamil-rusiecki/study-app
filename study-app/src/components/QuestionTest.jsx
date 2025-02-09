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

  const calculateGrade = (score, total) => {
    const percentage = (score / total) * 100;
    
    if (percentage < 60) return 'Niedostateczny';
    if (percentage < 70) return 'Dostateczny';
    if (percentage < 75) return 'Dostateczny plus';
    if (percentage < 85) return 'Dobry';
    if (percentage < 90) return 'Dobry plus';
    return 'Bardzo dobry';
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'Niedostateczny': return 'text-red-600';
      case 'Dostateczny': return 'text-yellow-600';
      case 'Dostateczny plus': return 'text-yellow-500';
      case 'Dobry': return 'text-green-600';
      case 'Dobry plus': return 'text-green-500';
      case 'Bardzo dobry': return 'text-emerald-600';
      default: return 'text-gray-600';
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  if (!questions.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Brak dostępnych pytań. Proszę najpierw zaimportować pytania.
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
            <CardTitle>Pytanie {questionIndex + 1}</CardTitle>
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
                    ? '✓ Poprawnie!' 
                    : `✗ Niepoprawnie. Prawidłowa odpowiedź to: ${q.options[q.correct]}`}
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
            {allQuestionsAnswered ? 'Zatwierdź odpowiedzi' : 'Proszę odpowiedzieć na wszystkie pytania'}
          </button>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-xl font-bold">Twoje wyniki</p>
              <p className="text-lg">Wynik: {calculateScore()} z {questions.length}</p>
              <p className="text-lg">Procent: {((calculateScore() / questions.length) * 100).toFixed(1)}%</p>
              <p className={`text-lg font-semibold ${getGradeColor(calculateGrade(calculateScore(), questions.length))}`}>
                Ocena: {calculateGrade(calculateScore(), questions.length)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionTest;