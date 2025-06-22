import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  PlayCircle, 
  PauseCircle, 
  CheckCircle, 
  BookOpen, 
  Video, 
  Settings, 
  Award,
  TrendingUp,
  Clock,
  Users,
  BarChart3,
  Download
} from 'lucide-react';
import { SCORMProvider, useSCORM } from './SCORMTracker';
import H5PIntegration from './H5PIntegration';

interface DemoModule {
  id: string;
  title: string;
  type: 'intro' | 'video' | 'h5p' | 'scorm' | 'assessment';
  duration: number;
  content: string;
  completed: boolean;
  score: number;
  interactions: number;
}

const DEMO_COURSE = {
  title: "Derecho Laboral Avanzado - Curso Interactivo",
  description: "Curso completo con seguimiento SCORM y contenido H5P interactivo",
  category: "Derecho Laboral",
  modules: [
    {
      id: "intro-1",
      title: "Introducción al Derecho Laboral Digital",
      type: "intro" as const,
      duration: 15,
      content: "Bienvenida y objetivos del curso",
      completed: false,
      score: 0,
      interactions: 0
    },
    {
      id: "video-1", 
      title: "Nuevas Tendencias en Contratos Laborales",
      type: "video" as const,
      duration: 25,
      content: "Video interactivo con preguntas integradas",
      completed: false,
      score: 0,
      interactions: 0
    },
    {
      id: "h5p-1",
      title: "Casos Prácticos Interactivos",
      type: "h5p" as const,
      duration: 30,
      content: "Simulación de casos reales con H5P",
      completed: false,
      score: 0,
      interactions: 0
    },
    {
      id: "scorm-1",
      title: "Módulo SCORM: Legislación Actualizada",
      type: "scorm" as const,
      duration: 40,
      content: "Paquete SCORM completo con seguimiento",
      completed: false,
      score: 0,
      interactions: 0
    },
    {
      id: "assessment-1",
      title: "Evaluación Final",
      type: "assessment" as const,
      duration: 20,
      content: "Evaluación con seguimiento SCORM completo",
      completed: false,
      score: 0,
      interactions: 0
    }
  ]
};

function DemoCourseContent() {
  const { data: scormData, updateProgress, setScore, recordInteraction } = useSCORM();
  const [courseData, setCourseData] = useState(DEMO_COURSE);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const currentModule = courseData.modules[currentModuleIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        
        // Simular progreso del módulo actual
        setCourseData(prev => ({
          ...prev,
          modules: prev.modules.map((module, index) => {
            if (index === currentModuleIndex) {
              const newScore = Math.min(module.score + 2, 100);
              const newInteractions = module.interactions + 1;
              const isCompleted = newScore >= 80;

              // Registrar interacción SCORM
              recordInteraction({
                id: `${module.id}_interaction_${newInteractions}`,
                type: 'choice',
                learner_response: `progress_${newScore}`,
                result: isCompleted ? 'correct' : 'neutral',
                weighting: 1,
                latency: '00:00:01',
                correct_responses: ['completed']
              });

              // Actualizar progreso SCORM
              updateProgress(module.id, newScore);
              setScore(newScore);

              return {
                ...module,
                score: newScore,
                interactions: newInteractions,
                completed: isCompleted
              };
            }
            return module;
          })
        }));
      }, 1500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentModuleIndex, recordInteraction, updateProgress, setScore]);

  const startCourse = () => {
    setIsPlaying(true);
  };

  const pauseCourse = () => {
    setIsPlaying(false);
  };

  const nextModule = () => {
    if (currentModuleIndex < courseData.modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1);
      setIsPlaying(false);
    }
  };

  const selectModule = (index: number) => {
    setCurrentModuleIndex(index);
    setIsPlaying(false);
  };

  const resetDemo = () => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(module => ({
        ...module,
        completed: false,
        score: 0,
        interactions: 0
      }))
    }));
    setCurrentModuleIndex(0);
    setIsPlaying(false);
    setSessionTime(0);
  };

  const exportProgressData = () => {
    const progressData = {
      course: courseData,
      scormData,
      sessionTime: formatTime(sessionTime),
      totalProgress: Math.round(courseData.modules.reduce((acc, mod) => acc + mod.score, 0) / courseData.modules.length),
      completedModules: courseData.modules.filter(mod => mod.completed).length,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(progressData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demo_course_progress_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'intro': return BookOpen;
      case 'video': return Video;
      case 'h5p': return Settings;
      case 'scorm': return Award;
      case 'assessment': return BarChart3;
      default: return BookOpen;
    }
  };

  const getModuleColor = (type: string) => {
    switch (type) {
      case 'intro': return 'bg-blue-500';
      case 'video': return 'bg-green-500';
      case 'h5p': return 'bg-indigo-500';
      case 'scorm': return 'bg-red-500';
      case 'assessment': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const overallProgress = Math.round(courseData.modules.reduce((acc, mod) => acc + mod.score, 0) / courseData.modules.length);
  const completedModules = courseData.modules.filter(mod => mod.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{courseData.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{courseData.description}</p>
            <Badge variant="secondary" className="text-lg px-4 py-2">{courseData.category}</Badge>
          </div>
        </motion.div>

        {/* Overall Progress Dashboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <TrendingUp className="mr-2 h-6 w-6" />
                  Panel de Seguimiento SCORM
                </span>
                <div className="flex space-x-2">
                  <Button onClick={exportProgressData} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Datos
                  </Button>
                  <Button onClick={resetDemo} variant="outline" size="sm">
                    Reiniciar Demo
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <motion.div 
                  className="bg-blue-50 p-6 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-blue-600">Progreso General</h3>
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-blue-900 mb-2">{overallProgress}%</p>
                  <Progress value={overallProgress} className="h-2" />
                </motion.div>

                <motion.div 
                  className="bg-green-50 p-6 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-green-600">Módulos Completados</h3>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-green-900">{completedModules}/{courseData.modules.length}</p>
                  <Progress value={(completedModules / courseData.modules.length) * 100} className="h-2" />
                </motion.div>

                <motion.div 
                  className="bg-purple-50 p-6 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-purple-600">Tiempo de Sesión</h3>
                    <Clock className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold text-purple-900">{formatTime(sessionTime)}</p>
                </motion.div>

                <motion.div 
                  className="bg-orange-50 p-6 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-orange-600">Interacciones SCORM</h3>
                    <Users className="h-5 w-5 text-orange-500" />
                  </div>
                  <p className="text-3xl font-bold text-orange-900">{scormData.interactions.length}</p>
                </motion.div>
              </div>

              {/* Session Info */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Información de Sesión SCORM</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <span className="ml-2 font-medium capitalize">{scormData.lessonStatus.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tiempo Total:</span>
                    <span className="ml-2 font-medium">{scormData.sessionTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Puntuación:</span>
                    <span className="ml-2 font-medium">{scormData.score.raw}/100</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ubicación Actual:</span>
                    <span className="ml-2 font-medium">{scormData.location || currentModule?.id}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Módulos del Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {courseData.modules.map((module, index) => {
                  const Icon = getModuleIcon(module.type);
                  const isActive = index === currentModuleIndex;
                  
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all ${
                          isActive ? 'ring-2 ring-sagardoy-blue shadow-md' : 'hover:shadow-sm'
                        } ${module.completed ? 'bg-green-50' : ''}`}
                        onClick={() => selectModule(index)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${getModuleColor(module.type)}`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-sm truncate">{module.title}</h4>
                                {module.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{module.duration} minutos</p>
                              
                              <div className="space-y-1">
                                <div className="bg-gray-200 rounded-full h-1.5">
                                  <motion.div
                                    className={`h-1.5 rounded-full ${
                                      module.completed ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${module.score}%` }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>{module.score}%</span>
                                  <span>{module.interactions} interacciones</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentModule?.title}</span>
                  <Badge variant={currentModule?.completed ? "default" : "secondary"}>
                    Módulo {currentModuleIndex + 1}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentModule && (
                  <motion.div
                    key={currentModule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Module Content */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-gray-700 mb-4">{currentModule.content}</p>
                      
                      {/* H5P Integration for H5P modules */}
                      {currentModule.type === 'h5p' && (
                        <div className="mt-4">
                          <H5PIntegration 
                            moduleId={currentModule.id}
                            onProgressUpdate={(progress) => console.log(`H5P Progress: ${progress}%`)}
                            onScoreUpdate={(score) => console.log(`H5P Score: ${score}`)}
                          />
                        </div>
                      )}
                      
                      {/* SCORM Simulation */}
                      {currentModule.type === 'scorm' && (
                        <div className="mt-4 p-4 bg-red-50 rounded-lg">
                          <h4 className="font-semibold mb-2">Simulación de Paquete SCORM</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Este módulo simula un paquete SCORM real con seguimiento completo de actividades.
                          </p>
                          <div className="flex space-x-2">
                            <Badge variant="outline">API SCORM 1.2</Badge>
                            <Badge variant="outline">xAPI Compatible</Badge>
                            <Badge variant="outline">Seguimiento Completo</Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress for current module */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progreso del módulo</span>
                        <span className="text-sm text-gray-600">{currentModule.score}%</span>
                      </div>
                      <Progress value={currentModule.score} className="h-3" />
                    </div>

                    {/* Controls */}
                    <div className="flex justify-between items-center">
                      <div className="space-x-2">
                        <Button
                          onClick={isPlaying ? pauseCourse : startCourse}
                          variant={isPlaying ? "destructive" : "default"}
                        >
                          {isPlaying ? (
                            <>
                              <PauseCircle className="mr-2 h-4 w-4" />
                              Pausar
                            </>
                          ) : (
                            <>
                              <PlayCircle className="mr-2 h-4 w-4" />
                              {currentModule.score > 0 ? 'Continuar' : 'Iniciar'}
                            </>
                          )}
                        </Button>
                        
                        {currentModule.completed && (
                          <Button onClick={nextModule} variant="outline">
                            Siguiente Módulo
                          </Button>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {currentModule.interactions} interacciones registradas
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoCourseBuilder() {
  return (
    <SCORMProvider>
      <DemoCourseContent />
    </SCORMProvider>
  );
}