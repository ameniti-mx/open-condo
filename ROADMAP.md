# Hoja de ruta de Open Condo

Esta hoja de ruta comunica prioridades, no fechas garantizadas. Las propuestas se desarrollan mediante issues y pull requests públicos.

## Versión vigente: 0.1.x

Objetivo: consolidar un núcleo portable para condominios, unidades, personas, ocupaciones, cargos y pagos.

Prioridades de estabilización:

- recibir implementaciones de referencia de al menos dos sistemas distintos;
- ampliar casos válidos e inválidos de prueba;
- documentar reglas semánticas que no pueden expresarse únicamente con JSON Schema;
- evitar cambios incompatibles dentro de `0.1.x`;
- corregir ambigüedades editoriales y de interoperabilidad.

## Próxima versión propuesta: 0.2.0

La versión 0.2 se enfocará en operación condominal cotidiana. Cada dominio deberá aprobarse por separado y podrá aplazarse si no cuenta con casos reales suficientes.

### Candidatos prioritarios

1. **Amenidades y reservaciones**
   - catálogo de amenidades;
   - reglas de disponibilidad;
   - reservaciones, cancelaciones y estados;
   - cargos relacionados, sin duplicar el dominio financiero.

2. **Visitantes y accesos no biométricos**
   - invitaciones y vigencias;
   - eventos de entrada y salida;
   - identificadores de credenciales temporales;
   - exclusión explícita de secretos, biometría y material criptográfico.

3. **Paquetería**
   - registro de recepción;
   - custodia y ubicación lógica;
   - notificación y entrega;
   - evidencia referenciada mediante URI o hash, no archivos incrustados.

4. **Incidencias y mantenimiento**
   - reportes, prioridad y estado;
   - áreas o unidades afectadas;
   - responsables y proveedores;
   - historial básico de cambios.

### Trabajo transversal

- perfiles de exportación total e incremental;
- paginación o particionado para conjuntos grandes;
- catálogo de códigos y vocabularios extensibles;
- mecanismo formal para extensiones de proveedor;
- suite de conformidad reutilizable;
- documentación bilingüe no normativa, manteniendo español de México como idioma normativo inicial.

## Criterios para aceptar un nuevo dominio

Una propuesta de dominio debe incluir:

- problema operativo verificable;
- al menos dos actores o sistemas potencialmente interoperables;
- modelo mínimo y ejemplos completos;
- análisis de privacidad y retención;
- reglas semánticas e invariantes;
- estrategia de compatibilidad y migración;
- pruebas válidas e inválidas.

## Fuera de alcance cercano

No se planea estandarizar en 0.2:

- autenticación o autorización de usuarios;
- contraseñas, tokens, secretos o llaves privadas;
- biometría o reconocimiento facial;
- video o audio de vigilancia;
- números completos de tarjetas;
- sustitución de contabilidad, CFDI o normatividad fiscal;
- decisiones automatizadas sobre acceso o sanciones.

## Cómo participar

Antes de proponer un esquema nuevo, abre un issue describiendo el caso de uso y utiliza los criterios de [CONTRIBUTING.md](CONTRIBUTING.md). Los cambios incompatibles deben justificar por qué no pueden resolverse mediante una adición compatible.