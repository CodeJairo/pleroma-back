# Pleroma Backend

### Descripción del Proyecto

Pleroma es un software diseñado para la generación y gestión de contratos, usuarios y presupuestos de manera eficiente. El proyecto está en desarrollo, por lo que algunas funcionalidades pueden estar incompletas o sujetas a cambios.

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

3. Levanta los servicios de base de datos y cache con Docker:

   ```bash
   docker-compose up -d
   ```

4. Aplica las migraciones de la base de datos:

   ```bash
   npx prisma migrate dev
   ```

5. Crea un archivo `.env` basado en `.env.template` y configura las variables necesarias.

## Ejecutar el Proyecto

### Modo Desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

### Producción

```bash
npm run build
npm start
```

## Documentación de la API

La documentación Swagger está disponible en:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Notas

- Asegúrate de tener configuradas las variables de entorno en el archivo `.env`.
- Para detener los servicios de Docker:

  ```bash
  docker-compose down
  ```

- El proyecto implementa autenticación JWT, control de acceso por roles, validación de datos con Zod, y cache con Redis.
- Para pruebas y desarrollo, revisa los archivos en la carpeta `src/__tests__/`.
