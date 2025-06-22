import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Clock, 
  BookOpen, 
  Award,
  X,
  Maximize2,
  FileText,
  Video,
  Image,
  Settings
} from 'lucide-react';

interface CourseModule {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'video' | 'image' | 'quiz' | 'h5p' | 'scorm';
  content: string;
  duration?: number;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: CourseModule[];
  totalDuration: number;
  category: string;
}

interface CoursePreviewProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

const moduleIcons = {
  text: FileText,
  video: Video,
  image: Image,
  quiz: Settings,
  h5p: Settings,
  scorm: Settings
};

const moduleColors = {
  text: 'bg-blue-500',
  video: 'bg-green-500',
  image: 'bg-purple-500',
  quiz: 'bg-orange-500',
  h5p: 'bg-indigo-500',
  scorm: 'bg-red-500'
};

export default function CoursePreview({ course, isOpen, onClose }: CoursePreviewProps) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [moduleProgress, setModuleProgress] = useState<{ [key: string]: number }>({});

  const currentModule = course.modules[currentModuleIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentModule) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            handleNextModule();
            return 0;
          }
          return newProgress;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentModuleIndex]);

  const handleNextModule = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      setModuleProgress(prev => ({
        ...prev,
        [currentModule.id]: 100
      }));
      setCurrentModuleIndex(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      setProgress(100);
    }
  };

  const handlePrevModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleModuleSelect = (index: number) => {
    setCurrentModuleIndex(index);
    setProgress(0);
    setIsPlaying(false);
  };

  const getModuleProgress = (moduleId: string) => {
    if (moduleId === currentModule?.id) return progress;
    return moduleProgress[moduleId] || 0;
  };

  const calculateOverallProgress = () => {
    const totalModules = course.modules.length;
    const completedModules = Object.keys(moduleProgress).length;
    const currentProgress = currentModule ? progress / 100 : 0;
    return ((completedModules + currentProgress) / totalModules) * 100;
  };

  if (!isOpen || !course.modules.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sagardoy-navy to-sagardoy-blue text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                >
                  <BookOpen className="h-8 w-8" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold">{course.title}</h2>
                  <p className="text-blue-100 mt-1">{course.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-100">Progreso del curso</span>
                <span className="text-sm text-blue-100">
                  {Math.round(calculateOverallProgress())}%
                </span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="bg-white bg-opacity-20 rounded-full h-2"
              >
                <motion.div
                  className="bg-sagardoy-gold h-2 rounded-full"
                  style={{ width: `${calculateOverallProgress()}%` }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </div>
          </div>

          <div className="flex h-[70vh]">
            {/* Module List Sidebar */}
            <div className="w-1/3 bg-gray-50 border-r overflow-y-auto">
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Award className="mr-2 h-5 w-5 text-sagardoy-gold" />
                  Módulos del Curso
                </h3>
                <div className="space-y-2">
                  {course.modules.map((module, index) => {
                    const Icon = moduleIcons[module.type];
                    const isActive = index === currentModuleIndex;
                    const progress = getModuleProgress(module.id);
                    const isCompleted = progress === 100;

                    return (
                      <motion.div
                        key={module.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 ${
                            isActive
                              ? 'ring-2 ring-sagardoy-blue shadow-md'
                              : 'hover:shadow-sm'
                          } ${isCompleted ? 'bg-green-50' : ''}`}
                          onClick={() => handleModuleSelect(index)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${moduleColors[module.type]}`}>
                                <Icon className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium text-sm truncate">
                                    {module.title}
                                  </h4>
                                  <span className="text-xs text-gray-500">
                                    #{index + 1}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                  {module.description}
                                </p>
                                
                                {/* Module Progress */}
                                <div className="space-y-1">
                                  <div className="bg-gray-200 rounded-full h-1.5">
                                    <motion.div
                                      className={`h-1.5 rounded-full ${
                                        isCompleted ? 'bg-green-500' : 'bg-sagardoy-blue'
                                      }`}
                                      style={{ width: `${progress}%` }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{Math.round(progress)}%</span>
                                    {module.duration && (
                                      <span className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {module.duration}min
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {currentModule && (
                <>
                  {/* Module Content */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <motion.div
                      key={currentModule.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg ${moduleColors[currentModule.type]}`}>
                            {React.createElement(moduleIcons[currentModule.type], {
                              className: "h-6 w-6 text-white"
                            })}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{currentModule.title}</h3>
                            <p className="text-gray-600">{currentModule.description}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-sm">
                          Módulo {currentModuleIndex + 1} de {course.modules.length}
                        </Badge>
                      </div>

                      {/* Content Preview */}
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="bg-gray-50 rounded-lg p-6 mb-6"
                      >
                        {currentModule.type === 'video' && (
                          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center mb-4">
                            <motion.div
                              animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
                              transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
                            >
                              <Play className="h-12 w-12 text-white opacity-80" />
                            </motion.div>
                          </div>
                        )}
                        
                        {currentModule.type === 'image' && (
                          <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-4">
                            <Image className="h-12 w-12 text-purple-600 opacity-80" />
                          </div>
                        )}
                        
                        {currentModule.type === 'quiz' && (
                          <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg p-6 mb-4">
                            <div className="flex items-center justify-center">
                              <Settings className="h-12 w-12 text-orange-600 opacity-80" />
                            </div>
                          </div>
                        )}

                        <div className="prose max-w-none">
                          <p className="text-gray-700 leading-relaxed">
                            {currentModule.content || "Contenido del módulo..."}
                          </p>
                        </div>
                      </motion.div>

                      {/* Module Progress */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progreso del módulo</span>
                          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Controls */}
                  <div className="border-t bg-white p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevModule}
                          disabled={currentModuleIndex === 0}
                        >
                          <SkipBack className="h-4 w-4 mr-1" />
                          Anterior
                        </Button>
                        
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="bg-sagardoy-blue hover:bg-blue-700"
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4 mr-1" />
                          ) : (
                            <Play className="h-4 w-4 mr-1" />
                          )}
                          {isPlaying ? 'Pausar' : 'Reproducir'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextModule}
                          disabled={currentModuleIndex === course.modules.length - 1}
                        >
                          Siguiente
                          <SkipForward className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {currentModule.duration && (
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {currentModule.duration} minutos
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}