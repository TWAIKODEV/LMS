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
import SCORMVideoPlayer from './SCORMVideoPlayer';
import SCORMDocumentViewer from './SCORMDocumentViewer';
import SCORMQuiz from './SCORMQuiz';

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
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        isActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => selectModule(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getModuleColor(module.type)}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{module.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {module.duration} min • {module.interactions} interacciones
                          </p>
                          <div className="mt-2">
                            <Progress value={module.score} className="h-1" />
                            <p className="text-xs text-gray-500 mt-1">
                              {module.score}% • {module.completed ? 'Completado' : 'En progreso'}
                            </p>
                          </div>
                        </div>
                        {module.completed && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Módulo: {currentModule?.title}</span>
                  <div className="flex space-x-2">
                    <Button
                      onClick={isPlaying ? pauseCourse : startCourse}
                      variant={isPlaying ? "destructive" : "default"}
                      size="sm"
                    >
                      {isPlaying ? (
                        <>
                          <PauseCircle className="mr-2 h-4 w-4" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Iniciar
                        </>
                      )}
                    </Button>
                    <Button onClick={nextModule} variant="outline" size="sm">
                      Siguiente Módulo
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentModule && (
                  <motion.div
                    key={currentModule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-gray-100 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">{currentModule.title}</h3>
                      <p className="text-gray-600 mb-4">{currentModule.content}</p>
                      
                      {/* Video Content with SCORM Tracking */}
                      {currentModule.type === 'video' && (
                        <div className="mt-4">
                          <SCORMVideoPlayer 
                            module={{
                              id: currentModule.id,
                              title: currentModule.title,
                              videoUrl: "/api/placeholder/video.mp4",
                              duration: currentModule.duration * 60,
                              objectives: [
                                "Comprender las nuevas modalidades de contratación digital",
                                "Identificar los derechos y obligaciones en el teletrabajo",
                                "Analizar la normativa aplicable a contratos remotos"
                              ]
                            }}
                            onProgress={(progress) => {
                              setCourseData(prev => ({
                                ...prev,
                                modules: prev.modules.map(mod => 
                                  mod.id === currentModule.id 
                                    ? { ...mod, score: progress, completed: progress >= 90 }
                                    : mod
                                )
                              }));
                            }}
                            onComplete={() => {
                              recordInteraction({
                                id: `video_complete_${currentModule.id}`,
                                type: 'performance',
                                learner_response: 'video_completed',
                                result: 'correct',
                                weighting: 1,
                                correct_responses: ['completed'],
                                latency: '00:00:01'
                              });
                            }}
                          />
                        </div>
                      )}

                      {/* Document Content with SCORM Tracking */}
                      {currentModule.type === 'scorm' && (
                        <div className="mt-4">
                          <SCORMDocumentViewer 
                            module={{
                              id: currentModule.id,
                              title: currentModule.title,
                              content: `# Legislación Laboral Actualizada

## 1. Marco Normativo Digital

La evolución del derecho laboral en la era digital ha introducido nuevos paradigmas que requieren una comprensión profunda de las normativas actuales.

### 1.1 Teletrabajo y Trabajo Remoto

El Real Decreto-ley 28/2020 estableció el marco regulatorio para el trabajo a distancia, definiendo:

- **Derechos del trabajador**: Equipamiento, formación y flexibilidad horaria
- **Obligaciones del empleador**: Seguridad digital, prevención de riesgos laborales
- **Modalidades contractuales**: Presencial, remoto y mixto

### 1.2 Nuevas Tecnologías en el Ámbito Laboral

La implementación de sistemas de seguimiento digital debe cumplir con:

- Ley Orgánica 3/2018 de Protección de Datos
- Convenios colectivos sectoriales
- Principios de proporcionalidad y transparencia

## 2. Casos Prácticos

### Caso 1: Implementación de Software de Monitoreo

Una empresa desea implementar software de seguimiento de productividad. Consideraciones legales:

1. **Información previa**: Los trabajadores deben ser informados
2. **Finalidad específica**: El monitoreo debe tener un propósito legítimo
3. **Proporcionalidad**: Las medidas no pueden ser excesivas

### Caso 2: Derechos Digitales del Trabajador

Los trabajadores tienen derecho a:

- Desconexión digital fuera del horario laboral
- Formación en competencias digitales
- Protección de sus datos personales

## 3. Jurisprudencia Relevante

- STS 2156/2021: Límites del control empresarial digital
- STC 89/2020: Derechos fundamentales en el trabajo remoto
- STEDH 12/2021: Privacidad en comunicaciones laborales

## 4. Tendencias Futuras

El derecho laboral digital evoluciona hacia:

- Mayor protección de la intimidad digital
- Regulación específica de la inteligencia artificial en RRHH
- Armonización europea de normativas laborales digitales

---

*Este documento forma parte del curso "Derecho Laboral Avanzado" con seguimiento SCORM completo.*`,
                              type: 'html',
                              pages: 4,
                              estimatedReadingTime: 8,
                              keywords: ["Teletrabajo", "RGPD", "Derechos Digitales", "Legislación Laboral"]
                            }}
                            onProgress={(progress) => {
                              setCourseData(prev => ({
                                ...prev,
                                modules: prev.modules.map(mod => 
                                  mod.id === currentModule.id 
                                    ? { ...mod, score: progress, completed: progress >= 95 }
                                    : mod
                                )
                              }));
                            }}
                            onComplete={() => {
                              recordInteraction({
                                id: `document_complete_${currentModule.id}`,
                                type: 'performance',
                                learner_response: 'document_read',
                                result: 'correct',
                                weighting: 1,
                                correct_responses: ['completed'],
                                latency: '00:08:00'
                              });
                            }}
                          />
                        </div>
                      )}

                      {/* Assessment with SCORM Tracking */}
                      {currentModule.type === 'assessment' && (
                        <div className="mt-4">
                          <SCORMQuiz 
                            module={{
                              id: currentModule.id,
                              title: currentModule.title,
                              description: "Evaluación final del curso con seguimiento SCORM completo",
                              timeLimit: 20,
                              passingScore: 75,
                              maxAttempts: 3,
                              questions: [
                                {
                                  id: "q1",
                                  type: "multiple-choice",
                                  question: "¿Cuál es el marco normativo principal que regula el teletrabajo en España?",
                                  options: [
                                    "Real Decreto-ley 28/2020",
                                    "Ley Orgánica 3/2018",
                                    "Estatuto de los Trabajadores",
                                    "Convenio OIT 177"
                                  ],
                                  correctAnswers: ["Real Decreto-ley 28/2020"],
                                  explanation: "El RDL 28/2020 estableció el marco específico para el trabajo a distancia en España.",
                                  points: 25
                                },
                                {
                                  id: "q2",
                                  type: "multiple-select",
                                  question: "¿Qué derechos tienen los trabajadores en modalidad de teletrabajo? (Selecciona todas las correctas)",
                                  options: [
                                    "Equipamiento adecuado",
                                    "Formación digital",
                                    "Desconexión digital",
                                    "Reducción salarial proporcional"
                                  ],
                                  correctAnswers: ["Equipamiento adecuado", "Formación digital", "Desconexión digital"],
                                  explanation: "Los trabajadores no pueden sufrir reducción salarial por trabajar remotamente.",
                                  points: 25
                                },
                                {
                                  id: "q3",
                                  type: "true-false",
                                  question: "Las empresas pueden implementar software de monitoreo sin informar a los trabajadores.",
                                  correctAnswers: ["Falso"],
                                  explanation: "Es obligatorio informar previamente a los trabajadores sobre cualquier sistema de monitoreo.",
                                  points: 25
                                },
                                {
                                  id: "q4",
                                  type: "multiple-choice",
                                  question: "¿Qué principio debe regir la implementación de tecnologías de seguimiento laboral?",
                                  options: [
                                    "Máxima eficiencia",
                                    "Proporcionalidad",
                                    "Control total",
                                    "Rentabilidad económica"
                                  ],
                                  correctAnswers: ["Proporcionalidad"],
                                  explanation: "El principio de proporcionalidad es fundamental en la protección de datos laborales.",
                                  points: 25
                                }
                              ]
                            }}
                            onComplete={(score, passed) => {
                              setCourseData(prev => ({
                                ...prev,
                                modules: prev.modules.map(mod => 
                                  mod.id === currentModule.id 
                                    ? { ...mod, score, completed: passed }
                                    : mod
                                )
                              }));
                              if (passed) {
                                recordInteraction({
                                  id: `assessment_passed_${currentModule.id}`,
                                  type: 'performance',
                                  learner_response: `final_score_${score}`,
                                  result: 'correct',
                                  weighting: 1,
                                  correct_responses: ['75'],
                                  latency: '00:20:00'
                                });
                              }
                            }}
                          />
                        </div>
                      )}

                      {/* Embedded H5P Content */}
                      {currentModule.type === 'h5p' && (
                        <div className="mt-4">
                          <H5PIntegration 
                            moduleId={currentModule.id}
                            onProgressUpdate={(progress) => {
                              setCourseData(prev => ({
                                ...prev,
                                modules: prev.modules.map(mod => 
                                  mod.id === currentModule.id 
                                    ? { ...mod, score: progress, completed: progress >= 80 }
                                    : mod
                                )
                              }));
                            }}
                          />
                        </div>
                      )}

                      {/* Introduction Content */}
                      {currentModule.type === 'intro' && (
                        <div className="mt-4 p-6 bg-gradient-to-r from-sagardoy-blue/10 to-sagardoy-gold/10 rounded-lg">
                          <h3 className="text-xl font-bold text-sagardoy-navy mb-4">Bienvenido al Curso de Derecho Laboral Avanzado</h3>
                          <div className="space-y-4 text-gray-700">
                            <p>
                              Este curso interactivo le proporcionará una comprensión completa de las últimas tendencias 
                              en derecho laboral digital, con un enfoque especial en el teletrabajo y las nuevas tecnologías.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h4 className="font-semibold text-sagardoy-navy mb-2">Objetivos del Curso</h4>
                                <ul className="text-sm space-y-1">
                                  <li>• Dominar la legislación laboral digital actual</li>
                                  <li>• Aplicar normativas en casos prácticos</li>
                                  <li>• Evaluar derechos y obligaciones digitales</li>
                                  <li>• Analizar jurisprudencia relevante</li>
                                </ul>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h4 className="font-semibold text-sagardoy-navy mb-2">Seguimiento SCORM</h4>
                                <ul className="text-sm space-y-1">
                                  <li>• Progreso en tiempo real</li>
                                  <li>• Evaluaciones interactivas</li>
                                  <li>• Certificación automática</li>
                                  <li>• Reportes detallados</li>
                                </ul>
                              </div>
                            </div>
                            <Button 
                              onClick={() => {
                                setCourseData(prev => ({
                                  ...prev,
                                  modules: prev.modules.map(mod => 
                                    mod.id === currentModule.id 
                                      ? { ...mod, score: 100, completed: true }
                                      : mod
                                  )
                                }));
                                updateProgress(currentModule.id, 100);
                                recordInteraction({
                                  id: `intro_complete_${currentModule.id}`,
                                  type: 'choice',
                                  learner_response: 'introduction_completed',
                                  result: 'correct',
                                  weighting: 1,
                                  correct_responses: ['completed'],
                                  latency: '00:02:00'
                                });
                              }}
                              className="bg-sagardoy-blue hover:bg-sagardoy-navy"
                            >
                              Marcar Introducción como Completada
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Progress Bar for current module */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progreso del módulo</span>
                          <span>{currentModule.score}%</span>
                        </div>
                        <Progress value={currentModule.score} className="h-2" />
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