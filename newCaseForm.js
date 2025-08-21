// Form validation and interaction functionality
document.addEventListener('DOMContentLoaded', function () {
    // Get form elements
    const form = document.querySelector('form');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const requiredFields = document.querySelectorAll('[required]');

    // Initialize form
    initializeForm();

    /**
     * Initialize form with event listeners and validation
     */
    function initializeForm() {
        // Add real-time validation
        addFieldValidation();

        // Add form submission handling
        addFormSubmission();

        // Add reset functionality
        addResetFunctionality();

        // Add form auto-save (optional)
        addAutoSave();

        // Add dynamic field interactions
        addDynamicInteractions();
    }

    /**
     * Add real-time field validation
     */
    function addFieldValidation() {
        requiredFields.forEach(field => {
            // Validate on blur
            field.addEventListener('blur', function () {
                validateField(this);
            });

            // Clear errors on input
            field.addEventListener('input', function () {
                clearFieldError(this);
            });
        });

        // Email validation
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('blur', function () {
                validateEmail(this);
            });
        }

        // Phone validation
        const phoneField = document.getElementById('phone');
        if (phoneField) {
            phoneField.addEventListener('input', function () {
                formatPhoneNumber(this);
            });
        }
    }

    /**
     * Add form submission handling
     */
    function addFormSubmission() {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateForm()) {
                submitForm();
            }
        });
    }

    /**
     * Add reset form functionality
     */
    function addResetFunctionality() {
        resetBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
                resetForm();
            }
        });
    }

    /**
     * Add auto-save functionality
     */
    function addAutoSave() {
        const formData = {};
        const saveableFields = form.querySelectorAll('input, select, textarea');

        // Load saved data
        loadSavedData();

        // Save data on input
        saveableFields.forEach(field => {
            field.addEventListener('input', function () {
                saveFieldData(this);
            });
        });

        function saveFieldData(field) {
            if (field.name && field.value) {
                formData[field.name] = field.value;
                localStorage.setItem('newCaseForm_draft', JSON.stringify(formData));
            }
        }

        function loadSavedData() {
            const savedData = localStorage.getItem('newCaseForm_draft');
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    Object.keys(data).forEach(fieldName => {
                        const field = form.querySelector(`[name="${fieldName}"]`);
                        if (field && !field.value) {
                            field.value = data[fieldName];
                        }
                    });
                } catch (e) {
                    console.warn('Could not load saved form data');
                }
            }
        }
    }

    /**
     * Add dynamic field interactions
     */
    function addDynamicInteractions() {
        // Priority field color coding
        const priorityField = document.getElementById('priority');
        if (priorityField) {
            priorityField.addEventListener('change', function () {
                updatePriorityStyling(this);
            });
        }

        // Case type dependent fields
        const typeField = document.getElementById('type');
        if (typeField) {
            typeField.addEventListener('change', function () {
                handleCaseTypeChange(this);
            });
        }
    }

    /**
     * Validate individual field
     */
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        let isValid = true;
        let errorMessage = '';

        // Check if required field is empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Additional validation based on field type
        if (field.type === 'email' && field.value) {
            isValid = validateEmailFormat(field.value);
            if (!isValid) errorMessage = 'Please enter a valid email address';
        }

        // Update field state
        updateFieldState(formGroup, isValid, errorMessage);
        return isValid;
    }

    /**
     * Validate email format
     */
    function validateEmail(field) {
        const formGroup = field.closest('.form-group');
        const isValid = validateEmailFormat(field.value);

        if (!isValid && field.value) {
            updateFieldState(formGroup, false, 'Please enter a valid email address');
        }

        return isValid;
    }

    /**
     * Validate email format helper
     */
    function validateEmailFormat(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Format phone number
     */
    function formatPhoneNumber(field) {
        let value = field.value.replace(/\D/g, '');

        // Add +62 prefix for Indonesian numbers if not present
        if (value.length > 0 && !value.startsWith('62') && !field.value.startsWith('+')) {
            if (value.startsWith('0')) {
                value = '62' + value.substring(1);
            }
        }

        // Format the number
        if (value.startsWith('62')) {
            value = '+62 ' + value.substring(2);
        }

        field.value = value;
    }

    /**
     * Update field state (error/success)
     */
    function updateFieldState(formGroup, isValid, errorMessage = '') {
        // Remove existing states
        formGroup.classList.remove('error', 'success');

        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (!isValid) {
            formGroup.classList.add('error');
            if (errorMessage) {
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = errorMessage;
                formGroup.appendChild(errorElement);
            }
        } else {
            formGroup.classList.add('success');
        }
    }

    /**
     * Clear field error state
     */
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');

        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    /**
     * Validate entire form
     */
    function validateForm() {
        let isFormValid = true;

        // Validate all required fields
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        // Scroll to first error if any
        if (!isFormValid) {
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }

        return isFormValid;
    }

    /**
     * Submit form
     */
    function submitForm() {
        // Show loading state
        setSubmissionState(true);

        // Clear auto-saved data
        localStorage.removeItem('newCaseForm_draft');

        // Submit the actual form
        form.submit();
    }

    /**
     * Set form submission state
     */
    function setSubmissionState(isSubmitting) {
        if (isSubmitting) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            resetBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            resetBtn.disabled = false;
        }
    }

    /**
     * Reset form
     */
    function resetForm() {
        form.reset();

        // Clear all validation states
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });

        // Clear auto-saved data
        localStorage.removeItem('newCaseForm_draft');

        // Reset dynamic styling
        const priorityField = document.getElementById('priority');
        if (priorityField) {
            priorityField.style.removeProperty('border-color');
        }

        // Focus first field
        const firstField = form.querySelector('input, select, textarea');
        if (firstField) {
            firstField.focus();
        }
    }

    /**
     * Update priority field styling based on selection
     */
    function updatePriorityStyling(field) {
        const value = field.value;

        // Reset styling
        field.style.removeProperty('border-color');

        // Apply color based on priority
        switch (value) {
            case 'High':
                field.style.borderColor = '#ef4444';
                break;
            case 'Medium':
                field.style.borderColor = '#f59e0b';
                break;
            case 'Low':
                field.style.borderColor = '#10b981';
                break;
        }
    }

    /**
     * Handle case type change
     */
    function handleCaseTypeChange(field) {
        const value = field.value;
        const descriptionField = document.getElementById('description');

        if (descriptionField && !descriptionField.value) {
            // Update placeholder based on case type
            switch (value) {
                case 'Technical Support':
                    descriptionField.placeholder = 'Please describe the technical issue you\'re experiencing, including error messages, steps you\'ve already tried, and your system information...';
                    break;
                case 'Bug Report':
                    descriptionField.placeholder = 'Please describe the bug, what you expected to happen vs. what actually happened, and steps to reproduce the issue...';
                    break;
                case 'Feature Request':
                    descriptionField.placeholder = 'Please describe the feature you\'d like to see, how it would help you, and any specific requirements...';
                    break;
                case 'Order Issue':
                    descriptionField.placeholder = 'Please provide your order number and describe the issue you\'re experiencing...';
                    break;
                default:
                    descriptionField.placeholder = 'Please provide detailed information about your issue, including steps to reproduce, error messages, or any relevant details...';
            }
        }
    }

    /**
     * Keyboard shortcuts
     */
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + Enter to submit
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (validateForm()) {
                submitForm();
            }
        }

        // Escape to clear current field
        if (e.key === 'Escape') {
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT' || activeElement.tagName === 'TEXTAREA')) {
                activeElement.blur();
            }
        }
    });

    /**
     * Handle form errors from server
     */
    window.addEventListener('pageshow', function (event) {
        // If we're back on this page after submission, there might have been an error
        if (event.persisted || (performance.navigation && performance.navigation.type === 2)) {
            setSubmissionState(false);
        }
    });
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmailFormat: function (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    };
}
