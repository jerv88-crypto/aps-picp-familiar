# PICP APS Familiar

Aplicación para diligenciar, analizar y exportar el **Formato Integral de Plan de Cuidado Primario en Salud (APS) Familiar**, conforme a la Ley 3280 de 2018 de Colombia, RIAS y Planes Integrales de Cuidado Primario (PICP). Pensada para uso multi-usuario y despliegue en GitHub.

## Características

- **Autenticación**: inicio de sesión con Google, Facebook o correo y contraseña (con confirmación). Registro gratuito.
- **Popup de bienvenida**: al entrar se muestra información sobre la app y en qué momento aplica el pago por planes.
- **Formularios por secciones** desplegables (Datos Generales, Vivienda, Agua/Saneamiento, Composición Familiar, Grupos Prioritarios, Prácticas y Recursos).
- **Módulo dinámico** de integrantes con botón "AGREGAR INTEGRANTE".
- **Tamizajes automáticos** según ciclo de vida y Ley 3280/2018.
- **Análisis PICP** con descripción del caso, tablas de evaluación y seguimiento.
- **Pago por planes**: cada plan de cuidado primario creado y guardado tiene un costo de **$10.000 COP**. Al generar el análisis PICP se muestra la pantalla de pago (transferencia, PSE o tarjeta débito según configure el administrador).
- **Contador de planes** creados visible en la barra de navegación.
- **Exportación a Excel** (.xlsx) en una sola hoja con formato profesional y ordenado.
- **Panel de administración** (solo rol ADMIN): configuración del prompt PICP, cuenta para recibir pagos, y dashboard de usuarios (información, cantidad de planes, estado de pago). El admin puede confirmar pagos pendientes.
- **Diseño responsive** para uso en escritorio y móvil.

## Conexión con Supabase (forma técnica)

La app se conecta a Supabase desde el cliente con **URL** y **anon key**:

- **Archivo**: `src/lib/supabase.ts`
- **Variables de entorno** (en `.env`):
  - `VITE_SUPABASE_URL`: URL del proyecto (ej. `https://xxxx.supabase.co`)
  - `VITE_SUPABASE_ANON_KEY`: clave pública anónima (Settings → API en el dashboard)

El cliente se crea con `createClient(url, anonKey)` de `@supabase/supabase-js`. Si faltan las variables, la app corre en modo sin backend (login de desarrollo). El resto del código usa `supabase` y `hasSupabase` importados desde `src/lib/supabase`.

## Configuración para producción (Supabase)

La app usa [Supabase](https://supabase.com) para autenticación y base de datos.

### 1. Crear proyecto en Supabase

1. Cree una cuenta en [supabase.com](https://supabase.com).
2. Cree un nuevo proyecto y anote la **URL** y la **anon key** (Settings → API).

### 2. Variables de entorno

Copie el archivo de ejemplo y complete con sus datos:

```bash
cp .env.example .env
```

Edite `.env`:

```
VITE_SUPABASE_URL=https://SUA-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=su-anon-key
# Opcional: VITE_ADMIN_PASSWORD=tu-contraseña-admin
```

Para subir la app a GitHub, consulte `GITHUB_SETUP.md`.

### 3. Ejecutar el esquema SQL

En el panel de Supabase vaya a **SQL Editor** → **New query**, pegue el contenido de `supabase/schema.sql` y ejecútelo. Esto crea las tablas (`profiles`, `plans`, `payments`, `admin_config`), políticas RLS y el trigger para crear el perfil al registrarse.

### 4. Habilitar proveedores de login

En **Authentication** → **Providers** habilite los que vaya a usar:

- **Google / Facebook**: siga la guía de Supabase para configurar OAuth (credenciales en cada proveedor y URLs de redirección).
- **Email**: puede dejar "Confirm email" desactivado para desarrollo o activarlo en producción.

### 5. Asignar el primer administrador

Tras registrarse con el correo que quiera usar como admin, en Supabase vaya a **Table Editor** → tabla `profiles`, busque su fila y cambie la columna `role` de `USUARIO` a `ADMIN`. Solo los usuarios con `role = 'ADMIN'` pueden acceder a `/admin`, configurar el prompt, la cuenta de pago y ver el dashboard de usuarios.

## Finales de línea (LF / CRLF)

El proyecto usa **LF** en el repositorio para evitar el aviso de GitHub sobre cambios de line endings. El archivo `.gitattributes` fuerza `eol=lf` en los archivos de texto. Si ves el aviso "This diff contains a change in line endings from 'LF' to 'CRLF'":

1. Asegúrate de tener el último código (incluido `.gitattributes`).
2. En la raíz del proyecto ejecuta:  
   `git add --renormalize .`  
   `git commit -m "Normalizar finales de línea a LF"`  
   `git push`

A partir de ahí, Git mantendrá LF al hacer checkout y el aviso no debería volver.

## Instalación

```bash
cd aps-picp-familiar
npm install
```

## Ejecución

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en el navegador.

**Sin configurar Supabase**: en la pantalla de login aparecerá la opción "Entrar como desarrollo" para probar la app sin backend.

## Build para producción

```bash
npm run build
```

Los archivos quedan en `dist/`. Puede desplegar en Vercel, Netlify, GitHub Pages o cualquier estático; configure las variables de entorno en la plataforma.

## Estructura del proyecto

```
aps-picp-familiar/
├── src/
│   ├── components/     # Layout, WelcomePopup, PaymentModal, formularios
│   ├── context/        # AuthContext (auth y rol)
│   ├── hooks/          # usePlanSummary
│   ├── forms/          # Formularios por sección
│   ├── pages/          # Login, Formulario, Análisis, Exportar, Admin
│   ├── lib/            # storage, supabase, plansApi, adminConfigApi, excelExport, ley3280
│   ├── services/       # análisis PICP
│   └── types/          # TypeScript y tipos Supabase
├── supabase/
│   └── schema.sql      # Esquema de BD y RLS
├── .env.example
└── package.json
```

## Uso

1. **Login**: Inicie sesión con Google, Facebook o correo/contraseña. Si es la primera vez, se muestra el popup de bienvenida.
2. **Formulario**: Diligencie las secciones y use "AGREGAR INTEGRANTE" para cada miembro de la familia. Guarde cuando lo necesite.
3. **Análisis**: Pulse "Generar Análisis PICP". Se guarda el plan y, si hay planes pendientes de pago, se abre la pantalla de pago ($10.000 COP por plan). Puede pagar por transferencia (datos configurados por el admin), PSE o tarjeta débito (el admin confirma el pago desde el panel).
4. **Exportar**: Descargue el Excel con toda la información en una sola hoja con formato ordenado.
5. **Admin**: Si tiene rol ADMIN, verá "Admin" en el menú para configurar el prompt, la cuenta de pago y el dashboard de usuarios.

## Tecnologías

- React + TypeScript
- Vite
- Supabase (Auth + PostgreSQL)
- xlsx (SheetJS)
- Lucide React (iconos)

---

© APS Familiar - RIAS - Minsalud Colombia
