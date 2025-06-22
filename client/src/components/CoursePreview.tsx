import { useState } from "react";

interface Module {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  current?: boolean;
  content: {
    type: string;
    title: string;
    duration: string;
  }[];
}

export default function CoursePreview() {
  const [activeModule, setActiveModule] = useState(1);
  const [currentContent, setCurrentContent] = useState(0);

  const courseData = {
    title: "Derecho Laboral Avanzado",
    instructor: "Dr. Miguel Sánchez",
    duration: "8 horas",
    modules: 5,
    certificate: true,
    description: "Profundiza en los aspectos más complejos del derecho del trabajo, incluyendo relaciones laborales colectivas, despidos improcedentes y nuevas modalidades de contratación."
  };

  const modules: Module[] = [
    {
      id: 1,
      title: "Fundamentos del Derecho Laboral",
      duration: "1.5h",
      completed: true,
      content: [
        { type: "video", title: "Introducción al marco normativo", duration: "15 min" },
        { type: "text", title: "Principios básicos del derecho del trabajo", duration: "20 min" },
        { type: "quiz", title: "Evaluación inicial", duration: "10 min" }
      ]
    },
    {
      id: 2,
      title: "Contratos de Trabajo",
      duration: "2h",
      completed: true,
      content: [
        { type: "video", title: "Tipos de contratos laborales", duration: "25 min" },
        { type: "h5p", title: "Simulador de contratos", duration: "20 min" },
        { type: "text", title: "Cláusulas especiales", duration: "15 min" },
        { type: "quiz", title: "Casos prácticos", duration: "10 min" }
      ]
    },
    {
      id: 3,
      title: "Relaciones Colectivas",
      duration: "2h",
      completed: false,
      current: true,
      content: [
        { type: "video", title: "Negociación colectiva", duration: "20 min" },
        { type: "text", title: "Convenios colectivos", duration: "25 min" },
        { type: "h5p", title: "Análisis de convenios", duration: "15 min" },
        { type: "quiz", title: "Evaluación módulo 3", duration: "15 min" }
      ]
    },
    {
      id: 4,
      title: "Despidos y Extinciones",
      duration: "1.5h",
      completed: false,
      content: [
        { type: "video", title: "Causas de extinción laboral", duration: "18 min" },
        { type: "text", title: "Procedimientos de despido", duration: "22 min" },
        { type: "quiz", title: "Evaluación módulo 4", duration: "10 min" }
      ]
    },
    {
      id: 5,
      title: "Nuevas Modalidades de Trabajo",
      duration: "1h",
      completed: false,
      content: [
        { type: "video", title: "Teletrabajo y trabajo híbrido", duration: "15 min" },
        { type: "text", title: "Economía de plataformas", duration: "20 min" },
        { type: "quiz", title: "Evaluación final", duration: "15 min" }
      ]
    }
  ];

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return 'fas fa-play-circle text-red-500';
      case 'text': return 'fas fa-file-text text-blue-500';
      case 'quiz': return 'fas fa-question-circle text-green-500';
      case 'h5p': return 'fas fa-puzzle-piece text-purple-500';
      default: return 'fas fa-file text-gray-500';
    }
  };

  const activeModuleData = modules.find(m => m.id === activeModule);
  const progressPercentage = Math.round((modules.filter(m => m.completed).length / modules.length) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-sagardoy-navy">Vista Previa del Curso</h3>
            <p className="text-sagardoy-gray mt-1">Experiencia de estudiante en tiempo real</p>
          </div>
          <button className="bg-sagardoy-blue text-white px-4 py-2 rounded-lg hover:bg-sagardoy-navy transition-colors">
            <i className="fas fa-external-link-alt mr-2"></i>Abrir en Nueva Ventana
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Course Info Sidebar */}
          <div className="lg:col-span-1">
            {/* Course Header */}
            <div className="bg-sagardoy-light-gray p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-sagardoy-navy mb-2">{courseData.title}</h4>
              <div className="space-y-2 text-sm text-sagardoy-gray">
                <div className="flex items-center">
                  <i className="fas fa-user-tie mr-2"></i>
                  {courseData.instructor}
                </div>
                <div className="flex items-center">
                  <i className="fas fa-clock mr-2"></i>
                  {courseData.duration}
                </div>
                <div className="flex items-center">
                  <i className="fas fa-graduation-cap mr-2"></i>
                  {courseData.modules} módulos
                </div>
              </div>
              
              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-sagardoy-gray">Progreso</span>
                  <span className="font-medium text-sagardoy-navy">{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-sagardoy-gold h-2 rounded-full transition-all" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Module Navigation */}
            <div className="space-y-2">
              <h5 className="font-semibold text-sagardoy-navy mb-3">Módulos</h5>
              {modules.map((module) => (
                <div
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    activeModule === module.id
                      ? 'bg-sagardoy-blue/10 border border-sagardoy-blue'
                      : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      module.completed 
                        ? 'bg-sagardoy-gold' 
                        : module.current 
                          ? 'bg-sagardoy-blue' 
                          : 'bg-gray-300'
                    }`}>
                      {module.completed ? (
                        <i className="fas fa-check text-white text-xs"></i>
                      ) : (
                        <span className="text-white text-xs">{module.id}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h6 className="text-sm font-medium text-sagardoy-navy">{module.title}</h6>
                      <p className="text-xs text-sagardoy-gray">{module.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeModuleData && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-sagardoy-navy">{activeModuleData.title}</h4>
                    <p className="text-sagardoy-gray">Módulo {activeModuleData.id} • {activeModuleData.duration}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-gray-100 text-sagardoy-gray px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                      <i className="fas fa-bookmark mr-2"></i>Marcar
                    </button>
                    <button className="bg-sagardoy-gold text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-colors">
                      <i className="fas fa-play mr-2"></i>Continuar
                    </button>
                  </div>
                </div>

                {/* Content List */}
                <div className="space-y-3">
                  {activeModuleData.content.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setCurrentContent(index)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        currentContent === index
                          ? 'border-sagardoy-blue bg-sagardoy-blue/5'
                          : 'border-gray-200 hover:border-sagardoy-blue/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <i className={getContentIcon(item.type)}></i>
                          <div>
                            <h6 className="font-medium text-sagardoy-navy">{item.title}</h6>
                            <p className="text-sm text-sagardoy-gray">{item.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {activeModuleData.completed && (
                            <i className="fas fa-check-circle text-sagardoy-gold"></i>
                          )}
                          <i className="fas fa-chevron-right text-sagardoy-gray"></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Course Description */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-sagardoy-navy mb-2">Sobre este curso</h5>
                  <p className="text-sagardoy-gray text-sm leading-relaxed">{courseData.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}