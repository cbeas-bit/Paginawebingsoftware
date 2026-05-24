/* ============================================================
   MUJER COBRA — inventory.js
   Inventario Revalorizado con Corrección Monetaria
   Metodología: UF (CMF Chile) + IPC (INE Chile)
   ============================================================ */

/* ── Parámetros de corrección monetaria ────────────────────── */
const CM_CONFIG = {
  // Valor UF del día (actualizar desde API CMF: https://mindicador.cl/api/uf)
  UF_HOY: 38247.33,
  // IPC acumulado últimos 12 meses (fuente: INE)
  IPC_ANUAL: 4.5,        // %
  // IPC acumulado desde fecha base del inventario
  IPC_DESDE_BASE: 3.2,   // %
  // Tasa de cambio USD referencial (BCCh)
  USD_CLP: 920,
  // Fecha base del inventario
  FECHA_BASE: '2025-01-01',
};

/* ── Inventario de productos ───────────────────────────────── */
// En producción se cargaría desde API/BD
let INVENTORY = [
  {
    id: 'INV-001', sku: 'JOY-AROS-001',
    name: 'Aros Cobra Martillados', name_en: 'Hammered Cobra Earrings',
    category: 'Joyería', category_en: 'Jewelry',
    costo_base_clp: 18000,          // Costo original en CLP (fecha base)
    precio_venta_clp: 42000,
    stock: 8, stock_min: 3,
    fecha_ingreso: '2025-03-15',
    material: 'Cobre recuperado',
  },
  {
    id: 'INV-002', sku: 'JOY-PUL-002',
    name: 'Pulsera Kintsugi', name_en: 'Kintsugi Bracelet',
    category: 'Joyería', category_en: 'Jewelry',
    costo_base_clp: 28000,
    precio_venta_clp: 68000,
    stock: 5, stock_min: 2,
    fecha_ingreso: '2025-04-01',
    material: 'Cobre · Resina dorada',
  },
  {
    id: 'INV-003', sku: 'JOY-COL-003',
    name: 'Collar Serpiente', name_en: 'Serpent Necklace',
    category: 'Joyería', category_en: 'Jewelry',
    costo_base_clp: 38000,
    precio_venta_clp: 95000,
    stock: 3, stock_min: 2,
    fecha_ingreso: '2025-02-20',
    material: 'Cobre · 45cm',
  },
  {
    id: 'INV-004', sku: 'TEX-CAR-001',
    name: 'Cartera Oveja Negra', name_en: 'Black Sheep Bag',
    category: 'Textil', category_en: 'Textile',
    costo_base_clp: 32000,
    precio_venta_clp: 85000,
    stock: 6, stock_min: 2,
    fecha_ingreso: '2025-05-10',
    material: 'Lana natural · Cuero crudo',
  },
  {
    id: 'INV-005', sku: 'TEX-TOT-002',
    name: 'Tote Petróleo', name_en: 'Petrol Tote',
    category: 'Textil', category_en: 'Textile',
    costo_base_clp: 42000,
    precio_venta_clp: 110000,
    stock: 4, stock_min: 2,
    fecha_ingreso: '2025-05-20',
    material: 'Merino · Algodón',
  },
  {
    id: 'INV-006', sku: 'CUA-COB-001',
    name: 'Cobra Ígnea I', name_en: 'Igneous Cobra I',
    category: 'Cuadros', category_en: 'Paintings',
    costo_base_clp: 180000,
    precio_venta_clp: 480000,
    stock: 1, stock_min: 1,
    fecha_ingreso: '2025-01-15',
    material: 'Acrílico · Cobre · Lino',
  },
  {
    id: 'INV-007', sku: 'CUA-KIN-002',
    name: 'Kintsugi Azul', name_en: 'Blue Kintsugi',
    category: 'Cuadros', category_en: 'Paintings',
    costo_base_clp: 120000,
    precio_venta_clp: 320000,
    stock: 2, stock_min: 1,
    fecha_ingreso: '2025-02-01',
    material: 'Óleo · Hoja de cobre',
  },
  {
    id: 'INV-008', sku: 'CUA-SEL-003',
    name: 'Selva Mística', name_en: 'Mystic Jungle',
    category: 'Cuadros', category_en: 'Paintings',
    costo_base_clp: 240000,
    precio_venta_clp: 650000,
    stock: 1, stock_min: 1,
    fecha_ingreso: '2025-01-10',
    material: 'Mixta · Resina · Cobre',
  },
];

/* ═══════════════════════════════════════════════════════════
   CORRECCIÓN MONETARIA — FÓRMULAS
   ═══════════════════════════════════════════════════════════

   La corrección monetaria ajusta el valor de un activo o
   precio para mantener su poder adquisitivo real, eliminando
   el efecto de la inflación.

   MÉTODOS DISPONIBLES:

   1. Por IPC (Índice de Precios al Consumidor):
      Valor_Corregido = Valor_Base × (1 + IPC_acumulado / 100)

   2. Por UF (Unidad de Fomento):
      — Primero expresar el valor en UF a la fecha base
      — Luego multiplicar por el valor actual de la UF
      Valor_Corregido = (Valor_Base / UF_base) × UF_actual

   3. Variación porcentual entre dos fechas:
      %_variación = ((UF_nueva / UF_antigua) - 1) × 100

   MUJER COBRA usa el MÉTODO IPC para precios de costo,
   y expresa en UF como referencia para cuadros de alto valor.
   ═══════════════════════════════════════════════════════════ */

function corregirPorIPC(valorBase, ipcPct) {
  return valorBase * (1 + ipcPct / 100);
}

function corregirPorUF(valorBaseCLP, ufBase, ufActual) {
  const enUF = valorBaseCLP / ufBase;
  return enUF * ufActual;
}

function calcCorrection(item) {
  const cfg = CM_CONFIG;
  // Usamos IPC acumulado desde la fecha de ingreso
  const ipc = cfg.IPC_DESDE_BASE;
  const costoCorregido = corregirPorIPC(item.costo_base_clp, ipc);
  const costoEnUF      = item.costo_base_clp / cfg.UF_HOY;
  const precioEnUF     = item.precio_venta_clp / cfg.UF_HOY;
  const ganancia       = item.precio_venta_clp - costoCorregido;
  const margen         = ((ganancia / item.precio_venta_clp) * 100).toFixed(1);
  const valorInventario = item.precio_venta_clp * item.stock;
  const costoInventario = costoCorregido * item.stock;

  return {
    costoOriginal:   item.costo_base_clp,
    costoCorregido:  Math.round(costoCorregido),
    costoEnUF:       costoEnUF.toFixed(4),
    precioEnUF:      precioEnUF.toFixed(4),
    ganancia:        Math.round(ganancia),
    margenPct:       margen,
    valorInventario,
    costoInventario: Math.round(costoInventario),
  };
}

/* ── Formatters ────────────────────────────────────────────── */
function fmtCLP(n) { return '$ ' + Math.round(n).toLocaleString('es-CL'); }
function fmtUSD(n) { return 'USD ' + (n / CM_CONFIG.USD_CLP).toFixed(0); }

/* ── Dashboard stats ───────────────────────────────────────── */
function renderDashboard() {
  const lang = window.MC?.lang || 'es';
  const isEn = lang === 'en';

  const totalStock   = INVENTORY.reduce((s,i) => s + i.stock, 0);
  const totalValor   = INVENTORY.reduce((s,i) => s + i.precio_venta_clp * i.stock, 0);
  const totalCosto   = INVENTORY.reduce((s,i) => s + calcCorrection(i).costoInventario, 0);
  const bajoStock    = INVENTORY.filter(i => i.stock <= i.stock_min && i.stock > 0).length;
  const sinStock     = INVENTORY.filter(i => i.stock === 0).length;

  const cards = [
    { label: isEn ? 'Total Units'        : 'Unidades Totales',   value: totalStock,           fmt: 'n' },
    { label: isEn ? 'Inventory Value'    : 'Valor Inventario',   value: totalValor,            fmt: 'clp' },
    { label: isEn ? 'Corrected Cost'     : 'Costo Corregido',    value: totalCosto,            fmt: 'clp' },
    { label: isEn ? 'Low Stock Items'    : 'Productos Stock Bajo', value: bajoStock,           fmt: 'n' },
    { label: isEn ? 'Out of Stock'       : 'Sin Stock',           value: sinStock,             fmt: 'n' },
    { label: isEn ? 'UF Value Today'     : 'Valor UF Hoy',        value: CM_CONFIG.UF_HOY,    fmt: 'clp' },
  ];

  const dash = document.getElementById('inv-dashboard');
  if (!dash) return;

  dash.innerHTML = cards.map(c => `
    <div class="inv-stat-card reveal">
      <div class="inv-stat-label">${c.label}</div>
      <div class="inv-stat-value">${c.fmt === 'clp' ? fmtCLP(c.value) : c.value}</div>
      ${c.fmt === 'clp' ? `<div class="inv-stat-sub">${fmtUSD(c.value)}</div>` : ''}
    </div>`).join('');
}

/* ── Inventory table ───────────────────────────────────────── */
function renderTable() {
  const lang = window.MC?.lang || 'es';
  const isEn = lang === 'en';
  const tbody = document.getElementById('inv-tbody');
  if (!tbody) return;

  tbody.innerHTML = INVENTORY.map(item => {
    const c = calcCorrection(item);
    const name = isEn ? (item.name_en || item.name) : item.name;
    const cat  = isEn ? (item.category_en || item.category) : item.category;

    const stockClass = item.stock === 0 ? 'stock-out'
                     : item.stock <= item.stock_min ? 'stock-low'
                     : 'stock-ok';
    const stockLabel = item.stock === 0
      ? (isEn ? 'Out of stock' : 'Sin stock')
      : item.stock <= item.stock_min
        ? (isEn ? 'Low' : 'Bajo')
        : (isEn ? 'OK' : 'OK');

    const gainClass = c.ganancia >= 0 ? 'gain-positive' : 'gain-negative';

    return `
    <tr>
      <td>
        <div class="inv-product-name">${name}</div>
        <div class="inv-product-cat">${cat} · ${item.sku}</div>
      </td>
      <td class="right">
        <div class="price-original-clp">${fmtCLP(c.costoOriginal)}</div>
      </td>
      <td class="right">
        <div class="price-revalued">${fmtCLP(c.costoCorregido)}</div>
        <div class="price-usd-eq">${c.costoEnUF} UF</div>
      </td>
      <td class="right">
        <div>${fmtCLP(item.precio_venta_clp)}</div>
        <div class="price-usd-eq">${c.precioEnUF} UF</div>
      </td>
      <td class="right">
        <div class="${gainClass}">${fmtCLP(c.ganancia)}</div>
        <div class="price-usd-eq">${c.margenPct}% margen</div>
      </td>
      <td class="right">${item.stock}</td>
      <td class="right"><span class="stock-pill ${stockClass}">${stockLabel}</span></td>
      <td class="right">
        <div>${fmtCLP(c.valorInventario)}</div>
      </td>
      <td class="right">
        <button class="btn-ghost" style="padding:6px 12px;font-size:0.68rem"
          onclick="editItem('${item.id}')">✎</button>
      </td>
    </tr>`;
  }).join('');
}

/* ── Explainer section ─────────────────────────────────────── */
function renderExplainer() {
  const lang = window.MC?.lang || 'es';
  const isEn = lang === 'en';
  const el = document.getElementById('cm-explainer');
  if (!el) return;

  const ipc = CM_CONFIG.IPC_DESDE_BASE;
  const exampleBase = 28000;
  const exampleCorr = Math.round(corregirPorIPC(exampleBase, ipc));
  const exampleUF   = (exampleBase / CM_CONFIG.UF_HOY).toFixed(4);

  el.innerHTML = `
    <div class="cm-explainer">
      <div class="cm-title">${isEn ? 'Monetary Correction — How It Works' : 'Corrección Monetaria — ¿Cómo se Calcula?'}</div>
      <div class="cm-subtitle">${isEn
        ? 'Methodology: IPC (INE Chile) + UF (CMF Chile) — maintains real purchasing power of costs'
        : 'Metodología: IPC (INE Chile) + UF (CMF Chile) — mantiene el poder adquisitivo real de los costos'}</div>

      <div class="cm-steps">
        <div class="cm-step">
          <div class="cm-step-num">01</div>
          <div class="cm-step-title">${isEn ? 'Base Cost' : 'Costo Base'}</div>
          <div class="cm-step-desc">${isEn
            ? 'Record the original purchase/production cost at the acquisition date.'
            : 'Registrar el costo original de compra o producción en la fecha de ingreso.'}</div>
        </div>
        <div class="cm-step">
          <div class="cm-step-num">02</div>
          <div class="cm-step-title">${isEn ? 'Accumulated IPC' : 'IPC Acumulado'}</div>
          <div class="cm-step-desc">${isEn
            ? `Apply the accumulated CPI since the base date (currently ${ipc}% from INE).`
            : `Aplicar el IPC acumulado desde la fecha base (actualmente ${ipc}% según INE).`}</div>
        </div>
        <div class="cm-step">
          <div class="cm-step-num">03</div>
          <div class="cm-step-title">${isEn ? 'Corrected Cost' : 'Costo Corregido'}</div>
          <div class="cm-step-desc">${isEn
            ? 'Multiply: Base Cost × (1 + IPC/100). This is the real current cost.'
            : 'Multiplicar: Costo Base × (1 + IPC/100). Este es el costo real actualizado.'}</div>
        </div>
        <div class="cm-step">
          <div class="cm-step-num">04</div>
          <div class="cm-step-title">${isEn ? 'UF Reference' : 'Referencia UF'}</div>
          <div class="cm-step-desc">${isEn
            ? 'Optionally express the value in UF to automatically index it to inflation.'
            : 'Opcionalmente expresar en UF para indexar automáticamente a la inflación.'}</div>
        </div>
      </div>

      <div class="cm-formula">
<span class="comment">// ${isEn ? 'Monetary Correction Formula' : 'Fórmula de Corrección Monetaria'}</span>

<span class="var">costoBase</span>      = $ ${exampleBase.toLocaleString('es-CL')} CLP
<span class="var">IPC_acumulado</span>  = ${ipc}%     <span class="comment">// ${isEn ? 'Source: INE Chile' : 'Fuente: INE Chile'}</span>
<span class="var">UF_hoy</span>         = $ ${CM_CONFIG.UF_HOY.toLocaleString('es-CL')} CLP  <span class="comment">// ${isEn ? 'Source: CMF Chile' : 'Fuente: CMF Chile'}</span>

<span class="comment">// ${isEn ? 'Method 1 — IPC' : 'Método 1 — IPC'}:</span>
<span class="result">costoCorregido</span> = costoBase × (1 + IPC / 100)
               = ${exampleBase.toLocaleString('es-CL')} × (1 + ${ipc} / 100)
               = <span class="result">$ ${exampleCorr.toLocaleString('es-CL')} CLP ✓</span>

<span class="comment">// ${isEn ? 'Method 2 — UF' : 'Método 2 — UF'}:</span>
<span class="result">costoEnUF</span>      = costoBase / UF_hoy
               = ${exampleBase.toLocaleString('es-CL')} / ${CM_CONFIG.UF_HOY.toLocaleString('es-CL')}
               = <span class="result">${exampleUF} UF ✓</span>
      </div>
    </div>`;
}

/* ── Add product form ──────────────────────────────────────── */
function renderAddForm() {
  const lang = window.MC?.lang || 'es';
  const isEn = lang === 'en';
  const wrap = document.getElementById('inv-add-form');
  if (!wrap) return;

  wrap.innerHTML = `
    <div class="inv-form">
      <div class="form-group">
        <label>${isEn ? 'Product Name (ES)' : 'Nombre del Producto (ES)'}</label>
        <input type="text" id="f-name" placeholder="Aros Cobra...">
      </div>
      <div class="form-group">
        <label>${isEn ? 'Name (EN)' : 'Nombre (EN)'}</label>
        <input type="text" id="f-name-en" placeholder="Cobra Earrings...">
      </div>
      <div class="form-group">
        <label>${isEn ? 'Category' : 'Categoría'}</label>
        <select id="f-cat">
          <option value="Joyería">Joyería / Jewelry</option>
          <option value="Textil">Textil / Textile</option>
          <option value="Cuadros">Cuadros / Paintings</option>
        </select>
      </div>
      <div class="form-group">
        <label>${isEn ? 'SKU' : 'SKU'}</label>
        <input type="text" id="f-sku" placeholder="JOY-001">
      </div>
      <div class="form-group">
        <label>${isEn ? 'Base Cost (CLP)' : 'Costo Base (CLP)'}</label>
        <input type="number" id="f-costo" placeholder="25000" min="0">
      </div>
      <div class="form-group">
        <label>${isEn ? 'Sale Price (CLP)' : 'Precio de Venta (CLP)'}</label>
        <input type="number" id="f-precio" placeholder="65000" min="0">
      </div>
      <div class="form-group">
        <label>${isEn ? 'Stock' : 'Stock'}</label>
        <input type="number" id="f-stock" placeholder="10" min="0">
      </div>
      <div class="form-group">
        <label>${isEn ? 'Min. Stock Alert' : 'Alerta Stock Mínimo'}</label>
        <input type="number" id="f-stock-min" placeholder="2" min="0">
      </div>
      <div class="form-group form-full">
        <label>${isEn ? 'Material' : 'Material'}</label>
        <input type="text" id="f-material" placeholder="Cobre recuperado · Lana natural">
      </div>
      <div class="form-actions">
        <button class="btn-ghost" type="button" onclick="clearForm()">${isEn ? 'Clear' : 'Limpiar'}</button>
        <button class="btn-primary" type="button" onclick="addProduct()">
          <span>${isEn ? 'Add Product' : 'Agregar Producto'}</span>
        </button>
      </div>
    </div>`;
}

function addProduct() {
  const lang = window.MC?.lang || 'es';
  const isEn = lang === 'en';
  const name = document.getElementById('f-name')?.value?.trim();
  const costo = parseInt(document.getElementById('f-costo')?.value);
  const precio = parseInt(document.getElementById('f-precio')?.value);
  const stock = parseInt(document.getElementById('f-stock')?.value);

  if (!name || isNaN(costo) || isNaN(precio) || isNaN(stock)) {
    window.MC?.showToast(isEn ? 'Please fill required fields' : 'Completa los campos requeridos', '⚠️');
    return;
  }

  const newItem = {
    id: 'INV-' + Date.now(),
    sku: document.getElementById('f-sku')?.value || 'SKU-000',
    name,
    name_en: document.getElementById('f-name-en')?.value || name,
    category: document.getElementById('f-cat')?.value || 'Joyería',
    category_en: 'Jewelry',
    costo_base_clp: costo,
    precio_venta_clp: precio,
    stock, stock_min: parseInt(document.getElementById('f-stock-min')?.value) || 2,
    fecha_ingreso: new Date().toISOString().split('T')[0],
    material: document.getElementById('f-material')?.value || '',
  };

  INVENTORY.push(newItem);
  renderDashboard();
  renderTable();
  clearForm();
  window.MC?.showToast(isEn ? 'Product added' : 'Producto agregado', '✓');
}

function clearForm() {
  ['f-name','f-name-en','f-sku','f-costo','f-precio','f-stock','f-stock-min','f-material']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

function editItem(id) {
  const lang = window.MC?.lang || 'es';
  const isEn = lang === 'en';
  window.MC?.showToast(isEn ? 'Edit feature coming soon' : 'Edición próximamente', '✎');
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  renderTable();
  renderExplainer();
  renderAddForm();

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        renderDashboard();
        renderTable();
        renderExplainer();
        renderAddForm();
      }, 60);
    });
  });
});
