# Seguridad de la API

## SQL Injection

La inyección SQL ocurre cuando la entrada del usuario se concatena directamente en una consulta. Un atacante puede manipular la consulta para acceder a datos que no debería ver.

### Ejemplo vulnerable
```sql
-- El atacante envía como título: '; DROP TABLE notes;--
const query = "SELECT * FROM notes WHERE title = '" + title + "'";
-- Resultado: SELECT * FROM notes WHERE title = ''; DROP TABLE notes;--'
-- Esto eliminaría toda la tabla notes
```

### Solución: consultas parametrizadas
Las consultas parametrizadas envían la estructura SQL y los valores por separado. La base de datos precompila el SQL y trata los parámetros estrictamente como datos, nunca como código:

```sql
-- Seguro: el atacante no puede modificar la estructura de la consulta
const query = "SELECT * FROM notes WHERE title = $1";
await db.query(query, [req.body.title]);
```

## Variables de entorno

Las variables de entorno permiten separar la configuración del código. El connection string de la base de datos nunca debe aparecer en el código fuente por varias razones:

- El código fuente se sube a GitHub y es público
- Si alguien accede al repositorio tendría acceso completo a la base de datos
- Las credenciales deben poder cambiarse sin modificar el código

### Cómo se usan en este proyecto
- `.env.local` contiene las variables reales y está en `.gitignore`
- `.env.example` es una plantilla con las claves vacías que sí se sube a GitHub
- En producción (Vercel) las variables se configuran en el panel de control

### Regla fundamental
**Nunca subas credenciales, tokens o connection strings a GitHub.**