import React, { createContext, useContext, useState, useEffect } from 'react';

// SCORM API simulation for tracking
interface SCORMData {
  lessonStatus: 'incomplete' | 'completed' | 'passed' | 'failed' | 'browsed' | 'not attempted';
  sessionTime: string;
  totalTime: string;
  score: {
    raw: number;
    min: number;
    max: number;
  };
  location: string;
  suspendData: string;
  interactions: Array<{
    id: string;
    type: 'choice' | 'fill-in' | 'matching' | 'performance' | 'sequencing' | 'likert' | 'numeric';
    timestamp: string;
    correct_responses: string[];
    weighting: number;
    learner_response: string;
    result: 'correct' | 'incorrect' | 'unanticipated' | 'neutral';
    latency: string;
  }>;
  objectives: Array<{
    id: string;
    score: number;
    status: 'passed' | 'failed' | 'unknown';
  }>;
}

interface SCORMContextType {
  data: SCORMData;
  updateProgress: (moduleId: string, progress: number) => void;
  recordInteraction: (interaction: any) => void;
  setLessonStatus: (status: SCORMData['lessonStatus']) => void;
  setScore: (score: number, min?: number, max?: number) => void;
  exportSCORMData: () => string;
  importSCORMData: (data: string) => void;
}

const SCORMContext = createContext<SCORMContextType | null>(null);

export const SCORMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SCORMData>({
    lessonStatus: 'not attempted',
    sessionTime: '00:00:00',
    totalTime: '00:00:00',
    score: { raw: 0, min: 0, max: 100 },
    location: '',
    suspendData: '',
    interactions: [],
    objectives: []
  });

  const [sessionStartTime, setSessionStartTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const sessionDuration = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
      const hours = Math.floor(sessionDuration / 3600);
      const minutes = Math.floor((sessionDuration % 3600) / 60);
      const seconds = sessionDuration % 60;
      
      setData(prev => ({
        ...prev,
        sessionTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const updateProgress = (moduleId: string, progress: number) => {
    setData(prev => ({
      ...prev,
      location: moduleId,
      lessonStatus: progress >= 100 ? 'completed' : progress > 0 ? 'incomplete' : 'not attempted'
    }));
  };

  const recordInteraction = (interaction: any) => {
    setData(prev => ({
      ...prev,
      interactions: [...prev.interactions, {
        ...interaction,
        timestamp: new Date().toISOString()
      }]
    }));
  };

  const setLessonStatus = (status: SCORMData['lessonStatus']) => {
    setData(prev => ({ ...prev, lessonStatus: status }));
  };

  const setScore = (score: number, min = 0, max = 100) => {
    setData(prev => ({
      ...prev,
      score: { raw: score, min, max }
    }));
  };

  const exportSCORMData = () => {
    return JSON.stringify(data, null, 2);
  };

  const importSCORMData = (jsonData: string) => {
    try {
      const importedData = JSON.parse(jsonData);
      setData(importedData);
    } catch (error) {
      console.error('Error importing SCORM data:', error);
    }
  };

  return (
    <SCORMContext.Provider value={{
      data,
      updateProgress,
      recordInteraction,
      setLessonStatus,
      setScore,
      exportSCORMData,
      importSCORMData
    }}>
      {children}
    </SCORMContext.Provider>
  );
};

export const useSCORM = () => {
  const context = useContext(SCORMContext);
  if (!context) {
    throw new Error('useSCORM must be used within a SCORMProvider');
  }
  return context;
};