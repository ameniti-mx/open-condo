# Open Condo

**Estándares y herramientas abiertas para la administración condominal en México.**

Open Condo es una iniciativa impulsada por [Ameniti](https://ameniti.mx) para proponer una forma neutral, documentada y extensible de representar información condominal. Su objetivo es facilitar la interoperabilidad, la portabilidad de datos y la construcción de herramientas para administradores, desarrolladores, comités y organizaciones del sector.

> Open Condo no es una plataforma de administración ni sustituye obligaciones legales, fiscales o de protección de datos. Es una especificación técnica abierta.

## Estado del proyecto

- Versión actual: **0.1.0**
- Estado: **experimental / propuesta inicial**
- Formato: **JSON Schema Draft 2020-12**
- Licencia: **Apache License 2.0**
- Idioma normativo inicial: **español de México**
- Próxima línea de trabajo: **preparación de 0.2 y adopción por implementadores**

Las versiones `0.x` pueden cambiar con base en la retroalimentación de implementadores. No deben considerarse estables hasta la publicación de `1.0.0`.

## Objetivo del MVP 0.1

La versión 0.1 define el núcleo mínimo necesario para intercambiar información básica entre sistemas:

1. `condominium`: comunidad o régimen condominal.
2. `unit`: unidad privativa o funcional.
3. `person`: persona relacionada con la comunidad.
4. `occupancy`: relación temporal entre una persona y una unidad.
5. `charge`: obligación económica asignada a una unidad.
6. `payment`: pago recibido y sus aplicaciones a cargos.
7. `export`: contenedor portable que agrupa todas las entidades.

El caso de uso principal es permitir que un sistema exporte información básica y otro sistema pueda validarla e importarla sin reconstruir manualmente unidades, personas, cargos y pagos.

## Principios

- **Neutralidad:** no depende de Ameniti ni de un proveedor específico.
- **Portabilidad:** los datos deben poder salir de un sistema en una estructura comprensible.
- **Privacidad por diseño:** se evita exigir información personal innecesaria.
- **Extensibilidad controlada:** se permiten metadatos, pero los campos comunes deben formalizarse.
- **Compatibilidad incremental:** los cambios compatibles se agregan sin romper implementaciones existentes.
- **Contexto mexicano:** moneda, divisiones administrativas, indivisos y prácticas condominales locales.
- **Trazabilidad:** las entidades incluyen identificadores, fechas y referencias externas.

## Estructura del repositorio

```text
open-condo/
├── .github/workflows/
│   └── validate.yml
├── schemas/v0.1/
│   ├── common.schema.json
│   ├── condominium.schema.json
│   ├── unit.schema.json
│   ├── person.schema.json
│   ├── occupancy.schema.json
│   ├── charge.schema.json
│   ├── payment.schema.json
│   └── export.schema.json
├── examples/v0.1/
│   └── complete-export.example.json
├── docs/
│   ├── conventions.md
│   ├── conformance.md
│   ├── implementation-guide.md
│   ├── privacy.md
│   └── versioning.md
├── scripts/
│   └── validate.mjs
├── CONTRIBUTING.md
├── ROADMAP.md
├── SECURITY.md
├── LICENSE
├── package.json
└── README.md
```

## Inicio rápido

Requiere Node.js 20 o posterior.

Instala exactamente las dependencias declaradas y valida los ejemplos:

```bash
npm ci
npm test
```

También puedes validar un archivo propio:

```bash
npm run validate -- ruta/al/archivo.json
```

El comando ejecuta validación estructural mediante JSON Schema y comprobaciones semánticas de IDs, referencias, fechas, indivisos, monedas y aplicaciones de pagos.

## Documentación para implementar

- [Guía de implementación](docs/implementation-guide.md): flujo de exportación e importación segura.
- [Criterios de conformidad](docs/conformance.md): perfiles y suite mínima de pruebas.
- [Convenciones normativas](docs/conventions.md): reglas obligatorias del estándar.
- [Privacidad](docs/privacy.md): minimización y datos que no deben exportarse.
- [Versionado](docs/versioning.md): compatibilidad entre versiones.
- [Hoja de ruta](ROADMAP.md): candidatos y criterios para la versión 0.2.
- [Seguridad](SECURITY.md): reporte responsable y expectativas para implementadores.

## Ejemplo mínimo

```json
{
  "open_condo": {
    "schema_version": "0.1.0",
    "exported_at": "2026-08-15T12:00:00-06:00",
    "generator": {
      "name": "Sistema de ejemplo",
      "version": "1.0.0"
    }
  },
  "condominium": {
    "schema_version": "0.1.0",
    "id": "cond_demo_001",
    "name": "Residencial Valle Central",
    "status": "active",
    "country": "MX",
    "timezone": "America/Mexico_City",
    "currency": "MXN",
    "address": {
      "state": "Querétaro",
      "municipality": "Querétaro",
      "country": "MX"
    },
    "created_at": "2026-08-15T12:00:00-06:00",
    "updated_at": "2026-08-15T12:00:00-06:00"
  },
  "units": [],
  "people": [],
  "occupancies": [],
  "charges": [],
  "payments": []
}
```

## Reglas esenciales

- Todos los documentos deben declarar `schema_version`.
- Los identificadores son strings opacos; no deben inferirse datos personales desde ellos.
- Las fechas usan `YYYY-MM-DD` y las fechas con hora usan ISO 8601/RFC 3339 con zona horaria.
- Las cantidades monetarias incluyen valor y moneda ISO 4217.
- Los sistemas no deben exportar contraseñas, biométricos, tokens, secretos, números completos de tarjeta ni credenciales de acceso.
- Las referencias entre entidades deben apuntar a identificadores existentes dentro del mismo conjunto de exportación.
- Los campos desconocidos fuera de `metadata` no se consideran parte del estándar.

Consulta [docs/conventions.md](docs/conventions.md) para las reglas normativas completas.

## Alcance excluido de v0.1

La versión 0.1 no estandariza todavía:

- accesos, QR, visitantes o llaves digitales;
- reservaciones y amenidades;
- paquetería;
- incidencias, mantenimiento y proveedores;
- asambleas, votaciones y documentos legales;
- CFDI, cuentas bancarias o contabilidad;
- autenticación, autorización o credenciales;
- biometría, videovigilancia o reconocimiento facial.

Estos dominios podrán proponerse en versiones posteriores. Consulta [ROADMAP.md](ROADMAP.md) para conocer los candidatos de 0.2 y sus criterios de aceptación.

## Contribuciones

Las propuestas deben abrirse como issues o pull requests y explicar:

1. el problema real que se busca resolver;
2. los actores y sistemas involucrados;
3. ejemplos de datos;
4. implicaciones de privacidad;
5. compatibilidad con la versión vigente.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencia

Open Condo se distribuye bajo la [Apache License 2.0](LICENSE).

---

Creado como una contribución abierta de Ameniti a la profesionalización y digitalización de la administración condominal en México.