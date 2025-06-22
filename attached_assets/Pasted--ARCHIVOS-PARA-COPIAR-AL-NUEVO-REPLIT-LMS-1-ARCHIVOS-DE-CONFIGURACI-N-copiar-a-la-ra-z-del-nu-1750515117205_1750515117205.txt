# ARCHIVOS PARA COPIAR AL NUEVO REPLIT LMS

## 1. ARCHIVOS DE CONFIGURACIÓN (copiar a la raíz del nuevo proyecto):

### package.json
```bash
# Renombrar LMS_package.json como package.json en el nuevo proyecto
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@assets': path.resolve(__dirname, './attached_assets'),
      '@shared': path.resolve(__dirname, './shared')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
```

### tailwind.config.ts
```typescript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'sagardoy-navy': '#1e3d59',
        'sagardoy-blue': '#3b82f6', 
        'sagardoy-gold': '#f59e0b',
        'sagardoy-gray': '#6b7280',
        'sagardoy-dark-gray': '#374151',
        'sagardoy-light-gray': '#f3f4f6'
      }
    }
  },
  plugins: []
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@assets/*": ["./attached_assets/*"],
      "@shared/*": ["./shared/*"]
    }
  },
  "include": ["client", "server", "shared"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 2. ARCHIVOS DE CÓDIGO FUENTE:

### UBICACIÓN EN ESTE PROYECTO → UBICACIÓN EN NUEVO PROYECTO:

```
client/src/pages/CourseBuilder.tsx → client/src/pages/CourseBuilder.tsx
client/src/pages/ProgressTracking.tsx → client/src/pages/ProgressTracking.tsx  
client/src/pages/CollaboratorForm.tsx → client/src/pages/CollaboratorForm.tsx

client/src/components/DemoCourseBuilder.tsx → client/src/components/DemoCourseBuilder.tsx
client/src/components/SCORMTracker.tsx → client/src/components/SCORMTracker.tsx
client/src/components/H5PIntegration.tsx → client/src/components/H5PIntegration.tsx
client/src/components/CoursePreview.tsx → client/src/components/CoursePreview.tsx

client/src/components/ui/ → client/src/components/ui/ (TODA LA CARPETA)

client/src/lib/utils.ts → client/src/lib/utils.ts
client/src/lib/queryClient.ts → client/src/lib/queryClient.ts

client/src/hooks/use-toast.ts → client/src/hooks/use-toast.ts
```

## 3. ARCHIVOS PRINCIPALES:

### client/src/main.tsx
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### client/src/index.css
```css
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
```

### client/index.html
```html
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
```

## 4. PASOS PARA CREAR EL NUEVO REPLIT:

1. **Crear nuevo Replit** con template "React + Vite"
2. **Instalar dependencias**: Usar el archivo `LMS_package.json` como `package.json`
3. **Copiar archivos de configuración** listados arriba
4. **Copiar carpetas completas**:
   - `client/src/components/` (toda)
   - `client/src/pages/` (solo los 3 del LMS)
   - `client/src/lib/`
   - `client/src/hooks/`
5. **Crear App.tsx** simplificado (ver documentación)
6. **Ejecutar** `npm install` y `npm run dev`

Los archivos están listos para copiar desde este proyecto actual.