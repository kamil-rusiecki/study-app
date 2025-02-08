import React, { useState } from 'react';
import { parse } from 'yaml';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const QuestionInput = ({ onQuestionsImported }) => {
  const [yamlContent, setYamlContent] = useState('');

  const handleParse = () => {
    try {
      const parsed = parse(yamlContent);

      // Validate the parsed content
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid format: Missing questions array');
      }

      // Validate each question
      parsed.questions.forEach((q, index) => {
        if (!q.question || !q.options || !Array.isArray(q.options) || 
            q.options.length !== 4 || typeof q.correct !== 'number') {
          throw new Error(`Invalid question format at index ${index}`);
        }
      });

      // Store questions in localStorage
      localStorage.setItem('questions', JSON.stringify(parsed.questions));
      alert(`Imported ${parsed.questions.length} questions successfully!`);
      onQuestionsImported();
    } catch (error) {
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
    correct: 1  # Index starts at 0, so 1 means Paris`}
          />
          <Button onClick={handleParse} className="w-full">
            Import Questions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionInput;