# Versionado de Open Condo

Open Condo usa versionado semántico `MAJOR.MINOR.PATCH`.

## Durante la etapa 0.x

Las versiones `0.x` son experimentales. Pueden cambiar, pero el proyecto documentará toda incompatibilidad y procurará rutas de migración.

- `0.1.0`: núcleo inicial.
- `0.1.x`: correcciones editoriales o de validación que no cambian el significado esperado.
- `0.2.0`: nuevas capacidades compatibles o nuevos dominios experimentales.
- `1.0.0`: primera versión estable.

## Cambios PATCH

Pueden incluir:

- corrección de errores tipográficos;
- aclaraciones sin cambio semántico;
- ejemplos adicionales;
- relajación de una restricción por error, cuando no invalide documentos previamente válidos.

## Cambios MINOR

Pueden incluir:

- nuevos campos opcionales;
- nuevos esquemas;
- nuevos valores de enumeración cuando los consumidores estén obligados a tolerarlos;
- nuevas reglas no incompatibles.

## Cambios MAJOR

Incluyen:

- eliminar o renombrar propiedades;
- convertir un campo opcional en obligatorio;
- cambiar el tipo o significado de un campo;
- restringir valores previamente válidos;
- modificar reglas referenciales de forma incompatible.

## Declaración de versión

Cada entidad y cada exportación DEBE incluir `schema_version`. La versión declara el contrato usado para producir el documento, no la versión de la aplicación que lo generó.

## Estabilidad de identificadores de esquema

Los `$id` publicados para una versión no deben reutilizarse con contenido incompatible. Una corrección incompatible requiere un nuevo directorio de versión.

## Deprecación

Antes de eliminar una capacidad estable, el proyecto DEBERÍA:

1. marcarla como obsoleta;
2. explicar la alternativa;
3. publicar una guía de migración;
4. mantenerla durante al menos una versión menor cuando sea posible.
