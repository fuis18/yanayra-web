# Yanaira - Setup e Instrucciones

## Arquitectura del Proyecto

```
Frontend (Vite/React) → Backend (NestJS) → Printer Service (Rust/gRPC) → Impresora
     Puerto 5173          Puerto 3000          Puerto 50051           192.168.0.252:9100
```

## Requisitos Previos

- Docker Desktop instalado
- Puerto 3000, 5173 y 50051 disponibles

## Instalación y Ejecución

### 1. Levantar todos los servicios

```bash
docker-compose up --build
```

Esto iniciará:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **Printer Service**: puerto 50051 (gRPC)

### 2. Para detener los servicios

```bash
docker-compose down
```

### 3. Para ver los logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f printer-service
```

## Uso

1. Abre el navegador en http://localhost:5173
2. Escribe el texto que deseas imprimir en el campo de entrada
3. Haz clic en "Imprimir"
4. El sistema enviará:
   - Frontend → Backend (HTTP POST)
   - Backend → Printer Service (gRPC)
   - Printer Service → Impresora física (TCP 9100)

## Desarrollo Local (sin Docker)

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Printer Service
```bash
cd printer-service
cargo build
cargo run
```

**Nota**: Si ejecutas sin Docker, cambia la URL del backend en `frontend/src/components/MyForm.tsx` línea 31:
```typescript
const response = await fetch('http://localhost:3000/printer/print', {
```

## Configuración de la Impresora

La dirección IP de la impresora está configurada en:
- `printer-service/src/main.rs` línea 26: `192.168.0.252:9100`

Para cambiarla, edita esa línea y reconstruye el contenedor:
```bash
docker-compose up --build printer-service
```

## Troubleshooting

### Error: No se puede conectar al backend
- Verifica que el backend esté corriendo: `docker-compose logs backend`
- Asegúrate de que no haya otro servicio en el puerto 3000

### Error: gRPC connection failed
- Verifica que printer-service esté corriendo: `docker-compose logs printer-service`
- Revisa que el puerto 50051 esté disponible

### Error: No se puede imprimir
- Verifica la IP de la impresora en la red
- Asegúrate de que la impresora esté encendida y en la misma red
- Prueba hacer ping a la impresora: `ping 192.168.0.252`

## Estructura del Proyecto

```
Yanaira/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── printer/     # Módulo de impresión con cliente gRPC
│   │   └── main.ts      # Entrada con CORS habilitado
│   └── Dockerfile
├── frontend/            # React + Vite
│   ├── src/
│   │   └── components/
│   │       └── MyForm.tsx  # Formulario con fetch al backend
│   └── Dockerfile
├── printer-service/     # Servidor gRPC en Rust
│   ├── src/
│   │   └── main.rs      # Servidor gRPC + lógica de impresión
│   └── Dockerfile
├── proto/              # Definiciones protobuf compartidas
│   └── printer.proto
└── docker-compose.yml  # Orquestación de contenedores
```
