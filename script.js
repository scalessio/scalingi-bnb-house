/*
 * Modern JavaScript for Scalingi Apartments Website
 * Handles navigation, smooth scrolling, and modern interactions
 */

class ScalingiApp {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    this.setupNavigation();
    this.setupSmoothScrolling();
    this.setupIntersectionObserver();
    this.setupMobileMenu();
    this.setupLanguageSwitcher();
    this.setupExperienceModals();
    this.initializeAnimations();
  }

  // Modern Navigation with active states
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    // Add click handlers for smooth navigation
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        // Only prevent default for internal hash links (starting with #)
        if (targetId.startsWith('#')) {
          e.preventDefault();
          const targetSection = document.querySelector(targetId);
          
          if (targetSection) {
            this.scrollToSection(targetSection);
          }
        }
        // For external links (.html files), allow normal navigation
      });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
      this.updateActiveNavLink(sections, navLinks);
    });
  }

  // Smooth scrolling with enhanced offset for fixed navbar
  scrollToSection(targetSection) {
    // Get accurate navbar height including any padding/margin
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80;
    
    // Add extra offset to ensure content is not hidden behind navbar
    const extraOffset = 20; // Additional padding
    const totalOffset = navbarHeight + extraOffset;
    
    const targetPosition = targetSection.getBoundingClientRect().top + 
                          window.pageYOffset - totalOffset;

    window.scrollTo({
      top: Math.max(0, targetPosition), // Prevent negative scroll
      behavior: 'smooth'
    });
  }

  // Update active navigation link based on scroll position with better accuracy
  updateActiveNavLink(sections, navLinks) {
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80;
    const scrollPosition = window.scrollY + navbarHeight + 50; // Buffer for better detection

    let activeSection = '';

    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      // Check if section is currently in view
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        activeSection = sectionId;
      }
    });

    // Update active link
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${activeSection}`) {
        link.classList.add('active');
      }
    });
  }

  // Enhanced smooth scrolling for all internal links
  setupSmoothScrolling() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          this.scrollToSection(targetSection);
        }
      }
    });
  }

  // Intersection Observer for animations and effects
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe sections for animations
    const animatedElements = document.querySelectorAll(
      '.apartment-card, .experience-item, .about-content, .contact-content'
    );
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  // Mobile menu toggle
  setupMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
      const closeMenu = () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
        navMenu.style.left = '-100%';
        navMenu.style.display = 'none';
      };

      // Calculate and set navbar height for mobile menu positioning
      const updateMenuPosition = () => {
        const navbar = document.querySelector('.navbar');
        if (navbar && window.innerWidth <= 768) {
          const navbarHeight = navbar.offsetHeight;
          navMenu.style.top = `${navbarHeight}px`;
          document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
        } else {
          navMenu.style.top = '';
          document.documentElement.style.removeProperty('--navbar-height');
        }
      };
      
      // Update on load and resize
      updateMenuPosition();
      window.addEventListener('resize', updateMenuPosition);
      
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');

        // Prevent body scroll when nav is open on mobile
        if (document.body.classList.contains('nav-open')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }

        // Safety: force left position to avoid hidden menu due to CSS conflicts
        if (navMenu.classList.contains('active')) {
          navMenu.style.left = '0';
          navMenu.style.display = 'flex';
        } else {
          navMenu.style.left = '-100%';
          navMenu.style.display = 'none';
        }
      });

      // Close menu when clicking on a link
      const navLinks = navMenu.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          closeMenu();
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          closeMenu();
        }
      });
    }
  }

  // Language switcher functionality
  setupLanguageSwitcher() {
    const flagButtons = document.querySelectorAll('.flag-button');
    
    // Initialize translations globally on page load
    this.initializeTranslations('it');
    
    if (flagButtons.length > 0) {
      // Load saved language preference
      const savedLang = localStorage.getItem('preferredLanguage') || 'it';
      
      // Set active state for saved language
      flagButtons.forEach(button => {
        const buttonLang = button.getAttribute('data-lang');
        if (buttonLang === savedLang) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      });
      
      // Apply saved language if not Italian
      if (savedLang !== 'it') {
        this.switchLanguage(savedLang);
      }
      
      // Add click event listeners to flag buttons
      flagButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const selectedLang = e.currentTarget.getAttribute('data-lang');
          
          // Update active states
          flagButtons.forEach(btn => btn.classList.remove('active'));
          e.currentTarget.classList.add('active');
          
          // Switch language
          this.switchLanguage(selectedLang);
        });
      });
    }
  }

  // Experience Modal System
  setupExperienceModals() {
    const experienceItems = document.querySelectorAll('.experience-item[data-experience]');
    const modal = document.getElementById('experience-modal');
    const modalOverlay = modal?.querySelector('.modal-overlay');
    const modalClose = modal?.querySelector('.modal-close');
    const modalDetails = modal?.querySelectorAll('.modal-detail');

    if (!modal || !experienceItems.length) return;

    // Open modal when clicking on experience items
    experienceItems.forEach(item => {
      item.addEventListener('click', () => {
        const experienceType = item.getAttribute('data-experience');
        this.openExperienceModal(modal, modalDetails, experienceType);
      });
    });

    // Close modal when clicking overlay or close button
    modalOverlay?.addEventListener('click', () => {
      this.closeExperienceModal(modal);
    });

    modalClose?.addEventListener('click', () => {
      this.closeExperienceModal(modal);
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        this.closeExperienceModal(modal);
      }
    });
  }

  openExperienceModal(modal, modalDetails, experienceType) {
    // Hide all modal details
    modalDetails.forEach(detail => {
      detail.classList.remove('active');
    });

    // Show the selected modal detail
    const targetModal = modal.querySelector(`[data-modal="${experienceType}"]`);
    if (targetModal) {
      targetModal.classList.add('active');
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeExperienceModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Initialize translations globally (called once on page load)
  initializeTranslations(lang) {
    // Don't re-initialize if already done
    if (window.scalingiApp && window.scalingiApp.translations) {
      return;
    }
    
    // This will be populated by switchLanguage
    window.scalingiApp = window.scalingiApp || {};
    
    // Call switchLanguage to populate translations
    this.switchLanguage(lang);
  }

  // Switch language content - Complete translation system
  switchLanguage(lang) {
    const translations = {
      it: {
        // Navigation
        'nav-home': 'Home',
        'nav-about': 'Chi Siamo',
        'nav-apartments': 'Appartamenti',
        'nav-reviews': 'Recensioni',
        'nav-experience': 'Esperienza',
        'nav-contact': 'Contatti',
        
        // Hero Section
        'hero-discover': 'Scopri',
        'hero-title': 'Sperlonga',
        'hero-subtitle': 'ed i nostri appartamenti vicinissimi al mare',
        'hero-cta': 'Esplora gli Appartamenti',
        
        // About Section
        'about-title-accent': 'Chi',
        'about-title-main': 'Siamo',
        'about-description': 'Una piccola realtà a gestione familiare, dove l\'ospitalità genuina incontra la comodità moderna a due passi dal mare di Sperlonga',
        
        // About Cards
        'family-title': 'Gestione Familiare',
        'family-desc': 'Siamo Antonio e la famiglia Scalingi. Offriamo i nostri alloggi da <strong>oltre 15 anni</strong> con passione e dedizione. Viviamo al piano superiore della stessa struttura, garantendo assistenza immediata e consigli autentici per vivere al meglio Sperlonga.',
        'location-title': 'Posizione Privilegiata',
        'location-desc': 'A soli <strong>200 metri dalla spiaggia</strong> e all\'inizio del lungomare con pista ciclabile. Centro storico e porto raggiungibili in 15-20 minuti a piedi. Bar, ristoranti, pizzerie e supermercati nelle immediate vicinanze.',
        'apartments-title': 'Due Soluzioni Comfort',
        'apartments-desc': '<strong>Bilocale</strong> soleggiato per coppie e piccole famiglie con giardino privato. <strong>Trilocale</strong> luminoso con due camere per famiglie fino a 4 persone. Unità indipendenti per massima privacy.',
        'services-title': 'Servizi Completi',
        'services-desc': '<strong>Posto auto privato gratuito</strong>, giardino recintato con tavolo esterno, aria condizionata, WiFi veloce, lavatrice, TV e cucina completamente attrezzata. Self check-in tramite cassetta di sicurezza.',
        'remote-title': 'Remote Working',
        'remote-desc': 'Spazio di lavoro dedicato con WiFi ad alta velocità. Ambiente tranquillo ideale per lo <strong>smart working</strong> con la possibilità di godersi il mare durante le pause. Perfetto per chi lavora in mobilità.',
        'activities-title': 'Attività & Relax',
        'activities-desc': 'Deposito bici nel giardino per percorrere la <strong>pista ciclabile</strong> sul lungomare. Falesie per arrampicata nei dintorni. <strong>Animali domestici benvenuti</strong> con piccolo supplemento. Tavoli all\'aperto per cene sotto le stelle.',
        
        // Philosophy Section
        'philosophy-title': 'La Nostra Filosofia',
        'philosophy-text': '"Accoglienza calorosa, attenzione ai dettagli e disponibilità costante. Ogni ospite è per noi un amico che torna a casa. La nostra profonda conoscenza del territorio e la passione per l\'ospitalità ci permettono di offrire un\'esperienza autentica e indimenticabile a Sperlonga."',
        'philosophy-author': '— Antonio, Host',
        
        // Apartments Section
        'apartments-title-accent': 'I Nostri',
        'apartments-title-main': 'Appartamenti',
        'apartments-description': 'Scegli l\'appartamento perfetto per la tua esperienza a Sperlonga',
        'bilocale-title': 'Bilocale',
        'bilocale-description': 'Accogliente appartamento al piano terra con giardino privato, perfetto per coppie. Dispone di una camera da letto matrimoniale, soggiorno con divano letto, cucina completamente attrezzata e bagno con doccia.',
        'trilocale-title': 'Trilocale',
        'trilocale-description': 'Spazioso appartamento al piano terra con due camere da letto e ampio giardino con tavolo per cene all\'aperto. Ideale per famiglie fino a 4 ospiti con tutti i comfort.',
        'apartment-cta': 'Vedi Dettagli',
        
        // Feature tags
        'guests-2-4': '2-4 Ospiti',
        'bedroom-1': '1 Camera',
        'private-garden': 'Giardino Privato',
        'parking': 'Parcheggio',
        'wifi': 'WiFi',
        'ac': 'A/C',
        'guests-4': '4 Ospiti',
        'bedrooms-2': '2 Camere',
        'large-garden': 'Giardino Ampio',
        'outdoor-table': 'Tavolo Esterno',
        'washing-machine': 'Lavatrice',
        'tv': 'TV',
        // Safety card (Bilocale/Trilocale)
        'feature-safety-title': 'Sicurezza',
        'safety-1': 'Rilevatore di monossido di carbonio',
        'safety-2': 'Rilevatore di fumo',
        'safety-3': 'Area esterna videosorvegliata',
        'safety-4': 'Estintore',
        
        // Reviews Section
        'reviews-title-accent': 'Le',
        'reviews-title-main': 'Recensioni dei Nostri Ospiti',
        'reviews-description': 'Cosa dicono le persone che hanno soggiornato nei nostri appartamenti',
        'review-1': '"Posizione ideale: mare e centro raggiungibili a piedi. I proprietari sono molto gentili e disponibili."',
        'review-2': '"Posizione vicino al mare, pulizia ottimale e tutto il necessario per la colazione. Host disponibilissimo e ci ha permesso di tenere l\'auto dopo il check‑out."',
        'review-3': '"Appartamento nuovo, pulito e confortevole a due passi dal lungomare e dal borgo storico. Proprietari gentilissimi e comodo parcheggio privato."',
        'review-4': '"Buona posizione a 5 minuti a piedi dalla spiaggia. Prezzo vantaggioso e graditi spuntini per la colazione."',
        'review-5': '"Appartamento carino, pulito e in ottima posizione: perfetto per una vacanza rilassante a Sperlonga."',
        'review-6': '"Siamo stati molto bene. Tutto nelle vicinanze, dalla spiaggia al centro. Nell\'alloggio c\'è tutto il necessario e i proprietari sono molto disponibili."',
        'review-7': '"Ci siamo trovati bene nel piccolo appartamento di Antonio; la cucina è fornita di tutto e la posizione era perfetta."',
        
        // Booking Platforms Section
        'book': 'Prenota',
        'official-channels': 'sui Nostri Canali Ufficiali',
        'booking-intro': 'Siamo presenti sulle principali piattaforme di prenotazione online',
        'booking-com-title': 'Booking.com',
        'booking-com-desc': 'Prenota direttamente su una delle piattaforme più affidabili al mondo',
        'booking-com-link': 'Vai su Booking.com',
        'airbnb-title': 'Airbnb',
        'airbnb-desc': 'Scopri i nostri appartamenti sulla piattaforma di casa condivisa',
        'airbnb-trilocale': 'Trilocale',
        'airbnb-bilocale': 'Bilocale',
        'direct-contact-title': 'Contatto Diretto',
        'direct-contact-desc': 'Per disponibilità, offerte speciali e condizioni personalizzate',
        'direct-contact-link': 'Contattaci Ora',
        
        // Experience Section
        'experience-title-accent': 'L\'',
        'experience-title-main': 'Esperienza Sperlonga',
        'experience-description': 'Immergiti nella bellezza senza tempo di una delle città costiere più incantevoli d\'Italia. Dalle spiagge incontaminate alla storia antica, ogni momento è un ricordo che aspetta di essere creato.',
        
        // Experience Cards
        'beaches-title': 'Spiagge Incontaminate',
        'beaches-desc': 'Sabbie dorate e acque cristalline a pochi passi dalla tua porta',
        'historic-title': 'Centro Storico',
        'historic-desc': 'Passeggia per strade medievali ricche di fascino e carattere',
        'cuisine-title': 'Cucina Locale',
        'cuisine-desc': 'Assapora autentici sapori italiani nei ristoranti sul lungomare',
        'nature-title': 'Sentieri Naturali',
        'nature-desc': 'Esplora sentieri costieri panoramici e calette nascoste',
        'archaeology-title': 'Storia e Archeologia',
        'archaeology-desc': 'Scopri i tesori romani e le leggende di Ulisse',
        'watersports-title': 'Mare e Sport Acquatici',
        'watersports-desc': 'Immersioni, kayak, vela e windsurf nelle acque cristalline',
        'discover-more': 'Scopri di più',
        
        // Experience Modals
        'beaches-modal-title': 'Spiagge Incontaminate',
        'beaches-modal-desc': 'La costa di Sperlonga è famosa per sabbia chiara e acqua limpidissima. Spiagge come l\'Angolo e le Bambole, raggiungibili solo a piedi o in barca, permettono di immergersi in una natura incontaminata.',
        'beaches-modal-text': 'Lungo la Riviera di Ulisse le acque cristalline e le baie nascoste sono ideali per nuotare, fare snorkeling o partecipare a tour in barca alla scoperta di grotte azzurre e angoli segreti.',
        'beaches-highlight-1': 'Acque cristalline per snorkeling',
        'beaches-highlight-2': 'Tour in barca alle grotte azzurre',
        'beaches-highlight-3': 'Spiagge nascoste come l\'Angolo e le Bambole',
        
        'historic-modal-title': 'Centro Storico',
        'historic-modal-desc': 'Il borgo, riconosciuto tra i "Borghi più belli d\'Italia", è un intricato dedalo di vicoli bianchissimi, archi e scalinate panoramiche che si affacciano sul mare.',
        'historic-modal-text': 'Passeggiando nel centro storico si respira l\'atmosfera mediterranea: case tinte di bianco, fiori alle finestre e scorci spettacolari sulle coste di levante e ponente. È il luogo ideale per una passeggiata serale tra botteghe, ristoranti e caffè.',
        'historic-highlight-1': 'Riconosciuto tra i "Borghi più belli d\'Italia"',
        'historic-highlight-2': 'Scorci panoramici su levante e ponente',
        'historic-highlight-3': 'Perfetto per passeggiate serali',
        
        'cuisine-modal-title': 'Cucina Locale',
        'cuisine-modal-desc': 'La gastronomia di Sperlonga riflette la tradizione marinara della Riviera di Ulisse con piatti autentici preparati con ingredienti freschi del territorio.',
        'cuisine-specialty-1-title': '<i class="fas fa-fish"></i> Zuppa di pesce alla sperlongana',
        'cuisine-specialty-1-desc': 'Preparata con pesci di scoglio, molluschi e crostacei',
        'cuisine-specialty-2-title': '<i class="fas fa-seedling"></i> Bombolotti al ragù di seppie',
        'cuisine-specialty-2-desc': 'Con un sugo delicato ma saporito',
        'cuisine-specialty-3-title': '<i class="fas fa-utensils"></i> Spaghetti alle cicale di mare',
        'cuisine-specialty-3-desc': 'Con canocchie saltate in olio e vino',
        'cuisine-specialty-4-title': '<i class="fas fa-pizza-slice"></i> Tiella di Gaeta',
        'cuisine-specialty-4-desc': 'Torta salata a due strati con ripieni di polpo o verdure',
        'cuisine-modal-text': 'A questi si aggiungono le celebri olive e alici di Gaeta, spesso servite come antipasto.',
        
        'nature-modal-title': 'Sentieri Naturali e Parco Regionale',
        'nature-modal-desc': 'Il Parco regionale Riviera di Ulisse, che abbraccia il tratto costiero tra Gaeta e Sperlonga, offre una biodiversità straordinaria e sentieri panoramici.',
        'nature-modal-text': 'Uno dei percorsi più suggestivi conduce alla "Montagna Spaccata", fenditura nella roccia con un santuario medievale e viste mozzafiato. Da Sperlonga partono escursioni guidate a piedi o in bicicletta lungo il <em>Sentiero di Ulisse</em>, che collega il centro storico al Museo Archeologico, attraversando uliveti e macchia costiera.',
        'nature-highlight-1': 'Sentiero alla "Montagna Spaccata"',
        'nature-highlight-2': 'Sentiero di Ulisse tra centro e museo',
        'nature-highlight-3': 'Escursioni a piedi o in bicicletta',
        'nature-highlight-4': 'Tour in barca alle grotte marine',
        
        'archaeology-modal-title': 'Storia e Archeologia',
        'archaeology-modal-desc': 'Oltre alle bellezze naturali, Sperlonga custodisce la Villa di Tiberio, residenza imperiale costruita accanto a una grotta che fu trasformata in ninfeo.',
        'archaeology-modal-text': 'Gli scavi hanno restituito gruppi scultorei oggi esposti nel Museo Archeologico Nazionale. Visitare la villa e la grotta offre un viaggio nella storia romana e nelle leggende legate a Ulisse.',
        'archaeology-highlight-1': 'Villa di Tiberio - residenza imperiale',
        'archaeology-highlight-2': 'Museo Archeologico Nazionale',
        'archaeology-highlight-3': 'Leggende di Ulisse',
        'archaeology-highlight-4': 'Gruppi scultorei romani',
        
        'watersports-modal-title': 'Mare e Sport Acquatici',
        'watersports-modal-desc': 'Le acque trasparenti di Sperlonga e i suoi dintorni regalano avventure uniche agli amanti del mare e degli sport acquatici.',
        'watersports-modal-text': 'Esplora la costa, visita grotte affascinanti come la Grotta di Tiberio con mosaici marini e la Grotta delle Bambole, e fai snorkeling nelle acque blu della Grotta Azzurra. Al porto, noleggia gommoni o barche per scoprire baie nascoste o affidati agli operatori locali per escursioni personalizzate lungo la costa.',
        'watersports-highlight-1': 'Tour in barca e immersioni nelle grotte marine',
        'watersports-highlight-2': 'Noleggi e charter dal porto di Sperlonga',
        'watersports-highlight-3': 'Sci nautico, canoa, vela e sailing school',
        'watersports-highlight-4': 'Oasi Blu Villa di Tiberio e Parco Regionale',
        
        // Features - Transport
        'feature-transport-title': 'Trasporti & Collegamenti',
        'transport-1': 'Fermata autobus di fronte casa (50 metri)',
        'transport-2': 'Stazione ferroviaria Fondi–Sperlonga a 11 km',
        'transport-3': 'Aeroporti di Napoli e Roma a 110 km',
        'transport-4': 'Servizio navetta (pagamento extra) su richiesta',
              
        // Location extras (Bilocale page)
        'location-beach-title': 'Spiaggia',
        'location-beach-desc': '150 metri - 3 minuti a piedi',
        'location-beach-detail': 'Sabbia dorata e mare cristallino',
        'location-center-title': 'Centro Storico',
        'location-center-desc': '1.4 Km - 20 minuti a piedi',
        'location-center-detail': 'Borgo medievale e ristoranti',
        'location-shop-title': 'Supermercato',
        'location-shop-desc': '500 metri - 7 minuti a piedi',
        'location-shop-detail': 'Tutti i prodotti essenziali',
        'location-museum-title': 'Villa di Tiberio',
        'location-museum-desc': '2.8 km - 40 minuti a piedi',
        'location-museum-detail': 'Sito archeologico e museo',
        'location-port-title': 'Porto',
        'location-port-desc': '1.5 km - 15 minuti a piedi',
        'location-port-detail': 'Passeggiate sul molo e noleggio barche',
        'location-health-title': 'Farmacie e Ambulatorio',
        'location-health-desc': '300 metri - 5 minuti a piedi',
        'location-health-detail': 'Farmacie e presidio ambulatorio vicini',
        
        // Contact Section
        'contact-title-accent': 'Mettiti In',
        'contact-title-main': 'Contatto',
        'contact-description': 'Pronto a vivere la magia di Sperlonga? Contattaci per prenotare la tua fuga perfetta.',
        'contact-address-label': 'Indirizzo',
        'contact-address': 'Via Lepanto 364, Sperlonga (LT), Italia  <br> Condominio "IRIS"',
        'contact-phone-label': 'Telefono',
        'contact-email-label': 'Email',
        'contact-cta': 'Contatta Ora',
        
        // Bilocale page translations
        'bilocale-hero-subtitle': 'Il Bilocale',
        'bilocale-hero-title': 'Family Duo',
        'bilocale-hero-description': 'Comfort smart a due passi dal mare',
        'bilocale-hero-cta': 'Scopri gli Spazi',
        'bilocale-hero-book': 'Contatta Ora',
        
        'overview-title-accent': 'Il Tuo',
        'overview-title-main': 'Bilocale',
        'overview-description': 'Un appartamento moderno e accogliente, perfetto per coppie e piccole famiglie che cercano comfort, stile e una posizione strategica a Sperlonga. </br>Ideale anche per giovani coppie, dispone di culla e seggiolone su richiesta ed è situato a due passi dalla spiaggia, così da poter rientrare facilmente durante le ore più calde della giornata.',
        
        'bilocale-spaces-title': 'Spazi Ottimizzati',
        'bilocale-spaces-desc': '<strong>Camera matrimoniale</strong> con armadi, <strong>soggiorno con divano letto</strong> per ospiti aggiuntivi, <strong>cucina completamente attrezzata</strong> e bagno con doccia. Ogni ambiente è progettato per il massimo comfort.',
        
        'bilocale-location-title': 'Posizione Strategica',
        'bilocale-location-desc': 'A soli <strong>150 metri dalla spiaggia</strong> e <strong>1.4 km dal centro storico</strong>. Il Lungomare con supermercati, ristoranti e tutti i servizi essenziali nelle immediate vicinanze per un soggiorno senza pensieri.',
        
        'bilocale-comfort-title': 'Comfort Moderni',
        'bilocale-comfort-desc': '<strong>Aria condizionata</strong>, WiFi ad alta velocità, TV Smart, cucina con tutti gli elettrodomestici. Biancheria e asciugamani inclusi. <strong>Perfetto anche per smart working</strong> con spazio dedicato al lavoro.',
        
        'bilocale-parking-title': 'Parcheggio Incluso',
        'bilocale-parking-desc': '<strong>Posto auto privato gratuito</strong> all\'interno della proprietà. Non dovrai più preoccuparti di trovare parcheggio durante l\'alta stagione. Spazio anche per biciclette nel giardino comune.',
        
        'gallery-title-accent': 'Galleria',
        'gallery-title-main': 'Fotografica',
        'gallery-description': 'Scopri ogni angolo del tuo bilocale attraverso queste immagini che mostrano gli spazi, i comfort e l\'attenzione ai dettagli',
        
        'gallery-kitchen-title': 'Cucina Attrezzata',
        'gallery-kitchen-desc': 'Cucina completa con frigorifero, piano cottura, e tutti gli utensili necessari per preparare i tuoi pasti preferiti durante il soggiorno.',
        
        'gallery-living-title': 'Soggiorno Luminoso',
        'gallery-living-desc': 'Zona living confortevole con divano letto, perfetta per rilassarsi dopo una giornata al mare o per ospitare un terzo ospite.',
        
        'gallery-bedroom-title': 'Camera Matrimoniale',
        'gallery-bedroom-desc': 'Camera da letto spaziosa e confortevole con letto matrimoniale, armadio capiente e tutti i comfort per un riposo perfetto e con possibilita\' di inseriere una culla.',
        
        'gallery-bathroom-title': 'Bagno Completo',
        'gallery-bathroom-desc': 'Bagno con doccia, asciugacapelli e set di cortesia per il massimo della comodità durante il soggiorno.',
        
        'gallery-details-title': 'Dettagli di Stile',
        'gallery-details-desc': 'Ogni dettaglio è curato con attenzione per creare un ambiente accogliente e raffinato che fa sentire a casa.',
        
        'gallery-exterior-title': 'Spazio Esterno',
        'gallery-exterior-desc': 'Vista esterna dell\'appartamento con accesso al giardino condiviso, parcheggio bici e posto auto privato incluso nel prezzo.',
        
        'book-bilocale': 'Prenota il',
        'book-bilocale-title': 'Bilocale',
        'booking-bilocale-intro': 'Scegli la piattaforma che preferisci per prenotare il tuo soggiorno nel bilocale',
        
        'booking-com-bilocale-desc': 'Prenota il bilocale su una delle piattaforme più affidabili al mondo',
        'airbnb-bilocale-desc': 'Scopri il bilocale sulla piattaforma di casa condivisa',
        'airbnb-bilocale-link': 'Prenota su Airbnb',
        'direct-contact-bilocale-desc': 'Contattaci per disponibilità, offerte speciali e condizioni personalizzate',
        
        'features-title-accent': 'Caratteristiche',
        'features-title-main': 'e Servizi',
        'features-description': 'Tutti i dettagli che rendono il tuo soggiorno confortevole e indimenticabile',
        
        'feature-spaces-title': 'Spazi Interni',
        'bilocale-space-1': '✓ Camera da letto matrimoniale',
        'bilocale-space-2': '✓ Soggiorno con divano letto',
        'bilocale-space-3': '✓ Cucina completamente attrezzata',
        'bilocale-space-4': '✓ Bagno con doccia',
        'bilocale-space-5': '✓ Giardino privato',
        
        'feature-tech-title': 'Tecnologia & Comfort',
        'comfort-1': '✓ Aria condizionata e Riscaldamento',
        'comfort-2': '✓ Biancheria e asciugamani inclusi',
        'comfort-3': '✓ Wi-Fi gratuito ad alta velocità',
        'comfort-4': '✓ TV Smart',
        'comfort-5': '✓ Culla per bambini (su richiesta)',
        
        'feature-kitchen-title': 'Cucina Completa',
        'kitchen-1': '✓ Frigorifero con freezer',
        'kitchen-2': '✓ Piano cottura a gas',
        'kitchen-3': '✓ Macchina del caffè',
        'kitchen-4': '✓ Stoviglie e posate complete',
        'kitchen-5': '✓ Seggiolone bambino',
        
        'feature-services-title': 'Servizi Extra',
        'service-1': '✓ Parcheggio privato gratuito',
        'service-2': '✓ Lavatrice e stenditoio disponibile',
        'service-3': '✓ Asciugacapelli',
        'service-4': '✓ Set cortesia bagno',
        'service-5': '✓ Spazio biciclette nel giardino',
        
        'location-title-accent': 'Posizione',
        'location-title-main': 'Strategica',
        'location-description': 'Tutto ciò di cui hai bisogno è a pochi passi dall\'appartamento',
        
        'contact-bilocale-accent': 'Contattaci',
        'contact-bilocale-main': 'Direttamente',
        'contact-bilocale-description': 'Hai domande? Non preoccuparti, non stai bloccando questo appartamento né lo stai prenotando. Siamo qui per te.',
        
        // Footer translations
        'footer-tagline': 'La Tua Casa al Mare a Sperlonga',
        'footer-appartamenti': 'Appartamenti',
        'footer-bilocale': 'Bilocale',
        'footer-trilocale': 'Trilocale',
        'footer-tutti': 'Tutti gli Appartamenti',
        'footer-informazioni': 'Informazioni',
        'footer-chi-siamo': 'Chi Siamo',
        'footer-esperienza': 'Esperienza Sperlonga',
        'footer-recensioni': 'Recensioni',
        'footer-contatti': 'Contatti',
        'footer-indirizzo': 'Via Lepanto 364<br>Sperlonga (LT), Italia<br>Condominio "IRIS"',
        'footer-copyright': '© 2024 Scalingi Apartments. Tutti i diritti riservati.',
        'footer-privacy': 'Privacy Policy',
        'footer-terms': 'Termini di Servizio',
        
        // Trilocale page translations
        'trilocale-hero-subtitle': 'Il Trilocale',
        'trilocale-hero-title': 'Family Home',
        'trilocale-hero-description': 'Due camere da letto per un soggiorno perfetto',
        'trilocale-hero-cta': 'Scopri gli Spazi',
        'trilocale-hero-book': 'Contatta Ora',
        
        'trilocale-overview-title-accent': 'Il Tuo',
        'trilocale-overview-title-main': 'Trilocale',
        'trilocale-overview-description': 'Un appartamento spazioso e luminoso, ideale per famiglie con bambini che cercano comfort, privacy e uno spazio esterno dove i piccoli possono giocare in sicurezza. </br>Perfetto per vacanze in famiglia, dispone di due camere separate, ampio soggiorno, giardino privato recintato e tutti i servizi per un soggiorno rilassante.',
        
        'trilocale-rooms-title': 'Due Camere Private',
        'trilocale-rooms-desc': '<strong>Camera matrimoniale</strong> per i genitori e <strong>camera con due letti singoli</strong> per i bambini. Entrambe con armadi capienti, aria condizionata e finestre luminose per il massimo comfort.',
        
        'trilocale-living-title': 'Spazi Condivisi Ampi',
        'trilocale-living-desc': '<strong>Soggiorno ampio</strong> con divano e tavolo da pranzo, <strong>cucina completamente attrezzata</strong> per la famiglia, bagno completo con doccia. Ideale per momenti di convivialità.',
        
        'trilocale-garden-title': 'Giardino Privato',
        'trilocale-garden-desc': '<strong>Giardino recintato</strong> con tavolo per cene all\'aperto, perfetto per bambini che possono giocare in sicurezza. Spazio ideale per godere delle serate estive.',
        
        'trilocale-parking-title': 'Servizi Completi',
        'trilocale-parking-desc': '<strong>Parcheggio privato gratuito</strong>, lavatrice, WiFi veloce, TV Smart, deposito biciclette e possibilità di ospitare <strong>animali domestici</strong> su richiesta.',
        
        'trilocale-gallery-description': 'Esplora ogni ambiente del trilocale: dalle camere spaziose al giardino privato, scopri tutti gli spazi che renderanno perfetto il tuo soggiorno in famiglia',
        
        'trilocale-gallery-master-title': 'Camera Matrimoniale',
        'trilocale-gallery-master-desc': 'Camera spaziosa per i genitori con letto matrimoniale, armadi capienti e tutti i comfort per il riposo.',
        
        'trilocale-gallery-twin-title': 'Camera Due Letti',
        'trilocale-gallery-twin-desc': 'Camera luminosa con due letti singoli, perfetta per bambini o ospiti aggiuntivi.',
        
        'trilocale-gallery-living-title': 'Soggiorno Ampio',
        'trilocale-gallery-living-desc': 'Zona living confortevole con divano, tavolo da pranzo e accesso al giardino.',
        
        'trilocale-gallery-kitchen-title': 'Cucina Completa',
        'trilocale-gallery-kitchen-desc': 'Cucina attrezzata con tutti gli elettrodomestici e utensili per preparare pasti per tutta la famiglia.',
        
        'trilocale-gallery-bathroom-title': 'Bagno Completo',
        'trilocale-gallery-bathroom-desc': 'Bagno moderno con doccia, lavabo, WC e bidet. Asciugacapelli e set cortesia inclusi.',
        
        'trilocale-gallery-garden-title': 'Giardino Privato',
        'trilocale-gallery-garden-desc': 'Ampio giardino recintato con tavolo per cene all\'aperto, perfetto per famiglie con bambini.',
        
        'trilocale-gallery-exterior-title': 'Vista Esterna',
        'trilocale-gallery-exterior-desc': 'Vista dell\'appartamento con accesso indipendente e parcheggio privato incluso.',
        
        'book-trilocale': 'Prenota il',
        'book-trilocale-title': 'Trilocale',
        'booking-trilocale-intro': 'Scegli la piattaforma che preferisci per prenotare il tuo soggiorno nel trilocale',
        
        'booking-com-trilocale-desc': 'Prenota il trilocale su una delle piattaforme più affidabili al mondo',
        'airbnb-trilocale-desc': 'Scopri il trilocale sulla piattaforma di casa condivisa',
        'airbnb-trilocale-link': 'Prenota su Airbnb',
        'direct-contact-trilocale-desc': 'Contattaci per disponibilità, sconti famiglia e condizioni speciali',
        
        'trilocale-features-title-accent': 'Caratteristiche',
        'trilocale-features-title-main': 'e Servizi',
        'trilocale-features-description': 'Tutti i dettagli che rendono il trilocale perfetto per la tua famiglia',
        
        'trilocale-feature-rooms-title': 'Camere da Letto',
        'trilocale-room-1': '✓ Camera matrimoniale spaziosa',
        'trilocale-room-2': '✓ Camera con due letti singoli',
        'trilocale-room-3': '✓ Armadi capienti in entrambe',
        'trilocale-room-4': '✓ Aria condizionata in ogni camera',
        'trilocale-room-5': '✓ Biancheria e cuscini inclusi',
        
        'trilocale-feature-living-title': 'Spazi Condivisi',
        'trilocale-living-1': '✓ Soggiorno ampio e luminoso',
        'trilocale-living-2': '✓ Tavolo da pranzo per 4 persone',
        'trilocale-living-3': '✓ Divano comodo per il relax',
        'trilocale-living-4': '✓ TV Smart con Netflix',
        'trilocale-living-5': '✓ Bagno completo con doccia',
        
        'trilocale-feature-kitchen-title': 'Cucina Attrezzata',
        'trilocale-kitchen-1': '✓ Frigorifero grande con freezer',
        'trilocale-kitchen-2': '✓ Piano cottura e forno',
        'trilocale-kitchen-3': '✓ Microonde e tostapane',
        'trilocale-kitchen-4': '✓ Stoviglie per 4+ persone',
        'trilocale-kitchen-5': '✓ Macchina del caffè e bollitore',
        
        'trilocale-feature-outdoor-title': 'Spazio Esterno',
        'trilocale-outdoor-1': '✓ Giardino privato recintato',
        'trilocale-outdoor-2': '✓ Tavolo per cene all\'aperto',
        'trilocale-outdoor-3': '✓ Parcheggio auto privato',
        'trilocale-outdoor-4': '✓ Deposito biciclette',
        'trilocale-outdoor-5': '✓ Animali domestici benvenuti',
        
        'contact-trilocale-accent': 'Contattaci',
        'contact-trilocale-main': 'Direttamente',
        'contact-trilocale-description': 'Hai domande? Non preoccuparti, non stai bloccando questo appartamento né lo stai prenotando. Siamo qui per te.',
        
        // Booking modal translations
        'booking-modal-title': 'Prenota il tuo soggiorno',
        'booking-modal-subtitle': 'Non preoccuparti, non stai bloccando l\'appartamento né lo stai prenotando definitivamente. Ti risponderemo sicuramente nel giro di 24h.',
        'booking-details-title': 'Dettagli Soggiorno',
        'booking-apartment-label': 'Quale appartamento vuoi prenotare? *',
        'booking-select-apartment': 'Seleziona appartamento',
        'booking-bilocale-option': 'Bilocale - Matrimoniale e Divano-Letto',
        'booking-trilocale-option': 'Trilocale - Matrimoniale e Camera con due letti',
        'booking-checkin-label': 'Data Check-in *',
        'booking-checkout-label': 'Data Check-out *',
        'booking-adults-label': 'Adulti *',
        'booking-select': 'Seleziona',
        'booking-1-adult': '1 Adulto',
        'booking-2-adults': '2 Adulti',
        'booking-3-adults': '3 Adulti',
        'booking-4-adults': '4 Adulti',
        'booking-children-label': 'Bambini (2-12 anni) *',
        'booking-none': 'Nessuno',
        'booking-1-child': '1 Bambino',
        'booking-2-children': '2 Bambini',
        'booking-3-children': '3 Bambini',
        'booking-infants-label': 'Neonati (0-2 anni) *',
        'booking-1-infant': '1 Neonato',
        'booking-2-infants': '2 Neonati',
        'booking-pets-label': 'Animali Domestici *',
        'booking-1-pet': '1 Animale',
        'booking-2-pets': '2 Animali',
        'booking-contact-title': 'I tuoi dati di contatto',
        'booking-name-label': 'Nome e Cognome *',
        'booking-name-placeholder': 'Mario Rossi',
        'booking-phone-label': 'Numero WhatsApp *',
        'booking-phone-placeholder': '+39 333 1234567',
        'booking-phone-note': 'Ti contatteremo su WhatsApp per confermare la prenotazione',
        'booking-email-label': 'Email *',
        'booking-email-placeholder': 'mario.rossi@email.com',
        'booking-requests-label': 'Richieste speciali o note aggiuntive',
        'booking-requests-placeholder': 'Ad esempio \'Avremo bisogno della culla\'',
        'booking-cancel-btn': 'Annulla',
        'booking-submit-btn': 'Invia Richiesta'
      },
      en: {
        // Navigation
        'nav-home': 'Home',
        'nav-about': 'About Us',
        'nav-apartments': 'Apartments',
        'nav-reviews': 'Reviews',
        'nav-experience': 'Experience',
        'nav-contact': 'Contact',
        
        // Hero Section
        'hero-discover': 'Discover',
        'hero-title': 'Sperlonga',
        'hero-subtitle': 'and our apartments by the sea',
        'hero-cta': 'Explore Apartments',
        
        // About Section
        'about-title-accent': 'About',
        'about-title-main': 'Us',
        'about-description': 'A small family-run business, where genuine hospitality meets modern comfort just steps from the sea of Sperlonga',
        
        // About Cards  
        'family-title': 'Family Management',
        'family-desc': 'We are Antonio and the Scalingi family. We have been offering our accommodations for <strong>over 15 years</strong> with passion and dedication. We live on the upper floor of the same building, ensuring immediate assistance and authentic advice to make the most of Sperlonga.',
        'location-title': 'Prime Location', 
        'location-desc': 'Just <strong>200 meters from the beach</strong> and at the beginning of the promenade with cycle path. Historic center and port reachable in 15-20 minutes on foot. Bars, restaurants, pizzerias and supermarkets in the immediate vicinity.',
        'apartments-title': 'Two Comfort Solutions',
        'apartments-desc': '<strong>One-bedroom apartment</strong> sunny for couples and small families with private garden. <strong>Three-room apartment</strong> bright with two bedrooms for families up to 4 people. Independent units for maximum privacy.',
        'services-title': 'Complete Services',
        'services-desc': '<strong>Free private parking</strong>, fenced garden with outdoor table, air conditioning, high-speed WiFi, washing machine, TV and fully equipped kitchen. Self check-in via security box.',
        'remote-title': 'Remote Working',
        'remote-desc': 'Dedicated workspace with high-speed WiFi. Quiet environment ideal for <strong>smart working</strong> with the possibility to enjoy the sea during breaks. Perfect for those working remotely.',
        'activities-title': 'Activities & Relaxation',
        'activities-desc': 'Bike storage in the garden to ride the <strong>cycle path</strong> on the promenade. Cliffs for climbing nearby. <strong>Pets welcome</strong> with small supplement. Outdoor tables for dining under the stars.',
        
        // Philosophy Section
        'philosophy-title': 'Our Philosophy',
        'philosophy-text': '"Warm hospitality, attention to detail and constant availability. Every guest is a friend who returns home to us. Our deep knowledge of the territory and passion for hospitality allow us to offer an authentic and unforgettable experience in Sperlonga."',
        'philosophy-author': '— Antonio, Host',
        'about-philosophy-title': 'Our Philosophy',
        'about-philosophy-text': 'Warm welcome, attention to detail and constant availability. Every guest is a friend coming home to us. Our deep knowledge of the territory and passion for hospitality allow us to offer an authentic and unforgettable experience in Sperlonga.',
        'about-philosophy-author': '— Antonio, Host',
        
        // Apartments Section
        'apartments-title-accent': 'Our',
        'apartments-title-main': 'Apartments',
        'apartments-description': 'Choose the perfect apartment for your Sperlonga experience',
        'bilocale-title': 'One-Bedroom Apartment',
        'bilocale-description': 'Cozy ground floor apartment with private garden, perfect for couples. It has a master bedroom, living room with sofa bed, fully equipped kitchen and bathroom with shower.',
        'trilocale-title': 'Three-Room Apartment',
        'trilocale-description': 'Spacious ground floor apartment with two bedrooms and large garden with table for outdoor dining. Ideal for families up to 4 guests with all comforts.',
        'apartment-cta': 'View Details',
        
        // Feature tags
        'guests-2-4': '2-4 Guests',
        'bedroom-1': '1 Bedroom',
        'private-garden': 'Private Garden',
        'parking': 'Parking',
        'wifi': 'WiFi',
        'ac': 'A/C',
        'guests-4': '4 Guests',
        'bedrooms-2': '2 Bedrooms',
        'large-garden': 'Large Garden',
        'outdoor-table': 'Outdoor Table',
        'washing-machine': 'Washing Machine',
        'tv': 'TV',
        
        // Reviews Section
        'reviews-title-accent': 'Our',
        'reviews-title-main': 'Guests Reviews',
        'reviews-description': 'What people who stayed in our apartments say',
        'review-1': '"Ideal location: sea and center reachable on foot. The owners are very kind and helpful."',
        'review-2': '"Location close to the sea, optimal cleanliness and everything needed for breakfast. Very helpful host who allowed us to keep the car after check-out."',
        'review-3': '"New, clean and comfortable apartment just steps from the waterfront and historic village. Very kind owners and convenient private parking."',
        'review-4': '"Good location 5 minutes walk from the beach. Great value and welcome breakfast snacks."',
        'review-5': '"Nice, clean apartment in an excellent location: perfect for a relaxing holiday in Sperlonga."',
        'review-6': '"We had a great time. Everything nearby, from the beach to the center. The accommodation has everything you need and the owners are very helpful."',
        'review-7': '"We enjoyed staying in Antonio\'s small apartment; the kitchen is fully equipped and the location was perfect."',
        
        // Booking Platforms Section
        'book': 'Book',
        'official-channels': 'on Our Official Channels',
        'booking-intro': 'We are present on the main online booking platforms',
        'booking-com-title': 'Booking.com',
        'booking-com-desc': 'Book directly on one of the world\'s most trusted platforms',
        'booking-com-link': 'Go to Booking.com',
        'airbnb-title': 'Airbnb',
        'airbnb-desc': 'Discover our apartments on the home sharing platform',
        'airbnb-trilocale': 'Three-Room',
        'airbnb-bilocale': 'Studio',
        'direct-contact-title': 'Direct Contact',
        'direct-contact-desc': 'For availability, special offers and personalized conditions',
        'direct-contact-link': 'Contact Us Now',
        
        // Experience Section
        'experience-title-accent': 'The',
        'experience-title-main': 'Sperlonga Experience',
        'experience-description': 'Immerse yourself in the timeless beauty of one of Italy\'s most enchanting coastal towns. From pristine beaches to ancient history, every moment is a memory waiting to be made.',
        
        // Experience Cards
        'beaches-title': 'Pristine Beaches',
        'beaches-desc': 'Golden sands and crystal clear waters just steps from your door',
        'historic-title': 'Historic Center',
        'historic-desc': 'Stroll through medieval streets full of charm and character',
        'cuisine-title': 'Local Cuisine',
        'cuisine-desc': 'Taste authentic Italian flavors in waterfront restaurants',
        'nature-title': 'Nature Trails',
        'nature-desc': 'Explore panoramic coastal paths and hidden coves',
        'archaeology-title': 'History & Archaeology',
        'archaeology-desc': 'Discover Roman treasures and legends of Ulysses',
        'watersports-title': 'Sea & Water Sports',
        'watersports-desc': 'Diving, kayaking, sailing and windsurfing in crystal clear waters',
        'discover-more': 'Discover more',
        
        // Experience Modals
        'beaches-modal-title': 'Pristine Beaches',
        'beaches-modal-desc': 'The coast of Sperlonga is famous for its clear sand and crystal-clear water. Beaches like l\'Angolo and le Bambole, reachable only on foot or by boat, allow you to immerse yourself in unspoiled nature.',
        'beaches-modal-text': 'Along the Riviera di Ulisse, the crystalline waters and hidden bays are ideal for swimming, snorkeling or participating in boat tours to discover blue caves and secret corners.',
        'beaches-highlight-1': 'Crystal clear waters for snorkeling',
        'beaches-highlight-2': 'Boat tours to blue caves',
        'beaches-highlight-3': 'Hidden beaches like l\'Angolo and le Bambole',
        
        'historic-modal-title': 'Historic Center',
        'historic-modal-desc': 'The village, recognized among the "Most Beautiful Villages in Italy", is an intricate maze of whitest alleys, arches and panoramic stairways overlooking the sea.',
        'historic-modal-text': 'Walking through the historic center you can breathe the Mediterranean atmosphere: white-painted houses, flowers at the windows and spectacular views of the eastern and western coasts. It is the ideal place for an evening stroll among shops, restaurants and cafés.',
        'historic-highlight-1': 'Recognized among "Italy\'s Most Beautiful Villages"',
        'historic-highlight-2': 'Panoramic views to east and west',
        'historic-highlight-3': 'Perfect for evening walks',
        
        'cuisine-modal-title': 'Local Cuisine',
        'cuisine-modal-desc': 'Sperlonga\'s gastronomy reflects the maritime tradition of the Riviera di Ulisse with authentic dishes prepared with fresh local ingredients.',
        'cuisine-specialty-1-title': '<i class="fas fa-fish"></i> Sperlonga-style fish soup',
        'cuisine-specialty-1-desc': 'Prepared with rock fish, mollusks and crustaceans',
        'cuisine-specialty-2-title': '<i class="fas fa-seedling"></i> Bombolotti with cuttlefish ragù',
        'cuisine-specialty-2-desc': 'With a delicate but flavorful sauce',
        'cuisine-specialty-3-title': '<i class="fas fa-utensils"></i> Spaghetti with mantis shrimp',
        'cuisine-specialty-3-desc': 'With mantis shrimp sautéed in oil and wine',
        'cuisine-specialty-4-title': '<i class="fas fa-pizza-slice"></i> Tiella di Gaeta',
        'cuisine-specialty-4-desc': 'Two-layer savory pie with octopus or vegetable fillings',
        'cuisine-modal-text': 'To these are added the famous olives and anchovies of Gaeta, often served as appetizers.',
        
        'nature-modal-title': 'Nature Trails and Regional Park',
        'nature-modal-desc': 'The Riviera di Ulisse Regional Park, which embraces the coastal stretch between Gaeta and Sperlonga, offers extraordinary biodiversity and panoramic trails.',
        'nature-modal-text': 'One of the most evocative routes leads to the "Montagna Spaccata", a split in the rock with a medieval sanctuary and breathtaking views. From Sperlonga, guided excursions on foot or by bicycle start along the <em>Path of Ulysses</em>, which connects the historic center to the Archaeological Museum, crossing olive groves and coastal scrub.',
        'nature-highlight-1': 'Trail to "Montagna Spaccata"',
        'nature-highlight-2': 'Path of Ulysses between center and museum',
        'nature-highlight-3': 'Excursions on foot or by bicycle',
        'nature-highlight-4': 'Boat tours to marine caves',
        
        'archaeology-modal-title': 'History and Archaeology',
        'archaeology-modal-desc': 'In addition to natural beauty, Sperlonga houses the Villa of Tiberius, an imperial residence built next to a cave that was transformed into a nymphaeum.',
        'archaeology-modal-text': 'The excavations have returned sculptural groups now displayed in the National Archaeological Museum. Visiting the villa and the cave offers a journey into Roman history and the legends linked to Ulysses.',
        'archaeology-highlight-1': 'Villa of Tiberius - imperial residence',
        'archaeology-highlight-2': 'National Archaeological Museum',
        'archaeology-highlight-3': 'Legends of Ulysses',
        'archaeology-highlight-4': 'Roman sculptural groups',
        
        'watersports-modal-title': 'Sea & Water Sports',
        'watersports-modal-desc': 'The transparent waters of Sperlonga and its surroundings offer unique adventures for sea and water sports lovers.',
        'watersports-modal-text': 'Explore the coast, visit fascinating caves like Tiberius Cave with marine mosaics and the Bambole Cave, and go snorkeling in the blue waters of the Blue Cave. At the port, rent dinghies or boats to discover hidden bays or rely on local operators for personalized excursions along the coast.',
        'watersports-highlight-1': 'Boat tours and diving in marine caves',
        'watersports-highlight-2': 'Rentals and charters from Sperlonga port',
        'watersports-highlight-3': 'Water skiing, canoeing, sailing and sailing school',
        'watersports-highlight-4': 'Blue Oasis Villa of Tiberius and Regional Park',
              
        // Features - Transport
        'feature-transport-title': 'Transport & Connections',
        'transport-1': 'Bus stop in front of the house (50 m)',
        'transport-2': 'Fondi–Sperlonga train station 11 km away',
        'transport-3': 'Naples and Rome airports at 110 km each',
        'transport-4': 'Shuttle service (extra fee) on request',
              
        // Location extras (Bilocale page)
        'location-beach-title': 'Beach',
        'location-beach-desc': '150 m - 3 minutes on foot',
        'location-beach-detail': 'Golden sand and crystal-clear sea',
        'location-center-title': 'Historic Center',
        'location-center-desc': '1.4 km - 20 minutes on foot',
        'location-center-detail': 'Medieval village and restaurants',
        'location-shop-title': 'Supermarket',
        'location-shop-desc': '500 m - 7 minutes on foot',
        'location-shop-detail': 'All essential products',
        'location-museum-title': 'Villa of Tiberius',
        'location-museum-desc': '2.8 km - 40 minutes on foot',
        'location-museum-detail': 'Archaeological site and museum',
        'location-port-title': 'Port',
        'location-port-desc': '1.5 km - 15 minutes on foot',
        'location-port-detail': 'Pier walks and boat rentals',
        'location-health-title': 'Pharmacies & Clinic',
        'location-health-desc': '300 m - 5 minutes on foot',
        'location-health-detail': 'Nearby pharmacies and medical outpost',
              
        // Contact Section
        'contact-title-accent': 'Get In',
        'contact-title-main': 'Touch',
        'contact-description': 'Ready to experience the magic of Sperlonga? Contact us to book your perfect getaway.',
        'contact-address-label': 'Address',
        'contact-address': 'Via Lepanto 364, Sperlonga (LT), Italy  <br> "IRIS" Condominium',
        'contact-phone-label': 'Phone',
        'contact-email-label': 'Email',
        'contact-cta': 'Contact Now',
        // Safety card (Bilocale/Trilocale)
        'feature-safety-title': 'Safety',
        'safety-1': 'Carbon monoxide detector',
        'safety-2': 'Smoke detector',
        'safety-3': 'Outdoor area under video surveillance',
        'safety-4': 'Fire extinguisher',
        
        // Bilocale page translations
        'bilocale-hero-subtitle': 'The One-Bedroom',
        'bilocale-hero-title': 'Family Duo',
        'bilocale-hero-description': 'Smart comfort steps from the sea',
        'bilocale-hero-cta': 'Discover the Spaces',
        'bilocale-hero-book': 'Contact Now',
        
        'overview-title-accent': 'Your',
        'overview-title-main': 'One-Bedroom Apartment',
        'overview-description': 'A modern and welcoming apartment, perfect for couples and small families looking for comfort, style and a strategic location in Sperlonga. </br>Also ideal for young couples, it has a crib and high chair on request and is located steps from the beach, so you can easily return during the hottest hours of the day.',
        
        'bilocale-spaces-title': 'Optimized Spaces',
        'bilocale-spaces-desc': '<strong>Master bedroom</strong> with wardrobes, <strong>living room with sofa bed</strong> for additional guests, <strong>fully equipped kitchen</strong> and bathroom with shower. Every space is designed for maximum comfort.',
        
        'bilocale-location-title': 'Strategic Location',
        'bilocale-location-desc': 'Only <strong>150 meters from the beach</strong> and <strong>1.4 km from the historic center</strong>. The waterfront with supermarkets, restaurants and all essential services in the immediate vicinity for a worry-free stay.',
        
        'bilocale-comfort-title': 'Modern Comforts',
        'bilocale-comfort-desc': '<strong>Air conditioning</strong>, high-speed WiFi, Smart TV, kitchen with all appliances. Linen and towels included. <strong>Also perfect for smart working</strong> with dedicated workspace.',
        
        'bilocale-parking-title': 'Parking Included',
        'bilocale-parking-desc': '<strong>Free private parking</strong> inside the property. You won\'t have to worry about finding parking during high season anymore. Space also for bicycles in the shared garden.',
        
        'gallery-title-accent': 'Photo',
        'gallery-title-main': 'Gallery',
        'gallery-description': 'Discover every corner of your one-bedroom apartment through these images that show the spaces, comforts and attention to detail',
        
        'gallery-kitchen-title': 'Equipped Kitchen',
        'gallery-kitchen-desc': 'Complete kitchen with refrigerator, stove, and all necessary utensils to prepare your favorite meals during your stay.',
        
        'gallery-living-title': 'Bright Living Room',
        'gallery-living-desc': 'Comfortable living area with sofa bed, perfect for relaxing after a day at the beach or for hosting a third guest.',
        
        'gallery-bedroom-title': 'Master Bedroom',
        'gallery-bedroom-desc': 'Spacious and comfortable bedroom with double bed, large wardrobe and all comforts for perfect rest and with the possibility of inserting a crib.',
        
        'gallery-bathroom-title': 'Complete Bathroom',
        'gallery-bathroom-desc': 'Bathroom with shower, hairdryer and courtesy set for maximum comfort during your stay.',
        
        'gallery-details-title': 'Style Details',
        'gallery-details-desc': 'Every detail is carefully crafted to create a welcoming and refined environment that feels like home.',
        
        'gallery-exterior-title': 'Outdoor Space',
        'gallery-exterior-desc': 'External view of the apartment with access to shared garden, bike space and private parking included in the price.',
        
        'book-bilocale': 'Book the',
        'book-bilocale-title': 'One-Bedroom Apartment',
        'booking-bilocale-intro': 'Choose your preferred platform to book your stay in the one-bedroom apartment',
        
        'booking-com-bilocale-desc': 'Book the one-bedroom apartment on one of the world\'s most trusted platforms',
        'airbnb-bilocale-desc': 'Discover the one-bedroom apartment on the home sharing platform',
        'airbnb-bilocale-link': 'Book on Airbnb',
        'direct-contact-bilocale-desc': 'Contact us for availability, special offers and personalized conditions',
        
        'features-title-accent': 'Features',
        'features-title-main': 'and Services',
        'features-description': 'All the details that make your stay comfortable and unforgettable',
        
        'feature-spaces-title': 'Indoor Spaces',
        'bilocale-space-1': '✓ Master bedroom',
        'bilocale-space-2': '✓ Living room with sofa bed',
        'bilocale-space-3': '✓ Fully equipped kitchen',
        'bilocale-space-4': '✓ Bathroom with shower',
        'bilocale-space-5': '✓ Private garden',
        
        'feature-tech-title': 'Technology & Comfort',
        'comfort-1': '✓ Air conditioning and Heating',
        'comfort-2': '✓ Linen and towels included',
        'comfort-3': '✓ Free high-speed Wi-Fi',
        'comfort-4': '✓ Smart TV',
        'comfort-5': '✓ Baby crib (on request)',
        
        'feature-kitchen-title': 'Complete Kitchen',
        'kitchen-1': '✓ Refrigerator with freezer',
        'kitchen-2': '✓ Gas stove',
        'kitchen-3': '✓ Coffee machine',
        'kitchen-4': '✓ Complete dishes and cutlery',
        'kitchen-5': '✓ Baby high chair',
        
        'feature-services-title': 'Extra Services',
        'service-1': '✓ Free private parking',
        'service-2': '✓ Washing machine and drying rack available',
        'service-3': '✓ Hair dryer',
        'service-4': '✓ Bathroom courtesy set',
        'service-5': '✓ Bicycle space in the garden',
        
        'location-title-accent': 'Strategic',
        'location-title-main': 'Location',
        'location-description': 'Everything you need is within walking distance from the apartment',
        
        'contact-bilocale-accent': 'Contact Us',
        'contact-bilocale-main': 'Directly',
        'contact-bilocale-description': 'Have questions? Don\'t worry, you\'re not blocking or definitively booking the apartment. We will definitely respond within 24 hours.',
        
        
        // Footer translations
        'footer-tagline': 'Your Home by the Sea in Sperlonga',
        'footer-appartamenti': 'Apartments',
        'footer-bilocale': 'One-Bedroom',
        'footer-trilocale': 'Three-Room',
        'footer-tutti': 'All Apartments',
        'footer-informazioni': 'Information',
        'footer-chi-siamo': 'About Us',
        'footer-esperienza': 'Sperlonga Experience',
        'footer-recensioni': 'Reviews',
        'footer-contatti': 'Contact',
        'footer-indirizzo': 'Via Lepanto 364<br>Sperlonga (LT), Italy<br>"IRIS" Condominium',
        'footer-copyright': '© 2024 Scalingi Apartments. All rights reserved.',
        'footer-privacy': 'Privacy Policy',
        'footer-terms': 'Terms of Service',
        
        // Trilocale page translations
        'trilocale-hero-subtitle': 'The Three-Room',
        'trilocale-hero-title': 'Family Home',
        'trilocale-hero-description': 'Two bedrooms for a perfect stay',
        'trilocale-hero-cta': 'Discover the Spaces',
        'trilocale-hero-book': 'Contact Now',
        
        'trilocale-overview-title-accent': 'Your',
        'trilocale-overview-title-main': 'Three-Room Apartment',
        'trilocale-overview-description': 'A spacious and bright apartment, ideal for families with children looking for comfort, privacy and an outdoor space where little ones can play safely. </br>Perfect for family vacations, it has two separate bedrooms, large living room, private fenced garden and all services for a relaxing stay.',
        
        'trilocale-rooms-title': 'Two Private Bedrooms',
        'trilocale-rooms-desc': '<strong>Master bedroom</strong> for parents and <strong>twin bedroom</strong> for children. Both with large wardrobes, air conditioning and bright windows for maximum comfort.',
        
        'trilocale-living-title': 'Large Shared Spaces',
        'trilocale-living-desc': '<strong>Large living room</strong> with sofa and dining table, <strong>fully equipped kitchen</strong> for the family, complete bathroom with shower. Ideal for convivial moments.',
        
        'trilocale-garden-title': 'Private Garden',
        'trilocale-garden-desc': '<strong>Fenced garden</strong> with table for outdoor dining, perfect for children who can play safely. Ideal space to enjoy summer evenings.',
        
        'trilocale-parking-title': 'Complete Services',
        'trilocale-parking-desc': '<strong>Free private parking</strong>, washing machine, fast WiFi, Smart TV, bicycle storage and possibility to host <strong>pets</strong> on request.',
        
        'trilocale-gallery-description': 'Explore every room of the three-room apartment: from spacious bedrooms to private garden, discover all the spaces that will make your family stay perfect',
        
        'trilocale-gallery-master-title': 'Master Bedroom',
        'trilocale-gallery-master-desc': 'Spacious bedroom for parents with double bed, large wardrobes and all comforts for rest.',
        
        'trilocale-gallery-twin-title': 'Twin Bedroom',
        'trilocale-gallery-twin-desc': 'Bright room with two single beds, perfect for children or additional guests.',
        
        'trilocale-gallery-living-title': 'Large Living Room',
        'trilocale-gallery-living-desc': 'Comfortable living area with sofa, dining table and access to the garden.',
        
        'trilocale-gallery-kitchen-title': 'Complete Kitchen',
        'trilocale-gallery-kitchen-desc': 'Equipped kitchen with all appliances and utensils to prepare meals for the whole family.',
        
        'trilocale-gallery-bathroom-title': 'Complete Bathroom',
        'trilocale-gallery-bathroom-desc': 'Modern bathroom with shower, sink, WC and bidet. Hairdryer and courtesy set included.',
        
        'trilocale-gallery-garden-title': 'Private Garden',
        'trilocale-gallery-garden-desc': 'Large fenced garden with table for outdoor dining, perfect for families with children.',
        
        'trilocale-gallery-exterior-title': 'Exterior View',
        'trilocale-gallery-exterior-desc': 'View of the apartment with independent access and private parking included.',
        
        'book-trilocale': 'Book the',
        'book-trilocale-title': 'Three-Room Apartment',
        'booking-trilocale-intro': 'Choose your preferred platform to book your stay in the three-room apartment',
        
        'booking-com-trilocale-desc': 'Book the three-room apartment on one of the world\'s most trusted platforms',
        'airbnb-trilocale-desc': 'Discover the three-room apartment on the home sharing platform',
        'airbnb-trilocale-link': 'Book on Airbnb',
        'direct-contact-trilocale-desc': 'Contact us for availability, family discounts and special conditions',
        
        'trilocale-features-title-accent': 'Features',
        'trilocale-features-title-main': 'and Services',
        'trilocale-features-description': 'All the details that make the three-room apartment perfect for your family',
        
        'trilocale-feature-rooms-title': 'Bedrooms',
        'trilocale-room-1': '✓ Spacious master bedroom',
        'trilocale-room-2': '✓ Twin bedroom',
        'trilocale-room-3': '✓ Large wardrobes in both',
        'trilocale-room-4': '✓ Air conditioning in each room',
        'trilocale-room-5': '✓ Linen and pillows included',
        
        'trilocale-feature-living-title': 'Shared Spaces',
        'trilocale-living-1': '✓ Large and bright living room',
        'trilocale-living-2': '✓ Dining table for 4 people',
        'trilocale-living-3': '✓ Comfortable sofa for relaxation',
        'trilocale-living-4': '✓ Smart TV with Netflix',
        'trilocale-living-5': '✓ Complete bathroom with shower',
        
        'trilocale-feature-kitchen-title': 'Equipped Kitchen',
        'trilocale-kitchen-1': '✓ Large refrigerator with freezer',
        'trilocale-kitchen-2': '✓ Stove and oven',
        'trilocale-kitchen-3': '✓ Microwave and toaster',
        'trilocale-kitchen-4': '✓ Dishes for 4+ people',
        'trilocale-kitchen-5': '✓ Coffee machine and kettle',
        
        'trilocale-feature-outdoor-title': 'Outdoor Space',
        'trilocale-outdoor-1': '✓ Private fenced garden',
        'trilocale-outdoor-2': '✓ Table for outdoor dining',
        'trilocale-outdoor-3': '✓ Private car parking',
        'trilocale-outdoor-4': '✓ Bicycle storage',
        'trilocale-outdoor-5': '✓ Pets welcome',
        
        'contact-trilocale-accent': 'Contact Us',
        'contact-trilocale-main': 'Directly',
        'contact-trilocale-description': 'Have questions? Don\'t worry, you\'re not blocking or definitively booking the apartment. We will definitely respond within 24 hours.',
        
        // Booking modal translations
        'booking-modal-title': 'Book your stay',
        'booking-modal-subtitle': 'Don\'t worry, you\'re not blocking or definitively booking the apartment. We will definitely respond within 24 hours.',
        'booking-details-title': 'Stay Details',
        'booking-apartment-label': 'Which apartment do you want to book? *',
        'booking-select-apartment': 'Select apartment',
        'booking-bilocale-option': 'One-Bedroom - Double and Sofa Bed',
        'booking-trilocale-option': 'Three-Room - Double and Twin Bedroom',
        'booking-checkin-label': 'Check-in Date *',
        'booking-checkout-label': 'Check-out Date *',
        'booking-adults-label': 'Adults *',
        'booking-select': 'Select',
        'booking-1-adult': '1 Adult',
        'booking-2-adults': '2 Adults',
        'booking-3-adults': '3 Adults',
        'booking-4-adults': '4 Adults',
        'booking-children-label': 'Children (2-12 years) *',
        'booking-none': 'None',
        'booking-1-child': '1 Child',
        'booking-2-children': '2 Children',
        'booking-3-children': '3 Children',
        'booking-infants-label': 'Infants (0-2 years) *',
        'booking-1-infant': '1 Infant',
        'booking-2-infants': '2 Infants',
        'booking-pets-label': 'Pets *',
        'booking-1-pet': '1 Pet',
        'booking-2-pets': '2 Pets',
        'booking-contact-title': 'Your contact details',
        'booking-name-label': 'Name and Surname *',
        'booking-name-placeholder': 'John Smith',
        'booking-phone-label': 'WhatsApp Number *',
        'booking-phone-placeholder': '+39 333 1234567',
        'booking-phone-note': 'We will contact you on WhatsApp to confirm the booking',
        'booking-email-label': 'Email *',
        'booking-email-placeholder': 'john.smith@email.com',
        'booking-requests-label': 'Special requests or additional notes',
        'booking-requests-placeholder': 'For example \'We will need a crib\'',
        'booking-cancel-btn': 'Cancel',
        'booking-submit-btn': 'Send Request'
      }
    };

    // Update text content based on selected language
    Object.keys(translations[lang]).forEach(key => {
      const elements = document.querySelectorAll(`[data-lang="${key}"]`);
      elements.forEach(element => {
        element.innerHTML = translations[lang][key];
      });
    });

    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
    
    // Expose translations globally for booking modal
    window.scalingiApp = window.scalingiApp || {};
    window.scalingiApp.translations = translations;
    
    // Apply additional translations for common elements
    this.applyAutoTranslations(lang);
  }

  // Auto-translate common elements that don't have data-lang attributes
  applyAutoTranslations(lang) {
    const autoTranslations = {
      it: {
        'Gestione Familiare': 'Gestione Familiare',
        'Posizione Privilegiata': 'Posizione Privilegiata',
        'Due Soluzioni Comfort': 'Due Soluzioni Comfort',
        'Servizi Completi': 'Servizi Completi',
        'Remote Working': 'Remote Working',
        'Attività & Relax': 'Attività & Relax',
        'La Nostra Filosofia': 'La Nostra Filosofia',
        'I Nostri': 'I Nostri',
        'Appartamenti': 'Appartamenti',
        'Bilocale': 'Bilocale',
        'Trilocale': 'Trilocale',
        'Le': 'Le',
        'Recensioni dei Nostri Ospiti': 'Recensioni dei Nostri Ospiti',
        'Prenota': 'Prenota',
        'sui Nostri Canali Ufficiali': 'sui Nostri Canali Ufficiali',
        'L\'': 'L\'',
        'Esperienza Sperlonga': 'Esperienza Sperlonga',
        'Mettiti In': 'Mettiti In',
        'Contatto': 'Contatto'
      },
      en: {
        'Gestione Familiare': 'Family Management',
        'Posizione Privilegiata': 'Prime Location',
        'Due Soluzioni Comfort': 'Two Comfort Solutions',
        'Servizi Completi': 'Complete Services',
        'Remote Working': 'Remote Working',
        'Attività & Relax': 'Activities & Relaxation',
        'La Nostra Filosofia': 'Our Philosophy',
        'I Nostri': 'Our',
        'Appartamenti': 'Apartments',
        'Bilocale': 'One-Bedroom Apartment',
        'Trilocale': 'Three-Room Apartment',
        'Le': 'Our',
        'Recensioni dei Nostri Ospiti': 'Guests Reviews',
        'Prenota': 'Book',
        'sui Nostri Canali Ufficiali': 'on Our Official Channels',
        'L\'': 'The',
        'Esperienza Sperlonga': 'Sperlonga Experience',
        'Mettiti In': 'Get In',
        'Contatto': 'Touch'
      }
    };

    // Apply auto-translations
    Object.keys(autoTranslations[lang]).forEach(originalText => {
      const translatedText = autoTranslations[lang][originalText];
      
      // Find elements containing the exact text
      document.querySelectorAll('h3, .title-accent, .title-main, .section-title span').forEach(element => {
        if (element.textContent.trim() === originalText) {
          element.textContent = translatedText;
        }
      });
    });
  }

  // Initialize scroll-triggered animations
  initializeAnimations() {
    // Add scroll-triggered animations for better UX
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.apartment-card, .experience-item');
      elements.forEach((element, index) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.style.animationDelay = `${index * 0.1}s`;
          element.classList.add('animate-in');
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
  }

  // Enhanced navbar behavior on scroll
  setupNavbarBehavior() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Add shadow when scrolled
      if (currentScrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Hide/show navbar on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.classList.add('hidden');
      } else {
        navbar.classList.remove('hidden');
      }
      
      lastScrollY = currentScrollY;
    });
  }

  // Parallax effect for hero section
  setupParallaxEffect() {
    const heroSection = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background img');

    if (heroSection && heroBackground) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
      });
    }
  }
}

// Enhanced apartment card interactions
class ApartmentInteractions {
  constructor() {
    this.setupCardHovers();
    this.setupImageGallery();
  }

  setupCardHovers() {
    const apartmentCards = document.querySelectorAll('.apartment-card');
    
    apartmentCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hovered');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hovered');
      });
    });
  }

  setupImageGallery() {
    // Add image gallery functionality if needed
    const apartmentImages = document.querySelectorAll('.apartment-image img');
    
    apartmentImages.forEach(img => {
      img.addEventListener('click', () => {
        // Could implement lightbox here
        console.log('Image clicked:', img.alt);
      });
    });
  }
}

// Performance optimizations
class PerformanceOptimizer {
  constructor() {
    // Bump this when you update static assets to force the browser to fetch new files
    this.assetsVersion = '20250828';
    this.setupLazyLoading();
    this.setupPreloading();
    this.applyCacheBusting();
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  setupPreloading() {
    // Preload critical images
    const criticalImages = [
      'src/assets/sperlonga_hero_cartoon.jpeg',
      'src/assets/bilocale/copertina.jpeg',
      'src/assets/trilocale/copertina.jpeg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = this.addVersion(src);
      document.head.appendChild(link);
    });
  }

  // Append cache-busting version parameter to an asset URL
  addVersion(url) {
    const hasQuery = url.includes('?');
    const sep = hasQuery ? '&' : '?';
    return `${url}${sep}v=${this.assetsVersion}`;
  }

  // Update existing <img> tags that point to local assets to include version parameter
  applyCacheBusting() {
    try {
      const imgs = document.querySelectorAll('img[src^="src/assets/"]');
      imgs.forEach(img => {
        // Skip if already versioned
        if (/([?&])v=/.test(img.src)) return;
        // Preserve any existing query string on relative src attributes
        const src = img.getAttribute('src') || '';
        if (!src) return;
        img.setAttribute('src', this.addVersion(src));
      });
    } catch (_) {
      // No-op if DOM not ready yet
    }
  }
}

/*
 * Gallery Modal System
 */
class GalleryModal {
  constructor() {
    console.log('GalleryModal constructor called');
    this.modal = document.getElementById('gallery-modal');
    console.log('Modal found:', !!this.modal);
    
    if (!this.modal) {
      console.error('Gallery modal not found in DOM');
      return;
    }
    
    // Use the same cache-busting version as PerformanceOptimizer; update as needed
    this.assetsVersion = '20250828';

    this.modalImage = document.getElementById('modal-image');
    this.modalTitle = document.getElementById('modal-title');
    this.modalDescription = document.getElementById('modal-description');
    this.modalGallery = document.getElementById('modal-gallery');
    this.modalOverlay = this.modal?.querySelector('.modal-overlay');
    this.modalClose = this.modal?.querySelector('.modal-close');
    this.navPrev = this.modal?.querySelector('.nav-prev');
    this.navNext = this.modal?.querySelector('.nav-next');
    
    this.currentIndex = 0;
    this.currentGalleryData = [];
    
    this.init();
  }
  
  init() {
    if (!this.modal) return;
    
    // Detect current page and setup appropriate gallery data
    const currentPage = window.location.pathname.toLowerCase();
    
    if (currentPage.includes('bilocale') || document.querySelector('[data-gallery-item="kitchen"]')) {
      this.setupBilocaleGallery();
    } else if (currentPage.includes('trilocale') || document.querySelector('[data-gallery-item="master-bedroom"]')) {
      this.setupTrilocaleGallery();
    } else {
      // Fallback - check if we have any gallery items
      if (document.querySelector('[data-gallery-item]')) {
        this.setupBilocaleGallery(); // Default to bilocale
      }
    }
    
    this.setupEventListeners();
  }
  
  setupBilocaleGallery() {
    // Setup gallery data for bilocale with multilingual support
    this.galleryData = {
      kitchen: {
        title: {
          it: 'Cucina Attrezzata',
          en: 'Equipped Kitchen'
        },
        description: {
          it: 'Cucina completamente attrezzata con frigorifero capiente, piano cottura a 4 fuochi, forno, e macchina del caffè. Tutti gli utensili necessari per cucinare, stoviglie per 4 persone e spazio di lavoro funzionale per preparare i tuoi pasti preferiti.',
          en: 'Fully equipped kitchen with spacious refrigerator, 4-burner stove, oven, and coffee machine. All necessary cooking utensils, dishes for 4 people and functional workspace to prepare your favorite meals.'
        },
        images: [
          { src: 'src/assets/bilocale/Cucina.jpeg', alt: 'Cucina - vista principale con elettrodomestici' },
          { src: 'src/assets/bilocale/Cucina_2.jpeg', alt: 'Cucina - dettaglio tavolo e AC' },
        ]
      },
      living: {
        title: {
          it: 'Soggiorno Luminoso',
          en: 'Bright Living Room'
        },
        description: {
          it: 'Accogliente zona living con divano letto matrimoniale per ospiti aggiuntivi, tavolo da pranzo interno per 4 persone, TV Smart, aria condizionata e accesso diretto al giardino. Spazio perfetto per rilassarsi dopo una giornata al mare o per momenti di convivialità.',
          en: 'Cozy living area with double sofa bed for additional guests, indoor dining table for 4, Smart TV, air conditioning and direct access to the garden. Perfect space to relax after a day at the beach or for convivial moments.'
        },
        images: [
          { src: 'src/assets/bilocale/Salone_cucina.jpeg', alt: 'Soggiorno con divano letto e tavolo da pranzo con TV e aria condizionata' },
        ]
      },
      bedroom: {
        title: {
          it: 'Camera Matrimoniale',
          en: 'Master Bedroom'
        },
        description: {
          it: 'Spaziosa camera da letto matrimoniale con letto comodo per un riposo perfetto, ampio armadio a 4 ante con spazio per tutti i vestiti, comodini con lampade, aria condizionata e finestra con vista sul verde. Biancheria da letto di qualità inclusa.',
          en: 'Spacious master bedroom with comfortable bed for perfect rest, large 4-door wardrobe with space for all clothes, bedside tables with lamps, air conditioning and window overlooking greenery. Quality bed linen included.'
        },
        images: [
          { src: 'src/assets/bilocale/Camera_matrimoniale.jpeg', alt: 'Camera matrimoniale - letto e arredamento' },
        ]
      },
      bathroom: {
        title: {
          it: 'Bagno Completo',
          en: 'Complete Bathroom'
        },
        description: {
          it: 'Bagno moderno completo con doccia spaziosa, WC, bidet, lavandino con specchio illuminato, lavatrice, asciugacapelli professionale, set di asciugamani puliti e set cortesia. Riscaldamento per comfort anche in inverno.',
          en: 'Modern complete bathroom with spacious shower, WC, bidet, sink with illuminated mirror, washing machine, professional hairdryer, set of clean towels and courtesy set. Heating for comfort even in winter.'
        },
        images: [
          { src: 'src/assets/bilocale/Bagno.jpeg', alt: 'Bagno completo con doccia e servizi' },
          { src: 'src/assets/bilocale/Bagno_2.jpeg', alt: 'Bagno - dettaglio doccia spaziosa' },
        ]
      },
      details: {
        title: {
          it: 'Dettagli e Comfort',
          en: 'Details and Comfort'
        },
        description: {
          it: 'Ogni ambiente è curato nei minimi dettagli per garantire il massimo comfort: illuminazione LED, WiFi veloce in tutta la casa, riscaldamento/raffreddamento, finestre con zanzariere e piccoli dettagli che fanno la differenza.',
          en: 'Every room is carefully detailed to ensure maximum comfort: LED lighting, fast WiFi throughout the house, heating/cooling, windows with mosquito nets and small details that make the difference.'
        },
        images: [
          { src: 'src/assets/bilocale/Esterno_3.jpeg', alt: 'Dettagli Esterni' },
          { src: 'src/assets/bilocale/Esterno_4.jpeg', alt: 'Dettagli Esterni' },
          { src: 'src/assets/bilocale/copertina.jpeg', alt: 'Dettagli Esterni' }
        ]
      },
      exterior: {
        title: {
          it: 'Esterno e Servizi',
          en: 'Exterior and Services'
        },
        description: {
          it: 'Accesso indipendente al piano terra con giardino condiviso attrezzato con tavolo e sedie per cene all\'aperto. Posto auto privato gratuito nel cortile, deposito biciclette, zona Wi-Fi esterna e possibilità di utilizzare il barbecue su richiesta.',
          en: 'Independent ground floor access with shared garden equipped with table and chairs for outdoor dining. Free private parking in the courtyard, bicycle storage, outdoor Wi-Fi area and possibility to use barbecue on request.'
        },
        images: [
          { src: 'src/assets/bilocale/Giardino.jpeg', alt: 'Vista esterno completa della struttura' },
          { src: 'src/assets/bilocale/Parcheggio.jpeg', alt: 'Vista esterna con parcheggio privato' },
          { src: 'src/assets/bilocale/Esterno.jpeg', alt: 'Giardino e aree esterne' }
        ]
      }
    };
  }
  
  setupTrilocaleGallery() {
    // Setup gallery data for trilocale with multilingual support
    this.galleryData = {
      'master-bedroom': {
        title: {
          it: 'Camera Matrimoniale',
          en: 'Master Bedroom'
        },
        description: {
          it: 'Spaziosa camera matrimoniale con letto comodo, armadio capiente e tutti i comfort per il riposo dei genitori, con vista sul giardino.',
          en: 'Spacious master bedroom with comfortable bed, large wardrobe and all comforts for parents\' rest, with garden view.'
        },
        images: [
          { src: 'src/assets/trilocale/Bedroom.jpeg', alt: 'Camera matrimoniale - vista principale' },
          { src: 'src/assets/trilocale/Bedroom2.jpeg', alt: 'Camera matrimoniale - vista principale' },

          // Seconda foto della camera matrimoniale: se disponibile aggiungere qui un altro scatto.
          // Al momento non esiste "Bedroom_2.jpeg" nella cartella, per evitare 404 manteniamo una sola immagine.
        ]
      },
      'twin-bedroom': {
        title: {
          it: 'Camera Due Letti',
          en: 'Twin Bedroom'
        },
        description: {
          it: 'Camera luminosa con due letti singoli, perfetta per bambini o ospiti aggiuntivi. Spazio funzionale e accogliente per tutti.',
          en: 'Bright room with two single beds, perfect for children or additional guests. Functional and welcoming space for everyone.'
        },
        images: [
          { src: 'src/assets/trilocale/Bedroom2.jpg', alt: 'Camera due letti - vista principale' },
          { src: 'src/assets/trilocale/Bedroom2_2.jpg', alt: 'Camera due letti - dettaglio con armadio' },
        ]
      },
      'living-room': {
        title: {
          it: 'Soggiorno Ampio',
          en: 'Large Living Room'
        },
        description: {
          it: 'Zona living spaziosa con divano comodo, tavolo da pranzo e accesso diretto al giardino privato per momenti di convivialità.',
          en: 'Spacious living area with comfortable sofa, dining table and direct access to private garden for convivial moments.'
        },
        images: [
          { src: 'src/assets/trilocale/Sala_cucina2.jpg', alt: 'Soggiorno - vista principale' },
          { src: 'src/assets/trilocale/Soggiorno_cucina2.jpeg', alt: 'Soggiorno - zona pranzo' },
        ]
      },
      'kitchen-dining': {
        title: {
          it: 'Cucina',
          en: 'Kitchen'
        },
        description: {
          it: 'Cucina completamente attrezzata con tutti gli elettrodomestici e utensili necessari per preparare pasti per tutta la famiglia.',
          en: 'Fully equipped kitchen with all appliances and utensils needed to prepare meals for the whole family.'
        },
        images: [
          { src: 'src/assets/trilocale/Cucina.jpeg', alt: 'Cucina - vista principale' },
          { src: 'src/assets/trilocale/Cucina_3.jpeg', alt: 'Cucina - elettrodomestici' },
          { src: 'src/assets/trilocale/Cucina.jpg', alt: 'Cucina - Macchina caffe' }
        ]
      },
      'bathroom': {
        title: {
          it: 'Bagno Completo',
          en: 'Complete Bathroom'
        },
        description: {
          it: 'Bagno moderno con doccia, lavabo con specchio, WC e bidet. Asciugacapelli e set cortesia disponibili per il massimo comfort.',
          en: 'Modern bathroom with shower, sink with mirror, WC and bidet. Hairdryer and courtesy set available for maximum comfort.'
        },
        images: [
          { src: 'src/assets/trilocale/Bagno.JPG', alt: 'Bagno - vista principale' },
          { src: 'src/assets/trilocale/Bagno_2.JPG', alt: 'Bagno - dettaglio doccia' },
          { src: 'src/assets/trilocale/Bagno_3.JPG', alt: 'Bagno - dettaglio lavabo' }
        ]
      },
      'private-garden': {
        title: {
          it: 'Giardino Privato',
          en: 'Private Garden'
        },
        description: {
          it: 'Ampio giardino recintato con tavolo per cene all\'aperto e spazio relax. Perfetto per bambini e momenti di tranquillità.',
          en: 'Large fenced garden with table for outdoor dining and relaxation space. Perfect for children and quiet moments.'
        },
        images: [
          { src: 'src/assets/trilocale/Giardino.jpeg', alt: 'Giardino - tavolo esterno' },
          { src: 'src/assets/trilocale/Giardino_2.JPG', alt: 'Giardino - vista principale' },
          { src: 'src/assets/trilocale/Entrata.jpeg', alt: 'Giardino - spazio verde' }
        ]
      },
      'exterior-view': {
        title: {
          it: 'Vista Esterna',
          en: 'Exterior View'
        },
        description: {
          it: 'Vista dell\'appartamento dall\'esterno con accesso indipendente, parcheggio privato e spazio verde circostante.',
          en: 'View of the apartment from the outside with independent access, private parking and surrounding green space.'
        },
        images: [
          { src: 'src/assets/trilocale/copertina.jpeg', alt: 'Esterno - vista completa' },
          { src: 'src/assets/trilocale/parcheggio.jpg', alt: 'Esterno - Parcheggio' },
        ]
      }
    };
  }
  
  setupEventListeners() {
    // Click on gallery cards
    const galleryCards = document.querySelectorAll('[data-gallery-item]');
    console.log('Found gallery cards:', galleryCards.length);
    
    galleryCards.forEach(card => {
      // Add click event to entire card
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const galleryItem = card.getAttribute('data-gallery-item');
        console.log('Clicked gallery item:', galleryItem);
        this.openModal(galleryItem);
      });
      
      // Also add click to the image and overlay specifically
      const image = card.querySelector('.apartment-image');
      const overlay = card.querySelector('.gallery-overlay');
      if (image) {
        image.style.cursor = 'pointer';
        image.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const galleryItem = card.getAttribute('data-gallery-item');
          console.log('Clicked image for item:', galleryItem);
          this.openModal(galleryItem);
        });
      }
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const galleryItem = card.getAttribute('data-gallery-item');
          console.log('Clicked overlay for item:', galleryItem);
          this.openModal(galleryItem);
        });
      }
    });
    
    // Modal controls
    this.modalOverlay?.addEventListener('click', () => this.closeModal());
    this.modalClose?.addEventListener('click', () => this.closeModal());
    this.navPrev?.addEventListener('click', () => this.previousImage());
    this.navNext?.addEventListener('click', () => this.nextImage());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      
      switch(e.key) {
        case 'Escape':
          this.closeModal();
          break;
        case 'ArrowLeft':
          this.previousImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
      }
    });
  }
  
  openModal(galleryItem) {
    console.log('openModal called with:', galleryItem);
    const data = this.galleryData[galleryItem];
    console.log('Gallery data found:', !!data);
    if (!data) return;
    
    this.currentGalleryData = data.images;
    this.currentIndex = 0;
    
    // Get current language from localStorage or default to 'it'
    const currentLang = localStorage.getItem('preferredLanguage') || 'it';
    
    // Set title and description with current language
    this.modalTitle.textContent = typeof data.title === 'object' ? data.title[currentLang] : data.title;
    this.modalDescription.textContent = typeof data.description === 'object' ? data.description[currentLang] : data.description;
    console.log('Set modal title:', this.modalTitle.textContent);
    
    // Load main image
    this.loadImage(0);
    
    // Create thumbnail gallery
    this.createThumbnailGallery();
    
    // Show modal
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('Modal should be visible now');
  }
  
  closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  loadImage(index) {
    if (index < 0 || index >= this.currentGalleryData.length) return;
    
    this.currentIndex = index;
    const imageData = this.currentGalleryData[index];
    
  this.modalImage.src = this.withVersion(imageData.src);
    this.modalImage.alt = imageData.alt;
    
    // Update thumbnail active state
    this.updateThumbnailActive();
  }
  
  previousImage() {
    const newIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.currentGalleryData.length - 1;
    this.loadImage(newIndex);
  }
  
  nextImage() {
    const newIndex = this.currentIndex < this.currentGalleryData.length - 1 ? this.currentIndex + 1 : 0;
    this.loadImage(newIndex);
  }
  
  createThumbnailGallery() {
    this.modalGallery.innerHTML = '';
    
    this.currentGalleryData.forEach((imageData, index) => {
      const thumbnail = document.createElement('img');
  thumbnail.src = this.withVersion(imageData.src);
      thumbnail.alt = imageData.alt;
      thumbnail.addEventListener('click', () => this.loadImage(index));
      
      if (index === this.currentIndex) {
        thumbnail.classList.add('active');
      }
      
      this.modalGallery.appendChild(thumbnail);
    });
  }
  
  updateThumbnailActive() {
    const thumbnails = this.modalGallery.querySelectorAll('img');
    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === this.currentIndex);
    });
  }

  // Helper to add cache-busting version to URLs
  withVersion(url) {
    const hasQuery = url.includes('?');
    const sep = hasQuery ? '&' : '?';
    return `${url}${sep}v=${this.assetsVersion}`;
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Add loaded class immediately to prevent animation delays
  document.body.classList.add('loaded');
  
  // Initialize main app
  new ScalingiApp();
  
  // Initialize apartment interactions
  new ApartmentInteractions();
  
  // Initialize performance optimizations
  new PerformanceOptimizer();
  
  // Initialize gallery modal (only on apartment pages)
  if (document.getElementById('gallery-modal')) {
    new GalleryModal();
  }

  // Add loading state management
  window.addEventListener('load', () => {
    // Ensure loaded class is present
    document.body.classList.add('loaded');
    
    // Fix for apartment links - ensure they work properly
    const apartmentLinks = document.querySelectorAll('.apartment-link');
    apartmentLinks.forEach(link => {
      // Remove any existing click listeners that might interfere
      link.onclick = null;
      
      // Add explicit click handler for apartment links
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Make sure it's a relative HTML link
        if (href && (href.endsWith('.html') || href.includes('.html'))) {
          // Let the browser handle the navigation naturally
          console.log('Navigating to:', href);
          window.location.href = href;
        }
      }, true); // Use capture phase
    });
  });
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ScalingiApp, ApartmentInteractions, PerformanceOptimizer };
}
