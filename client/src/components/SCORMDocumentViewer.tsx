import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Eye, 
  Download,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useSCORM } from './SCORMTracker';

interface DocumentModule {
  id: string;
  title: string;
  content: string;
  type: 'pdf' | 'html' | 'text';
  pages?: number;
  estimatedReadingTime: number;
  keywords: string[];
}

interface SCORMDocumentViewerProps {
  module: DocumentModule;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export default function SCORMDocumentViewer({ module, onProgress, onComplete }: SCORMDocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [readingProgress, setReadingProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const { updateProgress, recordInteraction, setLessonStatus, setScore } = useSCORM();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (hasStarted && !isCompleted) {
      interval = setInterval(() => {
        setTimeSpent(prev => {
          const newTime = prev + 1;
          
          // Calculate reading progress based on time spent vs estimated reading time
          const progress = Math.min((newTime / (module.estimatedReadingTime * 60)) * 100, 100);
          setReadingProgress(progress);
          
          // Update SCORM progress
          updateProgress(module.id, progress);
          onProgress?.(progress);
          
          // Record reading interaction every 30 seconds
          if (newTime % 30 === 0) {
            recordInteraction({
              id: `document_${module.id}_${Date.now()}`,
              type: 'performance',
              learner_response: `reading_time_${newTime}s`,
              result: 'neutral',
              weighting: 1,
              correct_responses: [`${module.estimatedReadingTime * 60}s`],
              latency: '00:00:30'
            });
          }
          
          // Mark as completed when reading time reaches estimated time
          if (progress >= 95 && !isCompleted) {
            setLessonStatus('completed');
            setScore(100);
            setIsCompleted(true);
            onComplete?.();
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hasStarted, isCompleted, module.estimatedReadingTime, module.id, updateProgress, recordInteraction, setLessonStatus, setScore, onProgress, onComplete]);

  const startReading = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setLessonStatus('incomplete');
      
      recordInteraction({
        id: `document_start_${module.id}`,
        type: 'choice',
        learner_response: 'started_reading',
        result: 'correct',
        weighting: 1,
        correct_responses: ['started_reading'],
        latency: '00:00:01'
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (module.pages && newPage >= 1 && newPage <= module.pages) {
      setCurrentPage(newPage);
      
      // Calculate progress based on page viewed
      const pageProgress = (newPage / module.pages) * 100;
      if (pageProgress > readingProgress) {
        setReadingProgress(pageProgress);
        updateProgress(module.id, pageProgress);
        onProgress?.(pageProgress);
      }
      
      recordInteraction({
        id: `page_view_${module.id}_${newPage}`,
        type: 'choice',
        learner_response: `viewed_page_${newPage}`,
        result: 'correct',
        weighting: 1,
        correct_responses: [`page_${newPage}`],
        latency: '00:00:01'
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPercent = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setScrollPosition(scrollPercent);
    
    if (scrollPercent > readingProgress) {
      setReadingProgress(scrollPercent);
      updateProgress(module.id, scrollPercent);
      onProgress?.(scrollPercent);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadDocument = () => {
    recordInteraction({
      id: `download_${module.id}`,
      type: 'choice',
      learner_response: 'downloaded_document',
      result: 'correct',
      weighting: 1,
      correct_responses: ['downloaded'],
      latency: '00:00:01'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {module.title}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isCompleted ? "default" : "secondary"}>
              {isCompleted ? "Completado" : "En progreso"}
            </Badge>
            {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Document Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-sagardoy-navy">{Math.round(readingProgress)}%</div>
            <div className="text-sm text-gray-600">Progreso</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-sagardoy-navy">{formatTime(timeSpent)}</div>
            <div className="text-sm text-gray-600">Tiempo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-sagardoy-navy">{module.estimatedReadingTime}min</div>
            <div className="text-sm text-gray-600">Estimado</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-sagardoy-navy">{module.pages || 1}</div>
            <div className="text-sm text-gray-600">Páginas</div>
          </div>
        </div>

        {/* Reading Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso de lectura</span>
            <span className="text-sm text-gray-500">{Math.round(readingProgress)}%</span>
          </div>
          <Progress value={readingProgress} className="h-2" />
        </div>

        {/* Document Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!hasStarted ? (
              <Button onClick={startReading} className="bg-sagardoy-blue hover:bg-sagardoy-navy">
                <BookOpen className="w-4 h-4 mr-2" />
                Comenzar lectura
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Leyendo...</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={downloadDocument}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Document Viewer */}
        <div 
          className="border rounded-lg h-96 overflow-auto bg-white"
          onScroll={handleScroll}
          style={{ fontSize: `${zoom}%` }}
        >
          <div className="p-6">
            {module.type === 'html' ? (
              <div dangerouslySetInnerHTML={{ __html: module.content }} />
            ) : (
              <div className="whitespace-pre-wrap font-serif leading-relaxed">
                {module.content}
              </div>
            )}
          </div>
        </div>

        {/* Page Navigation (for multi-page documents) */}
        {module.pages && module.pages > 1 && (
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Anterior
            </Button>
            
            <span className="text-sm">
              Página {currentPage} de {module.pages}
            </span>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === module.pages}
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Keywords */}
        {module.keywords && module.keywords.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Palabras clave:</h4>
            <div className="flex flex-wrap gap-2">
              {module.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* SCORM Status */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Tiempo: {formatTime(timeSpent)}</span>
          </div>
          <span>Estado SCORM: {isCompleted ? 'Completado' : hasStarted ? 'En progreso' : 'No iniciado'}</span>
        </div>
      </CardContent>
    </Card>
  );
}