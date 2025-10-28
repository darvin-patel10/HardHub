// Form submission handling
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            
            // In a real implementation, you would send this data to a server
            alert(`Thank you, ${name}! Your message about "${subject}" has been received. We'll contact you at ${email} shortly.`);
            
            // Reset form
            this.reset();
        });