// Access Denied Page JavaScript

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Animate digits on load with bounce effect
    const digits = document.querySelectorAll('.digit');
    digits.forEach((digit, index) => {
        setTimeout(() => {
            digit.style.animation = 'none';
            digit.offsetHeight; // Trigger reflow
            digit.style.animation = 'float 3s ease-in-out infinite';
            
            // Add bounce effect
            digit.style.transform = 'scale(1.1)';
            setTimeout(() => {
                digit.style.transform = 'scale(1)';
            }, 200);
        }, index * 200);
    });
    
    // Add hover effects to buttons
    const homeBtn = document.querySelector('.home-btn');
    const loginBtn = document.querySelector('.login-btn');
    
    if (homeBtn) {
        homeBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        homeBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        homeBtn.addEventListener('click', function(e) {
            console.log('Redirecting to homepage...');
        });
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        loginBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        loginBtn.addEventListener('click', function(e) {
            console.log('Redirecting to login page...');
        });
    }
    
    // Add smooth transition for all interactive elements
    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // Optional: Add loading animation for external links
            if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                // Create loading effect
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.style.opacity = '0.7';
                
                // Reset after navigation (if needed)
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.opacity = '1';
                }, 1000);
            }
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Press 'H' key to go to homepage
        if (e.key === 'h' || e.key === 'H') {
            window.location.href = '/';
        }
        // Press 'L' key to go to login page
        if (e.key === 'l' || e.key === 'L') {
            window.location.href = '/login';
        }
        // Press 'C' key to go to contact page
        if (e.key === 'c' || e.key === 'C') {
            window.location.href = '/contact';
        }
        // Press 'Esc' key to go back
        if (e.key === 'Escape') {
            window.history.back();
        }
    });
    
    // Add tooltip for keyboard shortcuts
    const helpText = document.querySelector('.help-text');
    if (helpText) {
        const keyboardHint = document.createElement('small');
        keyboardHint.style.display = 'block';
        keyboardHint.style.marginTop = '0.5rem';
        keyboardHint.style.fontSize = '0.7rem';
        keyboardHint.style.color = '#95a5a6';
        keyboardHint.innerHTML = '<i class="fas fa-keyboard"></i> Shortcuts: H (Home) | L (Login) | C (Contact) | Esc (Back)';
        helpText.parentNode.insertBefore(keyboardHint, helpText.nextSibling);
    }
    
    // Add random funny messages for access denied
    const funnyMessages = [
        "You shall not pass! (Like Gandalf said)",
        "This area is more exclusive than a VIP lounge!",
        "Looks like you need a special key for this door!",
        "Access denied! Our tools say NO!",
        "This page is like a hardware vault - locked tight!",
        "Sorry, this page is for authorized personnel only!"
    ];
    
    const errorMessage = document.querySelector('.error-message p');
    if (errorMessage && Math.random() > 0.7) { // 30% chance to show funny message
        const randomIndex = Math.floor(Math.random() * funnyMessages.length);
        errorMessage.textContent = funnyMessages[randomIndex];
    }
    
    // Add console message for developers
    console.log('%c🔒 JOY Hardware Solutions - Access Denied (403)', 'color: #34495e; font-size: 16px; font-weight: bold;');
    console.log('%cYou do not have permission to access this page.', 'color: #e74c3c; font-size: 12px;');
    
    // Track 403 error (optional analytics)
    function track403Error() {
        const errorData = {
            page: window.location.pathname,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            errorType: 'FORBIDDEN'
        };
        
        // Send to analytics endpoint (if you have one)
        // fetch('/api/track-403', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(errorData)
        // }).catch(err => console.log('Analytics disabled'));
        
        console.log('403 Error tracked:', errorData);
    }
    
    track403Error();
    
    // Add copy error info functionality
    const copyInfoBtn = document.createElement('button');
    copyInfoBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Error Info';
    copyInfoBtn.style.cssText = `
        background: transparent;
        border: 1px solid #34495e;
        color: #34495e;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 0.75rem;
        margin-top: 1rem;
        transition: all 0.3s ease;
    `;
    
    copyInfoBtn.addEventListener('mouseenter', function() {
        this.style.background = '#34495e';
        this.style.color = 'white';
    });
    
    copyInfoBtn.addEventListener('mouseleave', function() {
        this.style.background = 'transparent';
        this.style.color = '#34495e';
    });
    
    copyInfoBtn.addEventListener('click', function() {
        const errorInfo = `
Error 403 - Access Denied
URL: ${window.location.href}
Time: ${new Date().toLocaleString()}
User Agent: ${navigator.userAgent}
        `;
        
        navigator.clipboard.writeText(errorInfo).then(() => {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    });
    
    // Add the copy button after help text
    const helpTextParent = document.querySelector('.help-text');
    if (helpTextParent) {
        helpTextParent.parentNode.insertBefore(copyInfoBtn, helpTextParent.nextSibling);
    }
    
    // Check if user is logged in (optional)
    function checkLoginStatus() {
        // This would typically check for a session or token
        const isLoggedIn = document.cookie.includes('session') || false;
        
        if (!isLoggedIn) {
            // Show a message suggesting login
            const loginMessage = document.createElement('div');
            loginMessage.style.cssText = `
                margin-top: 1rem;
                padding: 0.75rem;
                background: #fef3c7;
                border: 1px solid #fbbf24;
                border-radius: 0.5rem;
                color: #92400e;
                font-size: 0.875rem;
            `;
            loginMessage.innerHTML = '<i class="fas fa-info-circle"></i> You might need to <a href="/login" style="color: #92400e; font-weight: bold;">login</a> to access this page.';
            helpTextParent.parentNode.insertBefore(loginMessage, helpTextParent);
        }
    }
    
    checkLoginStatus();
});

// Preload animation for smoother experience
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

// Handle online/offline status
window.addEventListener('online', function() {
    console.log('Connection restored');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
});

// Add security warning (optional)
window.addEventListener('contextmenu', function(e) {
    // Uncomment to disable right-click on error page
    // e.preventDefault();
    // return false;
});