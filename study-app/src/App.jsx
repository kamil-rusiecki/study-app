import React, { useState } from 'react';
import QuestionInput from './components/QuestionInput';
import QuestionTest from './components/QuestionTest';

function App() {
  const [showTest, setShowTest] = useState(false);
  const [hasQuestions, setHasQuestions] = useState(false);

  const handleQuestionsImported = () => {
    setHasQuestions(true);
  };

  const handleStartTest = () => {
    setShowTest(true);
  };

  const handleBackToInput = () => {
    setShowTest(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">Study App</h1>
        
        {!showTest ? (
          <>
            <QuestionInput onQuestionsImported={handleQuestionsImported} />
            {hasQuestions && (
              <div className="text-center">
                <button 
                  onClick={handleStartTest}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg"
                >
                  Start Test
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <button 
              onClick={handleBackToInput}
              className="mb-4 text-blue-500 hover:text-blue-600"
            >
              ← Back to Import
            </button>
            <QuestionTest />
          </>
        )}
      </div>
    </div>
  );
}

export default App;