# Convenciones normativas de Open Condo 0.1

Las palabras **DEBE**, **NO DEBE**, **DEBERÍA**, **NO DEBERÍA** y **PUEDE** se interpretan como requisitos normativos.

## 1. Codificación y formato

- Los documentos DEBEN ser JSON válido codificado en UTF-8.
- Los nombres de propiedades usan `snake_case` en inglés para mantener estabilidad técnica internacional.
- Los valores descriptivos pueden escribirse en español.
- Un productor NO DEBE emitir propiedades no declaradas por el esquema, salvo dentro de `metadata`.
- Un consumidor DEBE validar contra JSON Schema Draft 2020-12 antes de importar.

## 2. Identificadores

- `id` DEBE ser un string opaco, estable y único dentro de su tipo de entidad y conjunto de exportación.
- Un ID NO DEBE contener nombre, correo, teléfono, CURP, RFC ni información que identifique directamente a una persona.
- Un consumidor NO DEBE inferir semántica del formato de un ID.
- `external_ids` PUEDE conservar identificadores de sistemas previos.
- La pareja `system` + `value` DEBERÍA ser única dentro de cada entidad.

## 3. Referencias e integridad

En una exportación completa:

- cada `unit.condominium_id` DEBE coincidir con `condominium.id`;
- cada `occupancy.unit_id` DEBE apuntar a una unidad existente;
- cada `occupancy.person_id` DEBE apuntar a una persona existente;
- cada `charge.unit_id` y `payment.unit_id` DEBE apuntar a una unidad existente;
- cada `allocation.charge_id` DEBE apuntar a un cargo existente;
- todas las entidades DEBEN pertenecer al mismo condominio.

JSON Schema valida estructura, pero estas reglas referenciales DEBEN comprobarse adicionalmente por el importador.

## 4. Fechas y tiempo

- Fechas sin hora DEBEN usar `YYYY-MM-DD`.
- Fechas con hora DEBEN usar RFC 3339 e incluir offset o `Z`.
- No se permiten fechas ambiguas como `08/10/26`.
- `updated_at` NO DEBE ser anterior a `created_at`.
- `valid_until`, cuando exista, NO DEBE ser anterior a `valid_from`.
- `period.end` NO DEBE ser anterior a `period.start`.
- El productor DEBERÍA conservar el offset original del evento.

## 5. Dinero

- Todo importe DEBE incluir `value` y `currency`.
- `currency` DEBE ser un código ISO 4217 en mayúsculas.
- Para pesos mexicanos se usa `MXN`.
- `value` usa unidades mayores; `2500.50` significa dos mil quinientos pesos con cincuenta centavos cuando la moneda es MXN.
- Un pago y todas sus aplicaciones DEBEN usar la misma moneda.
- La suma de `allocations[].amount.value` NO DEBE exceder `payment.amount.value`.
- Un cargo cancelado NO DEBERÍA recibir nuevas aplicaciones.
- Los consumidores NO DEBEN calcular impuestos, comisiones o recargos no expresados explícitamente.

## 6. Indiviso

- `unit.indiviso` es opcional.
- Con `unit: fraction`, `value` representa una fracción entre 0 y 1.
- Con `unit: percentage`, `value` representa un porcentaje entre 0 y 100.
- El productor DEBERÍA usar una sola unidad de indiviso para todas las unidades del condominio.
- La suma puede diferir ligeramente de 1 o 100 por redondeo, pero el productor DEBERÍA documentarlo.

## 7. Personas y relaciones

- `person` representa una identidad de contacto, no una cuenta de autenticación.
- La relación con una unidad se expresa exclusivamente mediante `occupancy`.
- Una persona PUEDE estar relacionada con múltiples unidades.
- Una unidad PUEDE tener múltiples propietarios, residentes o contactos.
- `is_primary_contact` solo indica prioridad operativa y no acredita representación legal.
- `role: owner` no sustituye documentos que acrediten propiedad.

## 8. Estados

Los estados describen la situación reportada por el productor al momento de exportación.

- `archived` significa conservado para trazabilidad, no necesariamente eliminado.
- `overdue` indica que el productor considera vencido el cargo.
- `paid` indica que el cargo está totalmente cubierto según el productor.
- `confirmed` indica que el pago fue reconocido como recibido.
- Un importador PUEDE recalcular estados, pero DEBERÍA conservar el valor original para auditoría.

## 9. Metadatos

- `metadata` PUEDE incluir extensiones específicas de un implementador.
- Las claves DEBERÍAN usar un prefijo identificable, por ejemplo `ameniti_internal_code`.
- `metadata` NO DEBE contener contraseñas, secretos, tokens, biométricos, números completos de tarjeta o documentos adjuntos codificados.
- Un consumidor PUEDE ignorar todo `metadata` sin perder el significado normativo principal.

## 10. Duplicados y orden

- Los arrays no tienen orden semántico, salvo que una futura versión lo declare.
- Los IDs DEBEN ser únicos dentro de cada colección.
- Los importadores DEBERÍAN detectar duplicados por `id` y por identificadores externos conocidos.
- La repetición de una persona con IDs diferentes NO debe fusionarse automáticamente sin una regla explícita y auditable.

## 11. Errores de importación

Un importador DEBERÍA reportar:

- ruta JSON del error;
- código de error estable;
- mensaje entendible;
- severidad;
- entidad e identificador afectados;
- posibilidad de continuar o abortar.

Los errores estructurales y referencias inexistentes DEBEN impedir una importación silenciosa.

## 12. Compatibilidad

- Los consumidores de `0.1.0` DEBEN rechazar una versión mayor desconocida.
- Pueden aceptar parches posteriores de `0.1.x` cuando no introduzcan incompatibilidades.
- Ningún sistema debe anunciar cumplimiento total si omite campos requeridos o no aplica las reglas referenciales.
