# Conformidad con Open Condo 0.1

Este documento define cómo una implementación puede describir su compatibilidad con Open Condo 0.1.

## Términos normativos

Las palabras **DEBE**, **NO DEBE**, **DEBERÍA**, **NO DEBERÍA** y **PUEDE** se interpretan conforme a las convenciones del proyecto.

## Perfiles de conformidad

### Exportador estructural

Un exportador estructural conforme:

- DEBE producir JSON válido;
- DEBE validar contra `export.schema.json`;
- DEBE declarar `schema_version` igual a una versión soportada;
- NO DEBE agregar propiedades fuera de las permitidas por los esquemas;
- DEBE excluir secretos y categorías prohibidas por la política de privacidad.

### Exportador completo

Además de cumplir el perfil estructural, un exportador completo:

- DEBE preservar integridad referencial;
- DEBE generar IDs únicos por colección;
- DEBE cumplir reglas semánticas de fechas, indivisos, moneda y aplicaciones;
- DEBE informar el sistema y versión que generaron el archivo;
- DEBERÍA incluir un `export_id` estable para auditoría;
- DEBERÍA documentar cualquier transformación o dato omitido.

### Importador seguro

Un importador seguro conforme:

- DEBE validar antes de persistir datos;
- DEBE rechazar versiones no soportadas;
- DEBE tratar IDs como valores opacos;
- NO DEBE ejecutar ni interpretar contenido de texto como código;
- DEBE evitar estados parciales ante errores;
- DEBE reportar errores estructurales y semánticos;
- DEBERÍA permitir una corrida de prueba sin escritura definitiva.

### Implementación interoperable

Una implementación interoperable cumple al menos como exportador completo o importador seguro y publica:

- versiones soportadas;
- dominios soportados;
- límites conocidos;
- estrategia para extensiones;
- contacto para reportar incompatibilidades.

## Suite mínima de pruebas

Una implementación que declare conformidad DEBE probar:

1. ejemplo oficial válido;
2. propiedad adicional no permitida;
3. campo obligatorio ausente;
4. ID duplicado;
5. referencia a unidad inexistente;
6. ocupación con persona inexistente;
7. fecha final anterior a la inicial;
8. indiviso fuera de rango;
9. pago aplicado por encima de su importe;
10. aplicación en moneda distinta;
11. aplicación a cargo de otra unidad;
12. versión no soportada.

## Declaración sugerida

Una declaración pública puede usar este formato:

```text
Producto: Ejemplo Condo
Open Condo: 0.1.x
Perfil: exportador completo e importador seguro
Dominios: condominium, unit, person, occupancy, charge, payment
Extensiones: mx.ejemplo.*
Última verificación: 2026-07-30
```

## Lo que no significa conformidad

La conformidad técnica no certifica:

- cumplimiento legal o fiscal;
- exactitud de los datos de origen;
- seguridad integral del producto;
- identidad de personas;
- validez de saldos o comprobantes;
- compatibilidad con extensiones privadas de terceros.

## Evolución

Los criterios pueden ampliarse dentro de `0.1.x` únicamente para aclarar reglas existentes o añadir pruebas. Una obligación nueva que vuelva inválida una implementación previamente conforme debe reservarse para una versión incompatible.