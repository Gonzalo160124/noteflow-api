# NoteFlow API

API REST para la app móvil NoteFlow. Construida con Next.js, PostgreSQL en Neon y desplegada en Vercel.

## Stack tecnológico
- Next.js 16 (App Router)
- TypeScript
- PostgreSQL (Neon DB)
- Zod (validación)

## Setup

1. Clona el repositorio:
```bash
git clone https://github.com/Gonzalo160124/noteflow-api.git
cd noteflow-api
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea el archivo `.env.local` con las variables de entorno:
```
DATABASE_URL=postgresql://usuario:password@host/db?sslmode=require
```

4. Ejecuta el schema SQL en la consola de Neon (archivo `sql/schema.sql`)

5. Arranca el servidor:
```bash
npm run dev
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| DATABASE_URL | Connection string de PostgreSQL en Neon |

## Endpoints

### Notas

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| GET | /api/notes | - | Array de notas |
| POST | /api/notes | `{ title, type, content?, color? }` | Nota creada (201) |
| GET | /api/notes/:id | - | Nota por id |
| PATCH | /api/notes/:id | `{ title?, content?, color? }` | Nota actualizada |
| DELETE | /api/notes/:id | - | 204 No Content |

### Checklist Items

| Método | Ruta | Body | Respuesta |
|--------|------|------|-----------|
| GET | /api/notes/:id/checklist-items | - | Array de items |
| POST | /api/notes/:id/checklist-items | `{ text }` | Item creado (201) |
| PATCH | /api/checklist-items/:itemId | `{ is_completed }` | Item actualizado |
| DELETE | /api/checklist-items/:itemId | - | 204 No Content |

## Tipos de nota

- `note` - Nota de texto con título y contenido
- `checklist` - Lista de tareas con items completables
- `idea` - Nota de idea con etiquetas y color
