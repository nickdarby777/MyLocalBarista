/* 
===========================================
WAITLIST FORM HANDLER
===========================================

This file handles the waitlist form submission with Google Forms integration.
It provides:
- Form validation and error handling
- Google Forms submission (when configured)
- Success/error feedback to users
- Form data preprocessing
- Accessibility support

GOOGLE FORMS SETUP INSTRUCTIONS:
1. Create a Google Form with matching field names
2. Get the form action URL from Google Forms
3. Update the GOOGLE_FORM_URL constant below
4. Map form field names to Google Forms entry IDs

FEATURES:
- Client-side validation
- Real-time feedback
- Graceful error handling
- Accessible form interactions
- Loading states and animations
*/

/* ===========================================
   FORM HANDLER CLASS
   =========================================== */

class WaitlistFormHandler {
    constructor() {
        // Form elements
        this.form = document.getElementById('waitlist-form');
        this.submitBtn = this.form?.querySelector('button[type="submit"]');
        
        // Form fields
        this.fields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            zip: document.getElementById('zip'),
            interest: document.getElementById('interest'),
            espressoMachine: this.form?.querySelector('input[name="espresso_machine"]:checked'),
            comments: document.getElementById('comments')
        };
        
        // Google Forms configuration
        // Converted from: https://docs.google.com/forms/d/e/1FAIpQLSflEWC2sYiZ8lwPJtkgjq3X5Jjfcz-KENfeVQS7xDWG4J9TJg/viewform
        this.GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSflEWC2sYiZ8lwPJtkgjq3X5Jjfcz-KENfeVQS7xDWG4J9TJg/formResponse';
        this.GOOGLE_FORM_ENTRIES = {
            name: 'entry.847057752',        // Full Name field ✅ WORKING
            email: 'entry.508055351',       // Email Address field ✅ WORKING  
            zip: 'entry.832508456',         // Zip Code field ✅ WORKING
            interest: 'entry.1561535688',   // Primary Interest dropdown ✅ FOUND IN SOURCE
            espresso_machine: 'entry.1117044731', // Espresso machine radio ✅ FOUND IN SOURCE
            comments: 'entry.1572710206'  // Comments field ✅ FOUND IN SOURCE
        };
        
        // Form state
        this.isSubmitting = false;
        this.originalButtonText = '';
        
        this.init();
    }
    
    /* ===========================================
       INITIALIZATION
       =========================================== */
    
    init() {
        if (!this.form) {
            console.warn('⚠️ Waitlist form not found');
            return;
        }
        
        console.log('📝 Initializing Waitlist Form Handler...');
        
        // Store original button text
        if (this.submitBtn) {
            this.originalButtonText = this.submitBtn.innerHTML;
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up form validation
        this.setupValidation();
        
        console.log('✅ Waitlist Form Handler initialized');
    }
    
    /* ===========================================
       EVENT LISTENERS
       =========================================== */
    
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        Object.values(this.fields).forEach(field => {
            if (field) {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            }
        });
        
        // Radio button change handler
        const radioButtons = this.form.querySelectorAll('input[name="espresso_machine"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                this.fields.espressoMachine = this.form.querySelector('input[name="espresso_machine"]:checked');
            });
        });
    }
    
    /* ===========================================
       FORM VALIDATION
       =========================================== */
    
    setupValidation() {
        // Add required field indicators
        const requiredFields = this.form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const label = this.form.querySelector(`label[for="${field.id}"]`);
            if (label && !label.textContent.includes('*')) {
                label.innerHTML = label.innerHTML.replace(' *', '') + ' <span style="color: var(--color-error);">*</span>';
            }
        });
    }
    
    validateField(field) {
        if (!field) return true;
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Field-specific validation
        switch (field.type || field.tagName.toLowerCase()) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'text':
                if (field.id === 'zip' && value) {
                    if (!this.isValidZipCode(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid 5-digit zip code';
                    }
                }
                if (field.id === 'name' && value) {
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters long';
                    }
                }
                break;
        }
        
        // Display validation result
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    validateForm() {
        let isFormValid = true;
        
        // Validate all fields
        Object.values(this.fields).forEach(field => {
            if (field && !this.validateField(field)) {
                isFormValid = false;
            }
        });
        
        // Check radio button selection
        const radioSelected = this.form.querySelector('input[name="espresso_machine"]:checked');
        if (!radioSelected) {
            isFormValid = false;
            this.showGeneralError('Please select whether you own an espresso machine');
        }
        
        return isFormValid;
    }
    
    /* ===========================================
       FORM SUBMISSION
       =========================================== */
    
    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) return;
        
        console.log('📤 Form submission started...');
        
        // Clear previous errors
        this.clearAllErrors();
        
        // Validate form
        if (!this.validateForm()) {
            console.log('❌ Form validation failed');
            this.showGeneralError('Please fix the errors above and try again');
            return;
        }
        
        // Set submitting state
        this.setSubmittingState(true);
        
        // Collect form data
        const formData = this.collectFormData();
        
        try {
            // Submit to Google Forms (or handle locally)
            await this.submitToGoogleForms(formData);
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            this.resetForm();
            
            console.log('✅ Form submitted successfully');
            
        } catch (error) {
            console.error('❌ Form submission error:', error);
            this.showSubmissionError();
        } finally {
            this.setSubmittingState(false);
        }
    }
    
    collectFormData() {
        const espressoMachineValue = this.form.querySelector('input[name="espresso_machine"]:checked')?.value || '';
        
        // Convert form values to Google Forms expected text
        const interestMapping = {
            'training': 'Training - Learn espresso & latte art',
            'events': 'Events - Barista for gatherings', 
            'machine-help': 'Machine Help - Equipment maintenance',
            'all': 'All services interest me'
        };
        
        const espressoMachineMapping = {
            'yes': 'Yes, I have an espresso machine',
            'no': 'No, but I\'m interested in getting one',
            'considering': 'I\'m considering purchasing one'
        };
        
        return {
            name: this.fields.name?.value.trim() || '',
            email: this.fields.email?.value.trim() || '',
            zip: this.fields.zip?.value.trim() || '',
            interest: interestMapping[this.fields.interest?.value] || this.fields.interest?.value || '',
            espresso_machine: espressoMachineMapping[espressoMachineValue] || espressoMachineValue,
            comments: this.fields.comments?.value.trim() || '',
            timestamp: new Date().toISOString(),
            source: 'MyLocalBarista Landing Page'
        };
    }
    
    async submitToGoogleForms(formData) {
        console.log('📋 Form data to submit:', formData);
        
        try {
            // Create FormData for Google Forms submission
            const googleFormData = new FormData();
            
            // Log the entry mappings for debugging
            console.log('🔍 Entry ID Mappings:');
            console.log(`Name (${formData.name}) -> ${this.GOOGLE_FORM_ENTRIES.name}`);
            console.log(`Email (${formData.email}) -> ${this.GOOGLE_FORM_ENTRIES.email}`);
            console.log(`Zip (${formData.zip}) -> ${this.GOOGLE_FORM_ENTRIES.zip}`);
            console.log(`Interest (${formData.interest}) -> ${this.GOOGLE_FORM_ENTRIES.interest}`);
            console.log(`Espresso Machine (${formData.espresso_machine}) -> ${this.GOOGLE_FORM_ENTRIES.espresso_machine}`);
            console.log(`Comments (${formData.comments}) -> ${this.GOOGLE_FORM_ENTRIES.comments}`);
            
            // Append form data with entry IDs
            googleFormData.append(this.GOOGLE_FORM_ENTRIES.name, formData.name);
            googleFormData.append(this.GOOGLE_FORM_ENTRIES.email, formData.email);
            googleFormData.append(this.GOOGLE_FORM_ENTRIES.zip, formData.zip);
            googleFormData.append(this.GOOGLE_FORM_ENTRIES.interest, formData.interest);
            googleFormData.append(this.GOOGLE_FORM_ENTRIES.espresso_machine, formData.espresso_machine);
            googleFormData.append(this.GOOGLE_FORM_ENTRIES.comments, formData.comments);
            
            console.log('📤 Submitting to Google Forms:', this.GOOGLE_FORM_URL);
            
            // Submit to Google Forms
            const response = await fetch(this.GOOGLE_FORM_URL, {
                method: 'POST',
                body: googleFormData,
                mode: 'no-cors' // Required for Google Forms - prevents CORS issues
            });
            
            // Note: Google Forms returns opaque response in no-cors mode
            // We assume success if no error is thrown
            console.log('✅ Google Forms submission completed (no-cors mode - cannot verify response)');
            
            // Also store locally as backup
            this.storeFormDataLocally(formData);
            
            return true;
            
        } catch (error) {
            console.error('❌ Google Forms submission failed:', error);
            
            // Store locally as fallback
            this.storeFormDataLocally(formData);
            
            // Re-throw error to trigger error handling in main submission flow
            throw error;
        }
    }
    
    storeFormDataLocally(formData) {
        try {
            const existingData = JSON.parse(localStorage.getItem('mylocalbarista_waitlist') || '[]');
            existingData.push(formData);
            localStorage.setItem('mylocalbarista_waitlist', JSON.stringify(existingData));
            
            console.log('💾 Form data stored locally for demo purposes');
        } catch (error) {
            console.warn('⚠️ Could not store form data locally:', error);
        }
    }
    
    /* ===========================================
       UI STATE MANAGEMENT
       =========================================== */
    
    setSubmittingState(isSubmitting) {
        this.isSubmitting = isSubmitting;
        
        if (!this.submitBtn) return;
        
        if (isSubmitting) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                Joining Waitlist...
            `;
            this.submitBtn.style.opacity = '0.8';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = this.originalButtonText;
            this.submitBtn.style.opacity = '';
        }
    }
    
    showFieldError(field, message) {
        if (!field) return;
        
        // Remove existing error
        this.clearFieldError(field);
        
        // Add error class to field
        field.classList.add('error');
        field.style.borderColor = 'var(--color-error)';
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--color-error);
            font-size: 0.875rem;
            margin-top: var(--space-xs);
            font-weight: var(--font-weight-medium);
        `;
        
        // Insert error message
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.appendChild(errorElement);
        }
        
        // Focus on field for accessibility
        field.focus();
    }
    
    clearFieldError(field) {
        if (!field) return;
        
        field.classList.remove('error');
        field.style.borderColor = '';
        
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            const errorElement = formGroup.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }
    
    clearAllErrors() {
        // Clear field errors
        this.form.querySelectorAll('.field-error').forEach(error => error.remove());
        this.form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
            field.style.borderColor = '';
        });
        
        // Clear general errors
        const generalError = this.form.querySelector('.general-error');
        if (generalError) {
            generalError.remove();
        }
    }
    
    showGeneralError(message) {
        // Remove existing general error
        const existingError = this.form.querySelector('.general-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message
        const errorElement = document.createElement('div');
        errorElement.className = 'general-error';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        errorElement.style.cssText = `
            background: color-mix(in srgb, var(--color-error) 10%, var(--color-white));
            color: var(--color-error);
            padding: var(--space-md);
            border-radius: var(--border-radius-medium);
            border: 1px solid var(--color-error);
            margin-bottom: var(--space-lg);
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            font-weight: var(--font-weight-medium);
        `;
        
        // Insert at top of form
        this.form.insertBefore(errorElement, this.form.firstChild);
    }
    
    showSubmissionError() {
        this.showGeneralError('Sorry, there was an error submitting your information. Please try again in a moment.');
    }
    
    showSuccessMessage() {
        // Create success overlay
        const successOverlay = document.createElement('div');
        successOverlay.className = 'success-overlay';
        successOverlay.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Welcome to the Waitlist!</h3>
                <p>Thank you for joining! We'll be in touch soon with updates about MyLocalBarista services in your area.</p>
                <button class="btn btn-primary" onclick="this.closest('.success-overlay').remove()">
                    <i class="fas fa-thumbs-up"></i>
                    Awesome!
                </button>
            </div>
        `;
        successOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        // Style success content
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .success-content {
                background: var(--color-white);
                padding: var(--space-2xl);
                border-radius: var(--border-radius-xl);
                text-align: center;
                max-width: 400px;
                margin: var(--space-lg);
                box-shadow: var(--shadow-xl);
                animation: slideUp 0.4s ease-out;
            }
            
            .success-content i {
                font-size: 3rem;
                color: var(--color-success);
                margin-bottom: var(--space-lg);
            }
            
            .success-content h3 {
                color: var(--primary-color);
                margin-bottom: var(--space-md);
            }
            
            .success-content p {
                color: var(--theme-text-secondary);
                margin-bottom: var(--space-xl);
                line-height: 1.6;
            }
            
            @keyframes slideUp {
                from { 
                    transform: translateY(30px);
                    opacity: 0;
                }
                to { 
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Add to page
        document.body.appendChild(successOverlay);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successOverlay.parentNode) {
                successOverlay.remove();
                style.remove();
            }
        }, 5000);
    }
    
    resetForm() {
        this.form.reset();
        this.clearAllErrors();
    }
    
    /* ===========================================
       VALIDATION UTILITIES
       =========================================== */
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidZipCode(zip) {
        const zipRegex = /^\d{5}$/;
        return zipRegex.test(zip);
    }
    
    /* ===========================================
       DEBUGGING HELPER METHOD
       =========================================== */
    
    // Call this method in console to generate a test URL for verifying entry IDs
    generateTestURL() {
        const testData = {
            name: 'Test Name',
            email: 'test@example.com',
            zip: '12345',
            interest: 'Training - Learn espresso & latte art',  // Exact text from Google Form
            espresso_machine: 'Yes, I have an espresso machine', // Exact text from Google Form
            comments: 'This is a test submission'
        };
        
        const params = new URLSearchParams();
        params.append(this.GOOGLE_FORM_ENTRIES.name, testData.name);
        params.append(this.GOOGLE_FORM_ENTRIES.email, testData.email);
        params.append(this.GOOGLE_FORM_ENTRIES.zip, testData.zip);
        params.append(this.GOOGLE_FORM_ENTRIES.interest, testData.interest);
        params.append(this.GOOGLE_FORM_ENTRIES.espresso_machine, testData.espresso_machine);
        params.append(this.GOOGLE_FORM_ENTRIES.comments, testData.comments);
        
        const testURL = `${this.GOOGLE_FORM_URL}?${params.toString()}`;
        
        console.log('🧪 Test URL (open this to verify entry IDs):');
        console.log(testURL);
        console.log('\n📋 Instructions:');
        console.log('1. Copy the URL above');
        console.log('2. Open it in a new tab');
        console.log('3. If the form fields are populated, your entry IDs are correct!');
        console.log('4. If not, you need to find the correct entry IDs from your form source');
        
        return testURL;
    }
}

/* ===========================================
   GOOGLE FORMS SETUP HELPER
   =========================================== */

/**
 * INSTRUCTIONS FOR GOOGLE FORMS INTEGRATION:
 * 
 * 1. Create a new Google Form at https://forms.google.com
 * 
 * 2. Add the following questions (make sure question types match):
 *    - "Full Name" (Short answer, Required)
 *    - "Email Address" (Short answer, Required)
 *    - "Zip Code" (Short answer, Required)
 *    - "Primary Interest" (Multiple choice, Required)
 *      Options: Training, Events, Machine Help, All services
 *    - "Do you own an espresso machine?" (Multiple choice)
 *      Options: Yes, No, Considering
 *    - "Comments" (Paragraph, Optional)
 * 
 * 3. Get the form URL by clicking "Send" and copying the link
 * 
 * 4. To get entry IDs:
 *    - Open the form
 *    - Right-click and "View Page Source"
 *    - Search for "entry." to find entry IDs
 *    - Update the GOOGLE_FORM_ENTRIES object above
 * 
 * 5. Replace GOOGLE_FORM_URL with your actual form URL
 *    (change /viewform to /formResponse)
 * 
 * 6. Uncomment the Google Forms submission code in submitToGoogleForms()
 */

/* ===========================================
   INITIALIZATION
   =========================================== */

// Initialize form handler when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📝 Initializing waitlist form...');
    window.waitlistFormHandler = new WaitlistFormHandler();
});



/* ===========================================
   EXPORT FOR MODULE USAGE
   =========================================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WaitlistFormHandler;
}