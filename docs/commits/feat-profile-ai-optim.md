# Perfil de Usuario y Optimización de Mascota IA

**Fecha:** 15 de marzo de 2026

## Archivos Afectados
- `app/(protected)/dashboard/page.tsx`
- `app/(protected)/profile/ApiKeySection.tsx` [NEW]
- `app/(protected)/profile/page.tsx` [NEW]
- `app/onboarding/mision-1/page.tsx`
- `components/layout/Sidebar.tsx`
- `components/layout/Topbar.tsx`
- `components/mascot/MascotChat.tsx`
- `lib/auth/onboarding-actions.ts`
- `lib/auth/profile-actions.ts` [NEW]
- `lib/mascot/actions.ts`
- `lib/mascot/intents.json` [NEW]
- `types/index.ts`

## Descripción Detallada
Este commit implementa mejoras significativas en la experiencia del usuario y en la eficiencia del sistema de IA:

### Gestión de Perfil y API Keys
- Se ha creado una nueva sección de **Perfil** (`/profile`) que centraliza la información del estudiante (XP, monedas, rol) y la configuración técnica.
- Implementación de `ApiKeySection` para permitir que los usuarios conecten su propia clave de **Google Gemini**. Esto incluye validación en tiempo real contra la API de Google antes de guardar.
- Refactorización de las acciones de perfil (`profile-actions.ts`) para manejar la persistencia de claves de forma segura en el servidor.

### Optimización de la Mascota (Fase de Intenciones)
- Se ha introducido un sistema de **interpretación local** (`intents.json`) que permite a la mascota responder a saludos, agradecimientos y dudas genéricas sin realizar llamadas al LLM. Esto ahorra cuota de la API y mejora el tiempo de respuesta.
- Mejora en la robustez del parseo de respuestas de Gemini, filtrando bloques de pensamiento ("thought") y manejando formatos JSON complejos.
- Actualización del `System Prompt` para restringir el dominio estrictamente a programación y tecnología, aplicando el "Efecto Protégé".

### Pulido de UI y Navegación
- Se ha unificado la ruta de perfil a `/profile` (anteriormente `/perfil`).
- Actualización de `Sidebar` y `Topbar` para reflejar el nuevo enlace de perfil.
- Limpieza de comentarios y alineación de código en los procesos de onboarding.

## Mensaje de Commit Generado
✨ feat(profile): implementar gestión de API keys y optimización local de mascota

- Añadir página de perfil con visualización de estadísticas y configuración.
- Implementar `ApiKeySection` para conexión segura con Google Gemini.
- Añadir sistema de interpretación de intenciones local para ahorrar cuota de IA.
- Refactorizar lógica de chat con mascota para mayor robustez en el parseo.
- Actualizar navegación y rutas consistentes hacia `/profile`.
