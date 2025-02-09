import React, { useState, useEffect } from 'react';

const SubjectTile = ({ name, onClick, isSelected }) => (
  <button 
    onClick={onClick}
    className={`
      w-full h-20 sm:h-24 rounded-lg transition-all duration-200 text-center px-4
      ${isSelected 
        ? 'bg-purple-50 shadow-sm border border-purple-100' 
        : 'bg-white hover:bg-gray-50 shadow-sm border border-gray-100 hover:border-gray-200'}
    `}
  >
    <h3 className="text-base sm:text-lg font-normal text-slate-700">
      {name.replace(/-/g, ' ')}
    </h3>
  </button>
);

const SubjectSelector = ({ onSubjectSelect, onCustomQuestions }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://api.github.com/repos/kamil-rusiecki/study-app-questions/contents'
      );
      
      if (!response.ok) throw new Error('Nie udało się pobrać listy przedmiotów');
      
      const folders = await response.json();
      const subjectFolders = folders.filter(item => item.type === 'dir');
      setSubjects(subjectFolders);
    } catch (err) {
      setError('Nie udało się pobrać listy przedmiotów. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubjectSelect = async (subject) => {
    if (selectedSubject?.name === subject.name) {
      setSelectedSubject(null);
      return;
    }
    
    setSelectedSubject(subject);
    try {
      const response = await fetch(
        `https://api.github.com/repos/kamil-rusiecki/study-app-questions/contents/${subject.name}`
      );
      
      if (!response.ok) throw new Error('Nie udało się pobrać zestawów pytań');
      
      const files = await response.json();
      const yamlFiles = files.filter(file => file.name.endsWith('.yaml'));
      if (yamlFiles.length > 0) {
        const fileResponse = await fetch(yamlFiles[0].download_url);
        if (!fileResponse.ok) throw new Error('Nie udało się pobrać pytań');
        
        const content = await fileResponse.text();
        onSubjectSelect(content);
      }
    } catch (err) {
      setError('Nie udało się pobrać zestawów pytań. ' + err.message);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-lg sm:text-xl font-normal text-slate-700 text-center px-4">
        Wybierz przedmiot
      </h2>

      {error && (
        <div className="text-red-500 p-3 sm:p-4 bg-red-50 rounded-lg text-center border border-red-100 text-sm sm:text-base mx-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center text-slate-600 text-sm sm:text-base">
          Ładowanie przedmiotów...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
          {subjects.map((subject) => (
            <SubjectTile
              key={subject.name}
              name={subject.name}
              onClick={() => handleSubjectSelect(subject)}
              isSelected={selectedSubject?.name === subject.name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectSelector;