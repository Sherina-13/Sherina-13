(function () {
    'use strict';

    const $ = selector => document.querySelector(selector);
    const $$ = selector => document.querySelectorAll(selector);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ==========================================
    // 01. BASIC INITIALIZATION
    // ==========================================

    $('#year').textContent = new Date().getFullYear();

    // ==========================================
    // 02. CINEMATIC INTRO & PARTICLE ANIMATION
    // ==========================================

    const intro = $('#intro');
    const canvas = $('#introCanvas');
    const ctx = canvas.getContext('2d');

    let stars = [];

    function sizeIntro() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;

        stars = Array.from(
            { length: Math.min(170, Math.floor(innerWidth / 7)) },
            () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.3,
                v: 0.15 + Math.random() * 0.55,
                a: Math.random() * 6.28
            })
        );
    }

    function drawIntro() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.y -= star.v;

            if (star.y < 0) {
                star.y = canvas.height;
            }

            star.a += 0.02;

            ctx.fillStyle = `rgba(203,164,255,${0.2 + Math.sin(star.a) * 0.3})`;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fill();
        });

        if (!intro.classList.contains('hide')) {
            requestAnimationFrame(drawIntro);
        }
    }

    sizeIntro();
    drawIntro();

    addEventListener('resize', sizeIntro);

    function enter() {
        intro.classList.add('hide');

        sessionStorage.setItem('sherinIntroSeen', '1');

        setTimeout(() => intro.remove(), 1000);
    }

    // Typewriter welcome text

    const introText =
        "I'm Sherin Princy N — PHP Developer & Web Application Developer.";

    const typeTarget = $('#introTypewriter');

    if (typeTarget && !reduced) {
        typeTarget.textContent = '';

        let n = 0;

        const typeNext = () => {
            if (!typeTarget.isConnected || intro.classList.contains('hide')) {
                return;
            }

            typeTarget.textContent = introText.slice(0, ++n);

            if (n < introText.length) {
                setTimeout(typeNext, 34);
            }
        };

        setTimeout(typeNext, 850);
    }

    $('#enterWorld').addEventListener('click', enter);
    $('#skipIntro').addEventListener('click', enter);

    if (sessionStorage.getItem('sherinIntroSeen')) {
        enter();
    }

    // ==========================================
    // 03. RESPONSIVE NAVIGATION
    // ==========================================

    $('#menuToggle').addEventListener('click', () => {
        $('#mainNav').classList.toggle('open');
    });

    $$('#mainNav a').forEach(link => {
        link.addEventListener('click', () => {
            $('#mainNav').classList.remove('open');
        });
    });

    // ==========================================
    // 04. SCROLL PROGRESS, NAVIGATION & AMBIENT AVATAR
    // ==========================================

    const progress = $('#scrollProgress');
    const ambient = $('#ambientAvatar');
    const ambientImg = ambient ? ambient.querySelector('img') : null;

    const poseMap = {
        home: 'standing',
        about: 'standing',
        skills: 'coding',
        journey: 'walking',
        experience: 'pointing',
        projects: 'coding',
        education: 'relaxing',
        playground: 'jumping',
        contact: 'pointing'
    };

    const poseSrc = {
        standing: 'standing.png',
        walking: 'walking.png',
        coding: 'coding.png',
        pointing: 'pointing.png',
        relaxing: 'relaxing.png',
        jumping: 'jumping.png'
    };

    const leftPoseSections = new Set([
        'about',
        'experience',
        'education'
    ]);

    const observedSections = new Map();

    let currentSection = '';

    function setAvatarPose(sectionId) {
        if (!ambient || !ambientImg || !poseMap[sectionId]) return;

        if (currentSection === sectionId) return;

        currentSection = sectionId;

        const imagePath = 'assets/avatar/' + poseSrc[poseMap[sectionId]];

        if (!ambientImg.getAttribute('src')?.endsWith(imagePath)) {
            ambientImg.src = imagePath;
        }

        ambient.classList.toggle(
            'pose-left',
            leftPoseSections.has(sectionId)
        );

        ambient.classList.remove('is-muted');
        ambient.classList.add('visible');
    }

    function updateActiveObservedSection() {
        const viewportCenter = window.innerHeight * 0.5;

        let bestSection = null;
        let bestDistance = Infinity;

        observedSections.forEach((isVisible, section) => {
            if (!isVisible) return;

            const rect = section.getBoundingClientRect();

            const sectionCenter = Math.max(
                rect.top,
                Math.min(viewportCenter, rect.bottom)
            );

            const distance = Math.abs(sectionCenter - viewportCenter);

            if (distance < bestDistance) {
                bestDistance = distance;
                bestSection = section;
            }
        });

        if (bestSection) {
            bestSection.classList.add('section-seen');
            setAvatarPose(bestSection.id);
        }
    }

    function updateScrollProgress() {
        if (!progress) return;

        const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;

        const percentage = maxScroll > 0
            ? (window.scrollY / maxScroll) * 100
            : 0;

        progress.style.width = percentage + '%';
    }

    function updateNavigation() {
        const sections = $$('main section[id]');

        const marker = window.innerHeight * 0.42;

        let active = 'home';

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();

            if (rect.top <= marker && rect.bottom > marker) {
                active = section.id;
            }
        });

        $$('#mainNav a').forEach(link => {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + active
            );
        });
    }

    function scrollUI() {
        updateScrollProgress();
        updateNavigation();
    }

    window.addEventListener('scroll', scrollUI, { passive: true });

    scrollUI();

    // ==========================================
    // 05. INTERSECTION OBSERVERS
    // ==========================================

    if ('IntersectionObserver' in window) {

        // Reveal sections and cards once they enter the viewport.

        const revealObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.13,
                rootMargin: '0px 0px -35px 0px'
            }
        );

        $$('.reveal').forEach(element => {
            revealObserver.observe(element);
        });

        // One observer controls the ambient avatar for every portfolio section.

        const sections = $$('main section[id]');

        sections.forEach(section => {
            observedSections.set(section, false);
        });

        const sectionObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    observedSections.set(
                        entry.target,
                        entry.isIntersecting
                    );
                });

                updateActiveObservedSection();
            },
            {
                root: null,
                rootMargin: '-30% 0px -30% 0px',
                threshold: [0, 0.1, 0.25, 0.5, 0.75]
            }
        );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Set the initial pose immediately, before the first observer callback.

        const initialSection = sections[0];

        if (initialSection) {
            setAvatarPose(initialSection.id);
        }

    } else {

        // Fallback for browsers without IntersectionObserver.

        function fallbackAvatarUpdate() {
            const viewportCenter = window.innerHeight * 0.5;

            let activeSection = null;
            let bestDistance = Infinity;

            $$('main section[id]').forEach(section => {
                const rect = section.getBoundingClientRect();

                if (
                    rect.top <= viewportCenter &&
                    rect.bottom >= viewportCenter
                ) {
                    const distance = Math.abs(
                        (rect.top + rect.bottom) / 2 - viewportCenter
                    );

                    if (distance < bestDistance) {
                        bestDistance = distance;
                        activeSection = section;
                    }
                }
            });

            if (activeSection) {
                setAvatarPose(activeSection.id);
            }
        }

        window.addEventListener(
            'scroll',
            fallbackAvatarUpdate,
            { passive: true }
        );

        fallbackAvatarUpdate();
    }

    // ==========================================
    // 06. ROADMAP AVATAR ANIMATION
    // ==========================================

    const road = $('.roadmap');
    const roadAvatar = $('.roadmap-avatar');

    function moveRoad() {
        if (!road || !roadAvatar) {
            return;
        }

        const r = road.getBoundingClientRect();

        const p = Math.max(
            0,
            Math.min(
                1,
                (innerHeight * 0.72 - r.top) /
                (r.height + innerHeight * 0.3)
            )
        );

        roadAvatar.style.transform =
            `translateY(${p * Math.max(0, r.height - 130)}px) rotate(${Math.sin(p * 18) * 6}deg)`;

        // Walking avatar disappears gradually

        roadAvatar.style.opacity = String(
            Math.max(0, 1 - Math.max(0, (p - 0.78) / 0.18))
        );

        // Jumping avatar appears at the end

        const finish = road.querySelector('.journey-finish img');

        if (finish) {
            finish.style.opacity = String(
                Math.min(1, Math.max(0, (p - 0.78) / 0.18))
            );
        }
    }

    addEventListener('scroll', moveRoad, { passive: true });

    moveRoad();

    // ==========================================
    // 07. HERO STARFIELD ANIMATION
    // ==========================================

    const starCanvas = $('#starfield');

    if (starCanvas) {
        const c = starCanvas.getContext('2d');

        let points = [];

        function resizeStars() {
            starCanvas.width = starCanvas.clientWidth;
            starCanvas.height = starCanvas.clientHeight;

            points = Array.from(
                { length: 110 },
                () => ({
                    x: Math.random() * starCanvas.width,
                    y: Math.random() * starCanvas.height,
                    r: Math.random() * 1.5 + 0.2,
                    s: 0.1 + Math.random() * 0.35
                })
            );
        }

        function paint() {
            c.clearRect(
                0,
                0,
                starCanvas.width,
                starCanvas.height
            );

            points.forEach(point => {
                point.y -= point.s;

                if (point.y < 0) {
                    point.y = starCanvas.height;
                }

                c.fillStyle = 'rgba(205,174,255,.55)';

                c.fillRect(
                    point.x,
                    point.y,
                    point.r,
                    point.r
                );
            });

            requestAnimationFrame(paint);
        }

        resizeStars();
        paint();

        addEventListener('resize', resizeStars);
    }

    // ==========================================
    // 08. GSAP ANIMATIONS & 3D CARD TILT
    // ==========================================

    if (window.gsap && !reduced) {
        gsap.from('.hero-copy > *', {
            y: 22,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.15
        });

        gsap.to('.hero-orbit', {
            rotation: 360,
            duration: 45,
            repeat: -1,
            ease: 'none'
        });
    }

    if (!matchMedia('(pointer:coarse)').matches && !reduced) {
        $$('.stack-card, .project-card, .edu-card').forEach(card => {

            card.addEventListener('pointermove', e => {
                const r = card.getBoundingClientRect();

                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;

                card.style.transform =
                    `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg) translateY(-3px)`;
            });

            card.addEventListener('pointerleave', () => {
                card.style.transform = '';
            });

        });
    }


    // ==========================================
    // 09. CINEMATIC AMBIENT BACKGROUND MUSIC
    // ==========================================

    let audioCtx = null;
    let masterGain = null;
    let musicPlaying = false;
    let melodyTimer = null;
    let melodyIndex = 0;

    const melody = [
        261.63, 329.63, 392.00, 329.63,
        293.66, 349.23, 440.00, 349.23,
        261.63, 329.63, 392.00, 523.25,
        440.00, 392.00, 329.63, 293.66
    ];

    // Play an individual musical note
    function playNote(frequency, duration = 1.8) {
        if (!audioCtx || !masterGain || !musicPlaying) return;

        const oscillator = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(
            frequency,
            audioCtx.currentTime
        );

        noteGain.gain.setValueAtTime(0, audioCtx.currentTime);
        noteGain.gain.linearRampToValueAtTime(
            0.18,
            audioCtx.currentTime + 0.15
        );
        noteGain.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + duration
        );

        oscillator.connect(noteGain);
        noteGain.connect(masterGain);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    }

    // Start cinematic background music
    async function startMusic() {
        try {
            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) {
                throw new Error("Web Audio API is unavailable.");
            }

            audioCtx = audioCtx || new AudioContextClass();

            if (audioCtx.state === "suspended") {
                await audioCtx.resume();
            }

            if (audioCtx.state !== "running") {
                throw new Error("Audio context is not running.");
            }

            if (musicPlaying) return;

            masterGain = audioCtx.createGain();
            masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
            masterGain.connect(audioCtx.destination);

            musicPlaying = true;
            melodyIndex = 0;

            // Start the melody immediately
            playNote(melody[melodyIndex++]);

            // Continue the melody
            melodyTimer = setInterval(() => {
                if (!musicPlaying) return;

                playNote(melody[melodyIndex]);

                melodyIndex = (melodyIndex + 1) % melody.length;
            }, 650);

            $("#soundToggle").innerHTML =
                '♫ <span>Sound on</span>';

            $("#soundToggle").setAttribute(
                "aria-label",
                "Turn background music off"
            );

            if ($("#musicHint")) {
                $("#musicHint").classList.remove("show");
            }

        } catch (error) {
            console.error("Music playback failed:", error);
            alert("Unable to start audio. Please check your browser audio settings.");
        }
    }

    // Stop background music
    function stopMusic() {
        if (!musicPlaying) return;

        musicPlaying = false;

        clearInterval(melodyTimer);

        if (masterGain && audioCtx) {
            masterGain.gain.setTargetAtTime(
                0,
                audioCtx.currentTime,
                0.15
            );

            setTimeout(() => {
                if (masterGain) {
                    masterGain.disconnect();
                    masterGain = null;
                }
            }, 700);
        }

        $("#soundToggle").innerHTML =
            '♫ <span>Sound off</span>';

        $("#soundToggle").setAttribute(
            "aria-label",
            "Turn background music on"
        );
    }

    // Sound toggle button
    $("#soundToggle").addEventListener("click", async () => {
        if (musicPlaying) {
            stopMusic();
        } else {
            await startMusic();
        }
    });

    // ==========================================
    // 10. PORTFOLIO CHATBOT
    // ==========================================

    const knowledge = [
        {
            keys: ['what does', 'who is', 'about', 'introduce'],
            answer: "Sherin Princy N is a PHP Developer and Web Application Developer with 1+ year of hands-on experience. She works across frontend interfaces, PHP/MySQL applications, integrations, deployment and performance improvements."
        },
        {
            keys: ['skill', 'technology', 'stack', 'frontend', 'backend', 'database'],
            answer: "Her toolkit includes HTML5, CSS3, JavaScript ES6+, jQuery, AJAX, Bootstrap 5, PHP, Python, MySQL, SQL, phpMyAdmin, Git, GitHub, VS Code, EmailJS, Brevo, cPanel, Figma, Canva, Search Console, GA4 and GTM."
        },
        {
            keys: ['project', 'work', 'jans', 'medcare', 'thavam', 'university', 'medcity'],
            answer: "Featured work includes Thavam Fertility, Sri Venkateswaraa Medcity, Sri Venkateswaraa University and six affiliated college portals, the JANS admission lead management system, and Medcare patient tracking (under development). These are presented as contributions and team projects where applicable."
        },
        {
            keys: ['experience', 'career', 'job', 'company'],
            answer: "She has worked at Sri Venkateswaraa Medcity as a Web Designer since May 2025, developing PHP/MySQL websites and applications. Before that, she completed a Web Development Internship at MNC Corporate System India Pvt Ltd from April to May 2024."
        },
        {
            keys: ['education', 'degree', 'college', 'mca', 'study'],
            answer: "She completed B.Sc. Computer Science at Women's Christian College (2022–2025) and is pursuing an MCA through Anna University Distance Education (2025–2027)."
        },
        {
            keys: ['contact', 'email', 'phone', 'whatsapp', 'hire', 'reach'],
            answer: "You can email Sherin at sherinaofficial2025@gmail.com or message her on WhatsApp at +91 82480 03914. LinkedIn: linkedin.com/in/sherinprincy13."
        },
        {
            keys: ['resume', 'cv'],
            answer: "You can open or download Sherin's resume using the Resume link in the top navigation."
        },
        {
            keys: ['game', 'play', 'arcade'],
            answer: "Visit the Developer Arcade section to play Code Catcher, Debug the Code, Build the Stack and Find the Bug."
        }
    ];

    function botReply(question) {
        const text = question.toLowerCase();

        const match = knowledge.find(item =>
            item.keys.some(key => text.includes(key))
        );

        if (match) {
            return match.answer;
        }

        return "I can help with Sherin's background, PHP and frontend skills, projects, experience, education, resume or contact details. Try asking: “Tell me about her PHP projects”.";
    }

    function addMessage(text, type) {
        const message = document.createElement('div');

        message.className =
            type === 'user' ? 'user-message' : 'bot-message';

        message.textContent = text;

        $('#chatMessages').appendChild(message);

        $('#chatMessages').scrollTop =
            $('#chatMessages').scrollHeight;
    }

    function sendQuestion(question) {
        if (!question.trim()) {
            return;
        }

        addMessage(question, 'user');

        $('#chatInput').value = '';

        setTimeout(() => {
            addMessage(botReply(question), 'bot');
        }, 280);
    }

    // Chat open / close

    const chat = $('#chatbot');
    const chatLaunch = $('#chatLaunch');

    function closeChat() {
        chat.classList.remove('open');

        chatLaunch.setAttribute('aria-expanded', 'false');
    }

    chatLaunch.setAttribute('aria-expanded', 'false');

    chatLaunch.addEventListener('click', () => {
        chat.classList.toggle('open');

        chatLaunch.setAttribute(
            'aria-expanded',
            chat.classList.contains('open') ? 'true' : 'false'
        );
    });

    $('#chatClose').addEventListener('click', closeChat);

    // Close chatbot when clicking outside

    document.addEventListener('pointerdown', event => {
        if (
            chat.classList.contains('open') &&
            !chat.contains(event.target) &&
            !chatLaunch.contains(event.target)
        ) {
            closeChat();
        }
    });

    // Close chatbot with Escape

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeChat();
        }
    });

    $('#chatForm').addEventListener('submit', event => {
        event.preventDefault();

        sendQuestion($('#chatInput').value);
    });

    $$('.quick-questions button').forEach(button => {
        button.addEventListener('click', () => {
            sendQuestion(button.dataset.question);
        });
    });

    // ==========================================
    // 11. EMAILJS CONTACT FORM
    // ==========================================

    const emailConfig = window.PORTFOLIO_EMAILJS || {};

    const emailReady = !!(
        window.emailjs &&
        emailConfig.publicKey &&
        emailConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
        emailConfig.serviceId &&
        emailConfig.templateId
    );

    if (emailReady) {
        emailjs.init({
            publicKey: emailConfig.publicKey
        });
    }

    $('#contactForm').addEventListener('submit', async event => {
        event.preventDefault();

        const form = event.currentTarget;
        const note = $('#formNote');
        const btn = form.querySelector('button[type=submit]');

        if (!form.reportValidity()) {
            return;
        }

        const data = Object.fromEntries(
            new FormData(form).entries()
        );

        btn.disabled = true;
        btn.textContent = 'SENDING...';

        note.textContent = 'Sending your message securely...';
        note.style.color = '#c7a7ee';

        try {
            if (!emailReady) {
                throw new Error(
                    'EmailJS is not configured. Add your public key in assets/js/emailjs-config.js.'
                );
            }

            await emailjs.send(
                emailConfig.serviceId,
                emailConfig.templateId,
                {
                    name: data.name,
                    from_name: data.name,
                    reply_to: data.email,
                    from_email: data.email,
                    subject: data.subject,
                    message: data.message,
                    time: new Date().toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                    }),
                    to_email: 'sherinaofficial2025@gmail.com'
                }
            );

            note.textContent =
                'Message sent successfully! Thank you for reaching out.';

            note.style.color = '#9be4b2';

            form.reset();

        } catch (error) {

            note.textContent = emailReady
                ? 'Your message could not be sent right now. Please email sherinaofficial2025@gmail.com directly.'
                : 'EmailJS setup is incomplete. Please add your EmailJS public key in assets/js/emailjs-config.js.';

            note.style.color = '#ffbd82';

        } finally {

            btn.disabled = false;

            btn.innerHTML = 'SEND MESSAGE <span>↗</span>';
        }
    });

})();