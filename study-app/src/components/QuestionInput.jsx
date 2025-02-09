import React, { useState } from 'react';
import { parse } from 'yaml';
import { Button } from './ui/button';
import ManualQuestionInput from './ManualQuestionInput';

const Tab = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      px-4 sm:px-6 py-2 font-normal text-sm relative whitespace-nowrap
      ${isActive 
        ? 'text-blue-600' 
        : 'text-gray-500 hover:text-gray-700'}
    `}
  >
    {children}
    {isActive && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
    )}
  </button>
);

const defaultYamlContent = `questions:
  # Przykład 1: Pytanie z wieloma opcjami
  - question: Co jest stolicą Polski?
    options:
      - Kraków
      - Warszawa
      - Poznań
      - Wrocław
      - Gdańsk
    correct: 1 # Warszawa

  # Przykład 2: Pytanie z dwiema opcjami
  - question: Czy Wisła jest najdłuższą rzeką w Polsce?
    options:
      - Tak
      - Nie
    correct: 0 # Tak

  # Przykład 3: Pytanie matematyczne
  - question: Ile wynosi pierwiastek kwadratowy z 16?
    options:
      - 2
      - 4
      - 8
      - 16
    correct: 1 # 4

# Wskazówki:
# - Indeksowanie zaczyna się od 0
# - Każde pytanie musi mieć co najmniej 2 opcje
# - Wartość "correct" wskazuje na indeks poprawnej odpowiedzi`;

const QuestionInput = ({ onQuestionsImported }) => {
  const [inputMethod, setInputMethod] = useState('yaml');
  const [yamlContent, setYamlContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    try {
      const parsed = parse(yamlContent);
      if (!parsed.questions) {
        throw new Error('Nieprawidłowy format pliku. Upewnij się, że plik zaczyna się od "questions:"');
      }
      if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error('Lista pytań jest pusta lub nieprawidłowa');
      }
      
      // Walidacja każdego pytania
      parsed.questions.forEach((q, index) => {
        if (!q.question) {
          throw new Error(`Pytanie ${index + 1} nie ma treści`);
        }
        if (!Array.isArray(q.options) || q.options.length < 2) {
          throw new Error(`Pytanie ${index + 1} musi mieć co najmniej 2 opcje odpowiedzi`);
        }
        if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.options.length) {
          throw new Error(`Pytanie ${index + 1} ma nieprawidłowy indeks poprawnej odpowiedzi`);
        }
      });

      localStorage.setItem('questions', JSON.stringify(parsed.questions));
      onQuestionsImported();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <div className="flex px-4 sm:px-0">
          <Tab 
            isActive={inputMethod === 'yaml'} 
            onClick={() => setInputMethod('yaml')}
          >
            Import YAML
          </Tab>
          <Tab 
            isActive={inputMethod === 'manual'} 
            onClick={() => setInputMethod('manual')}
          >
            Manualnie
          </Tab>
        </div>
      </div>

      {inputMethod === 'yaml' ? (
        <div className="space-y-6 px-4 sm:px-0">
        <h2 className="text-lg sm:text-xl font-normal text-slate-700">
          Wklej plik YAML
        </h2>

        <textarea
          value={yamlContent}
          onChange={(e) => setYamlContent(e.target.value)}
          placeholder={defaultYamlContent}
          className="w-full min-h-[16rem] sm:min-h-[24rem] p-4 font-mono text-sm bg-gray-50 border border-gray-200 
                     rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent resize-y"
          spellCheck="false"
        />

        {error && (
          <div className="text-red-500 p-3 sm:p-4 bg-red-50 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            size="lg"
            className="w-full sm:w-auto"
            disabled={!yamlContent.trim()}
          >
            Rozpocznij test
          </Button>
        </div>
      </div>
      ) : (
        <div className="space-y-6 px-4 sm:px-0">
          <h2 className="text-lg sm:text-xl font-normal text-slate-700">
            Dodaj pytania manualnie
          </h2>
          <ManualQuestionInput 
            onSubmit={(questions) => {
              localStorage.setItem('questions', JSON.stringify(questions));
              onQuestionsImported();
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default QuestionInput;