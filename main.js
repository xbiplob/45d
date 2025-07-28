// Main JavaScript file for Cosmos Explorer

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const loadingProgress = document.querySelector('.loading-progress');
const mainNav = document.getElementById('main-nav');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const sections = document.querySelectorAll('.section');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading progress
    simulateLoading();
    
    // Set up navigation
    setupNavigation();
    
    // Initialize 3D space environment
    initSpaceEnvironment();
    
    // Set up event listeners
    setupEventListeners();
});

// Simulate loading progress
function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }
        loadingProgress.style.width = `${progress}%`;
    }, 100);
}

// Set up navigation
function setupNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            
            // Get target section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section
            sections.forEach(section => section.classList.remove('active'));
            targetSection.classList.add('active');
            
            // Scroll to top of section
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

// Initialize 3D space environment
function initSpaceEnvironment() {
    // This will be implemented with Three.js in space-explorer.js
    // For now, we'll create a simple starfield effect
    createStarfield();
}

// Create a simple starfield effect for the homepage
function createStarfield() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Add canvas to space-canvas element
    const spaceCanvas = document.getElementById('space-canvas');
    spaceCanvas.appendChild(canvas);
    
    // Create stars
    const stars = [];
    const starCount = 1000;
    
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1,
            brightness: Math.random() * 0.5 + 0.5
        });
    }
    
    // Animation loop
    function animate() {
        // Clear canvas
        ctx.fillStyle = 'rgba(10, 10, 42, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw and update stars
        ctx.fillStyle = '#ffffff';
        stars.forEach(star => {
            // Update position
            star.x -= star.speed;
            
            // Reset star if it goes off screen
            if (star.x < 0) {
                star.x = canvas.width;
                star.y = Math.random() * canvas.height;
            }
            
            // Draw star
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Start animation
    animate();
}

// Set up event listeners
function setupEventListeners() {
    // Handle window scroll for parallax effects
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Parallax effect for hero section
        const heroContainer = document.querySelector('.hero-container');
        if (heroContainer) {
            heroContainer.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Reinitialize any components that need it
    });
}

// Utility functions
function getRandomColor() {
    const colors = [
        '#00bfff', '#0088cc', '#0066cc', 
        '#ffcc00', '#ff9900', '#ff6600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Export functions for use in other modules
window.CosmosExplorer = {
    getRandomColor,
    formatNumber
};
