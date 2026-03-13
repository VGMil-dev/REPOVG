---
titulo: "Introducción a Expo"
materia: movil
seccion: "Fundamentos"
orden: 1
dificultad: 1
depende_de: []
mascota_preguntas:
  - pregunta: "¿Qué es Expo y para qué sirve?"
    conceptos_clave: ["framework", "React Native", "aplicación móvil", "multiplataforma"]
evaluacion:
  puntaje_minimo: 70
  ejercicios:
    - tipo: multiple_opcion
      texto: "¿Con qué comando se crea un nuevo proyecto Expo?"
      opciones:
        - texto: "npx create-expo-app mi-app"
          correcta: true
        - texto: "npm init expo mi-app"
          correcta: false
        - texto: "expo new mi-app"
          correcta: false
---

# Introducción a Expo

**Expo** es un framework que simplifica el desarrollo de aplicaciones móviles con React Native.
Te permite crear apps para iOS y Android desde una sola base de código.

## ¿Por qué Expo?

- ✅ Sin configuración de Xcode ni Android Studio al inicio
- ✅ Hot reload instantáneo
- ✅ Librerías pre-configuradas
- ✅ Deploy sencillo

## Tu primer proyecto

```bash
npx create-expo-app mi-primera-app
cd mi-primera-app
npx expo start
```

## Estructura básica

```
mi-app/
  app/           ← pantallas (Expo Router)
  assets/        ← imágenes y fuentes
  components/    ← componentes reutilizables
  app.json       ← configuración del proyecto
```
