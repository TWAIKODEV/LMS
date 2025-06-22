import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  TrendingUp,
  Award,
  BarChart3,
  PlayCircle,
  Users
} from 'lucide-react';
import { useSCORM } from './SCORMTracker';

interface H5PContent {
  id: string;
  type: 'interactive-video' | 'course-presentation' | 'interactive-book' | 'quiz' | 'timeline' | 'image-hotspots';
  title: string;
  description: string;
  content: string;
  parameters: {
    [key: string]: any;
  };
  tracking: {
    completion: number;
    score: number;
    timeSpent: number;
    attempts: number;
    interactions: Array<{
      timestamp: string;
      action: string;
      result: any;
    }>;
  };
}

interface H5PIntegrationProps {
  moduleId: string;
  onProgressUpdate?: (progress: number) => void;
  onScoreUpdate?: (score: number) => void;
}

const H5P_CONTENT_TYPES = [
  { type: 'interactive-video', label: 'Video Interactivo', icon: PlayCircle, description: 'Videos con preguntas y actividades integradas' },
  { type: 'course-presentation', label: 'Presentación de Curso', icon: BookOpen, description: 'Presentaciones interactivas con navegación' },
  { type: 'interactive-book', label: 'Libro Interactivo', icon: Users, description: 'Libros digitales con elementos interactivos' },
  { type: 'quiz', label: 'Evaluación', icon: Target, description: 'Cuestionarios y evaluaciones' },
  { type: 'timeline', label: 'Línea de Tiempo', icon: Clock, description: 'Cronologías interactivas' },
  { type: 'image-hotspots', label: 'Imagen con Puntos Calientes', icon: Award, description: 'Imágenes con zonas interactivas' }
];

export default function H5PIntegration({ moduleId, onProgressUpdate, onScoreUpdate }: H5PIntegrationProps) {
  const { data: scormData, recordInteraction, setScore, updateProgress } = useSCORM();
  const [content, setContent] = useState<H5PContent>({
    id: moduleId,
    type: 'quiz',
    title: 'Nuevo Contenido H5P',
    description: '',
    content: '',
    parameters: {},
    tracking: {
      completion: 0,
      score: 0,
      timeSpent: 0,
      attempts: 0,
      interactions: []
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<string>('quiz');
  const [simulationRunning, setSimulationRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simulationRunning) {
      interval = setInterval(() => {
        setContent(prev => {
          const newCompletion = Math.min(prev.tracking.completion + 5, 100);
          const newScore = Math.min(prev.tracking.score + 2, 100);
          const newTimeSpent = prev.tracking.timeSpent + 1;

          // Record SCORM interaction
          recordInteraction({
            id: `${moduleId}_${Date.now()}`,
            type: 'choice',
            learner_response: 'simulation_progress',
            result: newCompletion >= 100 ? 'correct' : 'neutral',
            weighting: 1,
            latency: '00:00:01',
            correct_responses: ['completed']
          });

          // Update SCORM progress
          updateProgress(moduleId, newCompletion);
          if (newScore > prev.tracking.score) {
            setScore(newScore);
          }

          // Notify parent components
          onProgressUpdate?.(newCompletion);
          onScoreUpdate?.(newScore);

          return {
            ...prev,
            tracking: {
              ...prev.tracking,
              completion: newCompletion,
              score: newScore,
              timeSpent: newTimeSpent,
              interactions: [
                ...prev.tracking.interactions,
                {
                  timestamp: new Date().toISOString(),
                  action: 'progress_update',
                  result: { completion: newCompletion, score: newScore }
                }
              ]
            }
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simulationRunning, moduleId, recordInteraction, updateProgress, setScore, onProgressUpdate, onScoreUpdate]);

  const handleContentTypeChange = (type: string) => {
    setSelectedContentType(type);
    const contentType = H5P_CONTENT_TYPES.find(ct => ct.type === type);
    setContent(prev => ({
      ...prev,
      type: type as any,
      title: contentType?.label || 'Nuevo Contenido H5P',
      parameters: getDefaultParameters(type)
    }));
  };

  const getDefaultParameters = (type: string) => {
    switch (type) {
      case 'interactive-video':
        return {
          video: { url: '', startTime: 0, endTime: 0 },
          interactions: [],
          summary: { displayAt: 3 }
        };
      case 'course-presentation':
        return {
          slides: [],
          globalBackgroundSelector: {},
          override: { activeSurface: false, hideSummary: false }
        };
      case 'quiz':
        return {
          questions: [],
          poolSize: 10,
          endGame: { showResultPage: true, showSolutionButton: true },
          override: { checkButton: true }
        };
      case 'timeline':
        return {
          timeline: { headlines: [], events: [] },
          behaviour: { startSlide: 0 }
        };
      case 'image-hotspots':
        return {
          image: { path: '' },
          hotspots: [],
          iconType: 'icon'
        };
      default:
        return {};
    }
  };

  const simulateUserInteraction = () => {
    setSimulationRunning(!simulationRunning);
    
    if (!simulationRunning) {
      setContent(prev => ({
        ...prev,
        tracking: {
          ...prev.tracking,
          attempts: prev.tracking.attempts + 1
        }
      }));
    }
  };

  const resetProgress = () => {
    setContent(prev => ({
      ...prev,
      tracking: {
        completion: 0,
        score: 0,
        timeSpent: 0,
        attempts: 0,
        interactions: []
      }
    }));
    setSimulationRunning(false);
  };

  const exportH5PData = () => {
    const exportData = {
      content,
      scormData,
      xAPIStatements: content.tracking.interactions.map(interaction => ({
        actor: { name: 'Learner', mbox: 'mailto:learner@example.com' },
        verb: { id: 'http://adlnet.gov/expapi/verbs/experienced' },
        object: {
          id: `${content.id}_${interaction.action}`,
          definition: { name: { 'es-ES': interaction.action } }
        },
        timestamp: interaction.timestamp,
        result: interaction.result
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `h5p_scorm_data_${moduleId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const selectedType = H5P_CONTENT_TYPES.find(ct => ct.type === selectedContentType);
  const Icon = selectedType?.icon || BookOpen;

  return (
    <div className="space-y-6">
      {/* Content Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon className="mr-2 h-5 w-5" />
            Configuración H5P + SCORM
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contentType">Tipo de Contenido H5P</Label>
            <Select value={selectedContentType} onValueChange={handleContentTypeChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona el tipo de contenido" />
              </SelectTrigger>
              <SelectContent>
                {H5P_CONTENT_TYPES.map((type) => {
                  const TypeIcon = type.icon;
                  return (
                    <SelectItem key={type.type} value={type.type}>
                      <div className="flex items-center">
                        <TypeIcon className="mr-2 h-4 w-4" />
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Título del Contenido</Label>
            <Input
              id="title"
              value={content.title}
              onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={content.description}
              onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracking Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Panel de Seguimiento SCORM
            </span>
            <Badge variant={content.tracking.completion >= 100 ? "default" : "secondary"}>
              {content.tracking.completion >= 100 ? "Completado" : "En Progreso"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <motion.div 
              className="bg-blue-50 p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Progreso</p>
                  <p className="text-2xl font-bold text-blue-900">{content.tracking.completion}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
              <Progress value={content.tracking.completion} className="mt-2" />
            </motion.div>

            <motion.div 
              className="bg-green-50 p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Puntuación</p>
                  <p className="text-2xl font-bold text-green-900">{content.tracking.score}/100</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
              <Progress value={content.tracking.score} className="mt-2" />
            </motion.div>

            <motion.div 
              className="bg-purple-50 p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Tiempo (min)</p>
                  <p className="text-2xl font-bold text-purple-900">{Math.floor(content.tracking.timeSpent / 60)}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </motion.div>

            <motion.div 
              className="bg-orange-50 p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Intentos</p>
                  <p className="text-2xl font-bold text-orange-900">{content.tracking.attempts}</p>
                </div>
                <Award className="h-8 w-8 text-orange-500" />
              </div>
            </motion.div>
          </div>

          {/* SCORM Session Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">Información de Sesión SCORM</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Estado:</span>
                <span className="ml-2 font-medium">{scormData.lessonStatus}</span>
              </div>
              <div>
                <span className="text-gray-600">Tiempo de Sesión:</span>
                <span className="ml-2 font-medium">{scormData.sessionTime}</span>
              </div>
              <div>
                <span className="text-gray-600">Ubicación:</span>
                <span className="ml-2 font-medium">{scormData.location || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Interacciones:</span>
                <span className="ml-2 font-medium">{scormData.interactions.length}</span>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={simulateUserInteraction}
              variant={simulationRunning ? "destructive" : "default"}
              className="flex items-center"
            >
              {simulationRunning ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Detener Simulación
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Simular Interacción
                </>
              )}
            </Button>

            <Button onClick={resetProgress} variant="outline">
              Reiniciar Progreso
            </Button>

            <Button onClick={exportH5PData} variant="outline">
              Exportar Datos SCORM/xAPI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interaction History */}
      {content.tracking.interactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Interacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {content.tracking.interactions.slice(-10).reverse().map((interaction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">{interaction.action}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(interaction.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {typeof interaction.result === 'object' 
                      ? `${interaction.result.completion}%`
                      : interaction.result
                    }
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}