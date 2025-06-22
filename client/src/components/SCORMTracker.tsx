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

interface StudentProgress {
  id: string;
  studentName: string;
  courseTitle: string;
  sessionTime: string;
  completionStatus: 'incomplete' | 'completed' | 'passed' | 'failed';
  successStatus: 'unknown' | 'passed' | 'failed';
  score: {
    raw: number;
    min: number;
    max: number;
  };
  lastAccessed: string;
  attempts: number;
}

export default function SCORMTracker() {
  const [scormData, setSCORMData] = useState<StudentProgress[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("all");

  useEffect(() => {
    // Datos SCORM desde la base de datos
    const loadSCORMData = async () => {
      try {
        const response = await fetch('/api/scorm/data');
        if (response.ok) {
          const data = await response.json();
          setSCORMData(data);
        } else {
          // Datos de ejemplo si no hay API
          const exampleSCORMData: StudentProgress[] = [
            {
              id: "1",
              studentName: "Juan Pérez",
              courseTitle: "Derecho Laboral Avanzado",
              sessionTime: "02:34:15",
              completionStatus: "incomplete",
              successStatus: "unknown",
              score: { raw: 45, min: 0, max: 100 },
              lastAccessed: new Date().toISOString(),
              attempts: 1
            },
            {
              id: "2",
              studentName: "Juan Pérez",
              courseTitle: "Fundamentos del Derecho Civil",
              sessionTime: "01:15:30",
              completionStatus: "incomplete",
              successStatus: "unknown",
              score: { raw: 20, min: 0, max: 100 },
              lastAccessed: new Date(Date.now() - 86400000).toISOString(),
              attempts: 1
            },
            {
              id: "3",
              studentName: "Juan Pérez",
              courseTitle: "Derecho Mercantil Empresarial",
              sessionTime: "00:00:00",
              completionStatus: "incomplete",
              successStatus: "unknown",
              score: { raw: 0, min: 0, max: 100 },
              lastAccessed: new Date(Date.now() - 172800000).toISOString(),
              attempts: 0
            }
          ];
          setSCORMData(exampleSCORMData);
        }
      } catch (error) {
        console.error('Error loading SCORM data:', error);
      }
    };

    loadSCORMData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800';
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredData = selectedCourse === "all" 
    ? scormData 
    : scormData.filter(item => item.courseTitle.toLowerCase().includes(selectedCourse));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-sagardoy-navy">SCORM Tracking Dashboard</h3>
            <p className="text-sagardoy-gray mt-1">Monitoreo detallado de actividad SCORM y progreso de estudiantes</p>
          </div>
          <div className="flex space-x-3">
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sagardoy-blue"
            >
              <option value="all">Todos los cursos</option>
              <option value="laboral">Derecho Laboral</option>
              <option value="compliance">Compliance</option>
              <option value="mercantil">Derecho Mercantil</option>
            </select>
            <button className="bg-sagardoy-blue text-white px-4 py-2 rounded-lg text-sm hover:bg-sagardoy-navy transition-colors">
              <i className="fas fa-download mr-2"></i>Exportar SCORM
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* SCORM Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-sagardoy-light-gray p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sagardoy-gray">Sesiones Activas</p>
                <p className="text-2xl font-bold text-sagardoy-navy">{scormData.length}</p>
              </div>
              <i className="fas fa-users text-sagardoy-blue text-xl"></i>
            </div>
          </div>
          
          <div className="bg-sagardoy-light-gray p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sagardoy-gray">Completados</p>
                <p className="text-2xl font-bold text-sagardoy-navy">
                  {scormData.filter(d => d.completionStatus === 'completed').length}
                </p>
              </div>
              <i className="fas fa-check-circle text-green-500 text-xl"></i>
            </div>
          </div>
          
          <div className="bg-sagardoy-light-gray p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sagardoy-gray">Puntuación Media</p>
                <p className="text-2xl font-bold text-sagardoy-navy">
                  {scormData.length > 0 ? Math.round(scormData.reduce((acc, d) => acc + d.score.raw, 0) / scormData.length) : 0}%
                </p>
              </div>
              <i className="fas fa-chart-line text-sagardoy-gold text-xl"></i>
            </div>
          </div>
          
          <div className="bg-sagardoy-light-gray p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-sagardoy-gray">Tiempo Total</p>
                <p className="text-2xl font-bold text-sagardoy-navy">24.5h</p>
              </div>
              <i className="fas fa-clock text-sagardoy-gray text-xl"></i>
            </div>
          </div>
        </div>

        {/* SCORM Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sagardoy-navy">Estudiante</th>
                <th className="text-left py-3 px-4 font-semibold text-sagardoy-navy">Curso</th>
                <th className="text-left py-3 px-4 font-semibold text-sagardoy-navy">Tiempo de Sesión</th>
                <th className="text-left py-3 px-4 font-semibold text-sagardoy-navy">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-sagardoy-navy">Puntuación</th>
                <th className="text-left py-3 px-4 font-semibold text-sagardoy-navy">Último Acceso</th>
                <th className="text-left py-3 px-4 font-semibold text-sagardoy-navy">Intentos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-sagardoy-navy">{item.studentName}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-sagardoy-gray">{item.courseTitle}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-mono text-sagardoy-navy">{item.sessionTime}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.completionStatus)}`}>
                        {item.completionStatus}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.successStatus)}`}>
                        {item.successStatus}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-semibold ${getScoreColor(item.score.raw)}`}>
                      {item.score.raw}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-sagardoy-gray">{new Date(item.lastAccessed).toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-sagardoy-blue/10 text-sagardoy-blue px-2 py-1 rounded-full text-xs font-medium">
                      {item.attempts}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SCORM Actions */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-sagardoy-gray">
            Mostrando {filteredData.length} de {scormData.length} registros SCORM
          </div>
          <div className="flex space-x-2">
            <button className="bg-gray-100 text-sagardoy-gray px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
              <i className="fas fa-sync mr-2"></i>Sincronizar
            </button>
            <button className="bg-sagardoy-gold text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors">
              <i className="fas fa-file-export mr-2"></i>Generar Informe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}