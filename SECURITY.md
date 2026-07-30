# Política de seguridad

Open Condo es una especificación de intercambio de datos. Una vulnerabilidad puede afectar los esquemas, el validador, los ejemplos o la documentación de seguridad y privacidad.

## Versiones con soporte

Mientras el proyecto permanezca en etapa experimental, únicamente la rama principal y la serie `0.1.x` reciben correcciones de seguridad.

## Reporte responsable

No publiques inicialmente un issue con datos personales, archivos reales de condominios, secretos o instrucciones de explotación.

Reporta de forma privada a **seguridad@ameniti.mx** e incluye:

- componente y versión afectada;
- impacto esperado;
- pasos mínimos para reproducir;
- archivo de prueba anonimizado, cuando sea necesario;
- mitigación propuesta, si existe.

No adjuntes bases de datos reales ni credenciales activas.

## Alcance

Son reportes relevantes, entre otros:

- esquemas que permiten exportar secretos o datos prohibidos;
- validaciones que aceptan referencias o cantidades peligrosamente inconsistentes;
- consumo excesivo de recursos con documentos pequeños o razonables;
- ejecución de código o acceso inesperado a archivos mediante el validador;
- dependencias vulnerables utilizadas por las herramientas del repositorio;
- documentación que induce prácticas inseguras de importación.

No forman parte del alcance vulnerabilidades de productos de terceros que implementen Open Condo, salvo que el problema provenga directamente del estándar o de sus herramientas oficiales.

## Expectativas para implementadores

Los sistemas que procesen exportaciones Open Condo deben:

- cifrar archivos en tránsito y, cuando corresponda, en reposo;
- limitar tamaño, profundidad y cantidad de entidades;
- validar antes de persistir;
- usar transacciones o áreas temporales;
- restringir acceso por mínimo privilegio;
- registrar importaciones y exportaciones sin copiar datos personales en logs;
- definir retención y eliminación segura;
- tratar URIs y texto como datos no confiables;
- mantener dependencias actualizadas.

## Divulgación

El proyecto procurará confirmar recepción, evaluar el impacto y coordinar una corrección antes de publicar detalles. Los tiempos dependerán de la complejidad y del riesgo. Se reconocerá a la persona reportante cuando lo solicite y sea apropiado.