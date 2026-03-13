---
titulo: "JFrame: El Edificio"
materia: java
seccion: "Swing"
orden: 1
dificultad: 1
depende_de: []
mascota_preguntas:
  - pregunta: "¿Me puedes explicar para qué sirve un JFrame?"
    conceptos_clave: ["ventana", "contenedor", "aplicación", "interfaz"]
  - pregunta: "¿Y para qué es el setVisible(true)?"
    conceptos_clave: ["visible", "mostrar", "pantalla"]
evaluacion:
  puntaje_minimo: 70
  ejercicios:
    - tipo: multiple_opcion
      texto: "¿Qué clase debemos importar para usar JFrame?"
      opciones:
        - texto: "javax.swing.JFrame"
          correcta: true
        - texto: "java.awt.Frame"
          correcta: false
        - texto: "java.swing.JFrame"
          correcta: false
---

# JFrame: El Edificio

Un **JFrame** es la ventana principal de cualquier aplicación Java con interfaz gráfica. 
Piénsalo como el edificio donde vivirá tu aplicación.

## Creando tu primer JFrame

```java
import javax.swing.JFrame;

public class MiApp {
    public static void main(String[] args) {
        JFrame ventana = new JFrame("Mi Primera App");
        ventana.setSize(400, 300);
        ventana.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        ventana.setVisible(true);
    }
}
```

## Métodos esenciales

| Método | Para qué sirve |
|--------|---------------|
| `setTitle(String)` | Cambia el título de la ventana |
| `setSize(int, int)` | Define el ancho y alto en píxeles |
| `setVisible(boolean)` | Muestra u oculta la ventana |
| `setDefaultCloseOperation(int)` | Define qué pasa al cerrar |

## El ciclo de vida

1. **Crear** → `new JFrame()`
2. **Configurar** → tamaño, título, comportamiento
3. **Agregar componentes** → botones, campos, etc.
4. **Mostrar** → `setVisible(true)`
