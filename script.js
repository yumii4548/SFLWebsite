(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initNavbar();
        initHamburgerMenu();
        initScrollAnimations();
        initStatsCounter();
        initBackToTop();
        initGalleryFilters();
        initFaqAccordion();
        initCopyText();
        initSmoothScroll();
        initScrollSpy();
    });

    function initNavbar() {
        var navbar = document.getElementById('navbar');
        if (!navbar) return;
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }

    function initHamburgerMenu() {
        var toggle = document.getElementById('navToggle');
        var menu = document.getElementById('navMenu');
        var overlay = document.getElementById('navOverlay');
        if (!toggle || !menu) return;

        function openMenu() {
            toggle.classList.add('active');
            menu.classList.add('active');
            if (overlay) overlay.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        toggle.addEventListener('click', function () {
            if (menu.classList.contains('active')) closeMenu();
            else openMenu();
        });

        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        var links = menu.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', closeMenu);
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    function initSmoothScroll() {
        var links = document.querySelectorAll('a[href^="#"]');
        links.forEach(function (a) {
            a.addEventListener('click', function (e) {
                var id = a.getAttribute('href');
                if (!id || id === '#' || id.length < 2) return;
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                var navbarH = document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 72;
                var top = target.getBoundingClientRect().top + window.scrollY - navbarH + 1;
                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });
    }

    function initScrollSpy() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-link[data-nav]');
        if (!sections.length || !navLinks.length) return;

        function updateActive() {
            var navbarH = document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 72;
            var scrollPos = window.scrollY + navbarH + 20;
            var currentId = '';
            sections.forEach(function (sec) {
                if (sec.offsetTop <= scrollPos && (sec.offsetTop + sec.offsetHeight) > scrollPos) {
                    currentId = sec.id;
                }
            });
            if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 50) {
                currentId = sections[sections.length - 1].id;
            }
            if (!currentId && window.scrollY < 200) {
                currentId = sections[0] ? sections[0].id : '';
            }
            /* 简介与数据条算作主页；数据看板归到代表作品 */
            if (currentId === 'about' || currentId === 'stats') currentId = 'hero';
            if (currentId === 'data-platform') currentId = 'works';
            navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('data-nav') === currentId) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateActive, { passive: true });
        window.addEventListener('resize', updateActive);
        updateActive();
    }

    function initScrollAnimations() {
        var reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;
        if (!('IntersectionObserver' in window)) {
            for (var i = 0; i < reveals.length; i++) reveals[i].classList.add('visible');
            return;
        }
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        reveals.forEach(function (el) { observer.observe(el); });
    }

    function initStatsCounter() {
        var counters = document.querySelectorAll('.stat-value');
        if (!counters.length) return;
        if (!('IntersectionObserver' in window)) {
            counters.forEach(function (el) { el.textContent = el.dataset.count + (el.dataset.suffix || ''); });
            return;
        }
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(function (el) { observer.observe(el); });
    }

    function animateCounter(el) {
        var target = parseInt(el.dataset.count, 10) || 0;
        var suffix = el.dataset.suffix || '';
        var duration = 2000;
        var start = performance.now();
        function update(now) {
            var progress = Math.min((now - start) / duration, 1);
            var easeOut = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(easeOut * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target + suffix;
        }
        requestAnimationFrame(update);
    }

    function initBackToTop() {
        var btn = document.getElementById('backToTop');
        if (!btn) return;
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) btn.classList.add('visible');
            else btn.classList.remove('visible');
        });
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function initGalleryFilters() {
        var buttons = document.querySelectorAll('.filter-btn');
        var items = document.querySelectorAll('.gallery-item');
        if (!buttons.length || !items.length) return;
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var filter = btn.dataset.filter;
                buttons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                items.forEach(function (item) {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = '';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(function () { item.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    function initFaqAccordion() {
        var questions = document.querySelectorAll('.faq-question');
        if (!questions.length) return;
        questions.forEach(function (q) {
            q.addEventListener('click', function () {
                var item = q.closest('.faq-item');
                var isOpen = item.classList.contains('open');
                document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
                if (!isOpen) item.classList.add('open');
            });
        });
    }

    function initCopyText() {
        window.copyText = function (text) {
            if (!text) return;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(function () { showToast('已复制：' + text); });
            } else {
                var ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); showToast('已复制：' + text); } catch (e) { }
                document.body.removeChild(ta);
            }
        };
    }

    function showToast(msg) {
        var toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 2000);
    }

})();
