---
description: Genera documentación y mensaje de commit atómico analizando git diff.
---

# Workflow: Smart Commit

Sigue estos pasos para generar un mensaje de commit atómico y su documentación de manera eficiente.

## 1. Capturar Diferencias (Staged)
Ejecuta este comando para volcar los cambios **preparados (staged)** a un archivo temporal.
// turbo
1. git diff --cached > .diff_tmp

## 2. Analizar Contexto
Lee el archivo temporal para identificar los cambios realizados.
2. view_file .diff_tmp

## 3. Generar Documentación y Mensaje
Basado en el análisis del archivo `.diff_tmp`:
1.  **Crea un archivo de documentación** en `docs/commits/` (ej: `docs/commits/feat-auth.md`) con el detalle de los cambios.
2.  **Propón el mensaje de commit** siguiendo el formato de Conventional Commits.

### Guía de Estilo
**Formato:** `<emoji> <tipo>(<scope>): <descripción imperativa>`

**Emojis Comunes:**
| Emoji | Tipo | Uso |
| :--- | :--- | :--- |
| ✨ | feat | Nueva funcionalidad |
| 🐛 | fix | Corrección de errores |
| ♻️ | refactor | Cambios de código sin nueva funcionalidad |
| 📚 | docs | Cambios en documentación |
| 🚀 | perf | Mejoras de rendimiento |
| 🔧 | chore | Tareas de mantenimiento/configuración |

## 4. Limpieza del Entorno
Elimina el archivo auxiliar para mantener el espacio de trabajo limpio.
// turbo
3. Remove-Item .diff_tmp
