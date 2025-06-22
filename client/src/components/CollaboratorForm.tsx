import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Collaborator {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
  initials: string;
  color: string;
}

export default function CollaboratorForm() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    role: '',
    specialty: '',
    biography: ''
  });

  const collaborators: Collaborator[] = [
    {
      id: '1',
      name: 'Dr. Miguel Sánchez',
      role: 'Profesor',
      specialty: 'Derecho Laboral',
      avatar: 'DM',
      initials: 'DM',
      color: 'bg-sagardoy-blue'
    },
    {
      id: '2',
      name: 'Lic. Carmen Torres',
      role: 'Tutora',
      specialty: 'Compliance',
      avatar: 'LC',
      initials: 'LC',
      color: 'bg-sagardoy-gold'
    },
    {
      id: '3',
      name: 'Ana Ruiz',
      role: 'Admin. Contenido',
      specialty: 'Gestión de Cursos',
      avatar: 'AR',
      initials: 'AR',
      color: 'bg-sagardoy-navy'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      lastName: '',
      email: '',
      role: '',
      specialty: '',
      biography: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-sagardoy-navy">Gestión de Colaboradores</h3>
        <p className="text-sagardoy-gray mt-1">Administra profesores, tutores y colaboradores del sistema</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Collaborator Form */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-semibold text-sagardoy-navy mb-4">Agregar Nuevo Colaborador</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-sagardoy-navy mb-2">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nombre completo"
                    className="focus:ring-sagardoy-blue focus:border-sagardoy-blue"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="block text-sm font-medium text-sagardoy-navy mb-2">
                    Apellidos
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Apellidos"
                    className="focus:ring-sagardoy-blue focus:border-sagardoy-blue"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-sagardoy-navy mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@sagardoy.com"
                  className="focus:ring-sagardoy-blue focus:border-sagardoy-blue"
                />
              </div>

              <div>
                <Label htmlFor="role" className="block text-sm font-medium text-sagardoy-navy mb-2">
                  Rol
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className="focus:ring-sagardoy-blue focus:border-sagardoy-blue">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profesor">Profesor</SelectItem>
                    <SelectItem value="tutor">Tutor</SelectItem>
                    <SelectItem value="admin-contenido">Administrador de Contenido</SelectItem>
                    <SelectItem value="revisor">Revisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="specialty" className="block text-sm font-medium text-sagardoy-navy mb-2">
                  Especialidad
                </Label>
                <Input
                  id="specialty"
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  placeholder="Área de especialización"
                  className="focus:ring-sagardoy-blue focus:border-sagardoy-blue"
                />
              </div>

              <div>
                <Label htmlFor="biography" className="block text-sm font-medium text-sagardoy-navy mb-2">
                  Biografía
                </Label>
                <Textarea
                  id="biography"
                  rows={3}
                  value={formData.biography}
                  onChange={(e) => handleInputChange('biography', e.target.value)}
                  placeholder="Breve descripción profesional..."
                  className="focus:ring-sagardoy-blue focus:border-sagardoy-blue"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Button 
                  type="submit" 
                  className="bg-sagardoy-blue text-white hover:bg-sagardoy-navy"
                >
                  <i className="fas fa-plus mr-2"></i>Agregar Colaborador
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  className="bg-gray-100 text-sagardoy-gray hover:bg-gray-200"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>

          {/* Collaborators List */}
          <div>
            <h4 className="text-lg font-semibold text-sagardoy-navy mb-4">Colaboradores Activos</h4>
            <div className="space-y-3">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-10 h-10 ${collaborator.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-sm font-medium">{collaborator.initials}</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-sagardoy-navy text-sm">{collaborator.name}</h5>
                      <p className="text-xs text-sagardoy-gray">{collaborator.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-sagardoy-gray">{collaborator.specialty}</p>
                  <div className="mt-2 flex space-x-2">
                    <button className="text-xs text-sagardoy-blue hover:text-sagardoy-navy">
                      <i className="fas fa-edit mr-1"></i>Editar
                    </button>
                    <button className="text-xs text-red-500 hover:text-red-700">
                      <i className="fas fa-trash mr-1"></i>Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
