import React, { useState } from 'react';
import { parse } from 'yaml';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const QuestionInput = ({ onQuestionsImported }) => {
  const [yamlContent, setYamlContent] = useState('');
  const [error, setError] = useState('');

  const validateQuestions = (questions) => {
    if (!Array.isArray(questions)) {
      throw new Error('Questions must be an array');
    }

    questions.forEach((q, index) => {
      if (!q.question) {
        throw new Error(`Question ${index + 1} is missing text`);
      }
      if (!q.options || !Array.isArray(q.options)) {
        throw new Error(`Question ${index + 1} is missing options array`);
      }
      if (q.options.length < 2) {
        throw new Error(`Question ${index + 1} must have at least 2 options (currently has ${q.options.length})`);
      }
      if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.options.length) {
        throw new Error(`Question ${index + 1} has invalid correct answer index (must be between 0 and the number of options minus 1)`);
      }
    });
  };

  const handleParse = () => {
    try {
      const parsed = parse(yamlContent);
      setError('');

      // Validate the parsed content
      if (!parsed.questions) {
        throw new Error('Invalid format: Missing questions array');
      }

      validateQuestions(parsed.questions);

      // Store questions in localStorage
      localStorage.setItem('questions', JSON.stringify(parsed.questions));
      alert(`Imported ${parsed.questions.length} questions successfully!`);
      if (onQuestionsImported) {
        onQuestionsImported();
      }
    } catch (error) {
      setError(error.message);
      alert('Error: ' + error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Questions (YAML format)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <textarea
            value={yamlContent}
            onChange={(e) => setYamlContent(e.target.value)}
            className="w-full h-64 p-4 border rounded-md font-mono text-sm"
            placeholder={`questions:
  - question: What is the capital of France?
    options:
      - London
      - Paris
      - Berlin
      - Madrid
      - Rome
      - Warsaw
    correct: 1  # Index starts at 0, so 1 means Paris
  - question: What is 2+2?
    options:
      - 3
      - 4
    correct: 1  # Shows that you can have just 2 options`}
          />
          {error && (
            <div className="text-red-500 p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          <Button onClick={handleParse} className="w-full">
            Import Questions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionInput;