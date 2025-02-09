import React, { useState } from 'react';
import { parse } from 'yaml';
import QuestionTest from './components/QuestionTest';
import QuestionInput from './components/QuestionInput';
import SubjectSelector from './components/SubjectSelector';
import { Button } from './components/ui/button';

function App() {
  const [view, setView] = useState('subject-selector');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleQuestionsImported = () => {
    setView('test');
    setRefreshKey(prev => prev + 1);
  };

  const handleSubjectSelect = async (yamlContent) => {
    try {
      const parsed = parse(yamlContent);
      if (!parsed.questions) {
        throw new Error('Nieprawidłowy format pliku z pytaniami');
      }
      localStorage.setItem('questions', JSON.stringify(parsed.questions));
      handleQuestionsImported();
    } catch (error) {
      alert('Błąd podczas wczytywania pytań: ' + error.message);
    }
  };

  const handleCustomQuestions = () => {
    setView('custom-input');
  };

  const handleBackToSubjects = () => {
    setView('subject-selector');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-12">
          <h1 className="text-xl sm:text-2xl font-normal text-slate-700">Study App</h1>
          
          {view === 'subject-selector' ? (
            <Button 
              onClick={handleCustomQuestions}
              variant="link"
              className="self-end sm:self-auto"
            >
              Dodaj własne pytania
            </Button>
          ) : (
            <Button 
              onClick={handleBackToSubjects}
              variant="back"
              className="self-start sm:self-auto text-sm sm:text-base"
            >
              <span className="mr-2">←</span>
              {view === 'test' ? 'Zakończ test i wróć do wyboru przedmiotu' : 'Wróć do wyboru przedmiotu'}
            </Button>
          )}
        </header>

        <main className="w-full max-w-4xl mx-auto">
          {view === 'subject-selector' && (
            <SubjectSelector
              onSubjectSelect={handleSubjectSelect}
              onCustomQuestions={handleCustomQuestions}
            />
          )}

          {view === 'custom-input' && (
            <QuestionInput onQuestionsImported={handleQuestionsImported} />
          )}

          {view === 'test' && (
            <QuestionTest key={refreshKey} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;