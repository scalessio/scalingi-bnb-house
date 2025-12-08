/**
 * EmailJS Configuration per Scalingi Apartments
 * Istruzioni per configurare il servizio di invio email automatico
 */

// ==== ISTRUZIONI PER CONFIGURARE EMAILJS (GRATUITO) ====

/* 
1. Vai su https://www.emailjs.com/ e crea un account gratuito
2. Nel dashboard, vai su "Email Services" e collega il tuo account email:
   - Gmail (consigliato per facilità)
   - Outlook/Hotmail  
   - Yahoo
   - O qualsiasi provider SMTP

3. Crea un "Email Template" con questi parametri:
   - Template ID: booking_notification
   - Oggetto: Nuova Prenotazione - {{apartment}}
   - Contenuto del template:
     
     Nuova richiesta di prenotazione ricevuta!
     
     APPARTAMENTO: {{apartment}}
     
     CLIENTE:
     Nome: {{guest_name}}
     WhatsApp: {{guest_phone}}
     Email: {{guest_email}}
     
     SOGGIORNO:
     Check-in: {{checkin_date}}
     Check-out: {{checkout_date}}
     Notti: {{nights}}
     
     OSPITI:
     Adulti: {{adults}}
     Bambini: {{children}}
     Neonati: {{infants}}
     Totale: {{total_guests}} persone
     
     RICHIESTE SPECIALI:
     {{special_requests}}
     
     Data richiesta: {{booking_date}}
     
     ---
     Scalingi Apartments - Sistema Prenotazioni

4. Vai su "Integration" e copia le tue chiavi:
   - Public Key
   - Service ID  
   - Template ID

5. Sostituisci i valori qui sotto con le tue chiavi reali
*/

// ==== CONFIGURAZIONE ====
const EMAIL_CONFIG = {
  // La tua chiave pubblica di EmailJS
  publicKey: "YOUR_PUBLIC_KEY_HERE",
  
  // ID del servizio email (es: gmail, outlook, etc)
  serviceId: "YOUR_SERVICE_ID_HERE", 
  
  // ID del template per le notifiche di prenotazione
  templateId: "booking_notification",
  
  // Email dove ricevere le notifiche (opzionale, se non specificato nel template)
  notificationEmail: "your-email@gmail.com"
};

// ==== IMPLEMENTAZIONE ALTERNATIVA GRATUITA CON FORMSPREE ====
/*
Se preferisci, puoi usare Formspree invece di EmailJS:

1. Vai su https://formspree.io/ e crea un account
2. Crea un nuovo form e copia l'endpoint URL
3. Nel booking.js, sostituisci il metodo sendEmailNotification con:

async sendEmailNotification(data) {
  const formData = new FormData();
  formData.append('apartment', this.currentApartment || 'Scalingi Apartments');
  formData.append('guest_name', data.guestName);
  formData.append('guest_phone', data.guestPhone);
  formData.append('guest_email', data.guestEmail);
  formData.append('checkin_date', data.checkinDate);
  formData.append('checkout_date', data.checkoutDate);
  formData.append('adults', data.adults);
  formData.append('children', data.children);
  formData.append('infants', data.infants);
  formData.append('special_requests', data.specialRequests);
  formData.append('message', this.generateEmailMessage(data));

  const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return response.json();
}
*/

// ==== WHATSAPP BUSINESS API (OPZIONALE) ====
/*
Per inviare automaticamente anche un messaggio WhatsApp:

1. Registrati su Twilio (https://www.twilio.com/)
2. Configura WhatsApp Business API
3. Aggiungi questa funzione al booking.js:

async sendWhatsAppNotification(data) {
  const message = this.generateWhatsAppMessage(data);
  
  const response = await fetch('/api/send-whatsapp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: '+393331234567', // Tuo numero WhatsApp Business
      message: message
    })
  });
  
  return response.json();
}

Nota: Richiede un backend server per gestire l'API di Twilio
*/

export default EMAIL_CONFIG;
