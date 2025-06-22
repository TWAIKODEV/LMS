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
  Users,
  Download
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
  moduleId?: string;
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

export default function H5PIntegration({ moduleId = 'h5p-demo', onProgressUpdate, onScoreUpdate }: H5PIntegrationProps) {
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

  const contentTypes = [
    {
      id: 'interactive-video',
      title: 'Video Interactivo',
      description: 'Crea videos con preguntas, botones y elementos interactivos integrados.',
      icon: 'fas fa-video',
      color: 'bg-sagardoy-blue/10 text-sagardoy-blue',
      activeCount: 5
    },
    {
      id: 'interactive-quiz',
      title: 'Quiz Interactivo',
      description: 'Exámenes con imágenes, audio y retroalimentación inmediata.',
      icon: 'fas fa-question-circle',
      color: 'bg-sagardoy-gold/10 text-sagardoy-gold',
      activeCount: 12
    },
    {
      id: 'interactive-image',
      title: 'Imagen Interactiva',
      description: 'Imágenes con puntos calientes que revelan información adicional.',
      icon: 'fas fa-images',
      color: 'bg-green-100 text-green-600',
      activeCount: 8
    }
  ];

  const recentContent: H5PContent[] = [
    {
      id: '1',
      title: 'Introducción a Contratos Laborales',
      type: 'Video Interactivo',
      status: 'Publicado',
      createdAt: 'Actualizado hace 2 días',
      icon: 'fas fa-video',
      activeCount: 0
    },
    {
      id: '2',
      title: 'Evaluación Módulo 3',
      type: 'Quiz Interactivo',
      status: 'Borrador',
      createdAt: 'Creado hace 1 semana',
      icon: 'fas fa-question-circle',
      activeCount: 0
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'Publicado' 
      ? 'bg-green-100 text-green-600' 
      : 'bg-yellow-100 text-yellow-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-sagardoy-navy">Contenido Interactivo H5P</h3>
            <p className="text-sagardoy-gray mt-1">Gestiona contenido interactivo y multimedia</p>
          </div>
          <button className="bg-sagardoy-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-sagardoy-navy transition-colors">
            <i className="fas fa-plus mr-2"></i>Crear H5P
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* H5P Content Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {contentTypes.map((contentType) => (
            <div 
              key={contentType.id}
              className="border border-gray-200 rounded-lg p-6 hover:border-sagardoy-blue transition-colors cursor-pointer"
              onClick={() => setSelectedType(contentType.id)}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-lg ${contentType.color.split(' ')[0]}`}>
                  <i className={`${contentType.icon} ${contentType.color.split(' ')[1]} text-xl`}></i>
                </div>
                <div>
                  <h4 className="font-semibold text-sagardoy-navy">{contentType.title}</h4>
                  <p className="text-sm text-sagardoy-gray">Con preguntas integradas</p>
                </div>
              </div>
              <p className="text-sm text-sagardoy-gray mb-4">{contentType.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${contentType.color}`}>
                  {contentType.activeCount} activos
                </span>
                <button className="text-sagardoy-blue hover:text-sagardoy-navy">
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Recent H5P Content */}
        <div>
          <h4 className="text-lg font-semibold text-sagardoy-navy mb-4">Contenido Reciente</h4>
          <div className="space-y-4">
            {recentContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-sagardoy-blue/10 rounded-lg flex items-center justify-center">
                    <i className={`${content.icon} text-sagardoy-blue`}></i>
                  </div>
                  <div>
                    <h5 className="font-medium text-sagardoy-navy">{content.title}</h5>
                    <p className="text-sm text-sagardoy-gray">{content.type} • {content.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(content.status)}`}>
                    {content.status}
                  </span>
                  <button className="text-sagardoy-blue hover:text-sagardoy-navy p-2">
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
