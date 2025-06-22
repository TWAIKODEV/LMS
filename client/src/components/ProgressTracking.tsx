import { useState } from "react";

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  timeSpent: string;
  lastActivity: string;
  status: 'En progreso' | 'Completado' | 'Pausado';
  avatar: string;
}

export default function ProgressTracking() {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const students: StudentProgress[] = [
    {
      id: '1',
      name: 'María García',
      email: 'maria.garcia@email.com',
      course: 'Derecho Laboral Avanzado',
      progress: 85,
      timeSpent: '4.2h',
      lastActivity: 'Hace 2 horas',
      status: 'En progreso',
      avatar: 'MG'
    },
    {
      id: '2',
      name: 'José López',
      email: 'jose.lopez@email.com',
      course: 'Compliance Empresarial',
      progress: 100,
      timeSpent: '6.1h',
      lastActivity: 'Hace 1 día',
      status: 'Completado',
      avatar: 'JL'
    },
    {
      id: '3',
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@email.com',
      course: 'Derecho Mercantil',
      progress: 45,
      timeSpent: '2.8h',
      lastActivity: 'Hace 3 días',
      status: 'Pausado',
      avatar: 'AR'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado':
        return 'bg-sagardoy-gold/10 text-sagardoy-gold';
      case 'En progreso':
        return 'bg-green-100 text-green-800';
      case 'Pausado':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvatarColor = (index: number) => {
    const colors = ['bg-sagardoy-blue', 'bg-sagardoy-gold', 'bg-sagardoy-navy'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-sagardoy-navy">Seguimiento de Progreso</h3>
        <p className="text-sagardoy-gray mt-1">Monitor del progreso de estudiantes y estadísticas SCORM</p>
      </div>

      <div className="p-6">
        {/* Course Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sagardoy-blue"
            >
              <option value="all">Todos los cursos</option>
              <option value="derecho-laboral">Derecho Laboral Avanzado</option>
              <option value="compliance">Compliance Empresarial</option>
              <option value="derecho-mercantil">Derecho Mercantil</option>
            </select>
            
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sagardoy-blue"
            >
              <option value="month">Último mes</option>
              <option value="quarter">Últimos 3 meses</option>
              <option value="year">Último año</option>
            </select>

            <button className="bg-sagardoy-blue text-white px-4 py-2 rounded-lg hover:bg-sagardoy-navy transition-colors">
              <i className="fas fa-download mr-2"></i>Exportar
            </button>
          </div>
        </div>

        {/* Students Progress Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-sagardoy-navy">Estudiante</th>
                <th className="text-left py-3 px-4 font-semibold text-sagardoy-navy">Curso</th>
                <th className="text-left py-3 px-4 font-semibold text-sagardoy-navy">Progreso</th>
                <th className="text-left py-3 px-4 font-semibold text-sagardoy-navy">Tiempo</th>
                <th className="text-left py-3 px-4 font-semibold text-sagardoy-navy">Última Actividad</th>
                <th className="text-left py-3 px-4 font-semibold text-sagardoy-navy">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${getAvatarColor(index)} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-sm font-medium">{student.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sagardoy-navy">{student.name}</p>
                        <p className="text-sm text-sagardoy-gray">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-sagardoy-navy">{student.course}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-sagardoy-gold h-2 rounded-full" 
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-sagardoy-navy">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-sagardoy-gray">{student.timeSpent}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-sagardoy-gray">{student.lastActivity}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
