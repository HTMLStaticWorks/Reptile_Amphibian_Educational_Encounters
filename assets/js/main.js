document.addEventListener('DOMContentLoaded', function() {
    "use strict";

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            htmlElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.replace('bi-moon-fill', 'bi-sun-fill');
        } else {
            icon.classList.replace('bi-sun-fill', 'bi-moon-fill');
        }
    }

    // --- RTL Toggle ---
    const rtlToggle = document.getElementById('rtlToggle');
    const savedRtl = localStorage.getItem('rtl') === 'true';
    
    if (savedRtl) {
        htmlElement.setAttribute('dir', 'rtl');
        rtlToggle.textContent = 'LTR';
    }

    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            const isRtl = htmlElement.getAttribute('dir') === 'rtl';
            if (isRtl) {
                htmlElement.removeAttribute('dir');
                rtlToggle.textContent = 'RTL';
                localStorage.setItem('rtl', 'false');
            } else {
                htmlElement.setAttribute('dir', 'rtl');
                rtlToggle.textContent = 'LTR';
                localStorage.setItem('rtl', 'true');
            }
        });
    }

    // --- Navbar Scroll Effect ---
    // Disabled transition effect as requested
    /*
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled', 'navbar-light', 'bg-white');
            navbar.classList.remove('navbar-dark', 'bg-transparent');
        } else {
            navbar.classList.remove('scrolled', 'navbar-light', 'bg-white');
            navbar.classList.add('navbar-dark', 'bg-transparent');
        }
    });
    */

    // --- Back to Top ---
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Counters ---
    const counters = document.querySelectorAll('.counter-value');
    const speed = 200;

    const startCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Intersection Observer for Counters
    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // --- Form Validation ---
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.innerHTML = 'Success!';
                    btn.classList.replace('btn-primary', 'btn-success');
                    form.reset();
                    form.classList.remove('was-validated');
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.classList.replace('btn-success', 'btn-primary');
                        btn.disabled = false;
                    }, 3000);
                }, 1500);
            }
            form.classList.add('was-validated');
        }, false);
    });

    // --- Smooth Scrolling for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Gallery Lightbox ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');

    if (galleryItems.length > 0 && lightboxModal) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').getAttribute('src');
                lightboxImage.setAttribute('src', imgSrc);
                const bsModal = new bootstrap.Modal(lightboxModal);
                bsModal.show();
            });
        });
    }

    // --- Load More Gallery ---
    const loadMoreBtn = document.querySelector('button.btn-primary.btn-lg');
    if (loadMoreBtn && window.location.pathname.includes('gallery')) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
            setTimeout(() => {
                const galleryRow = document.querySelector('.gallery-item').closest('.row');
                // Mock new images
                const newItems = [1, 2, 3].map(i => `
                    <div class="col-lg-4 col-md-6 reveal active">
                        <div class="gallery-item shadow-sm">
                            <img src="assets/images/gallery-${(i % 6) + 1}.png" alt="Gallery Image" class="img-fluid w-100">
                            <div class="gallery-overlay">
                                <i class="bi bi-plus-circle display-4"></i>
                            </div>
                        </div>
                    </div>
                `).join('');
                galleryRow.insertAdjacentHTML('beforeend', newItems);
                
                // Re-bind lightbox to new items
                const newGalleryItems = galleryRow.querySelectorAll('.gallery-item');
                newGalleryItems.forEach(item => {
                    item.addEventListener('click', () => {
                        const imgSrc = item.querySelector('img').getAttribute('src');
                        lightboxImage.setAttribute('src', imgSrc);
                        new bootstrap.Modal(lightboxModal).show();
                    });
                });

                loadMoreBtn.innerHTML = 'All Images Loaded';
                loadMoreBtn.disabled = true;
            }, 1000);
        });
    }

    // --- Ambassador Modals ---
    const ambassadorBtns = document.querySelectorAll('.ambassador-btn');
    const ambassadorModal = document.getElementById('ambassadorModal');
    
    if (ambassadorBtns.length > 0 && ambassadorModal) {
        const title = ambassadorModal.querySelector('#ambassadorTitle');
        const img = ambassadorModal.querySelector('#ambassadorImage');
        const desc = ambassadorModal.querySelector('#ambassadorDesc');
        const habitat = ambassadorModal.querySelector('#ambassadorHabitat');
        const diet = ambassadorModal.querySelector('#ambassadorDiet');

        ambassadorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.card');
                const imgSrc = card.querySelector('img').getAttribute('src');
                
                title.textContent = btn.getAttribute('data-name');
                img.setAttribute('src', imgSrc);
                desc.textContent = btn.getAttribute('data-desc');
                habitat.textContent = btn.getAttribute('data-habitat');
                diet.textContent = btn.getAttribute('data-diet');

                new bootstrap.Modal(ambassadorModal).show();
            });
        });
    }

    // --- Password Toggle ---
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('passwordInput');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            this.classList.toggle('bi-eye');
            this.classList.toggle('bi-eye-slash');
        });
    }
});
