#!/bin/bash

# Script para exportar archivos del LMS a un directorio
# Uso: ./export_lms_files.sh [directorio_destino]

DEST_DIR=${1:-"../sagardoy-lms"}

echo "🚀 Exportando archivos del LMS a: $DEST_DIR"

# Crear estructura de directorios
mkdir -p "$DEST_DIR/client/src/"{components/ui,pages,lib,hooks,contexts}
mkdir -p "$DEST_DIR/attached_assets"

echo "📁 Creando estructura de directorios..."

# Copiar archivos de configuración
echo "⚙️  Copiando archivos de configuración..."
cp LMS_package.json "$DEST_DIR/package.json"
cp tailwind.config.ts "$DEST_DIR/"
cp vite.config.ts "$DEST_DIR/"
cp tsconfig.json "$DEST_DIR/"
cp postcss.config.js "$DEST_DIR/"

# Copiar páginas del LMS
echo "📄 Copiando páginas principales..."
cp client/src/pages/CourseBuilder.tsx "$DEST_DIR/client/src/pages/"
cp client/src/pages/ProgressTracking.tsx "$DEST_DIR/client/src/pages/"
cp client/src/pages/CollaboratorForm.tsx "$DEST_DIR/client/src/pages/"

# Copiar componentes del LMS
echo "🧩 Copiando componentes LMS..."
cp client/src/components/DemoCourseBuilder.tsx "$DEST_DIR/client/src/components/"
cp client/src/components/SCORMTracker.tsx "$DEST_DIR/client/src/components/"
cp client/src/components/H5PIntegration.tsx "$DEST_DIR/client/src/components/"
cp client/src/components/CoursePreview.tsx "$DEST_DIR/client/src/components/"

# Copiar componentes UI (toda la carpeta)
echo "🎨 Copiando componentes UI..."
cp -r client/src/components/ui "$DEST_DIR/client/src/components/"

# Copiar utilidades y hooks
echo "🔧 Copiando utilidades..."
cp -r client/src/lib "$DEST_DIR/client/src/" 2>/dev/null || echo "⚠️  Directorio lib no encontrado"
cp -r client/src/hooks "$DEST_DIR/client/src/" 2>/dev/null || echo "⚠️  Directorio hooks no encontrado"
cp -r client/src/contexts "$DEST_DIR/client/src/" 2>/dev/null || echo "⚠️  Directorio contexts no encontrado"

# Copiar assets (logo de Sagardoy)
echo "🖼️  Copiando assets..."
cp attached_assets/sagardoy-logo-1_1750499204211.png "$DEST_DIR/attached_assets/" 2>/dev/null || echo "⚠️  Logo no encontrado"

# Crear archivos principales
echo "📝 Creando archivos principales..."

# Crear client/index.html
cat > "$DEST_DIR/client/index.html" << 'EOF'
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sagardoy LMS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# Crear client/src/main.tsx
cat > "$DEST_DIR/client/src/main.tsx" << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# Crear client/src/index.css
cat > "$DEST_DIR/client/src/index.css" << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --sagardoy-navy: #1e3d59;
  --sagardoy-blue: #3b82f6;
  --sagardoy-gold: #f59e0b;
  --sagardoy-gray: #6b7280;
  --sagardoy-dark-gray: #374151;
  --sagardoy-light-gray: #f3f4f6;
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF

# Crear App.tsx simplificado para LMS
cat > "$DEST_DIR/client/src/App.tsx" << 'EOF'
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CourseBuilder from "./pages/CourseBuilder";
import ProgressTracking from "./pages/ProgressTracking";
import CollaboratorForm from "./pages/CollaboratorForm";
import DemoCourseBuilder from "./components/DemoCourseBuilder";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-md p-4 mb-8">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-sagardoy-navy">
                Sagardoy LMS
              </h1>
              <div className="space-x-4">
                <a href="/constructor-cursos" className="text-sagardoy-blue hover:underline">
                  Constructor
                </a>
                <a href="/seguimiento-progreso" className="text-sagardoy-blue hover:underline">
                  Analytics
                </a>
                <a href="/curso-demo" className="text-sagardoy-blue hover:underline">
                  Demo
                </a>
                <a href="/ficha-colaboradores" className="text-sagardoy-blue hover:underline">
                  Colaboradores
                </a>
              </div>
            </div>
          </nav>
          
          <Switch>
            <Route path="/" component={CourseBuilder} />
            <Route path="/constructor-cursos" component={CourseBuilder} />
            <Route path="/seguimiento-progreso" component={ProgressTracking} />
            <Route path="/curso-demo" component={DemoCourseBuilder} />
            <Route path="/ficha-colaboradores" component={CollaboratorForm} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
EOF

# Copiar documentación
echo "📚 Copiando documentación..."
cp LMS_Export_Guide.md "$DEST_DIR/"
cp LMS_Complete_Setup.md "$DEST_DIR/"
cp LMS_Migration_Files.md "$DEST_DIR/"
cp COPY_THESE_FILES.md "$DEST_DIR/"

echo ""
echo "✅ ¡Exportación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. cd $DEST_DIR"
echo "2. npm install"
echo "3. npm run dev"
echo ""
echo "🌐 El LMS estará disponible en http://localhost:5173"
echo ""
echo "📁 Archivos exportados:"
echo "   - Páginas: CourseBuilder, ProgressTracking, CollaboratorForm"
echo "   - Componentes: DemoCourseBuilder, SCORMTracker, H5PIntegration"
echo "   - UI: Todos los componentes Shadcn/UI"
echo "   - Configuración: Vite, Tailwind, TypeScript"
echo "   - Documentación completa incluida"
EOF

chmod +x export_lms_files.sh