# Entrenador de tiempos verbales (MERN)

Aplicación MERN para practicar la identificación de tiempos verbales en inglés. Permite seleccionar tiempos específicos, generar lotes de oraciones únicas y recibir retroalimentación inmediata con explicación del disparador léxico. Incluye persistencia opcional en MongoDB para estadísticas básicas.

## Requisitos

- Node.js 18+
- npm 9+
- MongoDB (opcional, para estadísticas)

## Instalación

```bash
npm install
```

Esto instalará dependencias de cliente y servidor gracias a los *workspaces*.

### Variables de entorno

1. Copia el archivo de ejemplo y ajusta valores según tu entorno:

   ```bash
   cp server/.env.example server/.env
   ```

2. Si no deseas persistencia, puedes omitir `MONGODB_URI`. El servidor funcionará únicamente en modo memoria y las estadísticas devolverán valores vacíos.

## Scripts disponibles

Se ejecutan desde la raíz del monorepo:

| Script          | Descripción                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `npm run dev`   | Inicia servidor Express (puerto 4000) y cliente Vite (puerto 5173) en paralelo. |
| `npm run build` | Construye el frontend listo para producción.                                |
| `npm run start` | Arranca solo el servidor Express.                                           |
| `npm run lint`  | Ejecuta ESLint en cliente y servidor.                                       |
| `npm run test`  | Lanza las pruebas unitarias de backend y frontend.                          |

Para ejecutar scripts específicos por paquete usa `npm run <script> --workspace <nombre>`.

## Backend (server)

- **Tecnologías:** Node.js, Express, Mongoose, Zod.
- **Endpoints principales:**
  - `POST /api/generate`: genera 10 o 20 oraciones únicas según los tiempos seleccionados.
  - `POST /api/attempt`: guarda opcionalmente un intento en MongoDB.
  - `GET /api/stats`: devuelve estadísticas agregadas (requiere MongoDB).
- **Generador léxico:** combina sujetos, verbos y marcadores temporales para cada tiempo verbal, evitando repeticiones dentro de un lote. Cada ítem incluye traducción al español, opciones de respuesta, explicación y semilla.

## Frontend (client)

- **Tecnologías:** React + Vite, React Query, Axios.
- **Flujo:**
  1. Selecciona tiempos y cantidad.
  2. Haz clic en “Generar” para obtener ejercicios.
  3. Selecciona la opción correcta. Obtendrás retroalimentación inmediata y explicación basada en el marcador detectado.
  4. Puedes mostrar/ocultar la traducción al español por ejercicio.
  5. La barra superior muestra progreso (aciertos, respondidas, precisión).

El frontend envía intentos al backend; si no hay base de datos configurada, se ignoran silenciosamente.

## Estadísticas (opcional)

Cuando `MONGODB_URI` está configurado, los intentos se guardan en la colección `attempts`. El endpoint `/api/stats` calcula el total de aciertos por tiempo en el rango solicitado (por defecto, últimos 7 días).

## Pruebas

- Backend: pruebas con Vitest garantizan generación única, mezcla de tiempos y opciones válidas.
- Frontend: utilidades de progreso cubiertas con Vitest y Testing Library.

Ejecuta todo con:

```bash
npm run test
```

## Accesibilidad y i18n

- UI completamente en español, oraciones en inglés.
- Controles navegables con teclado, roles y etiquetas ARIA en elementos clave.
- Botón para mostrar traducción por ejercicio.

## Licencia

Este proyecto se distribuye con fines educativos.
