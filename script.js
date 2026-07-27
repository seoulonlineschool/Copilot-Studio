/**
 * Microsoft Copilot Studio 소개 웹사이트
 * script.js
 */

'use strict';

/* ─────────────────────────────────────────
   1. 모바일 메뉴 토글
───────────────────────────────────────── */
const menuToggle = document.getElementById('menuToggle');
const mobileNav  = document.getElementById('mobileNav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
  });

  // 모바일 메뉴 항목 클릭 시 닫기
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuToggle.innerHTML = '&#9776;';
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ─────────────────────────────────────────
   2. Intersection Observer - 스크롤 애니메이션
───────────────────────────────────────── */
const animatedEls = document.querySelectorAll('[data-animate]');

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.12,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

animatedEls.forEach(el => observer.observe(el));

/* ─────────────────────────────────────────
   3. 네비게이션 활성화 하이라이트
───────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        link.style.borderBottomColor = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = '#0078d4';
          link.style.borderBottomColor = '#0078d4';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(sec => navObserver.observe(sec));

/* ─────────────────────────────────────────
   4. 헤더 스크롤 그림자 효과
───────────────────────────────────────── */
const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      siteHeader.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
      siteHeader.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
    }
  }, { passive: true });
}

/* ─────────────────────────────────────────
   5. 스크롤 진행 표시 바
───────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = [
  'position:fixed',
  'top:0',
  'left:0',
  'height:3px',
  'background:linear-gradient(90deg,#0078d4,#00b4d8,#7FBA00)',
  'z-index:9999',
  'width:0%',
  'transition:width 0.1s linear',
  'pointer-events:none',
].join(';');
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const docHeight   = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled    = (window.scrollY / docHeight) * 100;
  progressBar.style.width = `${Math.min(scrolled, 100)}%`;
}, { passive: true });

/* ─────────────────────────────────────────
   6. 스무스 앵커 스크롤 (헤더 높이 보정)
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────
   7. 플로우 단계 순차 애니메이션
───────────────────────────────────────── */
const flowSteps = document.querySelectorAll('.flow-step, .flow-arrow');

const flowObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    flowSteps.forEach((el, idx) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, idx * 120);
    });

    flowObserver.disconnect();
  });
}, { threshold: 0.3 });

if (flowSteps.length > 0) {
  flowSteps.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  });

  const flowContainer = document.querySelector('.flow-diagram');
  if (flowContainer) flowObserver.observe(flowContainer);
}

/* ─────────────────────────────────────────
   8. 기능 카드 지연 등장 (stagger)
───────────────────────────────────────── */
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const parent = entry.target;
    const children = parent.querySelectorAll('.overview-card, .channel-card, .step, .ai-card');
    children.forEach((child, idx) => {
      setTimeout(() => child.classList.add('visible'), idx * 100);
    });

    staggerObserver.unobserve(parent);
  });
}, { threshold: 0.1 });

const staggerParents = document.querySelectorAll(
  '.overview-grid, .channels-grid, .steps, .ai-cards'
);
staggerParents.forEach(p => staggerObserver.observe(p));

/* ─────────────────────────────────────────
   9. 초기 로드 시 뷰포트 내 요소 즉시 표시
───────────────────────────────────────── */
window.addEventListener('load', () => {
  document.querySelectorAll('[data-animate]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    }
  });
});
