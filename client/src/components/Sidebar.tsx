import { useState } from "react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { id: 'demo-course', label: 'Curso Demo', icon: 'fas fa-play-circle' },
    { id: 'courses', label: 'Mis Cursos', icon: 'fas fa-book' },
    { id: 'builder', label: 'Constructor de Cursos', icon: 'fas fa-puzzle-piece' },
    { id: 'progress', label: 'Seguimiento', icon: 'fas fa-chart-bar' },
    { id: 'h5p', label: 'Contenido H5P', icon: 'fas fa-cogs' },
    { id: 'collaborators', label: 'Colaboradores', icon: 'fas fa-users' },
  ];

  return (
    <div className="w-64 bg-sagardoy-navy text-white shadow-lg h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-sagardoy-gold p-2 rounded-lg">
            <i className="fas fa-graduation-cap text-sagardoy-navy text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold">Sagardoy LMS</h1>
            <p className="text-sm text-gray-300">Learning Management</p>
          </div>
        </div>
      </div>

      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-all hover:bg-sagardoy-blue/20 hover:text-white ${
                activeSection === item.id
                  ? 'bg-sagardoy-blue/20 text-sagardoy-gold'
                  : 'text-gray-300'
              }`}
            >
              <i className={`${item.icon} mr-3`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 px-4">
          <div className="border-t border-sagardoy-blue/20 pt-4">
            <div className="flex items-center px-4 py-3">
              <div className="w-8 h-8 bg-sagardoy-gold rounded-full flex items-center justify-center mr-3">
                <span className="text-sagardoy-navy font-bold text-sm">JS</span>
              </div>
              <div>
                <p className="text-sm font-medium">Juan Sánchez</p>
                <p className="text-xs text-gray-400">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
