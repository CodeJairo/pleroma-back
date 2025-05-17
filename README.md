# 💡 Pleroma Backend

<table>
<tr>
<td>

🔍 ¿Tienes preguntas sobre el proyecto? ¡Consulta o aporta en [DeepWiki](https://deepwiki.com/CodeJairo/pleroma-back)!

</td>
<td align="right">

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/CodeJairo/pleroma-back)

</td>
</tr>
</table>

---

## 📘 Descripción del Proyecto

**Pleroma** es un software en desarrollo orientado a la **generación y gestión de contratos y presupuestos** de manera eficiente.

> ⚠️ _Este proyecto aún está en desarrollo; algunas funcionalidades pueden estar incompletas o sujetas a cambios._

---

## ⚙️ Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)

---

## 🚀 Configuración Inicial

1. **Clona el repositorio:**

   ```bash
   gh repo clone CodeJairo/pleroma-back
   cd pleroma-backend
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Levanta los servicios de base de datos y caché con Docker:**

   ```bash
   docker-compose up -d
   ```

4. **Aplica las migraciones de la base de datos:**

   ```bash
   npx prisma migrate dev
   ```

5. **Configura el entorno:**

   Crea un archivo `.env` basado en `.env.template` y ajusta las variables según tus necesidades.

---

## 🧪 Ejecutar el Proyecto

### 🔧 Modo Desarrollo

```bash
npm run dev
```

El servidor estará disponible en:  
👉 `http://localhost:3000`

### 🚢 Producción

```bash
npm run build
npm start
```

---

## 📚 Documentación de la API

La documentación Swagger está disponible en:  
📎 [http://pleromabackend/api-docs](http://localhost:3000/api-docs)

---

## 📝 Notas Adicionales

- Asegúrate de tener configuradas las variables de entorno correctamente.
- Para detener los servicios de Docker:

  ```bash
  docker-compose down
  ```

---
