# Open Condo

**Una iniciativa open source de Ameniti para contribuir a la digitalización e interoperabilidad de la administración condominal en México.**

Open Condo busca desarrollar un lenguaje común para representar información y procesos habituales de condominios, comunidades residenciales y administraciones.

> Este proyecto se encuentra en una etapa inicial. Los esquemas publicados todavía pueden cambiar y no deben considerarse una especificación definitiva.

## Objetivos

- Proponer estructuras de datos claras y reutilizables.
- Facilitar integraciones entre administraciones, proveedores y plataformas.
- Documentar casos de uso propios del contexto condominal mexicano.
- Promover herramientas abiertas sin exponer datos personales de residentes.

## Primera etapa

La primera versión se enfocará en un esquema básico para describir:

- Condominios.
- Unidades privativas.
- Residentes y roles, sin datos personales obligatorios.
- Cuotas y saldos.
- Reservaciones.
- Visitas.
- Paquetería.
- Reportes e incidencias.

## Ejemplo

```json
{
  "schema_version": "0.1.0",
  "condominium": {
    "id": "cond_mx_001",
    "name": "Condominio Ejemplo",
    "country": "MX"
  },
  "unit": {
    "id": "unit_a_302",
    "building": "Torre A",
    "number": "302",
    "type": "apartment"
  }
}
```

Consulta [`examples/basic-condominium.json`](examples/basic-condominium.json) para ver un ejemplo inicial.

## Estado del proyecto

`0.1 — Propuesta inicial`

Actualmente estamos definiendo alcance, terminología y primeros esquemas. La participación de administradores, desarrolladores y especialistas del sector será bienvenida conforme publiquemos las primeras propuestas.

## Principios

1. **Abierto:** la especificación puede ser consultada, utilizada y mejorada por la comunidad.
2. **Interoperable:** evita depender de una plataforma específica.
3. **Práctico:** parte de procesos reales de administración condominal.
4. **Privacidad desde el diseño:** ningún esquema debe requerir datos personales innecesarios.
5. **Contexto mexicano:** considera la terminología y operación habitual de los condominios en México.

## Licencia

El contenido de este repositorio se publica bajo la licencia [Apache License 2.0](LICENSE).

## Acerca de Ameniti

Open Condo es una contribución de [Ameniti](https://ameniti.mx), plataforma tecnológica para la administración y operación de condominios.
