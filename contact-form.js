// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        // Get the submit button
        const submitButton = contactForm.querySelector('button[type="button"]');
        
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Form validation
            let isValid = true;
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            if (!name) {
                isValid = false;
                highlightInvalidField('name');
            }
            
            if (!email || !isValidEmail(email)) {
                isValid = false;
                highlightInvalidField('email');
            }
            
            if (!message) {
                isValid = false;
                highlightInvalidField('message');
            }
            
            if (!isValid) {
                showMessage('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Send form data via AJAX
            fetch('contact-form-handler.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Clear form
                    contactForm.reset();
                    showMessage(data.message, 'success');
                } else {
                    showMessage(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('An error occurred. Please try again later.', 'error');
            })
            .finally(() => {
                // Reset button state
                submitButton.textContent = 'Submit';
                submitButton.disabled = false;
            });
        });
    }
    
    // Helper functions
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function highlightInvalidField(fieldName) {
        const field = contactForm.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('invalid-field');
            
            // Remove invalid class on input
            field.addEventListener('input', function() {
                this.classList.remove('invalid-field');
            }, { once: true });
        }
    }
    
    function showMessage(message, type) {
        // Get or create message container
        let alertBox = document.getElementById('email_sent');
        
        if (!alertBox) {
            alertBox = document.createElement('div');
            alertBox.id = 'email_sent';
            alertBox.className = 'alert';
            
            // Add close button
            const closeBtn = document.createElement('a');
            closeBtn.href = '#';
            closeBtn.className = 'close';
            closeBtn.setAttribute('data-dismiss', 'alert');
            closeBtn.setAttribute('aria-label', 'close');
            closeBtn.innerHTML = '&times;';
            
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                alertBox.style.display = 'none';
            });
            
            alertBox.appendChild(closeBtn);
            
            // Insert before the form
            contactForm.parentNode.insertBefore(alertBox, contactForm);
        }
        
        // Update message and class
        alertBox.className = type === 'success' 
            ? 'alert alert-success' 
            : 'alert alert-danger';
            
        // Clear previous content except close button
        const closeBtn = alertBox.querySelector('.close');
        alertBox.innerHTML = '';
        alertBox.appendChild(closeBtn);
        
        // Add message
        const strongElement = document.createElement('strong');
        strongElement.textContent = type === 'success' ? 'Success! ' : 'Error! ';
        alertBox.appendChild(strongElement);
        alertBox.appendChild(document.createTextNode(message));
        
        // Show the alert
        alertBox.style.display = 'block';
        
        // Auto hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 5000);
        }
    }
});