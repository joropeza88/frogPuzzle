# Frog Puzzle

Juego tipo rompecabezas de ranas con niveles progresivos, construido con Vue 3, TypeScript y Vite.

## Stack

- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- `vite-plugin-pwa`

## Desarrollo local

Instala dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
```

## Build de producción

Para generar la carpeta `dist`:

```bash
npm run build
```

## Estructura principal

- `src/`: lógica, vistas y componentes del juego
- `public/`: imágenes, sonidos e íconos
- `dist/`: build generado para producción

## Publicación

El proyecto está configurado sin base:

```txt
/
```

Si lo publicas en otra ruta, ajusta `base` en [`vite.config.ts`](./vite.config.ts).

## Repositorio

Remoto configurado:

```txt
git@github.com:joropeza88/frogPuzzle.git
```
