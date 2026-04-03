gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

const frameCount = 160;
// URL encoding space character in folder name
const currentFrame = index => `Freame%20vox/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

const images = [];
const animationFrames = { frame: 0 };

// Preload elements
const loader = document.querySelector('.loader');
const progressEl = document.querySelector('.progress');

// Preloading images
let loadedCount = 0;

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        loadedCount++;
        // Update loader progress
        const progress = (loadedCount / frameCount) * 100;
        progressEl.style.width = `${progress}%`;
        
        // Initial render on first frame loading
        if (loadedCount === 1) {
            resize();
        }
        
        // When all frames are loaded
        if (loadedCount === frameCount) {
            initAnimations();
        }
    };
    images.push(img);
}

function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    render();
}

window.addEventListener("resize", resize);

function render() {
    const img = images[Math.round(animationFrames.frame)];
    if (!img || !img.complete) return;
    
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.width / img.height;
    
    let drawWidth, drawHeight, startX, startY;
    
    if (canvasAspect > imgAspect) {
        // Canvas is wider than image aspect
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgAspect;
        startX = 0;
        startY = (canvas.height - drawHeight) / 2;
    } else {
        // Canvas is taller than image aspect
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgAspect;
        startX = (canvas.width - drawWidth) / 2;
        startY = 0;
    }
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, startX, startY, drawWidth, drawHeight);
}

function initAnimations() {
    // Hide loader
    setTimeout(() => {
        loader.classList.add('loaded');
        
        // Animate hero text in with a futuristic cinematic split-text effect
        const splitText = (selector) => {
            const el = document.querySelector(selector);
            if(!el) return [];
            const text = el.innerText;
            el.innerHTML = '';
            const spans = [];
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.innerText = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.filter = 'blur(15px)';
                span.style.transform = 'scale(1.5)';
                el.appendChild(span);
                spans.push(span);
            });
            return spans;
        };

        const logoChars = splitText(".logo");
        const tagChars = splitText(".tagline");

        // Reveal the glass panel and parent containers immediately
        gsap.to(".hero-glass-panel", { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" });
        gsap.to(".logo", { opacity: 1, y: 0, duration: 0.1 });
        gsap.to(".tagline", { opacity: 1, y: 0, duration: 0.1 });

        // Stagger the logo characters
        if(logoChars.length) {
            gsap.to(logoChars, {
                opacity: 1,
                filter: 'blur(0px)',
                scale: 1,
                duration: 1.5,
                stagger: 0.1,
                ease: "expo.out"
            });
        }

        // Stagger the tagline characters shortly after
        if(tagChars.length) {
            gsap.to(tagChars, {
                opacity: 1,
                filter: 'blur(0px)',
                scale: 1,
                duration: 1.2,
                stagger: 0.03,
                ease: "power3.out",
                delay: 0.5
            });
        }

        gsap.to(".scroll-indicator", { opacity: 1, duration: 1, delay: 1.5 });
    }, 500);

    // Setup canvas sequence scroll animation
    gsap.to(animationFrames, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: ".content-overlay",
            start: "top top",
            end: "bottom bottom", // animates over the whole scroll distance
            scrub: 0.5 // slight smoothing on scrub
        },
        onUpdate: render
    });
    
    // Animate season cards on scroll
    gsap.fromTo(".season-card", 
        { y: 80, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            stagger: 0.2, 
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".services-section",
                start: "top 80%", 
            }
        }
    );
    
    // Refresh triggers when all images are fully loaded
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

    // Animate CTA
    gsap.from(".cta-section h2, .cta-section p, .cta-section button", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".cta-section",
            start: "top 70%"
        }
    });

    // Sparkle Navbar Interaction
    const navItems = document.querySelectorAll('.nav-item');
    const indicator = document.querySelector('.sparkle-indicator');
    const navbar = document.querySelector('.sparkle-navbar');

    if(navItems.length > 0 && indicator) {
        navItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                const rect = e.target.getBoundingClientRect();
                const navRect = navbar.getBoundingClientRect();
                
                indicator.style.opacity = '1';
                indicator.style.width = `${rect.width}px`;
                indicator.style.left = `${rect.left - navRect.left}px`;
            });
        });

        navbar.addEventListener('mouseleave', () => {
            indicator.style.opacity = '0';
        });
    }

    // Smooth Scroll Navigation
    document.querySelectorAll('.nav-item').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Cascade Slider Logic
    const cascadeContainer = document.getElementById('cascade-slider');
    if (cascadeContainer) {
        const slides = cascadeContainer.querySelectorAll('.cascade-slider_item');
        const total = slides.length;
        const itemCount = 5;
        let activeIndex = 0;
        let autoplayInterval;
        const delay = 3000;
        let isDragging = false;
        let startX = 0;
        
        const getSlideClasses = (index, active, tot, visibleCount) => {
            const diff = index - active;
            if (diff === 0) return 'now';
            if (diff === 1 || diff === -tot + 1) return 'next';
            if (visibleCount === 5 && (diff === 2 || diff === -tot + 2)) return 'next2';
            if (diff === -1 || diff === tot - 1) return 'prev';
            if (visibleCount === 5 && (diff === -2 || diff === tot - 2)) return 'prev2';
            return '';
        };

        const updateSlider = () => {
            slides.forEach((slide, index) => {
                slide.className = `cascade-slider_item ${getSlideClasses(index, activeIndex, total, itemCount)}`;
            });
        };

        const navigate = (direction) => {
            if (direction === 'next') {
                activeIndex = (activeIndex + 1) % total;
            } else {
                activeIndex = (activeIndex - 1 + total) % total;
            }
            updateSlider();
        };

        const startAutoplay = () => {
            if (total > 1) {
                clearInterval(autoplayInterval);
                autoplayInterval = setInterval(() => navigate('next'), delay);
            }
        };

        const stopAutoplay = () => clearInterval(autoplayInterval);

        // Initial setup
        updateSlider();
        startAutoplay();

        // Arrow clicks
        const prevArrow = cascadeContainer.querySelector('.cascade-slider_arrow-left');
        const nextArrow = cascadeContainer.querySelector('.cascade-slider_arrow-right');
        
        if (prevArrow) {
            prevArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                navigate('prev');
                startAutoplay();
            });
        }
        if (nextArrow) {
            nextArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                navigate('next');
                startAutoplay();
            });
        }

        // Hover & Drag interactions
        cascadeContainer.addEventListener('mouseenter', stopAutoplay);
        cascadeContainer.addEventListener('mouseleave', (e) => {
            startAutoplay();
            if (isDragging) handleEnd(e.clientX);
        });

        const handleStart = (clientX) => {
            isDragging = true;
            startX = clientX;
            stopAutoplay();
        };

        const handleEnd = (clientX) => {
            if (!isDragging) return;
            const distance = clientX - startX;
            if (Math.abs(distance) > 50) {
                if (distance < 0) navigate('next');
                else navigate('prev');
            }
            isDragging = false;
            startX = 0;
            startAutoplay();
        };

        cascadeContainer.addEventListener('mousedown', (e) => handleStart(e.clientX));
        window.addEventListener('mouseup', (e) => handleEnd(e.clientX));
        
        cascadeContainer.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX), {passive: true});
        window.addEventListener('touchend', (e) => handleEnd(e.changedTouches[0].clientX));
    }

    // Video Card Interactive Logic
    const demoCard = document.getElementById('demo-card');
    const demoVideo = document.getElementById('demo-video');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const vidStatus = document.getElementById('vid-status');

    if(demoCard && demoVideo) {
        demoCard.addEventListener('mouseenter', () => {
            demoVideo.play().catch(err => console.log('Video play failed:', err));
            if(playIcon) playIcon.style.display = 'none';
            if(pauseIcon) pauseIcon.style.display = 'inline-block';
            if(vidStatus) vidStatus.textContent = 'Playing Preview';
        });

        demoCard.addEventListener('mouseleave', () => {
            demoVideo.pause();
            // Optional: Uncomment below line to reset video to start when mouse leaves
            // demoVideo.currentTime = 0; 
            if(playIcon) playIcon.style.display = 'inline-block';
            if(pauseIcon) pauseIcon.style.display = 'none';
            if(vidStatus) vidStatus.textContent = 'Hover to Preview';
        });
    }
}