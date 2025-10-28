// Mobile menu toggle
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });

        // Form submission
        document.getElementById('signin-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Simple validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // In a real app, you would send this to your server
            console.log('Signing in with:', { email, password, remember });
            
            // For demo purposes, redirect to home page after 1 second
            // setTimeout(() => {
            //     window.location.href = '/';
            // }, 1000);
        });