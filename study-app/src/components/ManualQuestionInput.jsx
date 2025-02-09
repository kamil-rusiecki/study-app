import React, { useState } from 'react';
import { Button } from './ui/button';

const ManualQuestionInput = ({ onSubmit }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', ''],
    correct: 0
  });

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    if (currentQuestion.options.length <= 2) return;
    
    setCurrentQuestion(prev => {
      const newOptions = prev.options.filter((_, i) => i !== index);
      return {
        ...prev,
        options: newOptions,
        correct: prev.correct >= index ? Math.max(0, prev.correct - 1) : prev.correct
      };
    });
  };

  const updateOption = (index, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim() || 
        currentQuestion.options.some(opt => !opt.trim()) ||
        currentQuestion.correct >= currentQuestion.options.length) {
      return;
    }

    setQuestions(prev => [...prev, currentQuestion]);
    setCurrentQuestion({
      question: '',
      options: ['', ''],
      correct: 0
    });
  };

  const handleSubmit = () => {
    if (questions.length === 0) return;
    onSubmit(questions);
  };

  const removeQuestion = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* Lista dodanych pytań */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Dodane pytania:</h3>
          {questions.map((q, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{q.question}</p>
                  <ul className="mt-2 space-y-1">
                    {q.options.map((opt, optIndex) => (
                      <li key={optIndex} className={optIndex === q.correct ? "text-green-600" : ""}>
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => removeQuestion(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formularz dodawania pytania */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Treść pytania
          </label>
          <input
            type="text"
            value={currentQuestion.question}
            onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Wpisz treść pytania"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Odpowiedzi
          </label>
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Odpowiedź ${index + 1}`}
              />
              <input
                type="radio"
                checked={currentQuestion.correct === index}
                onChange={() => setCurrentQuestion(prev => ({ ...prev, correct: index }))}
                className="mt-3"
              />
              {index >= 2 && (
                <button
                  onClick={() => removeOption(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  Usuń
                </button>
              )}
            </div>
          ))}
          {currentQuestion.options.length < 5 && (
            <button
              onClick={addOption}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              + Dodaj odpowiedź
            </button>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            onClick={addQuestion}
            variant="secondary"
            disabled={
              !currentQuestion.question.trim() ||
              currentQuestion.options.some(opt => !opt.trim())
            }
          >
            Dodaj pytanie
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={questions.length === 0}
          >
            Zakończ i rozpocznij test
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManualQuestionInput;