/**
 * Grupo Imperio S.A / Transportes Imperio - Main Application Script
 * High-performance, modular ES6+ vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initDynamicYears();
  initTheme();
  initHeader();
  initCounters();
  initScrollReveal();
  initFleetShowcase();
  initFreightCalculator();
  initRegionalMap();
  initContactForm();
});

/* ==========================================================================
   0. Dynamic Years of Experience Calculator
   ========================================================================== */
function initDynamicYears() {
  const currentYear = new Date().getFullYear();
  const startYear = 2000;
  const yearsExperience = Math.max(25, currentYear - startYear);

  // Update KPI counter attribute
  const kpiYears = document.getElementById('kpi-years');
  if (kpiYears) {
    kpiYears.setAttribute('data-counter', yearsExperience);
  }

  // Update hero badge
  const heroBadge = document.getElementById('hero-years-badge');
  if (heroBadge) {
    heroBadge.innerHTML = `
      <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      Fundado en el 2000 · +${yearsExperience} Años Conectando la Región
    `;
  }

  // Update any text elements with .dynamic-years class
  document.querySelectorAll('.dynamic-years').forEach(el => {
    el.textContent = `+${yearsExperience} años`;
  });

  // Update footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = currentYear;
}

/* ==========================================================================
   1. Theme Controller (Dark & Light Mode with Persistence)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('imperio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('imperio_theme', newTheme);
    });
  }
}

/* ==========================================================================
   2. Header & Navigation (Scroll Spy, Sticky Blur & Mobile Drawer)
   ========================================================================== */
function initHeader() {
  const header = document.querySelector('.site-header');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    const scrollPos = window.scrollY + 140;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Drawer toggles
  function toggleDrawer(open) {
    if (open) {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      toggleDrawer(!isOpen);
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => toggleDrawer(false));
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });
}

/* ==========================================================================
   3. Animated Counters (Intersection Observer)
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800; // ms
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeOut * target);

          el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        }

        requestAnimationFrame(updateCount);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   4. Scroll Reveal (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. Fleet Showcase (Tabs & Data Update)
   ========================================================================== */
const fleetData = {
  lowboy: {
    title: 'Lowboy (Cama Baja)',
    desc: 'Equipos de plataforma rebajada especialmente diseñados para el transporte de maquinaria pesada, transformadores, componentes industriales y cargas sobredimensionadas con máxima estabilidad.',
    img: 'assets/equipo-lowboy.jpg',
    capacidad: 'Hasta 60 Toneladas',
    dimensiones: 'Cuello desmontable / 3 y 4 ejes',
    cargaIdeal: 'Maquinaria pesada, estructuras y proyectos especiales',
    seguridad: 'Acompañamiento, permisos MOPT / ATTT y señalización'
  },
  trailetas: {
    title: 'Trailetas & Plataformas',
    desc: 'Unidades modulares de alta resistencia ideales para movilización de materiales de construcción, perfiles de acero, postes de tendido eléctrico y cargas paletizadas a granel en toda la región.',
    img: 'assets/equipo-trailetas.jpg',
    capacidad: '25 a 32 Toneladas',
    dimensiones: '40 a 48 pies de longitud',
    cargaIdeal: 'Acero, madera tratada, tubos y materiales industriales',
    seguridad: 'Cinchas certificadas y amarre de alta resistencia'
  },
  furgones: {
    title: 'Furgones Secos & Refrigerados',
    desc: 'Contenedores cerrados herméticos y unidades con control de temperatura para transporte de perecederos, frutas de exportación, fármacos y mercancía comercial de alto valor.',
    img: 'assets/equipo-furgones.jpg',
    capacidad: 'Hasta 28 Toneladas / 48-53 Pies',
    dimensiones: 'Volumen hasta 100 m³',
    cargaIdeal: 'Fruta, cárnicos, alimentos congelados y paquetería',
    seguridad: 'Sellos de seguridad, monitoreo térmico y GPS'
  },
  vagonetas: {
    title: 'Vagonetas de Volteo',
    desc: 'Diseñadas para transporte masivo y descarga rápida de materiales pétreos, agregados, arena, gravilla y minerales con accionamiento hidráulico seguro.',
    img: 'assets/equipo-vagonetas.jpg',
    capacidad: '14 a 22 m³ / 30 Toneladas',
    dimensiones: 'Caja reforzada de alta resistencia',
    cargaIdeal: 'Agregados, balastro, minerales y tierra',
    seguridad: 'Lona cobertora y compuerta automática'
  },
  carretas: {
    title: 'Carretas & Chasis Portacontenedores',
    desc: 'Chasis especializados para recepción y traslado ágil de contenedores marítimos de 20 y 40 pies (FCL) desde los principales puertos del Pacífico y el Caribe.',
    img: 'assets/equipo-carretas.jpg',
    capacidad: 'Contenedores 20ft / 40ft hasta 32 Ton',
    dimensiones: 'Chasis estándar y cuello de ganso',
    cargaIdeal: 'Contenedores de importación y exportación portuaria',
    seguridad: 'Twist-locks certificados y frenos ABS'
  },
  graneleras: {
    title: 'Graneleras Especializadas',
    desc: 'Carrocerías adaptadas para el transporte a granel de fertilizantes, maíz, soya, trigo, azúcar y concentrados agrícolas con sistemas de protección contra humedad.',
    img: 'assets/equipo-graneleras.jpg',
    capacidad: 'Hasta 32 Toneladas',
    dimensiones: 'Tolvas herméticas con carpas impermeables',
    cargaIdeal: 'Fertilizantes, granos básicos y concentrados',
    seguridad: 'Sellado antilluvia y compuertas dosificadoras'
  }
};

function initFleetShowcase() {
  const tabBtns = document.querySelectorAll('.fleet-tab-btn');
  const titleEl = document.getElementById('fleet-title');
  const descEl = document.getElementById('fleet-desc');
  const imgEl = document.getElementById('fleet-img');
  const capEl = document.getElementById('fleet-cap');
  const dimEl = document.getElementById('fleet-dim');
  const cargaEl = document.getElementById('fleet-carga');
  const segEl = document.getElementById('fleet-seg');

  if (!tabBtns.length || !titleEl) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const key = btn.getAttribute('data-fleet');
      const item = fleetData[key];
      if (!item) return;

      // Animate transition
      const card = document.querySelector('.fleet-display-card');
      card.style.opacity = '0.4';
      card.style.transform = 'scale(0.99)';

      setTimeout(() => {
        titleEl.textContent = item.title;
        descEl.textContent = item.desc;
        imgEl.src = item.img;
        imgEl.alt = item.title;
        capEl.textContent = item.capacidad;
        dimEl.textContent = item.dimensiones;
        cargaEl.textContent = item.cargaIdeal;
        segEl.textContent = item.seguridad;

        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      }, 150);
    });
  });
}

/* ==========================================================================
   6. Freight Quotation Calculator (Cotizador Inteligente)
   ========================================================================== */
function initFreightCalculator() {
  const originSelect = document.getElementById('calc-origin');
  const destSelect = document.getElementById('calc-dest');
  const cargoSelect = document.getElementById('calc-cargo');
  const weightInput = document.getElementById('calc-weight');
  const weightVal = document.getElementById('calc-weight-val');

  const summaryOrigin = document.getElementById('sum-origin');
  const summaryDest = document.getElementById('sum-dest');
  const summaryCargo = document.getElementById('sum-cargo');
  const summaryWeight = document.getElementById('sum-weight');
  const summaryUnit = document.getElementById('sum-unit');
  const routeEstimate = document.getElementById('sum-estimate');

  const btnWhatsapp = document.getElementById('calc-btn-whatsapp');
  const btnEmail = document.getElementById('calc-btn-email');

  if (!originSelect || !destSelect) return;

  function updateCalc() {
    const origin = originSelect.value;
    const dest = destSelect.value;
    const cargo = cargoSelect.value;
    const weight = weightInput.value;

    if (weightVal) weightVal.textContent = `${weight} Ton`;
    if (summaryOrigin) summaryOrigin.textContent = originSelect.options[originSelect.selectedIndex].text;
    if (summaryDest) summaryDest.textContent = destSelect.options[destSelect.selectedIndex].text;
    if (summaryCargo) summaryCargo.textContent = cargoSelect.options[cargoSelect.selectedIndex].text;
    if (summaryWeight) summaryWeight.textContent = `${weight} Toneladas`;

    // Dynamic recommended unit
    let unit = 'Plataforma / Traileta de 48ft';
    if (cargo === 'refrigerado') unit = 'Furgón Refrigerado (Thermo King)';
    else if (cargo === 'lowboy') unit = 'Lowboy de 3-4 Ejes con Escolta';
    else if (cargo === 'granel') unit = 'Tolva / Granelera Hermética';
    else if (cargo === 'fcl') unit = 'Chasis Portacontenedor FCL 40ft';
    else if (cargo === 'vagoneta') unit = 'Vagoneta de Volteo 22m³';
    if (summaryUnit) summaryUnit.textContent = unit;

    // Estimate corridor label
    let estimate = 'Ruta Nacional / Despacho Inmediato';
    if (origin.startsWith('PA') && dest.startsWith('CR') || origin.startsWith('CR') && dest.startsWith('PA')) {
      estimate = 'Corredor Internacional Costa Rica ⇄ Panamá (Paso Canoas)';
    } else if (origin.startsWith('GT') || dest.startsWith('GT')) {
      estimate = 'Corredor Internacional Centroamericano (CR / GT / PA)';
    } else if (origin.includes('CALDERA') || origin.includes('LIMON') || origin.includes('COLON')) {
      estimate = 'Operación Portuaria Multimodal Especializada';
    }
    if (routeEstimate) routeEstimate.textContent = estimate;

    // Update Action links
    const originText = originSelect.options[originSelect.selectedIndex].text;
    const destText = destSelect.options[destSelect.selectedIndex].text;
    const cargoText = cargoSelect.options[cargoSelect.selectedIndex].text;

    const waMsg = encodeURIComponent(
      `¡Hola Grupo Imperio! Deseo cotizar un flete de carga:\n` +
      `📍 *Origen:* ${originText}\n` +
      `🏁 *Destino:* ${destText}\n` +
      `📦 *Tipo de Carga:* ${cargoText}\n` +
      `⚖️ *Peso Estimado:* ${weight} Toneladas\n` +
      `🚛 *Equipo Sugerido:* ${unit}\n\n` +
      `Por favor me contactan con tarifas y disponibilidad.`
    );
    if (btnWhatsapp) {
      btnWhatsapp.href = `https://wa.me/50670246170?text=${waMsg}`;
    }

    const mailSubject = encodeURIComponent(`Cotización de Transporte: ${originText} -> ${destText}`);
    const mailBody = encodeURIComponent(
      `Estimado equipo de Grupo Imperio,\n\n` +
      `Solicito formalmente la cotización para el siguiente movimiento de carga:\n\n` +
      `- Origen: ${originText}\n` +
      `- Destino: ${destText}\n` +
      `- Tipo de Carga: ${cargoText}\n` +
      `- Peso Estimado: ${weight} Toneladas\n` +
      `- Equipo Requerido: ${unit}\n\n` +
      `Quedo atento a su propuesta comercial.\n`
    );
    if (btnEmail) {
      btnEmail.href = `mailto:logistica@grupoimperioca.com?subject=${mailSubject}&body=${mailBody}`;
    }
  }

  [originSelect, destSelect, cargoSelect, weightInput].forEach(input => {
    if (input) input.addEventListener('input', updateCalc);
  });

  updateCalc();
}


/* ==========================================================================
   8. Contact Form Handling (Instant Feedback)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('contact-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const service = form.querySelector('[name="service"]')?.value || '';
    const message = form.querySelector('[name="message"]')?.value || '';

    // Direct WhatsApp send as primary quick dispatch
    const waText = encodeURIComponent(
      `*Nuevo Contacto desde Web Grupo Imperio*\n` +
      `👤 *Nombre:* ${name}\n` +
      `📧 *Email:* ${email}\n` +
      `📞 *Teléfono:* ${phone}\n` +
      `📋 *Servicio:* ${service}\n` +
      `💬 *Mensaje:* ${message}`
    );

    if (feedback) {
      feedback.style.display = 'block';
      feedback.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #10B981; padding: 1rem 1.25rem; border-radius: 12px; font-weight: 600; text-align: center;">
          ¡Gracias ${name}! Tu solicitud ha sido preparada. Abriendo WhatsApp para confirmación inmediata con el equipo de Operaciones...
        </div>
      `;
    }

    setTimeout(() => {
      window.open(`https://wa.me/50670246170?text=${waText}`, '_blank');
      form.reset();
    }, 1200);
  });
}

/* ==========================================================================
   9. Interactive Central America Regional Map & Hub Navigation
   ========================================================================== */
function initRegionalMap() {
  const mapBox = document.getElementById('regional-map-box');
  const tooltip = document.getElementById('map-tooltip');
  const tooltipFlag = document.getElementById('tooltip-flag');
  const tooltipCountry = document.getElementById('tooltip-country');
  const tooltipOffice = document.getElementById('tooltip-office');
  const tooltipDetail = document.getElementById('tooltip-detail');

  if (!mapBox || !tooltip) return;

  const flagMap = {
    cr: 'assets/flag-cr.svg',
    pa: 'assets/flag-pa.svg',
    gt: 'assets/flag-gt.svg',
    ni: 'assets/flag-ni.svg'
  };

  const interactiveElements = mapBox.querySelectorAll('.map-country.active-hub, .map-hub-pin');

  function navigateToHub(hubKey) {
    if (!hubKey) return;
    const targetCard = document.getElementById('hub-' + hubKey);
    if (!targetCard) return;

    // Smooth scroll into view with center alignment
    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Trigger visual spotlight and blink animation
    targetCard.classList.remove('hub-card-spotlight');
    void targetCard.offsetWidth; // Force DOM reflow to restart animation reliably
    targetCard.classList.add('hub-card-spotlight');

    setTimeout(() => {
      targetCard.classList.remove('hub-card-spotlight');
    }, 2800);
  }

  // Hover and tooltip management
  interactiveElements.forEach(el => {
    const hubKey = el.getAttribute('data-hub');

    el.addEventListener('mouseenter', () => {
      const countryEl = el.classList.contains('map-country') ? el : mapBox.querySelector(`.map-country[data-hub="${hubKey}"]`);
      if (countryEl) countryEl.classList.add('is-hovered');

      const name = countryEl ? countryEl.getAttribute('data-name') : '';
      const office = countryEl ? countryEl.getAttribute('data-office') : '';
      const detail = countryEl ? countryEl.getAttribute('data-detail') : '';

      if (tooltipCountry) tooltipCountry.textContent = name;
      if (tooltipOffice) tooltipOffice.textContent = office;
      if (tooltipDetail) tooltipDetail.textContent = detail;
      if (tooltipFlag && flagMap[hubKey]) {
        tooltipFlag.style.backgroundImage = `url(${flagMap[hubKey]})`;
      }
      tooltip.style.display = 'block';
      tooltip.style.opacity = '1';
    });

    el.addEventListener('mousemove', (e) => {
      const boxRect = mapBox.getBoundingClientRect();
      let x = e.clientX - boxRect.left + 15;
      let y = e.clientY - boxRect.top - 20;

      // Keep tooltip fully visible within container boundaries
      if (x + 280 > boxRect.width) x = e.clientX - boxRect.left - 290;
      if (y + 120 > boxRect.height) y = e.clientY - boxRect.top - 100;
      if (x < 10) x = 10;
      if (y < 10) y = 10;

      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    });

    el.addEventListener('mouseleave', () => {
      const countryEl = el.classList.contains('map-country') ? el : mapBox.querySelector(`.map-country[data-hub="${hubKey}"]`);
      if (countryEl) countryEl.classList.remove('is-hovered');

      tooltip.style.display = 'none';
      tooltip.style.opacity = '0';
    });

    el.addEventListener('click', () => {
      navigateToHub(hubKey);
    });

    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigateToHub(hubKey);
      }
    });
  });

  // Quick button bar below map
  const quickBtns = document.querySelectorAll('.map-quick-btn');
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const hubKey = btn.getAttribute('data-hub');
      navigateToHub(hubKey);
    });
  });
}
