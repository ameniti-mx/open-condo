# Privacidad y seguridad en Open Condo 0.1

Open Condo define formatos de intercambio; no autoriza por sí mismo el tratamiento de datos personales. Cada implementador es responsable de contar con base jurídica, avisos de privacidad, medidas de seguridad y procesos de atención de derechos aplicables.

## Minimización

Un productor DEBE exportar únicamente la información necesaria para el propósito informado. Los campos de contacto de `person` son opcionales. CURP, RFC, fecha de nacimiento, identificaciones oficiales y datos patrimoniales no forman parte del núcleo 0.1.

## Datos expresamente prohibidos

Una exportación Open Condo 0.1 NO DEBE contener:

- contraseñas, hashes de contraseñas o preguntas de recuperación;
- tokens de sesión, API keys, secretos o cookies;
- números completos de tarjetas, CVV o NIP;
- credenciales bancarias o llaves privadas;
- plantillas biométricas, rostros codificados o huellas;
- códigos QR o credenciales de acceso vigentes;
- imágenes de identificaciones;
- expedientes médicos;
- grabaciones de videovigilancia;
- documentos binarios incrustados en Base64.

## Seudonimización

Los ejemplos públicos DEBEN usar datos ficticios. Los identificadores no deben contener nombres, correos o teléfonos. Para pruebas, se recomienda generar IDs aleatorios y dominios reservados como `example.com`.

## Transferencia

- Las exportaciones con datos reales DEBEN transmitirse mediante canales cifrados.
- Los archivos en reposo DEBERÍAN cifrarse.
- El acceso DEBE limitarse por necesidad operativa.
- El productor DEBERÍA registrar quién exportó, cuándo, para qué finalidad y quién recibió.
- Los enlaces de descarga DEBERÍAN expirar.

## Retención y eliminación

El receptor DEBE establecer un periodo de retención. Al concluir la migración o finalidad, DEBERÍA eliminar copias temporales y respaldos operativos cuando resulte procedente. `archived` dentro del estándar no equivale a una política legal de conservación.

## Importaciones seguras

Los importadores DEBEN tratar todo texto como no confiable, limitar tamaños, impedir ejecución de contenido, validar formatos y evitar que `metadata` se convierta en un vector de inyección o almacenamiento arbitrario.

## Responsabilidad

El cumplimiento del esquema solo acredita compatibilidad técnica. No acredita cumplimiento legal, consentimiento, exactitud registral, propiedad de una unidad ni autorización para compartir información.
