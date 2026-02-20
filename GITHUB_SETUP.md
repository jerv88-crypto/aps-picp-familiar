# Subir la app a GitHub

Esta guía te ayuda a subir **aps-picp-familiar** a GitHub sin problemas.

## Requisitos

1. **Git** instalado: [git-scm.com/downloads](https://git-scm.com/downloads)
2. Cuenta en [GitHub](https://github.com)

---

## Pasos para subir

### 1. Instalar Git (si aún no lo tienes)

Descarga e instala Git desde [git-scm.com](https://git-scm.com/downloads). Después de instalar, cierra y vuelve a abrir la terminal.

### 2. Inicializar el repositorio

En la terminal, dentro de la carpeta del proyecto:

```bash
cd c:\Users\JHONE\aps-picp-familiar
git init
```

### 3. Comprobar qué archivos se subirán

```bash
git status
```

**Importante:** NO deben aparecer `node_modules`, `dist`, `.env` ni archivos con contraseñas. Si aparecen, revisa el `.gitignore`.

### 4. Añadir archivos y hacer el primer commit

```bash
git add .
git status
git commit -m "Initial commit: PICP APS Familiar"
```

### 5. Crear el repositorio en GitHub

1. Entra en [github.com](https://github.com) → **New repository**
2. Pon el nombre (por ejemplo: `aps-picp-familiar`)
3. **No** marques "Initialize with README"
4. Clic en **Create repository**

### 6. Conectar y subir

En la terminal, sustituye `TU_USUARIO` y `aps-picp-familiar` por tu usuario y nombre del repo si son distintos:

```bash
git remote add origin https://github.com/TU_USUARIO/aps-picp-familiar.git
git branch -M main
git push -u origin main
```

Te pedirán usuario y contraseña/token de GitHub.

---

## Problemas habituales

### "Archivos muy grandes"

- `node_modules` y `dist` están en `.gitignore` y no deberían subirse.
- Si algo pesa >100 MB, GitHub lo rechaza. Comprueba con `git status` qué se está subiendo.

### "Credenciales rechazadas" o "Contraseña incorrecta"

GitHub ya no acepta contraseñas normales para `git push`. Debes usar un **Personal Access Token**:

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens**
2. **Generate new token (classic)**
3. Marca el permiso `repo`
4. Usa ese token como contraseña cuando hagas `git push`

### "No me deja subir X carpeta/archivo"

- `.env` no debe subirse (contiene claves). Está en `.gitignore`.
- `.env.example` sí se sube (solo plantilla sin datos reales).
- Las contraseñas se configuran con variables de entorno en tu máquina o en el host donde despliegues.

---

## Resumen de lo ya preparado

- **Contraseña de admin** movida a variable de entorno `VITE_ADMIN_PASSWORD` en `.env` (no en el código).
- **`.gitignore`** actualizado para excluir `node_modules`, `dist`, `.env`, cachés y archivos de IDE.
- Proyecto listo para `git init` y subida a GitHub.
