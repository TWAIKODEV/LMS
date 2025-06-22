export default function CoursesSection() {
  const featuredCourse = {
    title: "Derecho Laboral Avanzado",
    description: "Profundiza en los aspectos más complejos del derecho del trabajo, incluyendo relaciones laborales colectivas, despidos improcedentes y nuevas modalidades de contratación.",
    rating: 4.8,
    duration: "8 horas",
    students: 324,
    progress: 68,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop"
  };

  const otherCourses = [
    {
      id: 1,
      title: "Compliance Empresarial",
      description: "Implementación de programas de cumplimiento normativo",
      duration: "6 horas",
      students: 189,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      available: true
    },
    {
      id: 2,
      title: "Derecho Mercantil",
      description: "Aspectos fundamentales del derecho comercial",
      duration: "5 horas",
      students: 145,
      image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=200&fit=crop",
      available: false
    },
    {
      id: 3,
      title: "Derecho Contractual",
      description: "Formación y ejecución de contratos",
      duration: "4 horas",
      students: 98,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
      available: true
    }
  ];

  const courseStats = [
    { label: "Estudiantes inscritos", value: "324" },
    { label: "Tasa de finalización", value: "92%", color: "text-green-600" },
    { label: "Tiempo promedio", value: "6.2h" },
    { label: "Calificación promedio", value: "4.8/5", color: "text-sagardoy-gold" }
  ];

  const modules = [
    { id: 1, title: "1. Fundamentos", completed: true },
    { id: 2, title: "2. Contratos Laborales", completed: true },
    { id: 3, title: "3. Relaciones Colectivas", completed: false, current: true },
    { id: 4, title: "4. Despidos y Extinciones", completed: false },
    { id: 5, title: "5. Nuevas Modalidades", completed: false }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Course */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <img 
              src={featuredCourse.image} 
              alt="Curso destacado"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-sagardoy-gold/10 text-sagardoy-gold px-3 py-1 rounded-full text-sm font-medium">
                  Curso Destacado
                </span>
                <div className="flex items-center space-x-1 text-sagardoy-gold">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                  <span className="text-sm text-sagardoy-gray ml-2">({featuredCourse.rating})</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-sagardoy-navy mb-2">{featuredCourse.title}</h3>
              <p className="text-sagardoy-gray mb-4">{featuredCourse.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-sagardoy-gray">
                  <span><i className="fas fa-clock mr-1"></i>{featuredCourse.duration}</span>
                  <span><i className="fas fa-users mr-1"></i>{featuredCourse.students} estudiantes</span>
                  <span><i className="fas fa-certificate mr-1"></i>Certificado</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-sagardoy-gray">Progreso del curso</span>
                  <span className="font-medium text-sagardoy-navy">{featuredCourse.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-sagardoy-gold h-2 rounded-full" 
                    style={{ width: `${featuredCourse.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 bg-sagardoy-blue text-white py-2 px-4 rounded-lg font-medium hover:bg-sagardoy-navy transition-colors">
                  Continuar Curso
                </button>
                <button className="px-4 py-2 border border-sagardoy-blue text-sagardoy-blue rounded-lg hover:bg-sagardoy-blue hover:text-white transition-colors">
                  Vista Previa
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-sagardoy-navy mb-4">Estadísticas del Curso</h4>
            <div className="space-y-4">
              {courseStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sagardoy-gray">{stat.label}</span>
                  <span className={`font-semibold ${stat.color || 'text-sagardoy-navy'}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-sagardoy-navy mb-4">Módulos del Curso</h4>
            <div className="space-y-3">
              {modules.map((module) => (
                <div key={module.id} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    module.completed 
                      ? 'bg-sagardoy-gold' 
                      : module.current 
                        ? 'bg-sagardoy-blue' 
                        : 'bg-gray-200'
                  }`}>
                    {module.completed ? (
                      <i className="fas fa-check text-white text-xs"></i>
                    ) : (
                      <span className={`text-xs ${module.current ? 'text-white' : 'text-sagardoy-gray'}`}>
                        {module.id}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm ${
                    module.current ? 'font-medium text-sagardoy-navy' : 
                    module.completed ? 'text-sagardoy-navy' : 'text-sagardoy-gray'
                  }`}>
                    {module.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Other Courses */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-sagardoy-navy mb-6">Otros Cursos Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold text-sagardoy-navy mb-2">{course.title}</h4>
                <p className="text-sm text-sagardoy-gray mb-3">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-sagardoy-gray mb-3">
                  <span><i className="fas fa-clock mr-1"></i>{course.duration}</span>
                  <span><i className="fas fa-users mr-1"></i>{course.students} estudiantes</span>
                </div>
                <button className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                  course.available
                    ? 'bg-sagardoy-blue text-white hover:bg-sagardoy-navy'
                    : 'bg-gray-100 text-sagardoy-gray hover:bg-gray-200'
                }`}>
                  {course.available ? 'Ver Curso' : 'Próximamente'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
