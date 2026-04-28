## 🎯 OBJETIVO
Desarrollar un juego tipo rompecabezas de “ranas que intercambian posiciones” (Frog Puzzle) utilizando **Vue 3 + TailwindCSS v4**, optimizado para **móvil en orientación vertical**, con arquitectura limpia, escalable y preparado como **PWA**.

---

## 🧠 DESCRIPCIÓN DEL JUEGO
El juego consiste en dos grupos de ranas:
- 🟢 Ranas verdes (inician arriba)
- 🟤 Ranas cafés (inician abajo)
- Un espacio vacío en el centro

Objetivo:
Intercambiar completamente las posiciones de ambos grupos siguiendo reglas específicas de movimiento.

---

## 📜 REGLAS DEL JUEGO
1. Cada rana solo puede moverse en una dirección:
   - Verdes → hacia abajo
   - Cafés → hacia arriba

2. Movimientos permitidos:
   - Avanzar a una celda vacía adyacente
   - Saltar sobre una sola rana si hay espacio vacío después

3. Restricciones:
   - No pueden retroceder
   - No pueden saltar más de una rana
   - No pueden moverse si no hay espacio válido

---

## 🧩 SISTEMA DE NIVELES
- Nivel inicial: 2 ranas (1 verde + 1 café)
- Incremento progresivo:
  - Se aumenta 1 rana por nivel alternando colores
  - Ejemplo:
    - Nivel 1 → 1 vs 1
    - Nivel 2 → 2 verdes vs 1 café
    - Nivel 3 → 2 vs 2
    - Nivel 4 → 3 vs 2
    - ...
- Nivel máximo: 10 (5 vs 5)

IMPORTANTE:
- Diseñar lógica dinámica para permitir más niveles en el futuro
- No hardcodear cantidades

---

## ⏱️ SISTEMA DE TIEMPO
- Cada nivel tiene un tiempo límite configurable
- El tiempo aumenta ligeramente por nivel
- Si el tiempo se agota:
  - Mostrar pantalla de derrota
  - Opción de reintentar

---

## 📱 DISEÑO UI/UX (MÓVIL - VERTICAL)
- Layout vertical centrado
- Juego ocupa la mayor parte de la pantalla
- Elementos:
  - Header:
    - Nivel actual
    - Timer (cuenta regresiva)
  - Tablero:
    - Disposición vertical (tipo columna)
  - Footer:
    - Botón reiniciar
    - Botón siguiente nivel (si gana)

---

## 🎨 DISEÑO VISUAL (TAILWIND 4)
- Estilo minimalista tipo “mobile game casual”
- Usar:
  - Flex + Grid
  - Animaciones suaves (transition, scale, bounce leve)
- Estados visuales:
  - Selección de rana
  - Movimiento válido
  - Error de movimiento
- Colores sugeridos:
  - Verde: emerald
  - Café: amber / brown
  - Fondo: neutral claro

---

## 🧱 ARQUITECTURA (IMPORTANTE)
Aplicar buenas prácticas:

### Estructura de carpetas
```
src/
  components/
    GameBoard.vue
    FrogPiece.vue
    GameHeader.vue
    GameFooter.vue
  composables/
    useGameLogic.ts
    useTimer.ts
    useLevels.ts
  stores/ (opcional pinia)
  utils/
    movementRules.ts
  views/
    GameView.vue
  assets/
```

---

## ⚙️ LÓGICA DEL JUEGO
- Representar el tablero como un array:
```
['green', 'green', null, 'brown', 'brown']
```

- Funciones clave:
  - getValidMoves(index)
  - moveFrog(fromIndex, toIndex)
  - checkWinCondition()
  - generateLevel(level)

---

## 🔁 REACTIVIDAD (VUE 3)
- Usar Composition API
- Estado central en composables o Pinia
- Evitar lógica en templates

---

## 🎮 INTERACCIÓN
- Tap para seleccionar rana
- Tap en destino para mover
- Resaltar movimientos válidos

---

## 🧪 VALIDACIONES
- No permitir movimientos inválidos
- Validar reglas antes de mover
- Evitar estados inconsistentes

---

## 🏁 CONDICIONES
### Victoria:
- Todas las ranas intercambiaron posición correctamente

### Derrota:
- Se acabó el tiempo

---

## 📦 PWA
Configurar:
- Manifest.json
- Service Worker
- Offline básico
- Instalación en móvil

---

## 🚀 PERFORMANCE
- Evitar renders innecesarios
- Usar keys correctas en listas
- Minimizar watchers

---

## 🧼 CÓDIGO LIMPIO
- Separar lógica de UI
- Funciones puras en utils
- Tipado con TypeScript
- Nombres claros y semánticos

---

## 🔮 ESCALABILIDAD
Preparar el sistema para:
- Más niveles
- Diferentes reglas
- Modos de juego

---

## 📌 ENTREGABLE
El agente debe generar:
- Proyecto funcional Vue 3
- Código modular
- Juego completamente jugable
- UI responsive móvil
- Lógica clara y reutilizable

---

## 🧠 EXTRA (OPCIONAL)
- Animaciones de salto
- Sonidos básicos
- Sistema de puntuación por tiempo restante

---

Generar todo el código necesario con enfoque profesional, limpio, escalable y listo para producción.
