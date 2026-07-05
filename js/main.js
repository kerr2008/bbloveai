document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initSearch();
  initMoreMenu();
  initMobileMenu();
  initParticles();
  initShareFilter();
  initGradientDots();
  initVortex();
  initWavyBackground();
  initShutterText();
  initFluidSpatialHero();
  initWorksCarousel();
  initBbsCards();
  initBloomEffect();
  initErrorCanvas();
  initTiltCards();
  initBackgroundPaths();
  initVortexPage4();
  initCircularReveal();
});

function initSlider() {
  const SPOTLIGHT_R = 260;
  const slider = document.querySelector('.slider-container');
  const dots = document.querySelectorAll('.slide-dot');
  const prevBtn = document.querySelector('.slide-arrow.prev');
  const nextBtn = document.querySelector('.slide-arrow.next');
  const slides = document.querySelectorAll('.slide');
  const revealCanvases = document.querySelectorAll('.reveal-canvas');
  const revealImages = document.querySelectorAll('.slide-reveal-image');
  
  let currentIndex = 0;
  const totalSlides = slides.length;
  
  let mouse = { x: -999, y: -999 };
  let smooth = { x: -999, y: -999 };
  let rafRef = null;
  
  function resizeCanvases() {
    revealCanvases.forEach(canvas => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
  
  resizeCanvases();
  window.addEventListener('resize', resizeCanvases);
  
  function handleMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
  
  document.addEventListener('mousemove', handleMouseMove);
  
  function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 20}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }
  
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
    resetAnimation();
  }
  
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
    resetAnimation();
  }
  
  function resetAnimation() {
    const activeSlide = slides[currentIndex];
    const cta = activeSlide.querySelector('.slide-cta');
    const particleCanvases = activeSlide.querySelectorAll('.particle-canvas');
    
    particleCanvases.forEach((canvas, index) => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particleText = particleTextInstances.find(p => p.canvas === canvas);
      if (particleText) {
        setTimeout(() => particleText.reset(), index * 200);
      }
    });
    
    if (cta) {
      cta.style.opacity = '0';
      cta.style.animation = 'none';
      cta.offsetHeight;
      cta.style.animation = 'heroFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards';
    }
  }
  
  function updateRevealMask() {
    smooth.x += (mouse.x - smooth.x) * 0.1;
    smooth.y += (mouse.y - smooth.y) * 0.1;
    
    revealCanvases.forEach((canvas, index) => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createRadialGradient(
        smooth.x, smooth.y, 0,
        smooth.x, smooth.y, SPOTLIGHT_R
      );
      
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)');
      gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(smooth.x, smooth.y, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      const maskUrl = canvas.toDataURL();
      revealImages[index].style.maskImage = `url(${maskUrl})`;
      revealImages[index].style.webkitMaskImage = `url(${maskUrl})`;
      revealImages[index].style.maskSize = '100% 100%';
      revealImages[index].style.webkitMaskSize = '100% 100%';
    });
    
    rafRef = requestAnimationFrame(updateRevealMask);
  }
  
  updateRevealMask();
  
  prevBtn?.addEventListener('click', prevSlide);
  nextBtn?.addEventListener('click', nextSlide);
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
      resetAnimation();
    });
  });
  
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      nextSlide();
    }
    if (touchEndX > touchStartX + threshold) {
      prevSlide();
    }
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  
  let wheelTimeout;
  document.addEventListener('wheel', (e) => {
    if (!wheelTimeout) {
      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
        if (e.deltaX > 0) {
          nextSlide();
        } else if (e.deltaX < 0) {
          prevSlide();
        } else if (e.deltaY > 0) {
          nextSlide();
        } else if (e.deltaY < 0) {
          prevSlide();
        }
      }, 100);
    }
  });
  
  window.addEventListener('beforeunload', () => {
    if (rafRef) {
      cancelAnimationFrame(rafRef);
    }
    document.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', resizeCanvases);
  });
}

function initSearch() {
  const searchBtn = document.querySelector('.search-btn');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchClose = document.querySelector('.search-close');
  const searchInput = document.querySelector('.search-input');

  function openSearch() {
    searchOverlay?.classList.add('active');
    setTimeout(() => searchInput?.focus(), 100);
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    searchOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  searchBtn?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);

  searchOverlay?.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay?.classList.contains('active')) {
      closeSearch();
    }
  });

  const searchTags = document.querySelectorAll('.search-tag');
  searchTags.forEach(tag => {
    tag.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = tag.textContent;
        searchInput.focus();
      }
    });
  });
}

function initMoreMenu() {
  const moreBtn = document.querySelector('.more-btn');
  const moreMenu = document.querySelector('.more-menu');

  moreBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    moreMenu?.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!moreMenu?.contains(e.target) && !moreBtn?.contains(e.target)) {
      moreMenu?.classList.remove('active');
    }
  });
}

function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  function openMobileMenu() {
    mobileNavOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileNavOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileMenuBtn?.addEventListener('click', openMobileMenu);
  mobileNavClose?.addEventListener('click', closeMobileMenu);

  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  mobileNavItems.forEach(item => {
    item.addEventListener('click', closeMobileMenu);
  });
}

function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.className = 'particles-bg';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  function createParticles() {
    const count = Math.floor((canvas.width * canvas.height) / 25000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  createParticles();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

function initShareFilter() {
  const categories = document.querySelectorAll('.share-category');
  const items = document.querySelectorAll('.share-item');

  categories.forEach(category => {
    category.addEventListener('click', () => {
      categories.forEach(c => c.classList.remove('active'));
      category.classList.add('active');

      const filter = category.dataset.filter;

      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function copyToClipboard(text, element) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = element.textContent;
    element.textContent = '已复制';
    element.style.background = 'rgba(72, 187, 120, 0.2)';
    element.style.color = '#48bb78';
    element.style.borderColor = 'rgba(72, 187, 120, 0.3)';
    
    setTimeout(() => {
      element.textContent = originalText;
      element.style.background = '';
      element.style.color = '';
      element.style.borderColor = '';
    }, 2000);
  });
}

function initGradientDots() {
  const canvas = document.querySelector('.gradient-dots-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let dots = [];
  let mouseX = -999;
  let mouseY = -999;
  let time = 0;
  let animationId = null;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots();
  }
  
  function initDots() {
    dots = [];
    const dotCount = 120;
    
    for (let i = 0; i < dotCount; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 2,
        hue: Math.random() * 360,
        hueSpeed: Math.random() * 0.5 + 0.2,
        floatSpeed: Math.random() * 0.02 + 0.01,
        floatOffset: Math.random() * Math.PI * 2
      });
    }
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function animate() {
    time += 0.016;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    dots.forEach(dot => {
      dot.x += dot.vx;
      dot.y += dot.vy;
      
      const floatY = Math.sin(time * dot.floatSpeed + dot.floatOffset) * 0.5;
      dot.y += floatY;
      
      if (dot.x < 0) dot.x = canvas.width;
      if (dot.x > canvas.width) dot.x = 0;
      if (dot.y < 0) dot.y = canvas.height;
      if (dot.y > canvas.height) dot.y = 0;
      
      dot.hue += dot.hueSpeed;
      if (dot.hue > 360) dot.hue = 0;
      
      const distToMouse = Math.sqrt(Math.pow(mouseX - dot.x, 2) + Math.pow(mouseY - dot.y, 2));
      const mouseInfluence = Math.max(0, 1 - distToMouse / 300);
      const glowSize = dot.size + mouseInfluence * 10;
      
      const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, glowSize);
      gradient.addColorStop(0, `hsla(${dot.hue}, 60%, 50%, ${0.3 + mouseInfluence * 0.15})`);
      gradient.addColorStop(0.4, `hsla(${dot.hue}, 50%, 45%, ${0.15 + mouseInfluence * 0.1})`);
      gradient.addColorStop(1, `hsla(${dot.hue}, 40%, 40%, 0)`);
      
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${dot.hue}, 70%, 65%, ${0.4 + mouseInfluence * 0.2})`;
      ctx.fill();
    });
    
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.12;
          const avgHue = (dots[i].hue + dots[j].hue) / 2;
          
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `hsla(${avgHue}, 50%, 50%, ${alpha})`;
          ctx.lineWidth = 0.5 + alpha * 0.5;
          ctx.stroke();
        }
      }
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    window.removeEventListener('resize', resize);
  });
}

function initVortex() {
  const canvas = document.querySelector('.vortex-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let animationId;
  let time = 0;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  
  const waveCount = 5;
  const waves = [];
  
  for (let i = 0; i < waveCount; i++) {
    waves.push({
      amplitude: 80 + i * 30,
      frequency: 0.01 + i * 0.005,
      speed: 0.05 + i * 0.02,
      offset: i * Math.PI / waveCount,
      opacity: 0.25 - i * 0.04,
      width: 2 - i * 0.3,
      hue: 260 + i * 15
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 1;
    
    const centerY = canvas.height / 2;
    const centerX = canvas.width / 2;
    
    waves.forEach((wave, index) => {
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      
      for (let x = 0; x <= canvas.width; x += 3) {
        const relativeX = x - centerX;
        
        const y = centerY + 
                  Math.sin(relativeX * wave.frequency + time * wave.speed + wave.offset) * wave.amplitude * Math.exp(-Math.pow(relativeX / (canvas.width / 2.5), 2)) +
                  Math.sin(relativeX * wave.frequency * 2 + time * wave.speed * 1.5) * (wave.amplitude * 0.3) * Math.exp(-Math.pow(relativeX / (canvas.width / 2), 2));
        
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, centerY);
      
      const gradient = ctx.createLinearGradient(0, centerY - wave.amplitude, 0, centerY + wave.amplitude);
      gradient.addColorStop(0, `hsla(${wave.hue}, 60%, 50%, 0)`);
      gradient.addColorStop(0.5, `hsla(${wave.hue}, 60%, 50%, ${wave.opacity})`);
      gradient.addColorStop(1, `hsla(${wave.hue}, 60%, 50%, 0)`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = wave.width;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
    
    const particleCount = 200;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + time * 0.003;
      const baseRadius = 200 + Math.sin(time * 0.02 + i * 0.1) * 50;
      const radius = baseRadius + Math.sin(time * 0.1 + angle * 2) * 20;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius * 0.3;
      
      const particleSize = 2 + Math.sin(time * 0.05 + i) * 1;
      const particleHue = 280 + Math.sin(time * 0.03 + i * 0.1) * 30;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, particleSize * 2);
      gradient.addColorStop(0, `hsla(${particleHue}, 80%, 70%, 0.8)`);
      gradient.addColorStop(1, `hsla(${particleHue}, 70%, 50%, 0)`);
      
      ctx.beginPath();
      ctx.arc(x, y, particleSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', resize);
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    window.removeEventListener('resize', resize);
  });
}

function initWavyBackground() {
  const canvas = document.querySelector('.wavy-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let animationId;
  let time = 0;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  
  const waveCount = 5;
  const waves = [];
  
  for (let i = 0; i < waveCount; i++) {
    waves.push({
      y: canvas.height * 0.3 + (i * canvas.height * 0.15),
      amplitude: 30 + i * 15,
      frequency: 0.002 + i * 0.001,
      speed: 0.003 + i * 0.001,
      opacity: 0.15 - i * 0.025,
      color: `hsla(${260 + i * 10}, 70%, ${50 + i * 5}%, `
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 1;
    
    waves.forEach(wave => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      for (let x = 0; x <= canvas.width; x += 5) {
        const y = wave.y + Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
                  Math.sin(x * wave.frequency * 2 + time * wave.speed * 1.5) * (wave.amplitude * 0.5);
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, canvas.height);
      gradient.addColorStop(0, wave.color + wave.opacity + ')');
      gradient.addColorStop(1, wave.color + '0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    });
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
        const radius = 200 + i * 50 + Math.sin(angle * 3 + time * 0.02) * 30;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.5;
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      ctx.strokeStyle = `hsla(${280 + i * 20}, 60%, 60%, ${0.1 - i * 0.03})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', resize);
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    window.removeEventListener('resize', resize);
  });
}

function initShutterText() {
  const chars = document.querySelectorAll('.shutter-char');
  
  chars.forEach((char, index) => {
    char.setAttribute('data-char', char.textContent);
  });
  
  function animateSlide(index) {
    const slideChars = document.querySelectorAll(`.slide:nth-child(${index + 1}) .shutter-char`);
    
    slideChars.forEach(char => {
      char.classList.remove('visible');
      char.style.opacity = '0';
      char.style.transform = 'scaleY(0) translateY(-20px)';
    });
    
    setTimeout(() => {
      slideChars.forEach((char, i) => {
        setTimeout(() => {
          char.classList.add('visible');
          char.style.opacity = '1';
          char.style.transform = 'scaleY(1) translateY(0)';
        }, i * 80);
      });
    }, 300);
  }
  
  animateSlide(0);
  
  const dots = document.querySelectorAll('.slide-dot');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      animateSlide(index);
    });
  });
  
  const prevBtn = document.querySelector('.slide-arrow.prev');
  const nextBtn = document.querySelector('.slide-arrow.next');
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.slide').length;
  
  prevBtn?.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    animateSlide(currentSlide);
  });
  
  nextBtn?.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    animateSlide(currentSlide);
  });
  
  let autoPlayInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    animateSlide(currentSlide);
  }, 5000);
  
  const sliderContainer = document.querySelector('.slider-container');
  sliderContainer?.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
  });
  
  sliderContainer?.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      animateSlide(currentSlide);
    }, 5000);
  });
}

function initBloomEffect() {
  const canvas = document.querySelector('.bloom-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let time = 0;
  let animationId = null;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  const flowerPetals = [];
  const petalCount = 12;
  
  for (let i = 0; i < petalCount; i++) {
    flowerPetals.push({
      angle: (i / petalCount) * Math.PI * 2,
      speed: 0.002 + Math.random() * 0.003,
      amplitude: 30 + Math.random() * 20,
      offset: Math.random() * Math.PI * 2,
      hue: 280 + Math.random() * 60
    });
  }
  
  function animate() {
    time += 0.016;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    flowerPetals.forEach((petal, index) => {
      petal.angle += petal.speed;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(petal.angle);
      
      const radius = 150 + Math.sin(time * 2 + petal.offset) * petal.amplitude;
      const petalWidth = 40 + Math.sin(time + index) * 10;
      const petalHeight = radius;
      
      const gradient = ctx.createLinearGradient(0, 0, 0, petalHeight);
      gradient.addColorStop(0, `hsla(${petal.hue}, 80%, 70%, 0.6)`);
      gradient.addColorStop(0.5, `hsla(${petal.hue + 20}, 70%, 50%, 0.3)`);
      gradient.addColorStop(1, `hsla(${petal.hue}, 60%, 40%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(petalWidth, petalHeight * 0.3, 0, petalHeight);
      ctx.quadraticCurveTo(-petalWidth, petalHeight * 0.3, 0, 0);
      ctx.fill();
      
      ctx.restore();
    });
    
    const centerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100);
    centerGlow.addColorStop(0, 'hsla(300, 80%, 60%, 0.4)');
    centerGlow.addColorStop(0.5, 'hsla(280, 70%, 50%, 0.2)');
    centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = centerGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
    ctx.fill();
    
    const floatingParticles = 6;
    for (let i = 0; i < floatingParticles; i++) {
      const angle = (i / floatingParticles) * Math.PI * 2 + time * 0.05;
      const orbitRadius = 200 + Math.sin(time * 0.5 + i) * 50;
      const px = centerX + Math.cos(angle) * orbitRadius;
      const py = centerY + Math.sin(angle) * orbitRadius * 0.6;
      
      const particleSize = 60 + Math.sin(time + i) * 20;
      const particleGradient = ctx.createRadialGradient(px, py, 0, px, py, particleSize);
      particleGradient.addColorStop(0, `hsla(${280 + i * 20}, 70%, 60%, 0.15)`);
      particleGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = particleGradient;
      ctx.beginPath();
      ctx.arc(px, py, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const verticalWaves = 3;
    for (let w = 0; w < verticalWaves; w++) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      for (let x = 0; x <= canvas.width; x += 5) {
        const waveY = centerY + 
                     Math.sin(x * 0.005 + time * 0.5 + w) * 100 * Math.exp(-Math.pow((x - centerX) / (canvas.width * 0.8), 2)) +
                     Math.sin(x * 0.01 + time * 0.8 + w * 0.5) * 50 * Math.exp(-Math.pow((x - centerX) / (canvas.width * 0.6), 2));
        ctx.lineTo(x, waveY);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      
      const waveGradient = ctx.createLinearGradient(0, centerY - 100, 0, centerY + 100);
      waveGradient.addColorStop(0, `hsla(${300 + w * 20}, 70%, 50%, 0)`);
      waveGradient.addColorStop(0.5, `hsla(${300 + w * 20}, 70%, 50%, ${0.15 - w * 0.05})`);
      waveGradient.addColorStop(1, `hsla(${300 + w * 20}, 70%, 50%, 0)`);
      ctx.fillStyle = waveGradient;
      ctx.fill();
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
}

function initVortexPage4() {
  const canvas = document.querySelector('.vortex-canvas-page4');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let time = 0;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  const particleCount = 300;
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * Math.min(canvas.width, canvas.height) / 1.5;
    particles.push({
      x: canvas.width / 2 + Math.cos(angle) * radius,
      y: canvas.height / 2 + Math.sin(angle) * radius,
      angle: angle,
      radius: radius,
      speed: 0.002 + Math.random() * 0.005,
      size: 1 + Math.random() * 2,
      hue: 260 + Math.random() * 40,
      opacity: 0.2 + Math.random() * 0.4
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 1;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let ring = 0; ring < 5; ring++) {
      const ringRadius = 100 + ring * 60;
      const ringPoints = 50 + ring * 20;
      
      ctx.beginPath();
      for (let i = 0; i <= ringPoints; i++) {
        const angle = (i / ringPoints) * Math.PI * 2;
        const wave = Math.sin(angle * 3 + time * 0.02 + ring) * 15;
        const r = ringRadius + wave;
        
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      ctx.strokeStyle = `hsla(${260 + ring * 10}, 60%, 50%, ${0.15 - ring * 0.02})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    particles.forEach(p => {
      p.angle += p.speed;
      p.radius += Math.sin(time * 0.01 + p.hue) * 0.3;
      
      if (p.radius < 50) p.radius = 50;
      if (p.radius > Math.min(canvas.width, canvas.height) / 1.2) p.radius = Math.min(canvas.width, canvas.height) / 1.2;
      
      p.x = centerX + Math.cos(p.angle) * p.radius;
      p.y = centerY + Math.sin(p.angle) * p.radius;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 60%, 60%, ${p.opacity})`;
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

function initCircularReveal() {
  const heading = document.querySelector('.circular-reveal-heading');
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealArts = document.querySelectorAll('.reveal-art');
  const revealTitle = document.getElementById('revealTitle');
  const revealSubtitle = document.getElementById('revealSubtitle');
  
  if (!heading || revealItems.length === 0) return;

  function setActive(item, options = {}) {
    const index = Number(item.dataset.index || 0);
    const revealImage = options.revealImage !== false;

    heading.dataset.active = String(index);
    heading.classList.toggle('is-revealing', revealImage);
    revealItems.forEach(button => button.classList.toggle('active', button === item));
    revealArts.forEach((art, artIndex) => art.classList.toggle('active', revealImage && artIndex === index));
    updateSpotlightFromElement(item);

    if (revealTitle && item.dataset.title) {
      revealTitle.textContent = item.dataset.title;
    }

    if (revealSubtitle && item.dataset.subtitle) {
      revealSubtitle.textContent = item.dataset.subtitle;
    }
  }

  function updateSpotlight(clientX, clientY) {
    const rect = heading.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    heading.style.setProperty('--spot-x', `${Math.max(0, Math.min(100, x))}%`);
    heading.style.setProperty('--spot-y', `${Math.max(0, Math.min(100, y))}%`);
  }

  function updateSpotlightFromElement(element) {
    const headingRect = heading.getBoundingClientRect();
    const itemRect = element.getBoundingClientRect();
    const x = ((itemRect.left + itemRect.width / 2 - headingRect.left) / headingRect.width) * 100;
    const y = ((itemRect.top + itemRect.height / 2 - headingRect.top) / headingRect.height) * 100;

    heading.style.setProperty('--spot-x', `${Math.max(0, Math.min(100, x))}%`);
    heading.style.setProperty('--spot-y', `${Math.max(0, Math.min(100, y))}%`);
  }

  heading.addEventListener('mousemove', (event) => {
    updateSpotlight(event.clientX, event.clientY);
  });

  heading.addEventListener('mouseleave', () => {
    const activeItem = document.querySelector('.reveal-item.active') || revealItems[0];
    setActive(activeItem, { revealImage: false });
  });

  revealItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      setActive(item);
    });

    item.addEventListener('focus', () => {
      setActive(item);
    });

    item.addEventListener('click', () => {
      setActive(item);
    });
  });

  const initialItem = document.querySelector('.reveal-item.active') || revealItems[0];
  setActive(initialItem, { revealImage: false });
}

function initTiltCards() {
  const cards = document.querySelectorAll('.card, .carousel-card, .bbs-card, .floating-card, .feature-card');
  
  cards.forEach(card => {
    const originalTransform = card.style.transform || '';
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `${originalTransform} perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = originalTransform;
    });
    
    card.addEventListener('touchmove', (e) => {
      const rect = card.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `${originalTransform} perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('touchend', () => {
      card.style.transform = originalTransform;
    });
  });
}

function initBackgroundPaths() {
  const canvas = document.querySelector('.bloom-feature-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let time = 0;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  const paths = [];
  const pathCount = 8;
  
  for (let i = 0; i < pathCount; i++) {
    const points = [];
    const pointCount = 20 + Math.floor(Math.random() * 10);
    
    for (let j = 0; j < pointCount; j++) {
      points.push({
        x: (j / (pointCount - 1)) * canvas.width,
        y: canvas.height * (0.2 + Math.random() * 0.6),
        offset: Math.random() * Math.PI * 2,
        amplitude: 20 + Math.random() * 50,
        speed: 0.01 + Math.random() * 0.02
      });
    }
    paths.push({
      points: points,
      hue: 260 + Math.random() * 60,
      opacity: 0.1 + Math.random() * 0.2,
      width: 1 + Math.random() * 2
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.016;
    
    paths.forEach(path => {
      ctx.beginPath();
      
      for (let i = 0; i < path.points.length; i++) {
        const point = path.points[i];
        const y = point.y + Math.sin(time * point.speed + point.offset) * point.amplitude;
        
        if (i === 0) {
          ctx.moveTo(point.x, y);
        } else {
          const prevPoint = path.points[i - 1];
          const prevY = prevPoint.y + Math.sin(time * prevPoint.speed + prevPoint.offset) * prevPoint.amplitude;
          const cpX = (prevPoint.x + point.x) / 2;
          const cpY = (prevY + y) / 2;
          ctx.quadraticCurveTo(prevPoint.x, prevY, cpX, cpY);
        }
      }
      
      const lastPoint = path.points[path.points.length - 1];
      const lastY = lastPoint.y + Math.sin(time * lastPoint.speed + lastPoint.offset) * lastPoint.amplitude;
      ctx.lineTo(lastPoint.x, lastY);
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, `hsla(${path.hue}, 70%, 60%, 0)`);
      gradient.addColorStop(0.5, `hsla(${path.hue}, 70%, 60%, ${path.opacity})`);
      gradient.addColorStop(1, `hsla(${path.hue}, 70%, 60%, 0)`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let ring = 0; ring < 3; ring++) {
      const radius = 150 + ring * 80;
      const points = 60;
      
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const wave = Math.sin(angle * 4 + time * 0.5 + ring) * 20;
        const r = radius + wave;
        
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r * 0.5;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      ctx.strokeStyle = `hsla(${280 + ring * 20}, 60%, 50%, ${0.1 - ring * 0.03})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

function initErrorCanvas() {
  const canvas = document.querySelector('.error-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let time = 0;
  let animationId = null;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  const particles = [];
  const particleCount = 100;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      hue: 260 + Math.random() * 60,
      opacity: Math.random() * 0.5 + 0.2
    });
  }
  
  function animate() {
    time += 0.016;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.x += p.speedX + Math.sin(time + p.y * 0.01) * 0.3;
      p.y += p.speedY + Math.cos(time + p.x * 0.01) * 0.3;
      p.rotation += p.rotationSpeed;
      
      if (p.x < -50) p.x = canvas.width + 50;
      if (p.x > canvas.width + 50) p.x = -50;
      if (p.y < -50) p.y = canvas.height + 50;
      if (p.y > canvas.height + 50) p.y = -50;
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      
      const gradient = ctx.createLinearGradient(-p.size, -p.size, p.size, p.size);
      gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${p.opacity})`);
      gradient.addColorStop(0.5, `hsla(${p.hue + 30}, 70%, 50%, ${p.opacity * 0.5})`);
      gradient.addColorStop(1, `hsla(${p.hue}, 60%, 40%, 0)`);
      
      ctx.fillStyle = gradient;
      
      const shapeType = Math.floor(Math.random() * 3);
      if (shapeType === 0) {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else if (shapeType === 1) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * p.size / 2;
          const y = Math.sin(angle) * p.size / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.restore();
    });
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    for (let r = 0; r < 3; r++) {
      const radius = 150 + r * 80 + Math.sin(time * 0.5 + r) * 30;
      ctx.beginPath();
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
        const wavyRadius = radius + Math.sin(angle * 5 + time * 2) * 15;
        const x = centerX + Math.cos(angle) * wavyRadius;
        const y = centerY + Math.sin(angle) * wavyRadius * 0.6;
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      
      ctx.strokeStyle = `hsla(${280 + r * 20}, 70%, 60%, ${0.15 - r * 0.05})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
}

function initBbsCards() {
  const cards = document.querySelectorAll('.bbs-card');
  let draggedCard = null;
  let dragOffset = { x: 0, y: 0 };
  let zIndexCounter = 10;
  
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    card.dataset.origLeft = rect.left;
    card.dataset.origTop = rect.top;
    
    card.addEventListener('mousedown', handleMouseDown);
    card.addEventListener('touchstart', handleTouchStart, { passive: false });
  });
  
  function handleMouseDown(e) {
    e.preventDefault();
    startDrag(e.clientX, e.clientY, e.target.closest('.bbs-card'));
  }
  
  function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY, e.target.closest('.bbs-card'));
  }
  
  function startDrag(clientX, clientY, card) {
    if (!card) return;
    
    draggedCard = card;
    const rect = card.getBoundingClientRect();
    dragOffset.x = clientX - rect.left;
    dragOffset.y = clientY - rect.top;
    
    card.style.zIndex = ++zIndexCounter;
    card.style.transition = 'none';
    card.style.boxShadow = '0 25px 60px rgba(255, 77, 109, 0.4)';
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }
  
  function handleMouseMove(e) {
    if (!draggedCard) return;
    updateDrag(e.clientX, e.clientY);
  }
  
  function handleTouchMove(e) {
    e.preventDefault();
    if (!draggedCard) return;
    const touch = e.touches[0];
    updateDrag(touch.clientX, touch.clientY);
  }
  
  function updateDrag(clientX, clientY) {
    const container = document.querySelector('.hero-cards-section');
    const containerRect = container.getBoundingClientRect();
    
    let newLeft = clientX - containerRect.left - dragOffset.x;
    let newTop = clientY - containerRect.top - dragOffset.y;
    
    newLeft = Math.max(0, Math.min(newLeft, containerRect.width - draggedCard.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, containerRect.height - draggedCard.offsetHeight));
    
    draggedCard.style.left = `${newLeft}px`;
    draggedCard.style.top = `${newTop}px`;
    draggedCard.style.transform = 'rotate(0deg)';
    draggedCard.classList.remove('featured-card');
  }
  
  function handleMouseUp(e) {
    endDrag();
  }
  
  function handleTouchEnd(e) {
    endDrag();
  }
  
  function endDrag() {
    if (draggedCard) {
      draggedCard.style.transition = 'box-shadow 0.3s ease';
      draggedCard.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
      
      draggedCard = null;
    }
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }
  
  const heroCta = document.querySelector('.hero-text-section .hero-cta');
  if (heroCta) {
    heroCta.addEventListener('click', () => {
      alert('讨论组功能正在开发中，敬请期待！');
    });
  }
}

function initWorksCarousel() {
  const track = document.getElementById('carouselTrack');
  const cards = document.querySelectorAll('.carousel-card');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  
  if (!track || cards.length === 0) return;
  
  cards.forEach(card => {
    card.addEventListener('click', (event) => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const href = card.dataset.href;
      if (href && !event.target.closest('a, button')) {
        window.location.href = href;
      }
    });
  });
  
  const cardWidth = 340;
  
  prevBtn?.addEventListener('click', () => {
    track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });
  
  nextBtn?.addEventListener('click', () => {
    track.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });
  
  let autoScrollInterval = setInterval(() => {
    track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    
    setTimeout(() => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 50) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 500);
  }, 4000);
  
  track.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
  });
  
  track.addEventListener('mouseleave', () => {
    autoScrollInterval = setInterval(() => {
      track.scrollBy({ left: cardWidth, behavior: 'smooth' });
      
      setTimeout(() => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 50) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }, 500);
    }, 4000);
  });
}

function initFluidSpatialHero() {
  const canvas = document.querySelector('.spatial-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let mouseX = 0;
  let mouseY = 0;
  let particles = [];
  let animationId = null;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  class SpatialParticle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      this.color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 0.5 + 0.1})`;
      this.baseX = this.x;
      this.baseY = this.y;
    }
    
    update() {
      this.vx += (this.baseX - this.x) * 0.01;
      this.vy += (this.baseY - this.y) * 0.01;
      
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 200) {
        const force = (200 - dist) / 200;
        this.vx -= dx * force * 0.02;
        this.vy -= dy * force * 0.02;
      }
      
      this.vx *= 0.98;
      this.vy *= 0.98;
      
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  for (let i = 0; i < 100; i++) {
    particles.push(new SpatialParticle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    const cards = document.querySelectorAll('.floating-card');
    cards.forEach(card => {
      const parallax = parseFloat(card.dataset.parallax) || 1;
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      
      const rotateX = (mouseY - cardCenterY) * 0.02 * parallax;
      const rotateY = (cardCenterX - mouseX) * 0.02 * parallax;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1)`;
    });
  });
  
  const searchInput = document.querySelector('.spatial-search-input');
  const searchSuggestions = document.querySelectorAll('.spatial-search-suggestions .search-tag');
  
  searchSuggestions.forEach(tag => {
    tag.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = tag.textContent;
        searchInput.focus();
      }
    });
  });
  
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const searchOverlay = document.querySelector('.search-overlay');
      const overlayInput = document.querySelector('.search-input');
      if (searchOverlay && overlayInput) {
        overlayInput.value = searchInput.value;
        searchOverlay.classList.add('active');
        overlayInput.focus();
      }
    }
  });
  
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    window.removeEventListener('resize', resize);
  });
}
