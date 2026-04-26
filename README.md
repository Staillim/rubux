# Roblox Giveaway Tool (Node.js + React)

Aplicacion fullstack para registrar ganadores de giveaways de Roblox.

## Stack
- Backend: Node.js + Express
- Frontend: React + Vite
- Persistencia local: localStorage (cliente)

## Requisitos
- Node.js 18+

## Instalacion
```bash
cd "c:\Users\stail\Downloads\roblox-giveaway-node-react"
npm install
npm run install:all
```

## Ejecucion
```bash
npm run dev
```

Servicios:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Variables de entorno (backend)
Copia `server/.env.example` a `server/.env` y ajusta si necesitas cambiar puertos/origen.

## Endpoints
- `GET /health`
- `GET /api/roblox/user?username=<nombre>`
