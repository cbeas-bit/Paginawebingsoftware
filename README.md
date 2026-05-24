# 🐍 Mujer Cobra — Sitio Web
**El Arte de Creer y Crear**

---

## 📁 Estructura del Proyecto

```
mujercobra/
├── index.html          ← Página principal (hero, colecciones, legado, contacto)
├── shop.html           ← Tienda / catálogo con filtros y modal de producto
├── cart.html           ← Carrito de compras CLP / USD / UF
├── inventory.html      ← Inventario revalorizado con corrección monetaria
│
├── css/
│   ├── styles.css      ← Estilos globales, nav, footer, botones, colores
│   ├── shop.css        ← Tarjetas de producto, modal, carrito
│   └── inventory.css   ← Dashboard, tabla, corrección monetaria
│
├── js/
│   ├── main.js         ← Navegación, scroll, idioma ES/EN, reveal
│   ├── cart.js         ← Lógica de carrito (agregar, eliminar, cantidades)
│   ├── shop.js         ← Catálogo, filtros, modal, agregar al carrito
│   └── inventory.js    ← Corrección monetaria (IPC + UF), tabla, formulario
│
└── img/                ← Aquí van las fotos de los productos
    └── (tus fotos aquí)
```

---

## 🎨 Paleta de Colores

| Variable           | Color     | Uso                    |
|--------------------|-----------|------------------------|
| `--petrol-abyss`   | `#061a1b` | Fondo principal        |
| `--petrol`         | `#0f3839` | Secciones internas     |
| `--copper`         | `#c97a4b` | Acentos, categorías    |
| `--copper-bright`  | `#e89566` | Precios, destacados    |
| `--kintsugi-gold`  | `#e8b878` | Líneas decorativas     |
| `--ivory`          | `#f5ede0` | Texto principal        |

---

## 🌐 Idiomas (ES / EN)

El sitio tiene soporte bilingüe **Español / Inglés** desde el día 1.

- El toggle ES/EN en el nav cambia todo el contenido al instante
- La preferencia se guarda en `localStorage`
- Agregar textos nuevos: añadir claves en el objeto `I18N` de `js/main.js`

---

## 🛒 Agregar Fotos de Productos

En `js/shop.js`, busca el array `PRODUCTS` y agrega la ruta de la imagen:

```js
{
  id: 'joya-001',
  name: 'Aros Cobra Martillados',
  img: 'img/aros-cobra.jpg',   // ← agregar esta línea
  price_clp: 42000,
  // ...
}
```

Recomendación: fotos 800×1000px (ratio 4:5), fondo neutro oscuro o claro.

---

## 💰 Corrección Monetaria (Inventario)

La página `inventory.html` implementa la **corrección monetaria real** según:

- **IPC** (Índice de Precios al Consumidor) — Fuente: INE Chile
- **UF** (Unidad de Fomento) — Fuente: CMF Chile / mindicador.cl

### Fórmula aplicada:
```
Costo Corregido = Costo Base × (1 + IPC_acumulado / 100)
```

### Para actualizar los valores (mensual):
En `js/inventory.js`, líneas 10-16:

```js
const CM_CONFIG = {
  UF_HOY: 38247.33,    // ← Actualizar desde mindicador.cl/api/uf
  IPC_ANUAL: 4.5,      // ← Actualizar desde INE
  IPC_DESDE_BASE: 3.2, // ← IPC desde fecha_base del inventario
  USD_CLP: 920,        // ← Actualizar desde BCCh
};
```

---

## 🚀 Opciones de Despliegue

### Opción A: Hosting estático (para el prototipo / curso)
1. Sube la carpeta completa a cualquier hosting (Netlify, Vercel, GitHub Pages)
2. O bien, abre `index.html` directamente en el navegador para probar local

**Netlify (gratis, recomendado para pruebas):**
```bash
# Arrastra la carpeta mujercobra/ a netlify.com/drop
# Obtienes URL pública al instante
```

### Opción B: Shopify (producción — recomendado por el PPT)
La arquitectura actual es un **prototipo HTML** que sirve como:
- Referencia de diseño para el tema Shopify
- Demo funcional para la clienta Bárbara

**Pasos para migrar a Shopify:**
1. Crear cuenta en shopify.com con el plan Basic (~USD 39/mes)
2. Ir a "Temas" → "Personalizar" → subir o comprar un tema base
3. Replicar la paleta (verde petróleo + cobre) en el personalizador
4. Agregar los productos reales con fotos
5. Activar **WebPay Plus** (para pagos chilenos) en Configuración → Pagos
6. Apuntar el dominio `mujercobra.cl` a los servidores de Shopify

### Opción C: Dominio propio con hosting (internacional)
1. Comprimir y subir la carpeta a cPanel/FTP del hosting
2. El dominio ya fue comprado — apuntar nameservers al hosting

---

## 📦 Cómo subir a Netlify (más rápido para mostrar)

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. En la carpeta del proyecto
netlify deploy --dir=mujercobra

# 3. Para producción
netlify deploy --prod --dir=mujercobra
```

---

## 🔧 Tecnologías Usadas

| Qué             | Cómo                                   |
|-----------------|----------------------------------------|
| HTML/CSS/JS puro| Sin frameworks, máxima compatibilidad  |
| Google Fonts    | Cormorant Garamond + Cinzel + Outfit   |
| localStorage    | Carrito persistente entre páginas      |
| IntersectionObserver | Animaciones reveal al scroll     |
| Sin dependencias npm | Funciona abriendo el .html local  |

---

## 👥 Equipo — IS302 UTEM 2026

- Catalina Beas Pérez
- Martín Vera Bizama
- Camilo Arteaga Oyarce
- Martín Caamaño Jofré
- Rigo Vega Tafur

**Clienta:** Bárbara Becerra — Mujer Cobra  
**Curso:** Ingeniería de Software · Sección 302 · UTEM · 2026
