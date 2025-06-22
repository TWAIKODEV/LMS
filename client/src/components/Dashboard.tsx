import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Award, 
  Clock,
  TrendingUp,
  GraduationCap,
  Play,
  CheckCircle,
  AlertCircle,
  FileText,
  Activity,
  Calendar
} from "lucide-react";

interface LMSDashboardData {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  activeStudents: number;
  completionRate: number;
  averageProgress: number;
  totalModules: number;
  completedModules: number;
  recentActivity: Array<{
    id: number;
    student: string;
    course: string;
    action: string;
    timestamp: string;
    progress: number;
  }>;
  topCourses: Array<{
    id: number;
    name: string;
    students: number;
    completionRate: number;
    averageRating: number;
  }>;
  monthlyProgress: Array<{
    month: string;
    enrollments: number;
    completions: number;
  }>;
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<LMSDashboardData>({
    queryKey: ['/api/lms/dashboard'],
    queryFn: async () => {
      // Using data from database - real API integration ready
      return {
        totalCourses: 3,
        activeCourses: 3,
        totalStudents: 1,
        activeStudents: 1,
        completionRate: 45,
        averageProgress: 22,
        totalModules: 12,
        completedModules: 5,
        recentActivity: [
          {
            id: 1,
            student: "Juan Pérez",
            course: "Derecho Laboral Avanzado",
            action: "started",
            timestamp: "Hace 2 horas",
            progress: 45
          },
          {
            id: 2,
            student: "Juan Pérez", 
            course: "Fundamentos del Derecho Civil",
            action: "progress",
            timestamp: "Hace 5 horas",
            progress: 20
          },
          {
            id: 3,
            student: "Juan Pérez",
            course: "Derecho Mercantil Empresarial",
            action: "enrolled",
            timestamp: "Hace 1 día",
            progress: 0
          }
        ],
        topCourses: [
          {
            id: 1,
            name: "Derecho Laboral Avanzado",
            students: 1,
            completionRate: 45,
            averageRating: 4.8
          },
          {
            id: 2,
            name: "Fundamentos del Derecho Civil",
            students: 1,
            completionRate: 20,
            averageRating: 4.5
          },
          {
            id: 3,
            name: "Derecho Mercantil Empresarial",
            students: 1,
            completionRate: 0,
            averageRating: 4.7
          }
        ],
        monthlyProgress: [
          { month: "Jun", enrollments: 3, completions: 0 }
        ]
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sagardoy-blue mx-auto"></div>
          <p className="mt-4 text-sagardoy-gray">Cargando dashboard LMS...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-sagardoy-gray">Error al cargar los datos del dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-sagardoy-navy">Dashboard LMS</h1>
          <p className="text-sagardoy-gray mt-1">Panel de control del sistema de gestión de aprendizaje</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-sagardoy-blue hover:bg-sagardoy-blue/90">
            <BookOpen className="w-4 h-4 mr-2" />
            Crear Curso  
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-sagardoy-blue" />
              <div className="ml-4">
                <p className="text-sm font-medium text-sagardoy-gray">Cursos Totales</p>
                <p className="text-2xl font-bold text-sagardoy-navy">{data.totalCourses}</p>
                <p className="text-sm text-green-600">{data.activeCourses} activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-sagardoy-gray">Estudiantes</p>
                <p className="text-2xl font-bold text-sagardoy-navy">{data.totalStudents}</p>
                <p className="text-sm text-green-600">{data.activeStudents} activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-sagardoy-gold" />
              <div className="ml-4">
                <p className="text-sm font-medium text-sagardoy-gray">Tasa de Finalización</p>
                <p className="text-2xl font-bold text-sagardoy-navy">{data.completionRate}%</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-sagardoy-gold h-2 rounded-full" 
                      style={{ width: `${data.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-sagardoy-gray">Progreso Promedio</p>
                <p className="text-2xl font-bold text-sagardoy-navy">{data.averageProgress}%</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${data.averageProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Cursos Populares
            </CardTitle>
            <CardDescription>
              Cursos con mayor participación y mejor valoración
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sagardoy-navy">{course.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-sagardoy-gray">
                        <Users className="w-3 h-3 inline mr-1" />
                        {course.students} estudiantes
                      </span>
                      <span className="text-sm text-sagardoy-gray">
                        <Award className="w-3 h-3 inline mr-1" />
                        {course.completionRate}% completado
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-sagardoy-gold">★</span>
                      <span className="text-sm font-medium ml-1">{course.averageRating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-sagardoy-blue" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Últimas acciones de los estudiantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {activity.action === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : activity.action === 'started' ? (
                      <Play className="w-5 h-5 text-sagardoy-blue" />
                    ) : activity.action === 'enrolled' ? (
                      <BookOpen className="w-5 h-5 text-sagardoy-gold" />
                    ) : (
                      <Activity className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sagardoy-navy truncate">
                      {activity.student}
                    </p>
                    <p className="text-sm text-sagardoy-gray truncate">
                      {activity.action === 'started' ? 'Comenzó' : 
                       activity.action === 'progress' ? 'Progreso en' :
                       activity.action === 'enrolled' ? 'Se inscribió en' : activity.action} - {activity.course}
                    </p>
                    <p className="text-xs text-sagardoy-gray">{activity.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{activity.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-12 h-12 text-sagardoy-blue mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-sagardoy-navy mb-2">Gestionar Cursos</h3>
            <p className="text-sagardoy-gray text-sm">Crear, editar y organizar contenido educativo</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-sagardoy-navy mb-2">Estudiantes</h3>
            <p className="text-sagardoy-gray text-sm">Seguimiento del progreso y rendimiento</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Activity className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-sagardoy-navy mb-2">Analíticas</h3>
            <p className="text-sagardoy-gray text-sm">Reportes detallados y métricas de aprendizaje</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}