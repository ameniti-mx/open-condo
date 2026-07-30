# Registros biométricos v0.2

`biometric_record` permite trasladar referencias biométricas entre plataformas condominales sin convertir a Open Condo en un almacén biométrico ni imponer un algoritmo de reconocimiento.

## Principios

1. Cada registro pertenece a una `person` mediante `person_id` y al mismo condominio mediante `condominium_id`.
2. Los datos biométricos nunca se incluyen en texto claro.
3. Se recomienda `external_reference` con URI de corta duración, autenticación fuera de banda y cifrado en reposo y tránsito.
4. `encrypted_inline` se reserva para paquetes pequeños y siempre contiene ciphertext en Base64.
5. El receptor debe verificar el digest antes de descifrar o procesar el contenido.
6. Las claves no viajan en la exportación; `key_reference` identifica una clave o acuerdo de intercambio administrado externamente.
7. La biometría debe poder revocarse o sustituirse cuando la técnica utilizada lo permita.

## Formatos interoperables

El campo `format` identifica el contenido sin reinterpretarlo. Los perfiles recomendados son:

- ISO/IEC 39794 para formatos biométricos extensibles;
- ISO/IEC 19794 cuando un dispositivo o sistema legado lo requiera;
- ANSI/NIST-ITL para intercambios compatibles con ese ecosistema;
- CBEFF cuando el contenido se encuentre encapsulado en ese marco;
- `VENDOR_SPECIFIC` únicamente cuando no exista una representación estándar adecuada.

Para rostro se recomienda ISO/IEC 39794-5; para imagen de huella, ISO/IEC 39794-4; para minucias de huella, ISO/IEC 39794-2; y para iris, ISO/IEC 39794-6.

Open Condo no reproduce el contenido normativo de dichos estándares. El emisor debe declarar la parte, edición, codificación y perfil usados.

## Protección

El objeto `protection` sigue los objetivos de ISO/IEC 24745: confidencialidad, integridad, vinculación segura con la identidad y renovabilidad o revocabilidad.

Requisitos mínimos:

- cifrado autenticado (`A256GCM`, `XC20P` u otro perfil documentado);
- gestión de claves separada del documento exportado;
- digest SHA-256 o superior sobre el objeto cifrado transferido;
- control de acceso de mínimo privilegio;
- registro auditable de exportación, descarga, importación, lectura, revocación y eliminación;
- política de retención y eliminación verificable.

## Consentimiento y finalidad

`purpose` limita los usos previstos. `consent` registra la base declarada por el emisor, la versión del aviso y las fechas relevantes. La presencia de estos campos no demuestra por sí sola cumplimiento jurídico; cada implementación debe validar su fundamento legal y obligaciones aplicables.

El receptor no debe ampliar la finalidad, conservar el registro más tiempo del indicado ni reutilizarlo para vigilancia, perfilamiento o identificación masiva sin una base independiente y documentada.

## Flujo recomendado de traslado

1. El sistema origen cifra el bloque biométrico con una clave de transferencia dedicada.
2. Calcula el digest del ciphertext.
3. Publica el objeto en almacenamiento temporal privado o lo incorpora como `encrypted_inline`.
4. Exporta el registro con formato, propósito, retención y referencia de clave.
5. Transfiere la clave por KMS, envoltura de clave o canal independiente autorizado.
6. El receptor autentica al solicitante, descarga, verifica digest, descifra e importa.
7. El origen revoca la URI temporal y ambos sistemas conservan evidencia auditable.

## Datos que no deben incluirse

- claves privadas, secretos KMS o contraseñas;
- muestras biométricas en Base64 sin cifrado;
- URLs públicas o permanentes;
- plantillas sin identificación de formato;
- biometría de una persona distinta a `person_id`;
- contenido fuera del plazo o finalidad declarados.
