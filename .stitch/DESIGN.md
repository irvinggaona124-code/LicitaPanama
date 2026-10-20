# SISTEMA DE DISEÑO OFICIAL: LICITAPANAMA AI
> Generado por Google Stitch MCP + 21st.dev Magic System
> Versión: 1.0.0-production
> Modo: Web Application (Desktop-First Responsive & Mobile Adaptive)
> Estética: GovTech Enterprise Dark/Light Hybrid (Inspirado en Palantir Foundry, Linear y Stripe)

---

## 1. PALETA DE COLORES Y TOKENS SEMÁNTICOS

### 1.1 Colores Principales de Marca
- **Obsidian Sovereign Navy (Fondo Hero / Dark Base):** `#070B14`
  - Var CSS: `--color-obsidian: #070B14;`
  - Uso: Fondo del Hero, Radar 3D, barras de comando y componentes de inteligencia.
- **Surface Dark Card (Superficie Contenedores Oscuros):** `#0F172A`
  - Var CSS: `--color-card-dark: #0F172A;`
  - Borde: `rgba(255, 255, 255, 0.08)`
- **Clean Institutional Slate (Superficie Lectura Legal / Documentos):** `#F8FAFC`
  - Var CSS: `--color-institutional-slate: #F8FAFC;`
  - Uso: Fondos de pliegos, visores de plantillas Ley 22 y contrastes de alta legibilidad.
- **Emerald Cyber (Acento Éxito / Adjudicación / Win):** `#10B981`
  - Var CSS: `--color-emerald-cyber: #10B981;`
  - Glow: `0 0 20px rgba(16, 185, 129, 0.35)`
  - Uso: Probabilidad alta de adjudicación, botones de confirmación, licitaciones abiertas.
- **Panamanian Gold (Acento Alerta / Inteligencia Estratégica):** `#F59E0B`
  - Var CSS: `--color-panamanian-gold: #F59E0B;`
  - Glow: `0 0 20px rgba(245, 158, 11, 0.35)`
  - Uso: Detección de competidores, licitaciones por vencer, insignias de planes Pro y Élite.
- **Crimson Risk (Acento Riesgo / Descalificación):** `#EF4444`
  - Var CSS: `--color-crimson-risk: #EF4444;`
  - Uso: Ofertas temerarias, documentos faltantes Ley 22, pliegos vencidos.

### 1.2 Superficies Glassmorphism y Elevación
- **Glass Panel Surface:**
  - Background: `rgba(15, 23, 42, 0.75)`
  - Backdrop Filter: `blur(16px)`
  - Border: `1px solid rgba(255, 255, 255, 0.1)`
  - Box Shadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37)`
- **Spotlight Border Card (Efecto 21st.dev Magic):**
  - Hover: Gradiente radial dinámico de borde controlado por cursor `rgba(16, 185, 129, 0.25)`

---

## 2. TIPOGRAFÍA Y JERARQUÍA

### 2.1 Fuentes del Sistema
1. **Titulares y Branding:** `Plus Jakarta Sans`, sans-serif
   - Pesos: `600 (SemiBold)`, `700 (Bold)`, `800 (ExtraBold)`
   - Tracking: `-0.02em` en H1 y H2
2. **Cuerpo de Texto y Pliegos:** `Inter`, -apple-system, BlinkMacSystemFont, sans-serif
   - Pesos: `400 (Regular)`, `500 (Medium)`
   - Altura de línea: `1.6` para máxima legibilidad en pliegos de cargos extensos
3. **Metadatos Técnicos y Cifras Fiscales:** `JetBrains Mono`, monospace
   - Uso obligatorio para: Códigos RUC, DV, CUFE de DGI, Acto Número de PanamáCompra, Códigos UNSPSC, Montos en USD (`$XX,XXX.XX`).

---

## 3. COMPONENTES CLAVE Y REGLAS DE INTERACCIÓN

### 3.1 Hero Holográfico 3D (Panamá Radar)
- Canvas WebGL a pantalla completa o contenedor Hero de 500px de altura mínima.
- Representación geométrica de las 10 provincias y comarcas de Panamá.
- Puntos de pulso luminiscentes (`Emerald Cyber` y `Panamanian Gold`) en provincias con actos públicos vigentes.
- Raycaster interactivo: Hover sobre cada pulso despliega tarjeta emergente instantánea con:
  - Nombre de la Entidad (MINSA, MOP, MEDUCA, ACP, etc.)
  - Monto de Referencia en USD
  - Cuenta regresiva de entrega de propuestas

### 3.2 Buscador Público con Paywall Inteligente (Conversión Zero-Friction)
- **Acceso Libre (Sin Iniciar Sesión):**
  - Búsqueda en vivo por palabra clave, entidad o número de acto.
  - Filtros por provincia y rango de presupuesto.
  - Lectura del resumen del pliego y requisitos legales.
- **Capa Paywall Inteligente:**
  - Botón `Descargar Plantillas Ley 22`: Modal emergente de Registro Corporativo SSO 1-Clic.
  - Botón `Calcular Probabilidad de Ganar`: Velocímetro con filtro Gaussiano `blur(8px)` + CTA animado: *"Desbloquea el análisis de Gemini 3.8 Flash para tu empresa"*.
  - Botón `Activar Alertas de este Rubro`: Prompt instantáneo de correo/SSO.

### 3.3 Velocímetro de Probabilidad de Adjudicación ($P_{\text{Win}}$)
- Arco semicircular con aguja y gradiente tricolor:
  - 0% a 39%: `Crimson Risk` (Riesgo alto / capacidad insuficiente)
  - 40% a 69%: `Panamanian Gold` (Competitivo con ajustes requeridos)
  - 70% a 100%: `Emerald Cyber` (Alta probabilidad de adjudicación)
- Desglose en 4 barras métricas:
  1. Solvencia Financiera vs Monto Referencial DGI
  2. Similitud Técnica de Experiencia (pgvector Coseno)
  3. Concentración de Competidores (Índice HHI)
  4. Cumplimiento de Requisitos Ley 22

### 3.4 Bento Grid de Suscripciones ($0, $30, $50)
- **Plan Inicial ($0/mes):** Tarjeta minimalista, borde neutro. Enfoque en visualización de licitaciones y 1 digest semanal.
- **Plan Pro Pyme ($30/mes):** Borde `Panamanian Gold`, insignia *"Más Popular"*. Desbloquea probabilidad IA, alertas instantáneas por correo y plantillas base.
- **Plan Corporativo Élite ($50/mes):** Borde brillante `Emerald Cyber`, efecto halo. Desbloquea WhatsApp/Slack/Teams, análisis de competidores históricos en PanamáCompra, plantillas ilimitadas generadas por IA y canal de chat directo con los desarrolladores.
