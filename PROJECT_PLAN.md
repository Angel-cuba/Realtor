# Plan de Proyecto: Plataforma Realtor Web + Mobile

## 1. Vision ejecutiva

Crear una plataforma inmobiliaria premium para venta, compra y renta de casas, pisos, villas, terrenos y propiedades de lujo. La web debe funcionar como escaparate publico SEO-first y como motor comercial: captar compradores, captar propietarios, convertir leads en visitas, medir oportunidades y permitir que agentes administren inventario, documentos, estados de negociacion y cierre.

La app mobile debe ser companion real, no duplicado vacio: busqueda rapida, favoritos, alertas, visitas, chat/seguimiento y panel ligero para propietarios y agentes.

## 2. Lectura de referencias visuales

Imagenes revisadas desde `/Users/developer/Downloads/realtor`: `const-1.webp`, `const-3.webp`, `const-8.webp`, `const-11.webp` y metadatos del set completo.

Direccion visual extraida:

- Estetica arquitectonica premium: mucho blanco, negro profundo, acento amarillo/dorado, fotografia grande.
- Hero editorial con busqueda o CTA principal en el primer viewport.
- Bloques de confianza con metricas grandes, testimonios, equipo, proyectos/listings destacados.
- Tarjetas con radio moderado, no excesivamente redondeadas.
- Contraste alto y layout sobrio, mas cercano a firma inmobiliaria premium que a marketplace generico.

Traduccion inmobiliaria:

- Reemplazar discurso de construccion por busqueda de propiedades y expertise local.
- Convertir secciones de "projects/services" en "featured properties", "sell with us", "rent smarter", "market insights".
- Mantener la energia visual de las referencias, pero priorizar utilidad: filtros, mapas, disponibilidad, lead forms y visitas.

## 3. Supuestos de arquitectura

Basado en una evaluacion de arquitectura para un equipo pequeno con producto publico:

- Equipo hoy: 4 personas.
- Equipo en 12 meses: 8 personas.
- Cadencia objetivo: despliegue diario.
- Producto: publico, customer-facing, SEO-critical.
- Presupuesto cloud/SaaS inicial: hasta USD 5,000/mes.
- Trafico p99 esperado ano 1: 80 RPS.
- Datos: PII basica, preferencias, leads, documentos comerciales; no PCI directo.

Perfil elegido: `saas-startup`.

Patron recomendado: monolito modular con Next.js + PostgreSQL/Supabase. Evitar microservicios, Kubernetes, Kafka, event sourcing y GraphQL federation en esta fase.

## 4. Criterios verificables de exito

- API: p50 <= 100 ms, p95 <= 300 ms, p99 <= 800 ms.
- Frontend mobile 4G: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1.
- Disponibilidad: 99.5% mensual para web y API.
- Deploy: <= 15 min desde merge hasta produccion.
- Test coverage inicial: >= 60% en dominio critico.
- SEO: Lighthouse SEO >= 95 en home, listing, city page y property detail.
- Conversion: lead-to-contact >= 20% en leads calificados; favorite-to-tour >= 8%.

## 5. Mercado y estrategia comercial

Contexto 2026 observado:

- El mercado se esta normalizando: mas inventario en varias zonas, compradores mas sensibles a precio y tasas hipotecarias por encima de 6%.
- El comprador necesita claridad de costo total, comparables, alertas y rapidez para propiedades bien valoradas.
- El vendedor necesita pricing realista, marketing fuerte y prueba de demanda.
- Renta sigue siendo relevante para usuarios que no pueden comprar todavia; debe convivir con el camino a compra.
- Google y buscadores estan empujando mas descubrimiento directo de propiedades, asi que SEO local y datos estructurados son imprescindibles.

Fuentes consultadas:

- NAR, `Highlights From the Profile of Home Buyers and Sellers`, publicado con datos julio 2024-junio 2025: inventario limitado, affordability pressure, mortgage rates promedio 6.69%.
- WSJ/NAR, 17 Jun 2026: pending home sales suben 3.8% en mayo 2026, con aceptacion del entorno de tasas > 6%.
- Realtor.com via cobertura de mercado, Jun 2026: precio medio nacional de listing baja 2.4% YoY en mayo y pending sales suben 4.3% YoY.
- Barron's, Jun 2026: expansion de home listing ads de Google aumenta competencia en descubrimiento mobile.

Implicacion de producto:

- No construir solo una galeria bonita. Construir un sistema de decision: precio, zona, costo mensual, visitas, comparables, urgencia y confianza.
- Captar dos lados del mercado: compradores/renters y propietarios que quieren vender o alquilar.
- SEO local por ciudad/barrio/tipo de propiedad desde el dia uno.

## 6. Roles jugados y requisitos resultantes

### Comprador

Quiere encontrar rapido algo realista para su presupuesto. Necesita:

- Busqueda por compra/renta, ciudad, barrio, precio, habitaciones, tipo, amenities.
- Mapa + lista sincronizados.
- Calculadora de pago mensual para compra y estimador de coste inicial para renta.
- Favoritos, alertas y comparador de propiedades.
- Solicitar visita, preguntar disponibilidad, compartir listing.
- Ver confianza: agente, historial, fotos, documentos, barrio, schools/amenities si aplica.

### Vendedor / propietario

Quiere saber si la agencia puede vender o rentar mejor que el. Necesita:

- Landing "Vende tu propiedad" con propuesta clara.
- Formulario de valoracion: direccion/zona, tipo, superficie, estado, fotos, objetivo.
- Estimacion inicial y promesa de contacto.
- Panel para ver leads, visitas, ofertas, feedback y estado de marketing.

### Realtor / agente

Quiere cerrar operaciones sin perseguir informacion en chats. Necesita:

- CRM de leads con estado: nuevo, contactado, calificado, visita, oferta, contrato, cerrado, perdido.
- Agenda de visitas y disponibilidad.
- Gestion de propiedades, fotos, documentos, precio, visibilidad.
- Notas internas, tareas, asignacion de agente y actividad.
- Plantillas de mensajes y seguimiento.

### Jefe de proyecto

Quiere entregar rapido sin hipotecar el futuro. Necesita:

- MVP en 8-10 semanas con web publica, admin, leads y mobile base.
- Metricas de conversion desde el inicio.
- Stack manejable por equipo pequeno.
- Seguridad, permisos y datos personales tratados con disciplina.

### Lead developer

Quiere una arquitectura simple, tipada y escalable:

- Monorepo TypeScript.
- Dominio inmobiliario separado por modulos.
- Supabase/Postgres como fuente de verdad.
- Clerk para auth y organizaciones.
- UploadThing para imagenes.
- Jobs/queues solo cuando haya necesidad real.

## 7. Stack recomendado

### Monorepo

- `apps/web`: Next.js App Router, TypeScript, React Server Components, Tailwind CSS, shadcn/ui.
- `apps/mobile`: Expo + React Native + TypeScript, Expo Router, NativeWind o estilos nativos con tokens compartidos.
- `packages/db`: esquema, queries, tipos generados.
- `packages/domain`: reglas de negocio, enums, validaciones Zod.
- `packages/ui`: tokens, componentes compartibles web/mobile cuando tenga sentido.
- `packages/config`: eslint, tsconfig, prettier.

### Web

- Next.js App Router.
- SSR/ISR para home, property detail, city pages y category pages.
- Server Actions o Route Handlers para mutaciones.
- TanStack Query solo donde haya experiencia cliente compleja; RSC para server state.
- Zustand para estado local de filtros/mapa/comparador.
- Metadata API + JSON-LD para SEO inmobiliario.

### Mobile

- Expo + React Native.
- Expo Router.
- Clerk Expo SDK.
- EAS Build.
- Push notifications con Expo Notifications.
- Deep links hacia propiedad, visita, favorito y mensaje.

### Backend y datos

- Supabase Postgres.
- Prisma o Drizzle. Recomendacion: Drizzle para SQL explicito y buen control de tipos; Prisma tambien valido si el equipo lo domina.
- Supabase Storage no sera primario si se usa UploadThing para imagenes, pero puede usarse para documentos privados si conviene.
- Row-level security en Supabase para capas sensibles, mas checks de aplicacion.
- Vercel Functions/Fluid Compute para API web.

### Auth y permisos

- Clerk para usuarios, sesiones, organizaciones y roles.
- Roles:
  - `public`: visitante anonimo.
  - `buyer`: comprador/renter registrado.
  - `owner`: propietario/vendedor.
  - `agent`: agente realtor.
  - `manager`: jefe de equipo/oficina.
  - `admin`: control total.
- Autorizacion en capa dominio y base de datos:
  - Usuarios solo ven sus favoritos, tours, mensajes y leads.
  - Owners solo ven propiedades/leads asociados.
  - Agents ven propiedades asignadas y leads asignados.
  - Managers ven equipo/oficina.
  - Admin ve todo.

### Imagenes y media

- UploadThing para carga, validacion, transformacion y URLs.
- Reglas:
  - WebP/AVIF cuando sea posible.
  - Max original 10 MB por imagen.
  - Variantes: thumbnail, card, detail, hero.
  - Moderacion manual para listings publicos.
  - Orden de galeria configurable.

### Busqueda

MVP:

- Postgres full-text + filtros indexados.
- Geocoding almacenado: lat/lng, ciudad, barrio, zip/postal.
- Indices por `status`, `listing_type`, `property_type`, `price`, `bedrooms`, `bathrooms`, `city`, `neighborhood`, `geo`.

Post-MVP:

- Meilisearch, Typesense o Algolia si Postgres no alcanza UX de busqueda/facetas.

### Mapas

- Mapbox o Google Maps.
- MVP puede iniciar con lista + mapa en web.
- Mobile: mapa como modo secundario, no pantalla principal por defecto.

### Observabilidad

- Sentry para errores web/mobile/API.
- Vercel Analytics o Plausible para comportamiento.
- Log drains si el producto crece.
- Eventos de negocio propios en Postgres: lead_created, tour_requested, offer_submitted, listing_published.

### Deploy

- Web/API: Vercel.
- Mobile: EAS Build + App Store / Google Play.
- DB: Supabase.
- Images: UploadThing.
- Email: Resend.
- SMS/WhatsApp opcional: Twilio o proveedor local.

Nota Vercel: la CLI local esta desactualizada. Recomiendo actualizar con `npm i -g vercel@latest` antes del setup de deploy.

## 8. Modelo de dominio

Entidades principales:

- `UserProfile`: usuario app vinculado a Clerk.
- `Organization`: agencia/oficina/equipo.
- `AgentProfile`: agente, licencia, idiomas, zonas, bio.
- `OwnerProfile`: propietario.
- `Property`: entidad fisica: direccion, geo, tipo, superficie, atributos.
- `Listing`: publicacion comercial de una propiedad: venta/renta, precio, status, agente, SEO slug.
- `PropertyMedia`: imagenes, videos, planos, orden, alt text.
- `Amenity`: piscina, parking, jardin, ascensor, terraza, seguridad, energia.
- `Lead`: consulta comercial.
- `LeadActivity`: notas, llamadas, emails, cambios de estado.
- `SavedSearch`: alertas de busqueda.
- `Favorite`: favoritos por usuario.
- `TourRequest`: solicitud de visita.
- `Showing`: visita agendada.
- `Offer`: oferta de compra/renta.
- `Document`: contrato, disclosure, comprobantes, planos.
- `MarketArea`: ciudad/barrio/zona SEO.
- `Article`: contenidos de mercado y guias.

Estados de listing:

- `draft`
- `pending_review`
- `published`
- `reserved`
- `under_contract`
- `sold`
- `rented`
- `archived`

Estados de lead:

- `new`
- `contacted`
- `qualified`
- `tour_scheduled`
- `offer_intent`
- `negotiating`
- `won`
- `lost`

## 9. Logica comercial de ventas/renta

### Funnel comprador/renter

1. Llega por SEO, social, directo o recomendacion.
2. Busca por zona/tipo/precio.
3. Ve propiedad.
4. Guarda, compara o solicita visita.
5. Sistema crea lead y asigna agente.
6. Agente califica presupuesto, timing, financiamiento, objetivo.
7. Se agenda visita.
8. Feedback post-visita.
9. Oferta o seguimiento automatizado.

### Funnel propietario

1. Entra a "Vende/Renta con nosotros".
2. Completa valoracion.
3. Sistema crea owner lead.
4. Manager asigna agente.
5. Agente prepara comparables y propuesta.
6. Listing se crea como draft.
7. Owner aprueba fotos/precio/publicacion.
8. Se publica y se monitorean leads/visitas/ofertas.

### Reglas de asignacion

- Lead de propiedad publicada: agente propietario del listing.
- Lead general de zona: agente con cobertura de esa zona y menor carga activa.
- Lead premium/luxury: agente senior o manager.
- Lead sin respuesta en 15 min horario laboral: alerta.
- Lead sin actividad 24 h: tarea automatica.

### Scoring de leads

Puntaje 0-100:

- +25 presupuesto dentro del precio.
- +20 solicitud de visita.
- +15 usuario registrado.
- +15 financiamiento/preapproval indicado.
- +10 interaccion con 3+ propiedades.
- +10 busqueda guardada.
- +5 mensaje detallado.

Prioridad:

- `hot`: >= 70.
- `warm`: 40-69.
- `cold`: < 40.

## 10. Arquitectura de informacion web

Paginas publicas:

- `/`: home con hero search, featured properties, categorias, vender/rentar, testimonios, market insights.
- `/comprar`: listado de venta.
- `/rentar`: listado de renta.
- `/propiedades/[slug]`: detalle SEO.
- `/ciudades/[city]`: landing SEO local.
- `/barrios/[neighborhood]`: landing SEO hiperlocal.
- `/vender`: captacion de propietarios.
- `/alquilar-mi-propiedad`: captacion de propietarios renta.
- `/agentes`: equipo.
- `/agentes/[slug]`: perfil agente.
- `/guias`: contenido SEO.
- `/guias/[slug]`: articulo.
- `/contacto`: contacto.

App autenticada:

- `/dashboard`: segun rol.
- `/dashboard/favoritos`
- `/dashboard/busquedas`
- `/dashboard/visitas`
- `/dashboard/mensajes`
- `/dashboard/propiedades`
- `/dashboard/leads`
- `/dashboard/ofertas`
- `/dashboard/admin`

Mobile:

- Home search.
- Explore/listings.
- Property detail.
- Favorites.
- Saved searches/alerts.
- Tours.
- Messages/lead thread.
- Profile.
- Agent tools: leads, showings, listing status.

## 11. UX clave

Home:

- H1 directo: "Encuentra tu proxima casa con asesores que conocen el mercado".
- Busqueda visible: Comprar/Rentar, ubicacion, precio, tipo.
- Hero con foto arquitectonica real.
- CTA secundario: "Vende o renta tu propiedad".

Listing card:

- Imagen principal.
- Precio.
- Tipo, zona, beds/baths/sqft.
- Badge: nuevo, bajada de precio, open house, luxury.
- Botones iconicos: guardar, compartir, mapa.
- CTA: solicitar visita.

Property detail:

- Galeria grande.
- Precio + pago estimado.
- Datos clave.
- CTA sticky: agendar visita / contactar agente.
- Mapa y barrio.
- Amenities.
- Propiedades similares.
- Lead form corto y confiable.

Admin/CRM:

- Denso, operativo y rapido.
- Tablas filtrables, kanban de leads, agenda.
- Nada de hero marketing dentro del panel.

## 12. SEO y contenido

SEO tecnico:

- SSR/ISR para paginas publicas.
- Sitemap dinamico.
- Robots controlado.
- JSON-LD: `RealEstateListing`, `Residence`, `Offer`, `LocalBusiness`, `BreadcrumbList`, `FAQPage`.
- Canonicals por listing y ciudad.
- Open Graph con imagen de propiedad.

Contenido:

- City pages: "Casas en venta en [Ciudad]".
- Neighborhood pages: precio medio, lifestyle, commute, amenities.
- Guias: compra por primera vez, vender en mercado de tasas altas, rentar vs comprar, preparar casa para fotos.
- Market snapshots mensuales por ciudad/barrio.

## 13. Seguridad y privacidad

- Nunca defaults sensibles en codigo fuente.
- `.env.example` solo con placeholders.
- `.env` ignorado.
- Clerk para auth; no almacenar passwords.
- Validacion Zod en entradas publicas.
- Rate limit en lead forms, auth endpoints y uploads.
- Antivirus/moderacion basica para uploads si se aceptan documentos.
- Documentos privados con URLs firmadas.
- Audit log para cambios de precio, status, documentos y asignaciones.
- Separar PII de eventos analiticos.
- Revisar cumplimiento local: fair housing, privacidad, terminos, consentimientos de contacto.

## 14. Roadmap de ejecucion

### Fase 0: Fundacion de producto (2-3 dias)

- Definir nombre, mercado inicial, idiomas, monedas y pais/ciudad foco.
- Cerrar branding base inspirado en referencias: blanco, negro, dorado, fotografia premium.
- Crear backlog y schema inicial.
- Configurar monorepo, lint, format, CI.
- Crear Supabase, Clerk, UploadThing, Resend, Vercel.

Entregable: repo bootstrapped, ambientes y decisiones registradas.

### Fase 1: Web publica MVP (1.5-2 semanas)

- Home.
- Comprar/rentar list pages.
- Property detail.
- Filtros basicos.
- Galeria.
- Lead form.
- SEO base.
- Seed de propiedades demo usando imagenes reales/autorizadas.

Entregable: visitante puede descubrir propiedades y solicitar contacto.

### Fase 2: Auth + usuario comprador/renter (1 semana)

- Login/signup Clerk.
- Favoritos.
- Busquedas guardadas.
- Solicitud de visita.
- Dashboard usuario.
- Emails de confirmacion.

Entregable: usuario registrado puede volver y continuar su busqueda.

### Fase 3: Admin inmobiliario y CRM (2 semanas)

- CRUD propiedades/listings.
- Upload de imagenes.
- Estados de listing.
- CRM leads.
- Asignacion de agentes.
- Notas y actividad.
- Agenda de visitas.

Entregable: equipo realtor puede operar ventas/rentas desde el sistema.

### Fase 4: Captacion de propietarios (1 semana)

- Landing vender/rentar.
- Formulario de valoracion.
- Upload inicial de fotos.
- Owner lead pipeline.
- Panel propietario v1.

Entregable: la web capta inventario, no solo demanda.

### Fase 5: Mobile Expo MVP (2 semanas)

- Auth.
- Explorar propiedades.
- Detalle.
- Favoritos.
- Busquedas guardadas.
- Push notifications.
- Solicitud de visita.

Entregable: app instalable para compradores/renters y agentes ligeros.

### Fase 6: Inteligencia comercial (1 semana)

- Lead scoring.
- Alertas de seguimiento.
- Comparador de propiedades.
- Market area pages.
- Analytics de conversion.

Entregable: el equipo prioriza oportunidades con datos.

### Fase 7: Hardening y lanzamiento (1 semana)

- Tests criticos.
- Accesibilidad.
- Performance.
- Seguridad.
- Backup/restore Supabase.
- Runbook de incidentes.
- Preparar lanzamiento SEO.

Entregable: lanzamiento publico controlado.

## 15. Backlog MVP priorizado

P0:

- Home con busqueda.
- Comprar/rentar listings.
- Detalle propiedad.
- Lead form.
- Auth Clerk.
- Favoritos.
- Admin CRUD listings.
- UploadThing imagenes.
- CRM lead pipeline.
- SEO tecnico.

P1:

- Mapa.
- Visitas/agendamiento.
- Busquedas guardadas.
- Emails transaccionales.
- Owner valuation form.
- Agent profiles.
- Market pages.

P2:

- Chat.
- Offers.
- Document vault.
- Mortgage calculator avanzada.
- Comparables.
- Push notifications.
- Mobile agent tools.

P3:

- MLS integration.
- Descripciones automaticas de listings.
- Automated valuations.
- WhatsApp automation.
- BI dashboard avanzado.

## 16. Definition of Done

Una feature no esta lista hasta que:

- Tiene validacion de datos.
- Respeta permisos por rol.
- Tiene loading, empty, error states.
- Es responsive.
- Tiene tracking de evento clave.
- Tiene test unitario o integration si toca dominio.
- No rompe Lighthouse target en paginas publicas.
- No introduce secretos ni defaults sensibles.

## 17. Riesgos y mitigaciones

- Inventario insuficiente: construir funnel de propietarios desde el MVP.
- SEO lento: publicar city/neighborhood pages pronto y medir indexacion.
- Leads basura: scoring, rate limit, captcha invisible si hace falta.
- Imagenes pesadas: UploadThing + variantes + Next Image.
- Complejidad mobile: mobile companion despues de web + CRM base.
- Dependencia de servicios: contratos claros y wrappers internos.
- Legal/fair housing: revisar copys, filtros y terminos antes de launch.

## 18. Primer sprint recomendado

Duracion: 1 semana.

Objetivo: hacer visible la propuesta y probar conversion de leads.

Tareas:

- Scaffold monorepo Next.js + Expo.
- Configurar Clerk, Supabase, UploadThing.
- Implementar schema inicial `Property`, `Listing`, `Media`, `Lead`.
- Crear home visual basada en referencias.
- Crear list page comprar/rentar.
- Crear property detail.
- Crear lead form y guardar lead.
- Seed de 12 propiedades demo.
- Deploy preview en Vercel.

Resultado esperado: una demo clicable donde un comprador puede buscar, abrir una propiedad y pedir contacto.
