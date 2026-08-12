# Nomad Canarias - Plataforma Full-Stack de Alquiler de Campers en Canarias

Plataforma marketplace en producción especializada en el alquiler de campervans, furgonetas camperizadas y autocaravanas entre particulares y profesionales en **todas las Islas Canarias** (Gran Canaria, Tenerife, Lanzarote, Fuerteventura, La Palma, La Gomera, El Hierro y La Graciosa).

Diseñada con un lenguaje visual inspirador **estilo Alisios Picnic** (tonos tierra, crema, arena, negro suave y azul océano).

## 🚀 Características Principales

- **Frontend & Backend Integrado:** Next.js 14+ App Router, TypeScript, React 19, Tailwind CSS.
- **Base de Datos Relacional:** PostgreSQL + Prisma ORM con un esquema completo (`User`, `Vehicle`, `Booking`, `Payment`, `Contract`, `Review`, `Conversation`, `Message`, `SeoLocation`, etc.).
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
- PostgreSQL administrado (o Docker instalado)

### 2. Variables de Entorno
Crea un archivo `.env` en la raíz con el siguiente contenido:

```env
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@HOST:5432/BASE_DE_DATOS?sslmode=require"
JWT_SECRET="secret-jwt-key-canarias-2026"
STRIPE_SECRET_KEY="sk_test_mock_canarias_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_mock_canarias_key"
```

### 3. Instalación de Dependencias
```bash
npm install
```

### 4. Migraciones y Seed de Datos
Poblar la base de datos con campers y ubicaciones reales en las 8 Islas Canarias:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Accede a [http://localhost:3000](http://localhost:3000).

---

## 🔑 Cuentas Demo de Prueba (Sembradas en el Seed)

- **Administrador:** `admin@canariascampers.es` (Password: `Password123!`)
- **Propietario Gran Canaria:** `propietario.grancanaria@canariascampers.es` (Password: `Password123!`)
- **Propietario Tenerife:** `propietario.tenerife@canariascampers.es` (Password: `Password123!`)
- **Viajero:** `viajero@canariascampers.es` (Password: `Password123!`)

---

## 🐳 Despliegue con Docker

Para levantar la infraestructura completa (Next.js + PostgreSQL) en producción:

```bash
docker-compose up --build -d
```
