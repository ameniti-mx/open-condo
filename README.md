# Open Condo

**Estándares abiertos para la interoperabilidad de la administración condominal.**

Open Condo es una iniciativa open source impulsada por [Ameniti](https://ameniti.mx) para definir una forma neutral, documentada, portable y extensible de representar información condominal.

El proyecto busca que administradores, desarrolladores, comités, proveedores y plataformas puedan intercambiar datos sin depender de estructuras propietarias ni reconstruir manualmente la información al cambiar de sistema.

> Open Condo no es una plataforma de administración, un servicio de almacenamiento ni una autoridad regulatoria. Es una especificación técnica abierta y un conjunto de herramientas de validación.

## Estado del proyecto

- Versión base estable experimental: **0.1.0**
- Versión en desarrollo: **0.2.0-alpha.1**
- Estado: **experimental / abierta a implementación y comentarios**
- Formato: **JSON Schema Draft 2020-12**
- Licencia: **Apache License 2.0**
- Idioma normativo inicial: **español de México**
- Entorno de validación: **Node.js 20 o posterior**

Las versiones `0.x` pueden cambiar con base en la experiencia de implementadores. No deben considerarse estables hasta la publicación de `1.0.0`.

## ¿Qué resuelve Open Condo?

Open Condo propone contratos de datos comunes para que un sistema pueda exportar información y otro pueda validarla, interpretarla e importarla de forma predecible.

Sus objetivos principales son:

- reducir el bloqueo con un proveedor;
- facilitar migraciones entre plataformas;
- preservar relaciones e identificadores;
- mejorar la calidad y trazabilidad de los datos;
- permitir implementaciones parciales y progresivas;
- establecer reglas verificables de privacidad y conformidad;
- construir un lenguaje común para la tecnología condominal.

## Alcance de Open Condo 0.1

La versión `0.1.0` define el núcleo comunitario y financiero mínimo:

1. `condominium`: comunidad o régimen condominal.
2. `unit`: unidad privativa o funcional.
3. `person`: persona relacionada con la comunidad.
4. `occupancy`: relación temporal entre una persona y una unidad.
5. `charge`: obligación económica asignada a una unidad.
6. `payment`: pago recibido y sus aplicaciones a cargos.
7. `export`: contenedor portable que agrupa las entidades.

El caso de uso principal de v0.1 es trasladar unidades, personas, relaciones, cargos y pagos entre sistemas conservando referencias e integridad semántica.

## Novedades de Open Condo 0.2

La versión `0.2.0-alpha.1` amplía el estándar con un dominio completo de amenidades y reservaciones.

### Nuevas entidades

- `amenity`: representa una amenidad, su capacidad, recursos internos, estado y modalidad de uso.
- `rule_set`: conjunto versionado de reglas declarativas aplicables a una amenidad o proceso.
- `reservation`: reservación con horario, solicitante, unidad, invitados, recurso asignado y resultado de evaluación.
- `reservation_charge`: cargo o ajuste económico generado por una reservación.

### Motor declarativo de reglas

Open Condo 0.2 permite representar políticas complejas sin depender de código específico de un proveedor.

Las reglas pueden describir:

- horarios y días disponibles;
- bloqueos por mantenimiento, eventos o fechas especiales;
- duración mínima, máxima o fija;
- anticipación mínima y máxima;
- límites diarios, semanales o mensuales;
- restricciones por unidad, persona, rol o tipo de ocupación;
- capacidad, invitados y recursos disponibles;
- bloqueos por adeudos o incumplimientos;
- aprobación automática o manual;
- documentos y reglamentos requeridos;
- check-in, tolerancia, no-show y liberación de espacios;
- cancelación y reprogramación;
- precios, depósitos, descuentos y penalizaciones;
- daños, limpieza, invitados adicionales y tiempo extra.

El modelo incluye condiciones compuestas mediante `all`, `any` y `not`, prioridades, estrategias de conflicto, funciones puras y efectos declarativos.

### Reservaciones auditables

Una reservación puede conservar:

- los conjuntos de reglas evaluados;
- las reglas que coincidieron;
- la decisión obtenida;
- advertencias y requisitos pendientes;
- una instantánea del contexto utilizado;
- el recurso específico asignado;
- los cargos derivados de la evaluación.

Esto permite explicar por qué una reservación fue permitida, rechazada, enviada a aprobación o cobrada de determinada manera, incluso si las reglas cambian posteriormente.

### Cargos de reservación

`reservation_charge` permite representar, entre otros:

- tarifa de uso;
- depósito en garantía;
- limpieza;
- cuota por invitados;
- cancelación tardía;
- no-show;
- daños;
- tiempo adicional;
- descuentos;
- ajustes;
- reembolsos.

El cargo puede conservar la regla que lo originó y vincularse con la entidad financiera `charge` cuando se publique en el estado de cuenta de la unidad.

## Principios

- **Neutralidad:** la especificación no depende de Ameniti ni de un proveedor concreto.
- **Portabilidad:** los datos deben poder salir de un sistema en una estructura comprensible.
- **Interoperabilidad:** las mismas entidades y reglas deben conservar significado entre implementaciones.
- **Privacidad por diseño:** no se exige información personal innecesaria.
- **Extensibilidad controlada:** los campos comunes se formalizan y las extensiones se aíslan en `metadata`.
- **Compatibilidad incremental:** los dominios nuevos se incorporan sin invalidar automáticamente implementaciones anteriores.
- **Contexto mexicano:** contempla moneda, indivisos, unidades funcionales y prácticas condominales locales.
- **Trazabilidad:** las decisiones, relaciones, cargos y reglas deben poder auditarse.
- **Validación verificable:** la conformidad debe poder comprobarse automáticamente.

## Estructura del repositorio

```text
open-condo/
├── .github/workflows/
│   └── validate.yml
├── schemas/
│   ├── v0.1/
│   │   ├── common.schema.json
│   │   ├── condominium.schema.json
│   │   ├── unit.schema.json
│   │   ├── person.schema.json
│   │   ├── occupancy.schema.json
│   │   ├── charge.schema.json
│   │   ├── payment.schema.json
│   │   └── export.schema.json
│   └── v0.2/
│       ├── amenity.schema.json
│       ├── rule-set.schema.json
│       ├── reservation.schema.json
│       ├── reservation-charge.schema.json
│       └── export.schema.json
├── examples/
│   ├── v0.1/
│   │   └── complete-export.example.json
│   └── v0.2/
│       └── amenity-reservation.example.json
├── docs/
│   ├── amenities-and-reservations-v0.2.md
│   ├── conventions.md
│   ├── conformance.md
│   ├── implementation-guide.md
│   ├── privacy.md
│   └── versioning.md
├── scripts/
│   ├── test.mjs
│   └── validate.mjs
├── CONTRIBUTING.md
├── ROADMAP.md
├── SECURITY.md
├── LICENSE
├── package.json
└── README.md
```

## Inicio rápido

Instala las dependencias y ejecuta la suite completa:

```bash
npm install
npm test
```

Valida una exportación propia:

```bash
npm run validate -- ruta/al/archivo.json
```

El validador selecciona automáticamente el esquema compatible con la versión declarada en el documento.

La validación comprende:

- estructura JSON conforme a JSON Schema;
- campos obligatorios y formatos;
- identificadores duplicados;
- referencias entre entidades;
- pertenencia al mismo condominio;
- coherencia de fechas y vigencias;
- indivisos y monedas;
- aplicaciones de pagos;
- capacidad y traslapes de reservaciones;
- relaciones entre reservaciones y cargos;
- trazabilidad de reglas evaluadas.

## Ejemplos oficiales

### Exportación comunitaria y financiera v0.1

```bash
npm run validate -- examples/v0.1/complete-export.example.json
```

### Amenidad y reservación v0.2

```bash
npm run validate -- examples/v0.2/amenity-reservation.example.json
```

El ejemplo v0.2 incluye una cancha de pádel con duración fija, anticipación máxima, bloqueo por adeudo, aceptación de reglamento, tarifa de reservación y penalización por cancelación tardía.

## Documentación

- [Amenidades y reservaciones v0.2](docs/amenities-and-reservations-v0.2.md)
- [Guía de implementación](docs/implementation-guide.md)
- [Criterios de conformidad](docs/conformance.md)
- [Convenciones normativas](docs/conventions.md)
- [Privacidad](docs/privacy.md)
- [Versionado](docs/versioning.md)
- [Hoja de ruta](ROADMAP.md)
- [Seguridad](SECURITY.md)

## Reglas esenciales

- Cada documento y entidad debe declarar su `schema_version`.
- Los identificadores son opacos y no deben codificar datos personales.
- Las fechas usan ISO 8601 y las fechas con hora deben incluir zona horaria.
- Las cantidades monetarias incluyen valor y moneda ISO 4217.
- Las referencias deben apuntar a entidades existentes dentro del conjunto exportado.
- Las decisiones de reglas relevantes deben conservar trazabilidad suficiente.
- Los campos no definidos por el estándar deben colocarse dentro de `metadata`.
- No deben exportarse contraseñas, tokens, secretos, datos biométricos, números completos de tarjetas ni credenciales de acceso.

## Qué no cubre todavía

Open Condo todavía no estandariza completamente:

- visitantes, QR y control de acceso;
- paquetería;
- incidencias, mantenimiento y proveedores;
- asambleas y votaciones;
- documentos legales;
- CFDI y contabilidad completa;
- cuentas bancarias;
- autenticación y autorización;
- biometría, videovigilancia o reconocimiento facial.

Estos dominios deben proponerse mediante casos de uso, ejemplos, análisis de privacidad y pruebas de conformidad.

## Contribuir

Open Condo está abierto a administradores, desarrolladores, empresas, comités, investigadores y organizaciones del sector.

Las propuestas deben explicar:

1. el problema real que se busca resolver;
2. los actores y sistemas involucrados;
3. ejemplos representativos de datos;
4. reglas y casos límite;
5. implicaciones de privacidad y seguridad;
6. compatibilidad con las versiones vigentes;
7. casos válidos e inválidos para la suite de conformidad.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir un issue o pull request.

## Uso de la especificación

La licencia Apache 2.0 permite usar, modificar y distribuir la especificación y sus herramientas conforme a sus términos.

Una implementación puede declarar compatibilidad con un perfil de Open Condo siempre que satisfaga los criterios documentados de conformidad. La marca o declaración de compatibilidad no implica certificación, respaldo comercial ni afiliación con Ameniti.

## Licencia

Open Condo se distribuye bajo la [Apache License 2.0](LICENSE).

---

Creado como una contribución abierta de Ameniti a la profesionalización, portabilidad y digitalización de la administración condominal.