# Amenidades y reservaciones — propuesta Open Condo 0.2

## Objetivo

Open Condo 0.2 modela las amenidades como recursos administrables y las reservaciones como decisiones producidas por un motor declarativo de reglas. El estándar describe la política y el resultado; no obliga a utilizar una implementación específica del motor.

## Entidades

- `amenity`: espacio o servicio reservable, su capacidad, recursos internos, estado y conjuntos de reglas aplicables.
- `rule_set`: política versionable para disponibilidad, creación, modificación, cancelación, uso, check-in, precios y penalizaciones.
- `reservation`: solicitud y asignación temporal, incluyendo la evidencia de las reglas evaluadas.
- `reservation_charge`: consecuencia económica de una reservación; puede enlazarse posteriormente con un `charge` financiero del núcleo.

## Contexto de evaluación

Las rutas de los operandos comienzan con `$.` y se evalúan contra un contexto construido por el sistema implementador. El contexto recomendado incluye:

```json
{
  "reservation": {},
  "amenity": {},
  "resource": {},
  "unit": {"financial": {}, "occupancy": {}},
  "requester": {},
  "request": {"acknowledgements": {}},
  "history": {"reservations": [], "cancellations": [], "no_shows": []},
  "calendar": {"holidays": [], "closures": []},
  "system": {"now": "RFC3339"}
}
```

Los sistemas deben documentar las rutas adicionales que soporten. Una ruta desconocida no debe convertirse silenciosamente en `false`: debe producir un resultado de evaluación indeterminado o un error explícito.

## Expresividad

Las condiciones admiten composición con `all`, `any` y `not`, comparaciones, pertenencia, existencia, expresiones regulares y traslapes. Los operandos pueden ser valores literales, rutas del contexto o funciones puras como `now`, `day_of_week`, `minutes_between`, `days_between`, `count` y `sum`.

Los efectos pueden:

- permitir o negar;
- exigir aprobación, documentos o aceptación de reglamentos;
- determinar precio, depósito, penalización o cargo adicional;
- fijar capacidad, duración, ventana de reservación o cancelación;
- asignar recursos concretos;
- modificar prioridad, visibilidad o posición en cola;
- emitir advertencias auditables.

## Resolución de conflictos

Cada conjunto declara una estrategia:

- `deny_overrides`: cualquier denegación prevalece;
- `highest_priority`: prevalece la regla con mayor prioridad;
- `first_match`: termina en la primera coincidencia ordenada;
- `collect_all`: acumula todos los efectos compatibles.

Los efectos económicos acumulados deben conservar el `rule_set_id` y `rule_id` que los originó.

## Inmutabilidad y auditoría

Una reserva confirmada debe conservar `rule_evaluation`, incluyendo conjuntos y reglas aplicadas, decisión, advertencias y una instantánea mínima del contexto. Cambiar posteriormente un conjunto de reglas no debe reescribir el resultado histórico.

Para una modificación de fecha, personas, recurso o duración, el sistema debe volver a evaluar y producir una nueva evidencia. Se recomienda conservar eventos o versiones fuera del alcance del documento actual.

## Casos que el modelo debe poder expresar

- horarios distintos por día y temporada;
- cierres por mantenimiento, días festivos o eventos privados;
- duración fija, mínima, máxima o por bloques;
- anticipación mínima y máxima;
- límites simultáneos, diarios, semanales o mensuales por persona o unidad;
- prioridad por tipo de residente, sorteo, lista de espera o antigüedad;
- bloqueos por adeudos, sanciones, documentos pendientes o no-shows;
- restricciones por edad, aforo, invitados y acompañamiento;
- precios por hora, bloque, persona, invitado, horario o demanda;
- depósitos, limpieza, daños, tiempo extra y cancelación tardía;
- reglas particulares para recursos internos de una amenidad;
- aprobación administrativa condicionada;
- aceptación de reglamentos y documentos obligatorios.

## Reglas semánticas mínimas

El validador de referencia comprueba identificadores únicos, referencias existentes, pertenencia al mismo condominio, fechas coherentes, capacidad, traslapes, reglas declaradas y consistencia entre reserva, unidad y cargos.

La validación completa de una política depende del contexto operativo. Por ello, conformidad estructural no equivale a afirmar que una reserva cumple las reglas; esa decisión corresponde al motor del implementador y debe quedar registrada en `rule_evaluation`.

## Privacidad

No deben incluirse biométricos, credenciales, códigos de acceso, imágenes de videovigilancia ni documentos completos dentro de reglas, reservas o instantáneas. Las reglas deben usar estados o referencias opacas, por ejemplo `requester.age_verified`, en lugar de documentos de identidad.