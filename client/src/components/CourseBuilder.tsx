import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  GripVertical, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  FileText, 
  Video, 
  Image, 
  Download,
  Eye,
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
  scormData?: {
    packageUrl?: string;
    completionThreshold?: number;
    masteryScore?: number;
  };
  h5pData?: {
    contentType: string;
    parameters: any;
    tracking: boolean;
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: CourseModule[];
  totalDuration: number;
  category: string;
}

const moduleTypes = [
  { type: 'text', label: 'Contenido de Texto', icon: FileText, color: 'bg-blue-100 text-blue-800' },
  { type: 'video', label: 'Video', icon: Video, color: 'bg-green-100 text-green-800' },
  { type: 'image', label: 'Imagen', icon: Image, color: 'bg-purple-100 text-purple-800' },
  { type: 'quiz', label: 'Evaluación', icon: Settings, color: 'bg-orange-100 text-orange-800' },
  { type: 'h5p', label: 'Contenido H5P', icon: Settings, color: 'bg-indigo-100 text-indigo-800' },
  { type: 'scorm', label: 'Paquete SCORM', icon: Settings, color: 'bg-red-100 text-red-800' }
];

export default function CourseBuilder() {
  const [course, setCourse] = useState<Course>({
    id: 'course-1',
    title: 'Derecho Laboral Avanzado',
    description: 'Curso interactivo sobre aspectos avanzados del derecho laboral',
    modules: [],
    totalDuration: 0,
    category: 'Derecho Laboral'
  });

  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const addModule = (type: 'text' | 'video' | 'image' | 'quiz' | 'h5p' | 'scorm') => {
    const newModule: CourseModule = {
      id: `module-${Date.now()}`,
      title: `Nuevo ${moduleTypes.find(t => t.type === type)?.label}`,
      description: 'Descripción del módulo',
      type,
      content: '',
      duration: 0,
      order: course.modules.length
    };

    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
  };

  const updateModule = (moduleId: string, updates: Partial<CourseModule>) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId ? { ...module, ...updates } : module
      )
    }));
  };

  const deleteModule = (moduleId: string) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module.id !== moduleId)
    }));
  };

  const onDragEnd = (result: any) => {
    setDraggedItem(null);
    
    if (!result.destination) return;

    const items = Array.from(course.modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setCourse(prev => ({
      ...prev,
      modules: updatedItems
    }));
  };

  const onDragStart = (result: any) => {
    setDraggedItem(result.draggableId);
  };

  const calculateTotalDuration = () => {
    return course.modules.reduce((total, module) => total + (module.duration || 0), 0);
  };

  const exportCourse = () => {
    const courseData = {
      ...course,
      totalDuration: calculateTotalDuration(),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(courseData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.title.replace(/\s+/g, '_')}_course.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-sagardoy-navy">Constructor de Cursos Avanzado</h3>
            <p className="text-sagardoy-gray mt-1">Crea y organiza contenido educativo con drag & drop</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              Vista Previa
            </Button>
            <Button onClick={exportCourse} className="flex items-center bg-sagardoy-blue hover:bg-sagardoy-navy">
              <Download className="mr-2 h-4 w-4" />
              Exportar Curso
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Module Types */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Elementos del Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {moduleTypes.map((moduleType, index) => {
                  const Icon = moduleType.icon;
                  return (
                    <motion.div
                      key={moduleType.type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => addModule(moduleType.type as any)}
                        variant="outline"
                        className="w-full justify-start p-3 h-auto transition-all duration-200 hover:shadow-md"
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">{moduleType.label}</div>
                        </div>
                      </Button>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Course Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Información del Curso
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingCourse(!isEditingCourse)}
                  >
                    {isEditingCourse ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingCourse ? (
                  <>
                    <div>
                      <Label htmlFor="courseTitle">Título del Curso</Label>
                      <Input
                        id="courseTitle"
                        value={course.title}
                        onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="courseDescription">Descripción</Label>
                      <Textarea
                        id="courseDescription"
                        value={course.description}
                        onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="courseCategory">Categoría</Label>
                      <Input
                        id="courseCategory"
                        value={course.category}
                        onChange={(e) => setCourse(prev => ({ ...prev, category: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Módulos: {course.modules.length}</span>
                      <span>Duración: {calculateTotalDuration()} min</span>
                    </div>
                    <Badge variant="secondary">{course.category}</Badge>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estructura del Curso</CardTitle>
                <p className="text-sm text-gray-600">
                  Arrastra y suelta los módulos para reorganizar el contenido
                </p>
              </CardHeader>
              <CardContent>
                {course.modules.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <Plus className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No hay módulos</h3>
                    <p className="mt-2 text-gray-600">
                      Comienza agregando elementos desde el panel lateral
                    </p>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                    <Droppable droppableId="course-modules">
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`space-y-4 ${snapshot.isDraggingOver ? 'bg-blue-50 p-4 rounded-lg' : ''}`}
                        >
                          {course.modules.map((module, index) => {
                            const moduleType = moduleTypes.find(t => t.type === module.type);
                            const Icon = moduleType?.icon || FileText;
                            const isEditing = editingModule === module.id;
                            const isDragging = draggedItem === module.id;

                            return (
                              <Draggable key={module.id} draggableId={module.id} index={index}>
                                {(provided, snapshot) => (
                                  <motion.div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`bg-white border rounded-lg p-4 transition-all ${
                                      snapshot.isDragging ? 'shadow-lg rotate-2' : 'shadow-sm'
                                    } ${isEditing ? 'border-sagardoy-blue' : 'border-gray-200'}`}
                                  >
                                    <div className="flex items-start space-x-4">
                                      <div
                                        {...provided.dragHandleProps}
                                        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                                      >
                                        <GripVertical className="h-5 w-5" />
                                      </div>
                                      
                                      <div className="flex-1">
                                        {isEditing ? (
                                          <div className="space-y-3">
                                            <Input
                                              value={module.title}
                                              onChange={(e) => updateModule(module.id, { title: e.target.value })}
                                              className="font-medium"
                                            />
                                            <Textarea
                                              value={module.description}
                                              onChange={(e) => updateModule(module.id, { description: e.target.value })}
                                              rows={2}
                                            />
                                            <div className="flex items-center space-x-2">
                                              <Label>Duración (min):</Label>
                                              <Input
                                                type="number"
                                                value={module.duration || 0}
                                                onChange={(e) => updateModule(module.id, { duration: parseInt(e.target.value) || 0 })}
                                                className="w-20"
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          <div>
                                            <div className="flex items-center space-x-2 mb-2">
                                              <Icon className="h-5 w-5 text-sagardoy-blue" />
                                              <h3 className="font-medium text-sagardoy-navy">{module.title}</h3>
                                              <Badge variant="outline" className={moduleType?.color}>
                                                {moduleType?.label}
                                              </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                                            <div className="text-xs text-gray-500">
                                              Duración: {module.duration || 0} minutos
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex items-center space-x-2">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => setEditingModule(isEditing ? null : module.id)}
                                        >
                                          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => deleteModule(module.id)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
