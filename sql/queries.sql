-- Consulta principal: obtener todas las notas con sus items y etiquetas
-- LEFT JOIN se usa porque una nota puede no tener items ni etiquetas
-- Si usáramos INNER JOIN, las notas sin items no aparecerían en los resultados

SELECT 
  n.*,
  -- json_agg agrupa todos los items de cada nota en un array JSON
  -- FILTER (WHERE ci.id IS NOT NULL) evita que aparezca [null] cuando no hay items
  json_agg(ci.*) FILTER (WHERE ci.id IS NOT NULL) as items,
  
  -- Lo mismo para las etiquetas
  json_agg(nt.tag) FILTER (WHERE nt.id IS NOT NULL) as tags

FROM notes n

-- LEFT JOIN: devuelve todas las notas aunque no tengan checklist items
LEFT JOIN checklist_items ci ON n.id = ci.note_id

-- LEFT JOIN: devuelve todas las notas aunque no tengan etiquetas
LEFT JOIN note_tags nt ON n.id = nt.note_id

-- GROUP BY es necesario porque usamos json_agg (función de agregación)
GROUP BY n.id

-- Ordenar por fecha de creación, más recientes primero
ORDER BY n.created_at DESC;