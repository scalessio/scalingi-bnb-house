/**
 * Booking System - Sistema di Prenotazione Scalingi Apartments
 * Gestisce il form di prenotazione con invio automatico email
 */

// Base URL configurabile (via window.APP_CONFIG.apiBaseUrl oppure localhost di default)
const API_BASE_URL = (window.APP_CONFIG?.apiBaseUrl || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : '')).replace(/\/$/, '');

class BookingSystem {
  constructor() {
    this.modal = null;
    this.currentApartment = null;
    this.init();
    this.initEmailJS();
  }

  initEmailJS() {
    // EmailJS ora gestito dal backend
    console.log('Email system initialized via secure backend');
  }

  init() {
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    const modalHTML = `
      <div id="booking-modal" class="booking-modal">
        <div class="booking-modal-overlay" id="booking-modal-overlay"></div>
        <div class="booking-modal-content">
          <div class="booking-modal-header">
            <h2 id="booking-modal-title" data-lang="booking-modal-title">Prenota il tuo soggiorno</h2>
            <p class="booking-modal-subtitle" data-lang="booking-modal-subtitle">Non preoccuparti, non stai bloccando l'appartamento né lo stai prenotando definitivamente. Ti risponderemo sicuramente nel giro di 24h.</p>
            <button class="booking-modal-close" id="booking-modal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form id="booking-form" class="booking-form">
            <div class="booking-form-section">
              <h3 data-lang="booking-details-title">Dettagli Soggiorno</h3>
              
              <div class="booking-form-row">
                <div class="booking-form-field">
                  <label for="apartment-type" data-lang="booking-apartment-label">Quale appartamento vuoi prenotare? *</label>
                  <select id="apartment-type" name="apartmentType" required>
                    <option value="" data-lang="booking-select-apartment">Seleziona appartamento</option>
                    <option value="Bilocale" data-lang="booking-bilocale-option">Bilocale - Matrimoniale e Divano-Letto</option>
                    <option value="Trilocale" data-lang="booking-trilocale-option">Trilocale - Matrimoniale e Camera con due letti</option>
                  </select>
                </div>
              </div>
              
              <div class="booking-form-row">
                <div class="booking-form-field">
                  <label for="checkin-date" data-lang="booking-checkin-label">Data Check-in *</label>
                  <input type="date" id="checkin-date" name="checkinDate" required>
                </div>
                
                <div class="booking-form-field">
                  <label for="checkout-date" data-lang="booking-checkout-label">Data Check-out *</label>
                  <input type="date" id="checkout-date" name="checkoutDate" required>
                </div>
              </div>

              <div class="booking-form-row">
                <div class="booking-form-field">
                  <label for="adults" data-lang="booking-adults-label">Adulti *</label>
                  <select id="adults" name="adults" required>
                    <option value="" data-lang="booking-select">Seleziona</option>
                    <option value="1" data-lang="booking-1-adult">1 Adulto</option>
                    <option value="2" data-lang="booking-2-adults">2 Adulti</option>
                    <option value="3" data-lang="booking-3-adults">3 Adulti</option>
                    <option value="4" data-lang="booking-4-adults">4 Adulti</option>
                  </select>
                </div>
                
                <div class="booking-form-field">
                  <label for="children" data-lang="booking-children-label">Bambini (2-12 anni) *</label>
                  <select id="children" name="children" required>
                    <option value="0" data-lang="booking-none">Nessuno</option>
                    <option value="1" data-lang="booking-1-child">1 Bambino</option>
                    <option value="2" data-lang="booking-2-children">2 Bambini</option>
                    <option value="3" data-lang="booking-3-children">3 Bambini</option>
                  </select>
                </div>
                
                <div class="booking-form-field">
                  <label for="infants" data-lang="booking-infants-label">Neonati (0-2 anni) *</label>
                  <select id="infants" name="infants" required>
                    <option value="0" data-lang="booking-none">Nessuno</option>
                    <option value="1" data-lang="booking-1-infant">1 Neonato</option>
                    <option value="2" data-lang="booking-2-infants">2 Neonati</option>
                  </select>
                </div>
              </div>
              
              <div class="booking-form-row">
                <div class="booking-form-field">
                  <label for="pets" data-lang="booking-pets-label">Animali Domestici *</label>
                  <select id="pets" name="pets" required>
                    <option value="0" data-lang="booking-none">Nessuno</option>
                    <option value="1" data-lang="booking-1-pet">1 Animale</option>
                    <option value="2" data-lang="booking-2-pets">2 Animali</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="booking-form-section">
              <h3 data-lang="booking-contact-title">I tuoi dati di contatto</h3>
              
              <div class="booking-form-row">
                <div class="booking-form-field">
                  <label for="guest-name" data-lang="booking-name-label">Nome e Cognome *</label>
                  <input type="text" id="guest-name" name="guestName" required placeholder="Mario Rossi" data-lang-placeholder="booking-name-placeholder">
                </div>
                
                <div class="booking-form-field">
                  <label for="guest-phone" data-lang="booking-phone-label">Numero WhatsApp *</label>
                  <input type="tel" id="guest-phone" name="guestPhone" required placeholder="+39 333 1234567" data-lang-placeholder="booking-phone-placeholder">
                  <small data-lang="booking-phone-note">Ti contatteremo su WhatsApp per confermare la prenotazione</small>
                </div>
              </div>
              
              <div class="booking-form-field">
                <label for="guest-email" data-lang="booking-email-label">Email *</label>
                <input type="email" id="guest-email" name="guestEmail" required placeholder="mario.rossi@email.com" data-lang-placeholder="booking-email-placeholder">
              </div>
              
              <div class="booking-form-field">
                <label for="special-requests" data-lang="booking-requests-label">Richieste speciali o note aggiuntive</label>
                <textarea id="special-requests" name="specialRequests" rows="3" placeholder="Ad esempio 'Avremo bisogno della culla'" data-lang-placeholder="booking-requests-placeholder"></textarea>
              </div>
            </div>

            <div class="booking-form-actions">
              <button type="button" class="booking-btn-secondary" id="booking-cancel" data-lang="booking-cancel-btn">Annulla</button>
              <button type="submit" class="booking-btn-primary" id="booking-submit">
                <i class="fas fa-paper-plane"></i>
                <span data-lang="booking-submit-btn">Invia Richiesta</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('booking-modal');
  }

  bindEvents() {
    // Bind ai pulsanti "Prenota Ora" / "Book Now"
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-lang="contact-cta"], [data-lang="bilocale-hero-book"], [data-lang="trilocale-hero-book"], .cta-button.primary, .cta-button.secondary')) {
        const link = e.target.closest('a');
        const text = link?.textContent || '';
        if (link && (
          text.includes('Prenota') ||
          text.includes('Book') ||
          text.includes('Contatta') ||
          text.includes('Contact')
        )) {
          e.preventDefault();
          
          // Determina il tipo di appartamento dalla pagina corrente
          let apartmentType = null;
          const currentPath = window.location.pathname;
          if (currentPath.includes('bilocale')) {
            apartmentType = 'Bilocale';
          } else if (currentPath.includes('trilocale')) {
            apartmentType = 'Trilocale';
          }
          
          this.openModal(apartmentType);
        }
      }
    });

    // Eventi del modal
    document.getElementById('booking-modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('booking-modal-overlay').addEventListener('click', () => this.closeModal());
    document.getElementById('booking-cancel').addEventListener('click', () => this.closeModal());
    
    // Form submission
    document.getElementById('booking-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission();
    });

    // Date validation
    document.getElementById('checkin-date').addEventListener('change', () => this.validateDates());
    document.getElementById('checkout-date').addEventListener('change', () => this.validateDates());

    // Apartment selection
    document.getElementById('apartment-type').addEventListener('change', (e) => {
      this.currentApartment = e.target.value;
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  openModal(apartmentType = null) {
    this.currentApartment = apartmentType;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin-date').min = today;
    
    // Pre-select apartment type if provided
    const apartmentSelect = document.getElementById('apartment-type');
    if (apartmentType) {
      apartmentSelect.value = apartmentType;
      this.currentApartment = apartmentType;
    } else {
      apartmentSelect.value = '';
      this.currentApartment = null;
    }
    
    // Apply current language translations to modal
    const currentLang = localStorage.getItem('preferredLanguage') || 'it';
    this.applyLanguageToModal(currentLang);
    
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
      if (apartmentType) {
        document.getElementById('checkin-date').focus();
      } else {
        document.getElementById('apartment-type').focus();
      }
    }, 100);
  }
  
  applyLanguageToModal(lang) {
    // Get translations from window.translations if available
    if (typeof window.scalingiApp !== 'undefined' && window.scalingiApp.translations && window.scalingiApp.translations[lang]) {
      const translations = window.scalingiApp.translations[lang];
      
      // Apply translations to all elements with data-lang
      this.modal.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[key]) {
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            // For inputs/textareas, don't change value, only placeholder via data-lang-placeholder
          } else if (element.tagName === 'OPTION') {
            element.textContent = translations[key];
          } else {
            element.innerHTML = translations[key];
          }
        }
      });
      
      // Apply placeholder translations
      this.modal.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        if (translations[key]) {
          element.placeholder = translations[key];
        }
      });
    }
  }

  closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.resetForm();
  }

  validateDates() {
    const checkinDate = document.getElementById('checkin-date').value;
    const checkoutDate = document.getElementById('checkout-date').value;
    const checkoutInput = document.getElementById('checkout-date');
    
    if (checkinDate) {
      // Set minimum checkout date to day after checkin
      const minCheckout = new Date(checkinDate);
      minCheckout.setDate(minCheckout.getDate() + 1);
      checkoutInput.min = minCheckout.toISOString().split('T')[0];
      
      // Clear checkout if it's before new minimum
      if (checkoutDate && new Date(checkoutDate) <= new Date(checkinDate)) {
        checkoutInput.value = '';
      }
    }
  }

  calculateNights() {
    const checkinDate = document.getElementById('checkin-date').value;
    const checkoutDate = document.getElementById('checkout-date').value;
    
    if (checkinDate && checkoutDate) {
      const checkin = new Date(checkinDate);
      const checkout = new Date(checkoutDate);
      const diffTime = checkout - checkin;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  handleFormSubmission() {
    const formData = new FormData(document.getElementById('booking-form'));
    const data = Object.fromEntries(formData.entries());
    
    // Validation
    if (!this.validateForm(data)) {
      return;
    }

    // Show loading state
    this.setLoadingState(true);
    
    // Send email notification
    this.sendEmailNotification(data)
      .then(() => {
        this.showSuccessMessage();
        setTimeout(() => this.closeModal(), 5000);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        this.showErrorMessage();
        this.setLoadingState(false);
      });
  }

  async sendEmailNotification(data) {
    const nights = this.calculateNights();
    const totalGuests = parseInt(data.adults) + parseInt(data.children || 0) + parseInt(data.infants || 0);
    
    // Prepara i dati per il backend - usa la selezione dal form
    const bookingData = {
      apartment: data.apartmentType || 'Appartamento Scalingi',
      name: data.guestName,
      phone: data.guestPhone,
      email: data.guestEmail || '',
      start: data.checkinDate,
      end: data.checkoutDate,
      adults: data.adults,
      children: data.children || 0,
      infants: data.infants || 0,
      pets: data.pets || 0,
      message: data.specialRequests || ''
    };

    try {
      // Invia al backend sicuro invece di EmailJS diretto
      const response = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore invio email');
      }

      const result = await response.json();
      console.log('Email inviata con successo:', result);
      return Promise.resolve();
      
    } catch (error) {
      console.error('Errore invio email:', error);
      return Promise.reject(error);
    }
  }

  generateEmailMessage(data) {
    const nights = this.calculateNights();
    const totalGuests = parseInt(data.adults) + parseInt(data.children || 0) + parseInt(data.infants || 0);
    
    let message = `NUOVA RICHIESTA DI PRENOTAZIONE\n\n`;
    
    if (data.apartmentType) {
      message += `Appartamento: ${data.apartmentType}\n`;
    }
    
    message += `Check-in: ${this.formatDate(data.checkinDate)}\n`;
    message += `Check-out: ${this.formatDate(data.checkoutDate)}\n`;
    message += `Notti: ${nights}\n\n`;
    
    message += `OSPITI:\n`;
    message += `• Adulti: ${data.adults}\n`;
    if (data.children > 0) message += `• Bambini (2-12 anni): ${data.children}\n`;
    if (data.infants > 0) message += `• Neonati (0-2 anni): ${data.infants}\n`;
    if (data.pets > 0) message += `• Animali domestici: ${data.pets}\n`;
    message += `• Totale: ${totalGuests} persone\n\n`;
    
    message += `CONTATTO:\n`;
    message += `• Nome: ${data.guestName}\n`;
    message += `• WhatsApp: ${data.guestPhone}\n`;
    if (data.guestEmail) message += `• Email: ${data.guestEmail}\n`;
    
    if (data.specialRequests) {
      message += `\nRICHIESTE SPECIALI:\n${data.specialRequests}\n`;
    }
    
    return message;
  }

  setLoadingState(loading) {
    const submitBtn = document.getElementById('booking-submit');
    const btnText = submitBtn.querySelector('span');
    const btnIcon = submitBtn.querySelector('i');
    
    if (loading) {
      submitBtn.disabled = true;
      btnIcon.className = 'fas fa-spinner fa-spin';
      btnText.textContent = 'Invio in corso...';
    } else {
      submitBtn.disabled = false;
      btnIcon.className = 'fas fa-paper-plane';
      btnText.textContent = 'Invia Richiesta';
    }
  }

  validateForm(data) {
    const required = ['apartmentType', 'checkinDate', 'checkoutDate', 'adults', 'guestName', 'guestPhone'];
    
    for (const field of required) {
      if (!data[field]) {
        alert(`Il campo ${this.getFieldLabel(field)} è obbligatorio`);
        return false;
      }
    }
    
    // Validate dates
    const checkin = new Date(data.checkinDate);
    const checkout = new Date(data.checkoutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkin < today) {
      alert('La data di check-in non può essere nel passato');
      return false;
    }
    
    if (checkout <= checkin) {
      alert('La data di check-out deve essere successiva al check-in');
      return false;
    }
    
    // Validate phone
    if (!/^[\+]?[0-9\s\-\(\)]+$/.test(data.guestPhone)) {
      alert('Inserisci un numero di telefono valido');
      return false;
    }
    
    return true;
  }

  getFieldLabel(field) {
    const labels = {
      'apartmentType': 'Selezione Appartamento',
      'checkinDate': 'Data Check-in',
      'checkoutDate': 'Data Check-out',
      'adults': 'Numero Adulti',
      'guestName': 'Nome e Cognome',
      'guestPhone': 'Numero WhatsApp'
    };
    return labels[field] || field;
  }

  generateWhatsAppMessage(data) {
    const nights = this.calculateNights();
    const totalGuests = parseInt(data.adults) + parseInt(data.children || 0) + parseInt(data.infants || 0);
    
    let message = `🏖️ *RICHIESTA PRENOTAZIONE SCALINGI APARTMENTS*\n\n`;
    
    if (data.apartmentType) {
      message += `🏠 *Appartamento:* ${data.apartmentType}\n`;
    }
    
    message += `📅 *Check-in:* ${this.formatDate(data.checkinDate)}\n`;
    message += `📅 *Check-out:* ${this.formatDate(data.checkoutDate)}\n`;
    message += `🌙 *Notti:* ${nights}\n\n`;
    
    message += `👥 *Ospiti:*\n`;
    message += `• Adulti: ${data.adults}\n`;
    if (data.children > 0) message += `• Bambini (2-12 anni): ${data.children}\n`;
    if (data.infants > 0) message += `• Neonati (0-2 anni): ${data.infants}\n`;
    if (data.pets > 0) message += `• Animali domestici: ${data.pets}\n`;
    message += `• *Totale: ${totalGuests} persone*\n\n`;
    
    message += `👤 *Contatto:*\n`;
    message += `• Nome: ${data.guestName}\n`;
    message += `• WhatsApp: ${data.guestPhone}\n`;
    if (data.guestEmail) message += `• Email: ${data.guestEmail}\n`;
    
    if (data.specialRequests) {
      message += `\n📝 *Richieste speciali:*\n${data.specialRequests}\n`;
    }
    
    message += `\n✨ Grazie per aver scelto Scalingi Apartments!\nTi risponderemo al più presto per confermare la disponibilità.`;
    
    return message;
  }

  showSuccessMessage() {
    const successHTML = `
      <div class="booking-success">
        <i class="fas fa-check-circle"></i>
        <h3>Richiesta inviata con successo!</h3>
        <p>Abbiamo ricevuto la tua richiesta di prenotazione.<br>Ti contatteremo entro 24 ore per confermare la disponibilità.</p>
      </div>
    `;
    
    const modalContent = this.modal.querySelector('.booking-modal-content');
    modalContent.innerHTML = successHTML;
  }

  showErrorMessage() {
    const errorHTML = `
      <div class="booking-error">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Errore nell'invio</h3>
        <p>Si è verificato un problema nell'invio della richiesta.<br>Ti preghiamo di riprovare o contattarci direttamente.</p>
        <button class="booking-btn-primary" onclick="location.reload()">
          <i class="fas fa-redo"></i>
          Riprova
        </button>
      </div>
    `;
    
    const modalContent = this.modal.querySelector('.booking-modal-content');
    modalContent.innerHTML = errorHTML;
  }

  resetForm() {
    document.getElementById('booking-form').reset();
    this.currentApartment = null;
    this.setLoadingState(false);
  }
}

// Initialize booking system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BookingSystem();
});
