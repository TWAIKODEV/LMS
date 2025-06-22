import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Award, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Video,
  Settings,
  PlayCircle,
  Download,
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  totalProgress: number;
  completedModules: number;
  totalModules: number;
  averageScore: number;
  timeSpent: number;
  lastAccess: string;
  status: 'active' | 'completed' | 'inactive';
}

interface ModuleAnalytics {
  id: string;
  title: string;
  type: string;
  completionRate: number;
  averageScore: number;
  averageTime: number;
  interactions: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const DEMO_STUDENTS: StudentProgress[] = [
  {
    id: "1",
    name: "María García López",
    email: "maria.garcia@sagardoy.com",
    totalProgress: 85,
    completedModules: 4,
    totalModules: 5,
    averageScore: 88,
    timeSpent: 120,
    lastAccess: "2024-01-15",
    status: "active"
  },
  {
    id: "2", 
    name: "Carlos Rodríguez Sánchez",
    email: "carlos.rodriguez@sagardoy.com",
    totalProgress: 100,
    completedModules: 5,
    totalModules: 5,
    averageScore: 95,
    timeSpent: 135,
    lastAccess: "2024-01-14",
    status: "completed"
  },
  {
    id: "3",
    name: "Ana Martín Fernández",
    email: "ana.martin@sagardoy.com", 
    totalProgress: 60,
    completedModules: 3,
    totalModules: 5,
    averageScore: 82,
    timeSpent: 85,
    lastAccess: "2024-01-12",
    status: "active"
  },
  {
    id: "4",
    name: "Luis Pérez González",
    email: "luis.perez@sagardoy.com",
    totalProgress: 40,
    completedModules: 2,
    totalModules: 5,
    averageScore: 76,
    timeSpent: 65,
    lastAccess: "2024-01-10",
    status: "inactive"
  },
  {
    id: "5",
    name: "Carmen Jiménez Ruiz",
    email: "carmen.jimenez@sagardoy.com",
    totalProgress: 95,
    completedModules: 5,
    totalModules: 5,
    averageScore: 91,
    timeSpent: 142,
    lastAccess: "2024-01-15",
    status: "completed"
  }
];

const DEMO_MODULES: ModuleAnalytics[] = [
  {
    id: "intro-1",
    title: "Introducción al Derecho Laboral Digital",
    type: "intro",
    completionRate: 100,
    averageScore: 85,
    averageTime: 15,
    interactions: 45,
    difficulty: "easy"
  },
  {
    id: "video-1",
    title: "Nuevas Tendencias en Contratos Laborales", 
    type: "video",
    completionRate: 85,
    averageScore: 82,
    averageTime: 28,
    interactions: 38,
    difficulty: "medium"
  },
  {
    id: "h5p-1",
    title: "Casos Prácticos Interactivos",
    type: "h5p", 
    completionRate: 75,
    averageScore: 79,
    averageTime: 35,
    interactions: 125,
    difficulty: "medium"
  },
  {
    id: "scorm-1",
    title: "Módulo SCORM: Legislación Actualizada",
    type: "scorm",
    completionRate: 70,
    averageScore: 88,
    averageTime: 42,
    interactions: 67,
    difficulty: "hard"
  },
  {
    id: "assessment-1", 
    title: "Evaluación Final",
    type: "assessment",
    completionRate: 60,
    averageScore: 91,
    averageTime: 25,
    interactions: 23,
    difficulty: "hard"
  }
];

const PROGRESS_DATA = [
  { week: 'Sem 1', completed: 20, inProgress: 15, notStarted: 65 },
  { week: 'Sem 2', completed: 45, inProgress: 25, notStarted: 30 },
  { week: 'Sem 3', completed: 65, inProgress: 20, notStarted: 15 },
  { week: 'Sem 4', completed: 80, inProgress: 15, notStarted: 5 }
];

const INTERACTION_DATA = [
  { module: 'Intro', interactions: 45 },
  { module: 'Video', interactions: 38 },
  { module: 'H5P', interactions: 125 },
  { module: 'SCORM', interactions: 67 },
  { module: 'Eval', interactions: 23 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'active': return 'bg-blue-100 text-blue-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getModuleIcon(type: string) {
  switch (type) {
    case 'intro': return BookOpen;
    case 'video': return Video;
    case 'h5p': return Settings;
    case 'scorm': return PlayCircle;
    case 'assessment': return Award;
    default: return BookOpen;
  }
}

export default function ProgressTracking() {
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);
  
  const totalStudents = DEMO_STUDENTS.length;
  const completedStudents = DEMO_STUDENTS.filter(s => s.status === 'completed').length;
  const activeStudents = DEMO_STUDENTS.filter(s => s.status === 'active').length;
  const averageProgress = Math.round(DEMO_STUDENTS.reduce((acc, s) => acc + s.totalProgress, 0) / totalStudents);
  const averageScore = Math.round(DEMO_STUDENTS.reduce((acc, s) => acc + s.averageScore, 0) / totalStudents);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-sagardoy-navy">
                  Seguimiento de Progreso
                </h1>
                <p className="text-sagardoy-gray mt-2">
                  Curso: Derecho Laboral Avanzado - Curso Interactivo
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Reportes
                </Button>
                <Button className="bg-sagardoy-blue hover:bg-sagardoy-navy">
                  <Calendar className="mr-2 h-4 w-4" />
                  Programar Reporte
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-sagardoy-blue" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                    <p className="text-2xl font-bold text-sagardoy-navy">{totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completados</p>
                    <p className="text-2xl font-bold text-sagardoy-navy">{completedStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-sagardoy-gold" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Progreso Promedio</p>
                    <p className="text-2xl font-bold text-sagardoy-navy">{averageProgress}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-sagardoy-gold" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Calificación Promedio</p>
                    <p className="text-2xl font-bold text-sagardoy-navy">{averageScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="students">Estudiantes</TabsTrigger>
              <TabsTrigger value="modules">Módulos</TabsTrigger>
              <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Progreso por Semana</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={PROGRESS_DATA}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="completed" stackId="1" stroke="#10B981" fill="#10B981" />
                          <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                          <Area type="monotone" dataKey="notStarted" stackId="1" stroke="#6B7280" fill="#6B7280" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Interacciones por Módulo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={INTERACTION_DATA}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="module" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="interactions" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tiempo Promedio por Módulo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {DEMO_MODULES.map((module) => (
                        <div key={module.id} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{module.title.substring(0, 20)}...</span>
                          <Badge variant="outline">{module.averageTime} min</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tasa de Finalización</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {DEMO_MODULES.map((module) => (
                        <div key={module.id} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{module.title.substring(0, 20)}...</span>
                            <span>{module.completionRate}%</span>
                          </div>
                          <Progress value={module.completionRate} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estudiantes Activos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {DEMO_STUDENTS.filter(s => s.status === 'active').map((student) => (
                        <div key={student.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.totalProgress}% completado</p>
                          </div>
                          <Badge className={getStatusColor(student.status)}>
                            {student.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Estudiantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {DEMO_STUDENTS.map((student) => (
                      <motion.div
                        key={student.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedStudent(student)}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-sagardoy-blue rounded-full flex items-center justify-center text-white font-semibold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold">{student.name}</h3>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{student.completedModules}/{student.totalModules} módulos</p>
                            <Progress value={student.totalProgress} className="w-32 h-2 mt-1" />
                          </div>
                          <Badge className={getStatusColor(student.status)}>
                            {student.status}
                          </Badge>
                          <div className="text-right text-sm text-gray-600">
                            <p>Puntuación: {student.averageScore}%</p>
                            <p>Tiempo: {student.timeSpent} min</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Modules Tab */}
            <TabsContent value="modules" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DEMO_MODULES.map((module) => {
                  const Icon = getModuleIcon(module.type);
                  return (
                    <Card key={module.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Icon className="h-6 w-6 text-sagardoy-blue" />
                          <Badge className={getDifficultyColor(module.difficulty)}>
                            {module.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Tasa de Finalización</span>
                              <span>{module.completionRate}%</span>
                            </div>
                            <Progress value={module.completionRate} />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Puntuación Promedio</p>
                              <p className="font-semibold">{module.averageScore}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Tiempo Promedio</p>
                              <p className="font-semibold">{module.averageTime} min</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Interacciones</span>
                            <Badge variant="outline">{module.interactions}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribución de Calificaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Excelente (90-100)', value: 35, color: '#10B981' },
                              { name: 'Bueno (80-89)', value: 40, color: '#3B82F6' },
                              { name: 'Regular (70-79)', value: 20, color: '#F59E0B' },
                              { name: 'Necesita Mejora (<70)', value: 5, color: '#F87171' }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: 'Excelente (90-100)', value: 35, color: '#10B981' },
                              { name: 'Bueno (80-89)', value: 40, color: '#3B82F6' },
                              { name: 'Regular (70-79)', value: 20, color: '#F59E0B' },
                              { name: 'Necesita Mejora (<70)', value: 5, color: '#F87171' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tendencia de Progreso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={PROGRESS_DATA}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Advanced Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="mr-2 h-5 w-5" />
                      Engagement Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-sagardoy-blue mb-2">8.7</div>
                      <p className="text-sm text-gray-600">de 10 puntos</p>
                      <div className="mt-4">
                        <Progress value={87} className="h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="mr-2 h-5 w-5" />
                      Tasa de Retención
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">92%</div>
                      <p className="text-sm text-gray-600">estudiantes activos</p>
                      <div className="mt-4">
                        <Progress value={92} className="h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Tiempo Promedio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-sagardoy-gold mb-2">129</div>
                      <p className="text-sm text-gray-600">minutos por estudiante</p>
                      <div className="mt-4 text-xs text-gray-500">
                        Target: 120 min
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}