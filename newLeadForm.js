document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Form validation
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Phone validation (basic)
    function validatePhone(phone) {
        const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return re.test(phone);
    }

    // Real-time validation
    form.addEventListener('input', function (e) {
        const field = e.target;

        if (field.type === 'email' && field.value) {
            if (!validateEmail(field.value)) {
                field.setCustomValidity('Please enter a valid email address');
            } else {
                field.setCustomValidity('');
            }
        }

        if (field.type === 'tel' && field.value) {
            if (!validatePhone(field.value)) {
                field.setCustomValidity('Please enter a valid phone number');
            } else {
                field.setCustomValidity('');
            }
        }
    });

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';

        // Simulate form submission (replace with actual submission)
        setTimeout(() => {
            // For demo purposes, we'll just show success
            // In real implementation, submit the form data
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');

            // Reset form after successful submission
            form.reset();

            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
        }, 2000);

        // Uncomment below for actual form submission
        form.submit();
    });

    // Reset form
    resetBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
            form.reset();
            clearValidationStyles();
        }
    });

    // Clear validation styles
    function clearValidationStyles() {
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('error');
            field.setCustomValidity('');
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 400px;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            color: white;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        `;

        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        document.body.appendChild(notification);

        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Close button functionality
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Dynamic state/province based on country
    const countrySelect = document.getElementById('country_code');
    const stateSelect = document.getElementById('state_code');

    const stateOptions = {
        'ID': [
            { value: 'AC', text: 'Aceh' },
            { value: 'SU', text: 'Sumatera Utara' },
            { value: 'SB', text: 'Sumatera Barat' },
            { value: 'RI', text: 'Riau' },
            { value: 'KR', text: 'Kepulauan Riau' },
            { value: 'JB', text: 'Jambi' },
            { value: 'SS', text: 'Sumatera Selatan' },
            { value: 'BB', text: 'Bangka Belitung' },
            { value: 'BE', text: 'Bengkulu' },
            { value: 'LA', text: 'Lampung' },
            { value: 'JK', text: 'DKI Jakarta' },
            { value: 'JB', text: 'Jawa Barat' },
            { value: 'BT', text: 'Banten' },
            { value: 'JT', text: 'Jawa Tengah' },
            { value: 'YO', text: 'DI Yogyakarta' },
            { value: 'JI', text: 'Jawa Timur' },
            { value: 'BA', text: 'Bali' },
            { value: 'NB', text: 'Nusa Tenggara Barat' },
            { value: 'NT', text: 'Nusa Tenggara Timur' },
            { value: 'KB', text: 'Kalimantan Barat' },
            { value: 'KT', text: 'Kalimantan Tengah' },
            { value: 'KS', text: 'Kalimantan Selatan' },
            { value: 'KI', text: 'Kalimantan Timur' },
            { value: 'KU', text: 'Kalimantan Utara' },
            { value: 'SA', text: 'Sulawesi Utara' },
            { value: 'SR', text: 'Sulawesi Barat' },
            { value: 'ST', text: 'Sulawesi Tengah' },
            { value: 'SN', text: 'Sulawesi Selatan' },
            { value: 'SG', text: 'Sulawesi Tenggara' },
            { value: 'GO', text: 'Gorontalo' },
            { value: 'MA', text: 'Maluku' },
            { value: 'MU', text: 'Maluku Utara' },
            { value: 'PA', text: 'Papua' },
            { value: 'PB', text: 'Papua Barat' },
            { value: 'PS', text: 'Papua Selatan' },
            { value: 'PT', text: 'Papua Tengah' },
            { value: 'PP', text: 'Papua Pegunungan' },
            { value: 'PW', text: 'Papua Barat Daya' }
        ],
        'MY': [
            { value: 'KL', text: 'Kuala Lumpur' },
            { value: 'SL', text: 'Selangor' },
            { value: 'JH', text: 'Johor' },
            { value: 'PG', text: 'Penang' }
        ],
        'SG': [
            { value: 'SG', text: 'Singapore' }
        ],
        'TH': [
            { value: 'BK', text: 'Bangkok' },
            { value: 'CM', text: 'Chiang Mai' },
            { value: 'PK', text: 'Phuket' }
        ]
    };

    countrySelect.addEventListener('change', function () {
        const countryCode = this.value;
        const states = stateOptions[countryCode] || [];

        // Clear existing options
        stateSelect.innerHTML = '<option value="">Select state</option>';

        // Add new options
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state.value;
            option.textContent = state.text;
            stateSelect.appendChild(option);
        });

        stateSelect.disabled = states.length === 0;
    });

    // Initialize
    clearValidationStyles();
});