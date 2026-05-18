// ============================================================
// TIERRA INTERACTIVES LIBRARY — app.js
// ============================================================

(function () {
  'use strict';

  let activeFilter = 'all';
  let searchQuery  = '';
  let activeCard   = null;

  const grid           = document.getElementById('cardGrid');
  const cardCount      = document.getElementById('cardCount');
  const filterBtns     = document.querySelectorAll('.filter-btn');
  const searchInput    = document.getElementById('searchInput');
  const backdrop       = document.getElementById('modalBackdrop');
  const modalClose     = document.getElementById('modalClose');
  const modalVideo     = document.getElementById('modalVideo');
  const modalTitle     = document.getElementById('modalTitle');
  const modalClient    = document.getElementById('modalClient');
  const modalDate      = document.getElementById('modalDate');
  const modalTag       = document.getElementById('modalTag');
  const modalDriveLink = document.getElementById('modalDriveLink');
  const modalCopyBtn   = document.getElementById('modalCopyBtn');
  const copyConfirm    = document.getElementById('copyConfirm');
  const modalCtaBtn    = document.getElementById('modalCtaBtn');
  const modalCtaSwatch = document.getElementById('modalCtaSwatch');
  const modalCtaInfo   = document.getElementById('modalCtaInfo');

  // ── Text contrast helper ───────────────────────────────────
  function getTextColor(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
    return lum > 0.55 ? '#000000' : '#ffffff';
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

  // ── Render ─────────────────────────────────────────────────

  function render() {
    const filtered = getFiltered();
    cardCount.textContent = `${filtered.length} card${filtered.length !== 1 ? 's' : ''}`;
    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="empty-state">No interactives match your search.<br>Try a different filter or keyword.</div>';
      return;
    }

    filtered.forEach((c, idx) => {
      const textColor = getTextColor(c.ctaColor);
      const card = document.createElement('div');
      card.className = 'card';
      card.style.animationDelay = `${idx * 35}ms`;

      card.innerHTML = `
        <div class="card-preview">
          <video
            src="${c.videoUrl}"
            autoplay muted loop playsinline
            preload="metadata"
          ></video>
          <div class="card-cta">
            <div class="card-cta-btn" style="background:${c.ctaColor}; color:${textColor};">
              Shop Now
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="card-meta-row">
            <span class="card-category">${c.category}</span>
            <span class="card-date">${c.date}</span>
          </div>
          <div class="card-name">${c.name}</div>
          <div class="card-client">${c.client}</div>
        </div>
      `;

      card.addEventListener('click', () => openModal(c));
      grid.appendChild(card);
    });
  }

  // ── Modal ──────────────────────────────────────────────────

  function openModal(c) {
    activeCard = c;

    const textColor = getTextColor(c.ctaColor);

    modalTag.textContent            = c.category;
    modalTitle.textContent          = c.name;
    modalClient.textContent         = `Client: ${c.client}`;
    modalDate.textContent           = `Created: ${c.date}`;
    modalDriveLink.href             = c.driveUrl;
    modalCtaSwatch.style.background = c.ctaColor;
    modalCtaInfo.textContent        = `"Shop Now" · bottom · ${c.ctaColor}`;
    modalCtaBtn.style.background    = c.ctaColor;
    modalCtaBtn.style.color         = textColor;
    modalVideo.src                  = c.videoUrl;
    modalVideo.play();

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    modalVideo.pause();
    modalVideo.src = '';
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
    navigator.clipboard.writeText(activeCard.videoUrl).then(() => {
      copyConfirm.classList.add('show');
      setTimeout(() => copyConfirm.classList.remove('show'), 2000);
    });
  });

  // ── Init ───────────────────────────────────────────────────
  render();

})();
