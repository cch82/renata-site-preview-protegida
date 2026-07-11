/* ============================================
   RENATA LAGE HUMES — Site Oficial (C polido)
   Main JavaScript
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // NAV
    const nav = document.getElementById('mainNav');
    const hamburger = document.getElementById('navHamburger');
    const navLinks = document.getElementById('navLinks');

    const setMenuOpen = (open) => {
        navLinks.classList.toggle('open', open);
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
        hamburger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        document.body.style.overflow = open ? 'hidden' : '';
    };

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    hamburger.addEventListener('click', () => {
        setMenuOpen(!navLinks.classList.contains('open'));
    });

    navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
        setMenuOpen(false);
    }));

    // SCROLL SPY
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = navLinks.querySelectorAll('a[href^="#"]');
    const spyObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const id = e.target.id;
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.25, rootMargin: '-80px 0px -55% 0px' });
    sections.forEach(s => spyObs.observe(s));

    // SCROLL REVEAL
    if (reduceMotion) {
        document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => {
            el.classList.add('visible');
        });
    } else {
        const ro = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    ro.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => ro.observe(el));
    }

    // APEGO ACCORDION
    const setAccMax = () => {
        document.querySelectorAll('.apego-acc-item').forEach(item => {
            const body = item.querySelector('.apego-acc-body');
            if (!body) return;
            const wasActive = item.classList.contains('active');
            // measure full height
            const prev = body.style.maxHeight;
            body.style.maxHeight = 'none';
            const h = body.scrollHeight;
            body.style.maxHeight = prev;
            body.style.setProperty('--acc-max', h + 'px');
            if (wasActive) {
                // keep open
            }
        });
    };
    setAccMax();
    window.addEventListener('resize', setAccMax, { passive: true });

    document.querySelectorAll('.apego-acc-header').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.apego-acc-item');
            const wasActive = item.classList.contains('active');
            document.querySelectorAll('.apego-acc-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.apego-acc-header').setAttribute('aria-expanded', 'false');
            });
            if (!wasActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
                // remeasure after open state
                requestAnimationFrame(setAccMax);
            }
        });
    });

    // LUTO SPIRAL
    const lv = document.querySelector('.luto-visual');
    if (lv) {
        const svg = lv.querySelector('.luto-spiral-svg');
        const nodes = lv.querySelectorAll('.luto-node');
        if (reduceMotion) {
            if (svg) svg.classList.add('visible');
            nodes.forEach(n => n.classList.add('visible'));
        } else {
            const lutoObs = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        if (svg) svg.classList.add('visible');
                        nodes.forEach((n, i) => setTimeout(() => n.classList.add('visible'), 500 + i * 350));
                        lutoObs.unobserve(e.target);
                    }
                });
            }, { threshold: 0.25 });
            lutoObs.observe(lv);
        }
    }

    // SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]:not(.article-link)').forEach(a => {
        a.addEventListener('click', e => {
            const h = a.getAttribute('href');
            if (h === '#') {
                e.preventDefault();
                return;
            }
            const t = document.querySelector(h);
            if (t) {
                e.preventDefault();
                const top = t.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
            }
        });
    });

    // ARTICLE MODAL
    const modal = document.getElementById('articleModal');
    const mCat = document.getElementById('modalCategory');
    const mTitle = document.getElementById('modalTitle');
    const mBody = document.getElementById('modalBody');
    const mClose = document.getElementById('modalClose');
    let lastFocus = null;

    document.addEventListener('click', e => {
        const link = e.target.closest('.article-link') || e.target.closest('.article-row-thumb');
        if (!link) return;
        e.preventDefault();
        e.stopPropagation();
        const id = link.getAttribute('data-article-id');
        const src = document.getElementById('article-' + id);
        if (!src) return;
        lastFocus = link;
        mCat.textContent = src.getAttribute('data-category');
        mTitle.textContent = src.getAttribute('data-title');
        mBody.innerHTML = src.innerHTML;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        mClose.focus();
    });

    function closeModal() {
        if (!modal.classList.contains('open')) return;
        modal.classList.remove('open');
        document.body.style.overflow = '';
        if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
        }
    }

    mClose.addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });
    window.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    // WHATSAPP FLOAT — entrada após 3s
    const waFloat = document.querySelector('.whatsapp-float');
    if (waFloat) {
        if (reduceMotion) {
            waFloat.classList.add('is-visible');
        } else {
            setTimeout(() => {
                waFloat.classList.add('is-visible');
            }, 3000);
        }
    }
});
