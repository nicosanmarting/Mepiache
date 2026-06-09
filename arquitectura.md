# Mepiache — Arquitectura técnica futura

## Stack actual
- Sitio: HTML/CSS/JS estático + `productos.json`
- Hosting: Netlify (pendiente)
- Formulario: Formspree (pendiente)
- Sin backend ni base de datos

## Principio de diseño
Una base de datos central → una API → múltiples sistemas consumen la misma fuente de verdad.

## Sistemas a construir (en orden)
1. **Sitio web** ← estamos aquí
2. **Sistema de pedidos** — formulario → BD → notificación
3. **Inventario** — stock por producto/sabor/formato
4. **Logística** — estado de despachos, rutas, confirmación entrega
5. **Clientes/distribuidores** — historial, precios diferenciados
6. **Pagos online** — Transbank / Mercado Pago

## APIs necesarias por sistema

| Sistema | Qué expone la API |
|---|---|
| Productos | GET catálogo, precios, disponibilidad |
| Pedidos | POST nuevo pedido, GET estado |
| Inventario | GET stock, PUT actualizar unidades |
| Logística | POST despacho, PATCH estado entrega |
| Clientes | GET historial, precios por segmento |
| Pagos | POST cobro (integración externa) |
| Notificaciones | POST email/WA (SendGrid / Resend) |

## Base de datos recomendada
**Supabase** (PostgreSQL hosted) o **Firebase** (NoSQL).
Supabase preferible: SQL, genera API REST automáticamente, open source, plan gratis generoso.

## Estructura de datos mínima (migrar desde productos.json)

```
productos: id, nombre, categoria, sabores[], formatos[], precio_unitario, precio_mayorista, stock, activo
pedidos: id, cliente_id, productos[], total, estado, fecha, canal (web/WA/presencial)
clientes: id, nombre, tipo (B2B/B2C), rut, telefono, email, precio_segmento
despachos: id, pedido_id, direccion, fecha_despacho, estado, conductor
```

## Flujo de pedido completo (futuro)
```
Pedido web → API pedidos → descuenta inventario → crea despacho → 
envía email confirmación → actualiza estado cliente
```

## Lo que hay que hacer ahora para preparar la migración
- Mantener `productos.json` con campos: `id, nombre, categoria, descripcion, sabores, formatos, precio, activo`
- No hardcodear precios en el HTML
- Separar datos de presentación desde ya

## Servicios externos útiles
- Auth: Supabase Auth / Firebase Auth
- Emails: Resend (simple) o SendGrid
- Pagos: Transbank Webpay (CL) o Mercado Pago
- Mapas/logística: Google Maps API o simplefleet.cl
