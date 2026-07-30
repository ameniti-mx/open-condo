# Guía de implementación de Open Condo 0.1

Esta guía acompaña a los JSON Schema normativos. No reemplaza los esquemas ni las reglas de [conventions.md](conventions.md).

## 1. Objetivo de una implementación

Un exportador conforme produce un documento JSON que:

1. valida estructuralmente contra `schemas/v0.1/export.schema.json`;
2. cumple las reglas semánticas entre entidades;
3. contiene únicamente los datos necesarios para el propósito declarado;
4. puede ser interpretado sin conocer identificadores internos del proveedor.

Un importador conforme debe rechazar documentos inválidos de forma segura y reportar errores suficientemente precisos para corregirlos.

## 2. Flujo recomendado de exportación

1. Selecciona un único condominio.
2. Genera identificadores opacos y estables dentro del conjunto exportado.
3. Exporta las unidades relacionadas.
4. Exporta únicamente las personas necesarias.
5. Construye ocupaciones que relacionen personas y unidades.
6. Exporta cargos y pagos en la moneda declarada.
7. Verifica referencias, fechas, duplicados y aplicaciones de pagos.
8. Valida el archivo antes de entregarlo.
9. Protege el archivo durante almacenamiento y transporte.

## 3. Identificadores

Los campos `id` son strings opacos. Un consumidor no debe inferir tipo, orden, fecha, correo, teléfono, CURP u otra información a partir del valor.

Recomendaciones:

- utiliza UUID, ULID u otro identificador aleatorio o pseudónimo;
- conserva estabilidad durante una misma migración;
- evita enteros secuenciales expuestos cuando revelen volumen o antigüedad;
- no reutilices un identificador para entidades distintas;
- usa `external_ids` o `metadata` únicamente cuando exista una necesidad real de conciliación.

## 4. Fechas y zonas horarias

- Fechas civiles: `YYYY-MM-DD`.
- Instantes: RFC 3339 con zona horaria explícita.
- El campo `timezone` del condominio usa nombres IANA, por ejemplo `America/Mexico_City`.
- No conviertas fechas civiles, como un periodo de cuota, en instantes UTC.
- `updated_at` no puede ser anterior a `created_at`.

## 5. Dinero

Cada cantidad monetaria incluye `value` y `currency`.

- La moneda usa ISO 4217.
- No uses números de punto flotante para cálculos contables internos.
- Al serializar JSON, limita la precisión al número de decimales admitido por la moneda y por el sistema origen.
- Las aplicaciones de un pago no pueden exceder el importe del pago.
- Una aplicación debe corresponder a un cargo de la misma unidad y moneda.
- Los saldos derivados deben recalcularse; no deben asumirse a partir de etiquetas o notas.

## 6. Personas y minimización de datos

La entidad `person` representa una persona relacionada con el condominio, no una identidad gubernamental completa.

Exporta únicamente atributos necesarios para migración o interoperabilidad. No incluyas:

- contraseñas o hashes de contraseña;
- tokens de sesión, API keys o secretos;
- biométricos;
- números completos de tarjeta;
- documentos adjuntos incrustados;
- códigos QR de acceso activos;
- datos sensibles sin justificación y base legal.

Consulta [privacy.md](privacy.md).

## 7. Relaciones e integridad referencial

Además de validar JSON Schema, verifica:

- IDs únicos por colección;
- `condominium_id` consistente;
- referencias a unidades, personas y cargos existentes;
- rangos de fechas coherentes;
- indivisos dentro de su escala;
- aplicaciones de pagos no superiores al total;
- correspondencia de unidad y moneda en pagos.

El script `npm run validate` incluye estas comprobaciones para la versión 0.1.

## 8. Extensiones

Los campos no definidos por el estándar no deben agregarse directamente a las entidades. Usa `metadata` cuando el esquema lo permita.

Buenas prácticas:

- usa una clave con espacio de nombres, por ejemplo `mx.proveedor.modulo`;
- documenta públicamente la estructura cuando pretendas interoperabilidad;
- no conviertas una extensión privada en requisito para interpretar campos estándar;
- propón formalizar extensiones de uso común mediante issue.

## 9. Importación segura

Un importador debe:

1. limitar tamaño de archivo, profundidad y número de registros;
2. analizar JSON sin ejecutar contenido;
3. validar antes de escribir en producción;
4. realizar la importación en una transacción o área temporal;
5. producir un reporte de altas, actualizaciones, omisiones y errores;
6. evitar conciliaciones automáticas basadas únicamente en nombres;
7. requerir revisión para conflictos de identidad o dinero;
8. registrar la versión del esquema y el identificador de exportación.

## 10. Compatibilidad

- Un consumidor de `0.1.x` debe fijar explícitamente las versiones que soporta.
- No asumas que cualquier versión futura es compatible.
- Rechaza una versión mayor o menor no soportada con un mensaje claro.
- Conserva el archivo original durante una migración auditada.
- Documenta transformaciones realizadas al importar.

## 11. Lista de verificación

Antes de publicar una integración:

- [ ] valida el ejemplo oficial;
- [ ] valida al menos un archivo real anonimizado;
- [ ] prueba IDs duplicados y referencias rotas;
- [ ] prueba fechas y monedas inconsistentes;
- [ ] prueba pagos parcialmente aplicados y no aplicados;
- [ ] revisa minimización y retención de datos;
- [ ] documenta límites de tamaño;
- [ ] documenta versiones soportadas;
- [ ] entrega mensajes de error accionables;
- [ ] verifica que una importación fallida no deje datos parciales.