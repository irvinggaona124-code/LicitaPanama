# Blueprint Maestro de Arquitectura: Plataforma IA de Licitaciones en Panamá (LicitaPanama AI)

*   **Rol del Documento:** Especificación de Arquitectura de Sistemas (Blueprint).
*   **Ingeniero Ejecutor (En el IDE):** **Google Antigravity** (ejecutando estándares de ingeniería de frontera tipo Argon 4 High + **Gemini 3.8 Flash**).
*   **Motor de IA Operativo en la Web:** **Gemini 3.8 Flash (`gemini-3.8-flash`)** — Responsable de atender a las empresas, analizar pliegos de cargos de PanamáCompra, procesar facturas fiscales de la DGI, calcular probabilidades de adjudicación frente a competidores y redactar plantillas legales de la Ley 22.
*   **Presupuesto de Infraestructura:** Costo $\$0.00$ (Free Tiers empresariales + procesamiento en borde y cliente).
*   **Meta de Despliegue:** En producción antes del sábado.

---

## 1. Fase 0: Preparación del Entorno en Google Antigravity (Skills + MCP Servers Esenciales)

Antes de que **Google Antigravity** inicie la escritura del código, debe contar con los siguientes **Skills** y **Servidores MCP (Model Context Protocol)** instalados en su entorno local. Estas herramientas conectan el diseño visual de Google Stitch, los componentes 3D/WebGL, la base de datos y el scraper de PanamáCompra directamente al agente ingeniero.

### 1.1 Comandos de Instalación de Skills Esenciales (Terminal de Antigravity)

Ejecutar este bloque en la terminal integrada de Google Antigravity (`agy`):

```bash
# 1. Suite Oficial de Google Stitch (Diseño UI/UX a Código y Sistema de Diseño)
for skill in stitch-design stitch-loop design-md enhance-prompt react:components remotion shadcn-ui code-to-design extract-design-md manage-design-system; do
  npx skills add google-labs-code/stitch-skills --skill $skill -a antigravity --global
done

# 2. Ciclo de Vida de Ingeniería de Addy Osmani (/spec, /plan, /build, /test, /review, /ship)
agy plugin install https://github.com/addyosmani/agent-skills.git

# 3. Componentes Visuales de Alto Impacto (21st.dev Magic UI + Animaciones + Bento Grids)
npm i -g @21st-dev/cli
npx @21st-dev/cli install-skill

# 4. Habilidades 3D / WebGL Nativas (Mapa/Radar 3D Interactivo de Panamá en el Hero)
npx skills add sickn33/antigravity-awesome-skills --skill threejs-skills -a antigravity --global

# 5. Optimización Next.js 15 App Router, React Server Components y Despliegue en Vercel
npx skills add vercel-labs/agent-skills -a antigravity --global

# 6. Infraestructura Edge, Almacenamiento R2 Cifrado y Reglas WAF en Cloudflare
npx skills add https://github.com/cloudflare/skills -a antigravity --global

# 7. Extracción Documental de Pliegos PDF a Markdown y Generación de Plantillas Word (.docx)
npx skills add sickn33/antigravity-awesome-skills --skill markitdown -a antigravity --global
npx skills add sickn33/antigravity-awesome-skills --skill docx-generator -a antigravity --global

# 8. Auditoría de Ciberseguridad B2B (OAuth PKCE, RLS, JWT, Prevención de IDOR/XSS)
npx skills add sickn33/antigravity-awesome-skills --skill security-auditor -a antigravity --global

# 9. Optimizador de Tokens y Velocidad de Respuesta (Ahorra 65% de cuota en el IDE)
npx skills add JuliusBrussee/caveman -a antigravity --global
```

### 1.2 Servidores MCP Obligatorios en Antigravity (`.agents/mcp_config.json`)

Antigravity debe mantener activos estos **7 Servidores MCP**:

1.  **Google Stitch MCP (`stitch-mcp`):** Conecta Antigravity con `stitch.withgoogle.com` para generar la interfaz visual, extraer el archivo `.stitch/DESIGN.md` y exportar código React/Tailwind limpio.
2.  **21st.dev Magic MCP (`@21st-dev/magic-mcp`):** Inyecta componentes UI interactivos de nivel SaaS (tarjetas con efecto Spotlight, Bento Grids animados, tablas de precios interactivas y velocímetros de probabilidad).
3.  **Context7 MCP (`@upstash/context7-mcp`):** Garantiza documentación oficial al día para Next.js 15, Supabase SSR, `@google/genai` y Tailwind v4 sin alucinaciones de sintaxis.
4.  **Supabase MCP (`@supabase/mcp-server-supabase`):** Permite a Antigravity ejecutar migraciones SQL, activar la extensión vectorial `pgvector` y auditar las políticas `Row-Level Security (RLS)` directamente en la base de datos.
5.  **Firecrawl MCP (`firecrawl-mcp`):** Extrae datos limpios en Markdown de los portales dinámicos y pliegos de cargos de **PanamáCompra**.
6.  **Playwright MCP (`@executeautomation/playwright-mcp-server`):** Permite a Antigravity automatizar la extracción de licitaciones y realizar pruebas visuales en navegador real (*Vibe Check*) comparando la web contra el diseño de Google Stitch.
7.  **Sequential Thinking MCP (`@modelcontextprotocol/server-sequential-thinking`):** Estructura la ejecución paso a paso de Antigravity en tareas multi-archivo complejas.

---

## 2. Arquitectura Visual en Google Stitch y Efecto "Wow" de Entrada

Para que el visitante quede impactado visualmente en el primer segundo al entrar a la web (sin haber iniciado sesión), Antigravity implementará una estética **GovTech Enterprise Dark/Light Hybrid** inspirada en **Palantir Foundry, Linear y Stripe**.

### 2.1 Experiencia Visual Sin Iniciar Sesión (Gancho de Conversión)
1.  **Hero Interactivo 3D en WebGL (`threejs-skills` + `@react-three/fiber`):**
    *   En la parte superior de la portada, Antigravity renderizará un **Radar Holográfico 3D de la República de Panamá** a $60\text{ FPS}$.
    *   Cada provincia emite pulsos de luz en tiempo real representando actos públicos activos en **PanamáCompra** (MINSA, MOP, CSS, MEDUCA, ACP, Alcaldía de Panamá). Al pasar el cursor sobre un pulso, emerge una tarjeta flotante con el monto en dólares y la cuenta regresiva de cierre.
2.  **Explorador Público de Licitaciones con "Paywall Inteligente" (`21st.dev Magic MCP`):**
    *   Cualquier visitante sin cuenta puede usar el buscador instantáneo, filtrar licitaciones por entidad, provincia o monto y leer los datos generales del acto público.
    *   **Restricción Estratégica (Conversión):** En cada tarjeta de licitación aparecen 3 botones de alto valor con efecto *Glassmorphism*:
        *   `Descargar Plantillas Ley 22 del Pliego` $\rightarrow$ Requiere Cuenta.
        *   `Calcular Probabilidad de Ganar con IA (Gemini 3.8 Flash)` $\rightarrow$ Muestra el velocímetro desenfocado y solicita Cuenta.
        *   `Activar Alertas Automáticas de este Rubro` $\rightarrow$ Requiere Cuenta.

### 2.2 Modalidad Elegida en Google Stitch
Antigravity utilizará el modo **`Web Application (Desktop-First Responsive)`** de Google Stitch junto con el ciclo **`stitch-loop`**:
*   **Flujo de Skills de Stitch que ejecutará Antigravity:**
    1.  `enhance-prompt` $\rightarrow$ Refina los prompts de las 5 pantallas principales antes de enviarlos a Stitch.
    2.  `stitch-design` + `extract-design-md` $\rightarrow$ Genera las pantallas en Stitch y descarga los tokens visuales en `.stitch/DESIGN.md`:
        *   **Color Primario (Fondo Hero/Dark):** `#070B14` (*Obsidian Sovereign Navy*).
        *   **Color Superficie Lectura Legal:** `#F8FAFC` (*Clean Institutional Slate*).
        *   **Acento de Éxito/Adjudicación:** `#10B981` (*Emerald Cyber*).
        *   **Acento de Alerta/Inteligencia:** `#F59E0B` (*Panamanian Gold*).
        *   **Tipografía:** `Plus Jakarta Sans` (Títulos), `Inter` (Cuerpo y Pliegos), `JetBrains Mono` (RUC, CUFE, Códigos UNSPSC, Montos en USD).
    3.  `shadcn-ui` + `react:components` + `stitch-loop` $\rightarrow$ Transforma el diseño en código React/Next.js y verifica visualmente en el navegador que cada componente luzca idéntico al diseño.

---

## 3. Reglas de Negocio: SSO, Onboarding Corto, Planes y Ecosistema de APIs

### 3.1 Registro Corporativo SSO (Sin 2FA Inicial) + Onboarding Corto
*   **Inicio de Sesión SSO en 1 Clic:** Configurado en **Supabase Auth** para correos corporativos mediante **Google Workspace, Microsoft (Entra ID / Azure AD) y GitHub**.
*   **Cero Fricción Inicial:** No se solicita autenticación de dos factores (2FA) al crear la cuenta ni en el primer acceso. El usuario dispone de un panel de *Seguridad de la Empresa* donde puede activar voluntariamente el **2FA (TOTP / Passkeys)** después de haber creado su cuenta.
*   **Formulario Corto Post-Registro (4 Campos para Nutrir a Gemini 3.8 Flash):**
    1.  **RUC + DV** y Razón Social de la empresa.
    2.  **Rubro y Actividades Comerciales** (mapeados automáticamente a códigos UNSPSC de PanamáCompra).
    3.  **Capacidad de Contratación:** Rango de facturación anual y años de experiencia.
    4.  **Conexión Fiscal DGI / Carga de Facturas Fiscales (Opcional en Onboarding, Activable en Planes $\$30$ y $\$50$):** Zona de arrastre (*Dropzone*) para subir Facturas Electrónicas de la DGI (`.xml` o `.pdf` con código CUFE) o consultar datos públicos de la DGI para que **Gemini 3.8 Flash** valide la solvencia financiera real de la empresa frente a los requisitos del pliego.

### 3.2 Matriz de Planes de Suscripción

| Característica | Plan Inicial ($\$0$/mes) | Plan Pro Pyme ($\$30$/mes) | Plan Corporativo Élite ($\$50$/mes) |
| :--- | :--- | :--- | :--- |
| **Visualización de Licitaciones** | Ilimitada | Ilimitada | Ilimitada |
| **Frecuencia y Canales de Alerta** | $1$ alerta semanal por correo electrónico (empresa o empleado asignado) | Alertas instantáneas por correo cada vez que se publique una licitación relacionada con la empresa | **Alertas Omnicanal instantáneas:** WhatsApp, Correo, Slack, Microsoft Teams y Telegram |
| **Acceso a Plantillas (Ley 22)** | Bloqueado | Acceso a **pocas plantillas base** esenciales | **Acceso total a todas las plantillas** + **Generación de plantillas desde cero por Gemini 3.8 Flash** adaptadas a la empresa y al pliego |
| **IA Especializada (Gemini 3.8 Flash)** | Bloqueado | Analiza la empresa + datos DGI / Facturas Fiscales y calcula la **probabilidad de adjudicación** | **Acceso Total a Gemini 3.8 Flash:** Analiza empresa + DGI + **Análisis de Competidores en PanamáCompra** (quiénes participaron, precios ofertados y qué debe mejorar la empresa para ganar) |
| **Soporte Directo** | Comunidad / Docs | Asistente IA | **Línea directa de chat con el equipo de desarrollo** dentro de la plataforma |

### 3.3 Ecosistema de APIs (Costo $\$0.00$ o Mínimo)
1.  **Motor de IA Central:** **Google Gemini API (`gemini-3.8-flash`)** usando el SDK oficial `@google/genai` con *Structured Outputs (JSON Schema)* y *Context Caching*.
2.  **Datos de Licitaciones y Competidores:** **API de Datos Abiertos OCDS de la DGCP (PanamáCompra)** + Scraper automatizado con **Playwright** ejecutándose gratis en **GitHub Actions** cada $30\text{ minutos}$.
3.  **Validador DGI Panamá:** Analizador nativo de esquemas XML de Factura Electrónica de Panamá (SFEP) y verificador de código CUFE.
4.  **Pasarela de Pagos:** **LemonSqueezy / Paddle** ($\$0$/mes de costo fijo, cobro internacional con tarjetas) + soporte de webhook para **Yappy Comercial / Tilopay** en Panamá.
5.  **Despacho de Alertas:**
    *   **Correo Electrónico:** **Resend API** (Free Tier: $3,000\text{ correos/mes}$).
    *   **WhatsApp (Plan $\$50$):** **Meta WhatsApp Cloud API Oficial** ($1,000\text{ conversaciones gratis/mes}$).
    *   **Apps de Trabajo (Plan $\$50$):** **Incoming Webhooks nativos de Slack y Microsoft Teams** ($\$0.00$).
6.  **Chat con el Equipo de Desarrollo (Plan $\$50$):** **Crisp.chat Web SDK (Free Tier)** cargado condicionalmente cuando `organization.plan_tier === 'elite_50'`.

---

## 4. Arquitectura de Ingeniería Avanzada que Implementará Antigravity

Antigravity programará los siguientes subsistemas de alta ingeniería:

### 4.1 Algoritmo Híbrido de Probabilidad de Adjudicación ($P_{\text{Win}}$)
Antigravity implementará en el backend una función de puntuación que combina cálculo vectorial y financiero antes de pasarlo a **Gemini 3.8 Flash**:
$$P_{\text{Win}} = \sigma\left( w_1 \cdot \min\left(1, \frac{\text{FacturaciónValidada}_{\text{DGI}}}{\text{PrecioReferencia}_{\text{Pliego}}}\right) + w_2 \cdot \cos(\vec{E}_{\text{Empresa}}, \vec{E}_{\text{Pliego}}) - w_3 \cdot \text{HHI}_{\text{Competidores}} + w_4 \cdot \text{Cumplimiento}_{\text{Ley22}} \right)$$
Donde:
*   $\cos(\vec{E}_{\text{Empresa}}, \vec{E}_{\text{Pliego}})$ es la similitud coseno en `pgvector` entre el perfil técnico de la empresa y los requisitos del pliego de cargos.
*   $\text{HHI}_{\text{Competidores}}$ mide la concentración histórica de los competidores que han ganado licitaciones similares en esa misma entidad estatal según los registros de PanamáCompra (exclusivo completo con desglose de competidores en el Plan de $\$50$).

### 4.2 Motor Generador de Plantillas Oficiales de la Ley 22 (`.docx` y `.pdf`)
*   **Catálogo Base (Plan $\$30$ y $\$50$):** Formulario de Propuesta, Pacto de Integridad, Declaración Jurada de Medidas de Retorsión (Ley 48), Carta de Intención de Consorcio y Declaración de No Incapacidad Legal (Artículo 24 del Texto Único de la Ley 22).
*   **Generación Específica por IA (Exclusivo Plan $\$50$):** **Gemini 3.8 Flash** lee el pliego de cargos completo y los datos de la empresa, redacta las cláusulas técnicas, cronogramas de entrega y matrices de cumplimiento específicas para esa licitación, y el cliente descarga el archivo `.docx` editable generado en el navegador mediante la librería `docx` (cero consumo de RAM en el servidor).

### 4.3 Ciberseguridad de Grado Bancario (Zero-Trust B2B)
1.  **Aislamiento Multi-Tenant con RLS:** Ninguna consulta a Supabase puede ejecutarse sin pasar por las políticas `Row-Level Security` vinculadas al `org_id` del token JWT firmado.
2.  **Cifrado de Facturas Fiscales DGI (AES-256-GCM):** Los archivos XML/PDF de facturas fiscales subidos por las empresas se cifran con llaves derivadas por organización antes de almacenarse en **Cloudflare R2**, y sus metadatos sensibles se procesan en memoria efímera.
3.  **Cabeceras y Perímetro WAF:** Configuración estricta de `Content-Security-Policy (CSP)`, `Strict-Transport-Security (HSTS)`, protección contra inyección de prompts (*Prompt Injection Sanitizer*) antes de enviar documentos a `gemini-3.8-flash`, y registro inmutable en la tabla `security_audit_logs`.

---

## 5. Cronograma Paso a Paso en Orden Estricto para Antigravity

Antigravity ejecutará la construcción siguiendo este orden secuencial inalterable:

*   **Paso 1 (Inicialización y Reglas):** Lectura de `AGENTS.md`, activación de `/caveman lite` para optimizar tokens, y creación de la estructura base **Next.js 15 + TypeScript + Tailwind v4 + Supabase SSR** usando `/agent-skills:spec-driven-development`.
*   **Paso 2 (Sistema de Diseño con Google Stitch MCP):** Ejecución de `enhance-prompt`, `stitch-design` y `extract-design-md` para crear `.stitch/DESIGN.md` y generar las 5 vistas maestras con `shadcn-ui` y `21st.dev Magic MCP`.
*   **Paso 3 (Base de Datos Vectorial y Ciberseguridad RLS):** Creación de las 6 tablas en PostgreSQL mediante **Supabase MCP**, activación de `pgvector` y auditoría de políticas RLS con el skill `security-auditor`.
*   **Paso 4 (Landing Page con Radar 3D WebGL y Buscador Público):** Construcción de la escena 3D interactiva de Panamá con `threejs-skills` y el buscador público de licitaciones con bloqueo inteligente para usuarios no autenticados.
*   **Paso 5 (Autenticación SSO sin 2FA Inicial + Onboarding + Parser DGI):** Configuración de OAuth con Google, Microsoft y GitHub en Supabase Auth, pantalla de 2FA opcional post-registro, formulario corto de perfilamiento y lector cifrado de Facturas Electrónicas DGI (XML/CUFE).
*   **Paso 6 (Scraper de PanamáCompra + Motor de Alertas Omnicanal):** Creación del pipeline con **Playwright MCP** + **Firecrawl MCP** + API OCDS en GitHub Actions y programación de alertas para los planes de $\$0$ (semanal por email), $\$30$ (instantánea por email) y $\$50$ (WhatsApp, Email, Slack y Teams).
*   **Paso 7 (Integración de Gemini 3.8 Flash + Generador de Plantillas Ley 22):** Conexión de `@google/genai` con el modelo `gemini-3.8-flash` para el chat contextual, el motor de probabilidad de adjudicación, la matriz de inteligencia de competidores y el compilador de plantillas `.docx` con el skill `docx-generator`.
*   **Paso 8 (Facturación, Chat con Desarrolladores, QA Visual y Despliegue):** Integración de Webhooks de LemonSqueezy/Yappy, widget de Crisp.chat para el plan de $\$50$, verificación visual con `stitch-loop` + Playwright MCP y despliegue en producción en **Vercel + Cloudflare WAF**.