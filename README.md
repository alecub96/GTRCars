# vaneando. — Plataforma de alquiler de vehículos recreativos en Canarias

Plataforma marketplace en producción especializada en el alquiler de campervans, furgonetas camperizadas y autocaravanas entre particulares y profesionales en **todas las Islas Canarias** (Gran Canaria, Tenerife, Lanzarote, Fuerteventura, La Palma, La Gomera, El Hierro y La Graciosa).

Diseñada con la identidad visual propia de vaneando. (turquesa atlántico, verde profundo, crema y arena).

## 🚀 Características Principales

- **Frontend & Backend Integrado:** Next.js 14+ App Router, TypeScript, React 19, Tailwind CSS.
- **Base de Datos Relacional:** MySQL/MariaDB + Prisma ORM con un esquema completo (`User`, `Vehicle`, `Booking`, `Payment`, `Contract`, `Review`, `Conversation`, `Message`, `SeoLocation`, etc.).
- **Motor de Precios Backend:** Cálculo autoritativo de tarifas por día, estancias mínimas, descuentos automáticos semanales/mensuales, comisiones marketplace y tarifas de servicio.
- **Prevención de Double-Booking:** Transacciones de base de datos atómicas para bloquear calendarios e impedir solapamientos.
- **Pagos Marketplace:** Integración de Stripe & Stripe Connect para cobros, payout de propietarios y depósitos de fianza.
- **Contratos & Firma Digital:** Generación de contrato de alquiler de vehículos sin conductor en España con firma digital en pantalla.
- **SEO Canarias Especializado:** Rutas indexables por isla (`/alquiler-camper/gran-canaria`, `/tenerife`, etc.), metadatos OG, `sitemap.xml` dinámico y `robots.txt`.
- **Dashboards por Rol:** Paneles para Viajeros, Propietarios (ingresos, ocupación, lista de campers) y Administradores (KPIs globales, transacciones GMV).

---

## 🛠️ Instalación y Desarrollo Local

### 1. Requisitos Previos
- Node.js 20+
- MySQL/MariaDB administrado (o Docker instalado)

### 2. Variables de Entorno
Crea un archivo `.env` en la raíz con el siguiente contenido:

Usa [`.env.example`](.env.example) como referencia. No guardes credenciales reales en Git y utiliza secretos aleatorios de al menos 32 caracteres para sesiones, documentos y cron.

### 3. Instalación de Dependencias
```bash
npm install
```

### 4. Esquema y datos de desarrollo
Sincroniza primero el esquema. Ejecuta el seed únicamente sobre una base local o vacía:

```bash
npm run db:deploy
# Solo en desarrollo y después de confirmar que la base está vacía:
npx tsx prisma/seed.ts
```

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Accede a [http://localhost:3000](http://localhost:3000).

---

El seed es exclusivamente local. Las cuentas administrativas de producción se crean mediante el registro normal y se autorizan con `ADMIN_EMAILS`.

## Despliegue en Hostinger

- Usa `VANEANDO_DATABASE_URL` para la conexión MySQL/MariaDB de la aplicación. Tiene prioridad sobre `DATABASE_URL`, que algunas integraciones pueden sobrescribir.
- El formato es `mysql://USUARIO:CONTRASEÑA_URL_ENCODED@HOST_MYSQL:3306/BASE_DE_DATOS`.
- `SMTP_USER` debe ser un buzón real de Hostinger (por ejemplo, `admin@vaneando.com`) y `SMTP_PASSWORD` debe ser la contraseña de ese buzón, no la contraseña del panel hPanel.
- Tras cambiar variables, vuelve a desplegar y comprueba `https://vaneando.com/api/health`. No publiques si el proveedor de base aparece como `missing` o `incompatible`.
- El webhook de Stripe debe apuntar a `https://vaneando.com/api/webhooks/stripe` y su secreto de firma debe guardarse en `STRIPE_WEBHOOK_SECRET`.

---

## 🐳 Despliegue con Docker

Para levantar la infraestructura completa (Next.js + MariaDB) en producción:

```bash
docker-compose up --build -d
```
