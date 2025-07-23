# Frontend E-Commerce & Blog

Un frontend moderno y completo para e-commerce y blog basado en React, construido con TypeScript y Material-UI, que incluye un panel de administración integral, gestión de usuarios y operaciones CRUD completas.

## 🏗️ Estructura del Proyecto

```
src/
├── api/                 # Llamadas a servicios API y cliente HTTP
│   ├── admin.ts         # Llamadas API específicas de administrador
│   ├── auth.ts          # Llamadas API de autenticación
│   ├── client.ts        # Configuración del cliente HTTP con interceptores
│   ├── logs.ts          # Llamadas API de logs del sistema
│   ├── orderItems.ts    # Llamadas API de elementos de pedido
│   ├── orders.ts        # Llamadas API de gestión de pedidos
│   ├── products.ts      # Llamadas API de productos y categorías
│   ├── reviews.ts       # Llamadas API del sistema de reseñas
│   ├── users.ts         # Llamadas API de gestión de usuarios
│   └── index.ts         # Exportaciones de API
├── assets/              # Recursos estáticos
│   └── logo.svg         # Logo de la aplicación
├── components/          # Componentes UI reutilizables
│   ├── auth/            # Componentes de autenticación
│   │   ├── AuthTest.tsx # Componente de prueba de autenticación
│   │   └── ProtectedRoute.tsx # Wrapper de protección de rutas
│   ├── debug/           # Componentes de desarrollo y depuración
│   │   └── ProductsDebug.tsx # Interfaz de depuración de productos
│   ├── shared/          # Componentes UI compartidos
│   │   ├── Button.tsx   # Componente de botón reutilizable
│   │   ├── Footer.tsx   # Pie de página de la aplicación
│   │   ├── Header.tsx   # Encabezado de la aplicación con navegación
│   │   ├── Input.tsx    # Componente de entrada de formulario
│   │   ├── Loader.tsx   # Componente de carga
│   │   └── index.ts     # Exportaciones de componentes
│   ├── ReviewForm.tsx   # Formulario de creación/edición de reseñas
│   ├── ReviewList.tsx   # Componente de visualización de reseñas
│   └── index.ts         # Todas las exportaciones de componentes
├── contexts/            # Proveedores de React Context
│   ├── AuthContext.tsx  # Gestión de estado de autenticación
│   ├── CartContext.tsx  # Gestión de estado del carrito de compras
│   └── index.ts         # Exportaciones de contexto
├── hooks/               # Custom React hooks
│   ├── useOrders.ts     # Hooks relacionados con pedidos
│   ├── useProducts.ts   # Hooks relacionados con productos
│   ├── useRoles.ts      # Hooks de control de acceso basado en roles
│   └── index.ts         # Exportaciones de hooks
├── pages/               # Componentes de página
│   ├── admin/           # Páginas del panel de administración (CRUD Completo)
│   │   ├── AdminCategories.tsx # Gestión de categorías
│   │   ├── AdminLogs.tsx       # Gestión de logs del sistema
│   │   ├── AdminOrders.tsx     # Gestión de pedidos
│   │   ├── AdminProducts.tsx   # Gestión de productos
│   │   ├── AdminReviews.tsx    # Moderación de reseñas
│   │   ├── AdminUsers.tsx      # Gestión de usuarios
│   │   ├── Dashboard.tsx       # Panel de administración con métricas
│   │   └── index.ts            # Exportaciones de admin
│   ├── auth/            # Páginas de autenticación
│   │   ├── Login.tsx    # Página de inicio de sesión
│   │   └── Register.tsx # Página de registro de usuario
│   ├── cart/            # Páginas del carrito de compras
│   │   ├── Cart.tsx     # Gestión del carrito de compras
│   │   └── Checkout.tsx # Proceso de finalización de compra
│   ├── public/          # Páginas públicas
│   │   ├── Home.tsx         # Página de inicio con productos destacados
│   │   ├── ProductDetail.tsx # Vista individual de producto
│   │   └── ProductList.tsx   # Catálogo de productos
│   ├── Cart.tsx         # Página principal del carrito
│   ├── CustomerOrders.tsx # Historial de pedidos del cliente
│   ├── Home.tsx         # Página de inicio principal
│   ├── Login.tsx        # Página principal de inicio de sesión
│   ├── OrderDetail.tsx  # Detalles individuales del pedido
│   ├── ProductDetail.tsx # Página principal de detalle de producto
│   ├── Products.tsx     # Página principal de productos
│   ├── Register.tsx     # Página principal de registro
│   ├── Unauthorized.tsx # Página de acceso denegado
│   ├── UserReviews.tsx  # Gestión de reseñas del usuario
│   └── index.ts         # Exportaciones de páginas
├── routes/              # Configuración de enrutamiento
│   ├── AppRouter.tsx    # Router principal con todas las rutas
│   └── ProtectedRoute.tsx # Lógica de protección de rutas
├── styles/              # Estilos globales y temas
│   ├── App.css          # Estilos principales de la aplicación
│   └── index.css        # Importaciones CSS globales
├── theme/               # Configuración del tema Material-UI
│   └── index.ts         # Configuración de tema personalizado
├── types/               # Definiciones de tipos TypeScript
│   └── index.ts         # Todos los tipos de la aplicación (User, Product, Order, etc.)
├── utils/               # Funciones utilitarias
│   ├── index.ts         # Funciones auxiliares y exportaciones
│   └── translations.ts  # Utilidades de internacionalización
├── App.tsx              # Componente principal de la aplicación
├── App.test.tsx         # Pruebas de la aplicación
├── index.tsx            # Punto de entrada de la aplicación
├── react-app-env.d.ts   # Tipos de entorno React
├── reportWebVitals.ts   # Monitoreo de rendimiento
└── setupTests.ts        # Configuración de pruebas
```

## 🚀 Características

### Características Públicas
- **Catálogo de Productos**: Navegación avanzada de productos con búsqueda, filtrado y ordenamiento
- **Detalles de Productos**: Vistas detalladas de productos con galerías de imágenes y especificaciones
- **Sistema de Reseñas**: Sistema completo de reseñas de productos con calificaciones y comentarios
- **Carrito de Compras**: Gestión completa del carrito con agregar/quitar elementos y control de cantidad
- **Autenticación de Usuario**: Inicio de sesión y registro seguro con tokens JWT
- **Gestión de Pedidos**: Historial de pedidos y seguimiento detallado de pedidos
- **Diseño Responsivo**: Diseño completamente responsivo con enfoque móvil
- **Perfil de Usuario**: Gestión de perfil personal e historial de pedidos

### Características del Panel de Administración (Operaciones CRUD Completas)
- **Panel de Control**: Vista general completa con métricas clave, gráficos y actividad reciente
- **Gestión de Usuarios**: CRUD completo de usuarios con gestión de roles y control de cuentas
- **Gestión de Productos**: Gestión completa del ciclo de vida de productos con categorías
- **Gestión de Categorías**: Organizar y gestionar categorías de productos
- **Gestión de Pedidos**: Ver, actualizar y rastrear todos los pedidos de clientes
- **Moderación de Reseñas**: Aprobar/rechazar reseñas de productos con sistema de verificación
- **Logs del Sistema**: Sistema completo de gestión de logs con filtrado y exportación
- **Controles de Administrador**: Control de acceso basado en roles y gestión de permisos

### Características Técnicas
- **Integración Material-UI**: Framework UI completo con temas personalizados
- **TypeScript**: Seguridad de tipos completa en toda la aplicación
- **Context API**: Gestión de estado global para autenticación y carrito
- **Custom Hooks**: Lógica de negocio reutilizable para obtención de datos y gestión de estado
- **Rutas Protegidas**: Control de acceso completo basado en roles
- **Manejo de Errores**: Límites de error globales y mensajes de error amigables
- **Estados de Carga**: Indicadores de carga sofisticados y pantallas de esqueleto
- **Integración API**: Integración completa de API REST con manejo de errores
- **Validación de Formularios**: Validación del lado del cliente con retroalimentación en tiempo real
- **Internacionalización**: Utilidades de soporte multi-idioma

## 🛠️ Stack Tecnológico

### Tecnologías Principales
- **React 19** - Framework React más reciente con características concurrentes
- **TypeScript 4.9** - Seguridad de tipos completa y características modernas de JS
- **Material-UI v7** - Biblioteca de componentes completa y sistema de diseño
- **React Router v7** - Enrutamiento del lado del cliente con carga de datos

### UI y Estilos
- **@mui/material** - Componentes principales de Material-UI
- **@mui/icons-material** - Iconos de Material Design
- **@mui/lab** - Componentes experimentales de Material-UI
- **@emotion/react & @emotion/styled** - Solución de estilos CSS-in-JS
- **CSS Personalizado** - Estilos adicionales con variables CSS

### Gestión de Estado y Obtención de Datos
- **React Context API** - Estado global para autenticación y carrito
- **Custom Hooks** - Lógica reutilizable de obtención de datos y estado
- **Fetch API** - Cliente HTTP con interceptores y manejo de errores

### Desarrollo y Pruebas
- **Create React App** - Entorno de desarrollo y herramientas de construcción
- **@testing-library/react** - Utilidades de prueba de componentes
- **@testing-library/jest-dom** - Matchers extendidos de Jest
- **@testing-library/user-event** - Pruebas de interacción del usuario
- **ESLint y TypeScript** - Calidad de código y verificación de tipos

### Utilidades
- **date-fns** - Biblioteca moderna de manipulación de fechas
- **web-vitals** - Monitoreo de rendimiento
- **React DevTools** - Soporte de depuración para desarrollo

## 📦 Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd frontend-blog-ecommerce
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configuración del entorno**
   ```bash
   cp .env.example .env
   ```
   Actualiza el archivo `.env` con tu configuración:
   ```
   REACT_APP_API_URL=https://ecommerce-blog-backend.onrender.com
   REACT_APP_APP_NAME=E-Commerce & Blog
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

La aplicación se abrirá en tu navegador en `http://localhost:3000`.

## 🔧 Scripts Disponibles

- `npm start` - Ejecuta la aplicación en modo de desarrollo (auto-recarga habilitada)
- `npm test` - Lanza el ejecutor de pruebas en modo de vigilancia interactiva
- `npm run build` - Construye la aplicación para producción en la carpeta `build`
- `npm run eject` - Expulsa de Create React App (⚠️ operación irreversible)

## 🌐 Integración API

El frontend se integra con una **API backend NestJS** desplegada en Render:
- **API de Producción**: `https://ecommerce-blog-backend.onrender.com`
- **Desarrollo Local**: `http://localhost:3000` (si ejecutas el backend localmente)

### Funcionalidades API Integradas:
- **Autenticación** - Inicio de sesión/registro basado en JWT
- **Usuarios** - Gestión completa de usuarios
- **Productos** - Catálogo de productos con categorías
- **Pedidos** - Procesamiento y seguimiento de pedidos
- **Reseñas** - Sistema de reseñas de productos
- **Administrador** - Operaciones administrativas
- **Logs** - Registro y monitoreo del sistema

## 📱 Diseño Responsivo

La aplicación es completamente responsiva y está optimizada para todos los tipos de dispositivos:

### Soporte de Dispositivos:
- **Teléfonos Móviles** (320px - 768px) - Interfaz optimizada para táctil
- **Tabletas** (768px - 1024px) - Diseño adaptativo con soporte táctil
- **Escritorio** (1024px+) - Interfaz completa con estados hover
- **Pantallas Grandes** (1440px+) - Diseño optimizado para pantallas amplias

### Características Responsivas Clave:
- Arquitectura CSS mobile-first
- Tamaños de botones y espaciado amigables al tacto
- Menú de navegación colapsable
- Tablas de datos responsivas con desplazamiento horizontal
- Diseños de formularios adaptativos
- Carga e imágenes optimizadas

## 🏛️ Arquitectura y Componentes

### Arquitectura de Gestión de Estado:
```typescript
AuthContext     - Autenticación de usuario y gestión de sesión
CartContext     - Estado del carrito de compras y operaciones
Custom Hooks    - Encapsulación de obtención de datos y lógica de negocio
```

### Componentes Clave:

#### Componentes del Panel de Administración:
- **Dashboard** - Métricas, gráficos y vista general del sistema
- **AdminUsers** - CRUD completo de usuarios con gestión de roles
- **AdminProducts** - Gestión de productos con asignación de categorías
- **AdminOrders** - Procesamiento de pedidos y gestión de estado
- **AdminReviews** - Moderación de reseñas con sistema de aprobación
- **AdminLogs** - Gestión de logs del sistema con filtrado y exportación
- **AdminCategories** - Organización de categorías de productos

#### Componentes Públicos:
- **Header/Navigation** - Navegación responsiva con menú de usuario
- **ProductList** - Catálogo de productos paginado con filtrado
- **ProductDetail** - Vista detallada de producto con reseñas
- **Cart** - Gestión del carrito de compras
- **Checkout** - Flujo de trabajo de procesamiento de pedidos
- **ReviewSystem** - Sistema de reseñas y calificación de productos

#### Componentes Compartidos:
- **ProtectedRoute** - Protección de rutas basada en roles
- **Button, Input, Loader** - Componentes UI reutilizables
- **Error Boundaries** - Manejo de errores global

## 🚀 Comenzando

### Prerrequisitos:
- **Node.js** (versión 16 o superior)
- **npm** o **yarn** gestor de paquetes
- **Navegador web moderno** (Chrome, Firefox, Safari, Edge)

### Inicio Rápido:
1. **Configuración del Backend** - Asegúrate de que el backend NestJS esté ejecutándose:
   - Producción: `https://ecommerce-blog-backend.onrender.com` (ya desplegado)
   - Local: Ejecuta el backend en `http://localhost:3000`

2. **Configuración del Frontend**:
   ```bash
   npm install
   npm start
   ```

3. **Acceder a la Aplicación**:
   - Frontend: `http://localhost:3000`
   - Inicia sesión con credenciales de prueba o registra una nueva cuenta

4. **Acceso de Administrador**:
   - Usa credenciales de administrador para acceder a las rutas `/admin`
   - Operaciones CRUD completas disponibles para todas las entidades

### Cuentas de Prueba:
```
Usuario Regular:
- Email: user@test.com
- Contraseña: password123

Usuario Administrador:
- Email: admin@test.com  
- Contraseña: admin123
```

## 📊 Estado Actual de Implementación

### ✅ Características Completamente Implementadas:

#### Autenticación y Seguridad:
- [x] Autenticación basada en JWT
- [x] Control de acceso basado en roles (Admin/Usuario)
- [x] Rutas protegidas y guardias de ruta
- [x] Gestión de sesión y actualización de tokens
- [x] Páginas de Login/Registro con validación

#### Panel de Administración (CRUD Completo):
- [x] **Dashboard** - Métricas y vista general del sistema
- [x] **Gestión de Usuarios** - Crear, leer, actualizar, eliminar usuarios
- [x] **Gestión de Productos** - Gestión completa del ciclo de vida de productos
- [x] **Gestión de Categorías** - Organización de categorías de productos
- [x] **Gestión de Pedidos** - Procesamiento y seguimiento de pedidos
- [x] **Gestión de Reseñas** - Sistema de moderación de reseñas
- [x] **Gestión de Logs** - Logs del sistema con filtrado y exportación
- [x] **Navegación de Admin** - Sistema de menú basado en roles

#### Características Públicas:
- [x] **Catálogo de Productos** - Navegar, buscar y filtrar productos
- [x] **Detalles de Productos** - Páginas individuales de productos
- [x] **Sistema de Reseñas** - Reseñas y calificaciones de productos
- [x] **Carrito de Compras** - Gestión y persistencia del carrito
- [x] **Pedidos de Usuario** - Historial y seguimiento de pedidos
- [x] **Diseño Responsivo** - Diseño responsivo mobile-first

#### Infraestructura Técnica:
- [x] **Integración TypeScript** - Seguridad de tipos completa
- [x] **Integración Material-UI** - Biblioteca de componentes completa
- [x] **Integración API** - API REST con manejo de errores
- [x] **Gestión de Estado** - Context API y custom hooks
- [x] **Manejo de Errores** - Límites de error globales
- [x] **Estados de Carga** - Indicadores de carga comprensivos
- [x] **Validación de Formularios** - Validación del lado del cliente
- [x] **Enrutamiento** - Sistema de rutas protegidas y públicas

### 🔄 Características Avanzadas:
- [x] **Exportación de Datos** - Funcionalidad de exportación de datos de admin
- [x] **Filtrado Avanzado** - Sistemas de filtrado multi-criterio
- [x] **Actualizaciones en Tiempo Real** - Actualización dinámica de datos
- [x] **Funcionalidad de Búsqueda** - Búsqueda global y contextual
- [x] **Paginación** - Paginación eficiente de datos
- [x] **Ordenamiento** - Capacidades de ordenamiento multi-columna

### 🎯 Optimizaciones de Rendimiento:
- [x] **Carga Perezosa** - División de código basada en componentes
- [x] **Memoización** - Optimizaciones React.memo y useMemo
- [x] **Renderizado Eficiente** - Re-renderizados mínimos
- [x] **Optimización de Imágenes** - Carga de imágenes responsiva
- [x] **Optimización de Bundle** - División de código y tree shaking

## 🔗 Proyectos Relacionados

Este frontend está diseñado para trabajar con el correspondiente **Backend NestJS E-Commerce**:
- **Repositorio del Backend**: [API Backend E-Commerce](https://github.com/Someguy105/finalproject_backend)
- **Backend Desplegado**: `https://ecommerce-blog-backend.onrender.com`
- **Características del Backend**: MongoDB, JWT Auth, APIs CRUD, Permisos basados en roles

## 🧪 Pruebas

### Framework de Pruebas:
- **@testing-library/react** - Pruebas de componentes
- **@testing-library/jest-dom** - Matchers extendidos de Jest
- **@testing-library/user-event** - Pruebas de interacción del usuario

### Ejecutar Pruebas:
```bash
npm test                    # Ejecutar pruebas en modo vigilancia
npm test -- --coverage     # Ejecutar pruebas con reporte de cobertura
npm test -- --watchAll     # Ejecutar todas las pruebas en modo vigilancia
```

### Áreas de Cobertura de Pruebas:
- Renderizado y comportamiento de componentes
- Interacciones del usuario y envío de formularios
- Integración API y manejo de errores
- Flujos de autenticación
- Funcionalidad del panel de administración

## 🚀 Despliegue

### Construir para Producción:
```bash
npm run build
```

### Opciones de Despliegue:
- **Netlify** - Despliegue automático desde Git
- **Vercel** - Despliegue sin configuración
- **GitHub Pages** - Alojamiento de sitio estático
- **AWS S3** - Almacenamiento en la nube con CDN CloudFront

### Variables de Entorno para Producción:
```
REACT_APP_API_URL=https://ecommerce-blog-backend.onrender.com
REACT_APP_APP_NAME=E-Commerce & Blog
```

## 🤝 Contribuir

1. Hacer fork del repositorio
2. Crear tu rama de característica (`git checkout -b feature/CaracteristicaIncreible`)
3. Confirmar tus cambios (`git commit -m 'Agregar alguna CaracteristicaIncreible'`)
4. Subir a la rama (`git push origin feature/CaracteristicaIncreible`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

---

**🎉 Solución E-Commerce Completa con React, TypeScript, Material-UI y Backend NestJS!**
