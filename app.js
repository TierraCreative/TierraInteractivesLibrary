// ============================================================
// TIERRA INTERACTIVES LIBRARY — app.js
// ============================================================

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────
  let activeFilter = 'all';
  let searchQuery = '';
  let activeCard = null;

  // ── DOM refs ───────────────────────────────────────────────
  const grid         = document.getElementById('cardGrid');
  const cardCount    = document.getElementById('cardCount');
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const searchInput  = document.getElementById('searchInput');
  const backdrop     = document.getElementById('modalBackdrop');
  const modalClose   = document.getElementById('modalClose');
  const modalIframe  = document.getElementById('modalIframe');
  const modalTitle   = document.getElementById('modalTitle');
  const modalClient  = document.getElementById('modalClient');
  const modalDate    = document.getElementById('modalDate');
  const modalTag     = document.getElementById('modalTag');
  const modalDriveLink = document.getElementById('modalDriveLink');
  const modalCopyBtn = document.getElementById('modalCopyBtn');
  const copyConfirm  = document.getElementById('copyConfirm');
  const ctaDot       = document.getElementById('ctaDot');
  const ctaBadgeText = document.getElementById('ctaBadgeText');
  const modalCtaSwatch = document.getElementById('modalCtaSwatch');
  const modalCtaInfo = document.getElementById('modalCtaInfo');

  // ── Scale iframes to fit their containers ─────────────────
  // Cards: iframe is 390×844, container is card width × 9/16 of width
  // We scale the iframe down to fit
  function scaleIframe(iframe, containerW, containerH) {
    const scaleX = containerW / 390;
    const scaleY = containerH / 844;
    const scale = Math.min(scaleX, scaleY);
    iframe.style.transform = `scale(${scale})`;
  }

  function setupCardIframe(iframe, card) {
    const preview = card.querySelector('.card-preview');
    const rect = preview.getBoundingClientRect();
    scaleIframe(iframe, rect.width, rect.height);
  }

  function setupModalIframe() {
    // phone screen: 200px wide × 430px tall (inner)
    scaleIframe(modalIframe, 196, 426);
  }

  // ── Filter & Search ────────────────────────────────────────
  function getFiltered() {
    return CARDS.filter(c => {
      const matchFilter = activeFilter === 'all' || c.category === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.client.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }

  // ── Render grid ────────────────────────────────────────────
  function render() {
    const filtered = getFiltered();
    cardCount.textContent = `${filtered.length} card${filtered.length !== 1 ? 's' : ''}`;
    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="empty-state">No interactives match your search.<br>Try a different filter or keyword.</div>';
      return;
    }

    filtered.forEach((c, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.animationDelay = `${idx * 40}ms`;
      card.innerHTML = `
        <div class="card-preview" id="preview-${c.id}">
          <iframe
            src="${c.htmlFile}"
            title="${c.name}"
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
            id="iframe-${c.id}"
          ></iframe>
          <div class="card-cta-hint">
            <span class="card-cta-hint-label">↑ CTA zone — leave clear</span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-meta-row">
            <span class="card-category">${c.category}</span>
            <span class="card-date">${c.date}</span>
          </div>
          <div class="card-name">${c.name}</div>
          <div class="card-client">${c.client}</div>
          <div class="card-cta-row">
            <span class="cta-dot" style="background:${c.ctaColor};"></span>
            <span class="cta-label">${c.ctaText} · ${c.ctaPosition} · ${c.ctaColor}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openModal(c));
      grid.appendChild(card);

      // scale iframe after layout
      const iframe = card.querySelector(`#iframe-${c.id}`);
      iframe.addEventListener('load', () => setupCardIframe(iframe, card));
      // also scale once immediately (in case already cached)
      requestAnimationFrame(() => setupCardIframe(iframe, card));
    });

    // re-scale all on resize
    window.addEventListener('resize', () => {
      document.querySelectorAll('.card').forEach(card => {
        const id = card.querySelector('[id^="iframe-"]')?.id.replace('iframe-', '');
        const iframe = card.querySelector(`#iframe-${id}`);
        if (iframe) setupCardIframe(iframe, card);
      });
    });
  }

  // ── Modal ──────────────────────────────────────────────────
  function openModal(c) {
    activeCard = c;

    modalTag.textContent        = c.category;
    modalTitle.textContent      = c.name;
    modalClient.textContent     = `Client: ${c.client}`;
    modalDate.textContent       = `Created: ${c.date}`;
    modalDriveLink.href         = c.driveUrl;
    modalCtaSwatch.style.background = c.ctaColor;
    modalCtaInfo.textContent    = `"${c.ctaText}" · ${c.ctaPosition} · ${c.ctaColor}`;
    ctaDot.style.background     = c.ctaColor;
    ctaBadgeText.textContent    = `CTA: ${c.ctaPosition} — leave blank`;

    // load iframe
    modalIframe.src = c.htmlFile;
    modalIframe.onload = setupModalIframe;
    setupModalIframe();

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    // pause video in iframe by blanking src, then restore
    modalIframe.src = '';
    activeCard = null;
    copyConfirm.classList.remove('show');
  }

  // ── Events ─────────────────────────────────────────────────
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      render();
    });
  });

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    render();
  });

  modalClose.addEventListener('click', closeModal);

  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  modalCopyBtn.addEventListener('click', () => {
    if (!activeCard) return;
    const filename = activeCard.htmlFile.split('/').pop();
    navigator.clipboard.writeText(filename).then(() => {
      copyConfirm.classList.add('show');
      setTimeout(() => copyConfirm.classList.remove('show'), 2000);
    });
  });

  // ── Init ───────────────────────────────────────────────────
  render();

})();
