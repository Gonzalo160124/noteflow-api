# Backend – Teoría

## Patrón cliente-servidor

Una app móvil nunca debe conectarse directamente a una base de datos. Si el connection string estuviese embebido en el binario de la app, cualquiera que la descompile tendría acceso completo a la base de datos.

El patrón cliente-servidor divide la responsabilidad en tres capas:
- **Cliente**: la app móvil, que solo hace peticiones HTTP
- **Servidor (API)**: actúa como guardián, valida datos y permisos
- **Base de datos**: solo accesible desde el servidor

## Qué es una API REST

Una API REST es una interfaz que permite comunicar el cliente con el servidor mediante HTTP. Cada recurso tiene una URL y se manipula con métodos HTTP estándar.

## Métodos HTTP

- **GET** → leer datos
- **POST** → crear datos
- **PATCH** → modificar datos parcialmente
- **DELETE** → eliminar datos

## Códigos de estado

- **200 OK** → petición correcta
- **201 Created** → recurso creado
- **400 Bad Request** → datos incorrectos
- **401 Unauthorized** → sin permiso
- **404 Not Found** → recurso no encontrado
- **500 Internal Server Error** → error del servidor

Nunca devuelvas el error real de la base de datos al cliente: es información interna que un atacante podría usar.

## Bases de datos relacionales

Organizan los datos en tablas con filas y columnas. Cada tabla representa una entidad del dominio y las tablas se conectan mediante claves.

### ACID
- **Atomicidad**: una transacción se ejecuta completa o no se ejecuta
- **Consistencia**: los datos siempre quedan en un estado válido
- **Aislamiento**: las transacciones no se interfieren entre sí
- **Durabilidad**: los cambios persisten aunque el sistema falle

### Primary Key
Identificador único e irrepetible. Se prefiere UUID sobre enteros autoincrementales en apps móviles porque el cliente puede generar el ID antes de conectarse a la red, permitiendo crear notas offline.

### Foreign Key
Columna que referencia la primary key de otra tabla. `ON DELETE CASCADE` significa que al borrar una nota, sus checklist items se borran automáticamente.

### DDL vs DML
- **DDL**: define la estructura con CREATE, ALTER y DROP
- **DML**: manipula los datos con SELECT, INSERT, UPDATE y DELETE

## Diagrama Entidad-Relación
notes (1) ──── (N) checklist_items
id UUID PK         id UUID PK
title              note_id UUID FK → notes.id
content            text
type               is_completed
color
created_at
updated_at
notes (1) ──── (N) note_tags
id UUID PK
note_id UUID FK → notes.id
tag

Una nota puede tener muchos checklist items y muchas etiquetas. Al eliminar una nota, sus items y etiquetas se eliminan automáticamente por el ON DELETE CASCADE.

## JOINs

### INNER JOIN
Devuelve solo las filas que tienen coincidencia en ambas tablas. Úsalo cuando necesitas datos que existen en las dos tablas, por ejemplo notas que tengan al menos un item.

### LEFT JOIN
Devuelve todas las filas de la tabla izquierda y las coincidentes de la derecha. Si no hay coincidencia devuelve NULL. Úsalo para notas con sus items, porque una nota puede no tener items y no queremos perderla.

```sql
SELECT 
  n.*,
  json_agg(ci.*) FILTER (WHERE ci.id IS NOT NULL) as items,
  json_agg(nt.tag) FILTER (WHERE nt.id IS NOT NULL) as tags
FROM notes n
LEFT JOIN checklist_items ci ON n.id = ci.note_id
LEFT JOIN note_tags nt ON n.id = nt.note_id
GROUP BY n.id
ORDER BY n.created_at DESC;
```