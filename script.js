document.addEventListener('DOMContentLoaded', () => {
    // Handle scroll progress
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.querySelector('.scroll-progress').style.setProperty('--scroll', `${scrolled}%`);
    });

    // Handle mobile menu
    const menuButton = document.querySelector('.menu-button');
    const nav = document.querySelector('.header-nav');
    
    if (menuButton) {
        menuButton.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuButton.setAttribute('aria-expanded', 
                menuButton.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }

    const modal = document.getElementById('loginModal');
    const bookButtons = document.querySelectorAll('a[href="#"].btn-primary, .header-nav a[href="#"]:contains("Book")');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    const formMessage = document.querySelector('.form-message');

    // Open modal when clicking Book buttons
    bookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
        });
    });

    // Close modal when clicking X
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                formMessage.textContent = 'Login successful! Redirecting...';
                setTimeout(() => {
                    modal.style.display = 'none';
                    // Redirect to booking page
                    window.location.href = '/booking.html';
                }, 2000);
            } else {
                formMessage.textContent = data.message;
            }
        } catch (error) {
            formMessage.textContent = 'An error occurred. Please try again.';
        }
    });

    // Check authentication status on page load
    checkAuth();
});

async function checkAuth() {
    try {
        const response = await fetch('/api/auth/verify', {
            credentials: 'include'
        });
        
        if (response.ok) {
            // User is authenticated
            // Update UI accordingly
        }
    } catch (error) {
        console.error('Auth check failed:', error);
    }
}