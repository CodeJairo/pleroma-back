# Pleroma Backend

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)

## Configuración Inicial

1. Clona el repositorio:

   ```bash
   gh repo clone CodeJairo/pleroma-back
   cd pleroma-backend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Levanta los servicios con Docker:

   ```bash
   docker-compose up -d
   ```

4. Aplica las migraciones de la base de datos:

   ```bash
   npx prisma migrate dev
   ```

## Ejecutar el Proyecto

### Modo Desarrollo:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

### Producción:

```bash
npm run build
npm start
```

## Notas

- Asegúrate de tener configuradas las variables de entorno en el archivo `.env`.
- Para detener los servicios de Docker:

  ```bash
  docker-compose down
  ```
