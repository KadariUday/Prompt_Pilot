// Smooth scrolling for navigation links
function scrollToBuilder() {
    document.getElementById('builder').scrollIntoView({
        behavior: 'smooth'
    });
}

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
});

// Prompt generation function
function generatePrompt() {
    const topic = document.getElementById('topic').value.trim();
    const tone = document.getElementById('tone').value;
    const audience = document.getElementById('audience').value.trim();
    const outputBox = document.getElementById('outputBox');
    const copyBtn = document.getElementById('copyBtn');
    
    // Validation
    if (!topic) {
        showError('Please enter a topic or subject');
        return;
    }
    
    if (!tone) {
        showError('Please select a tone');
        return;
    }
    
    if (!audience) {
        showError('Please enter a target audience');
        return;
    }
    
    // Show loading state
    showLoading();
    
    // Simulate API call with timeout
    setTimeout(() => {
        const generatedPrompt = createOptimizedPrompt(topic, tone, audience);
        displayPrompt(generatedPrompt);
        copyBtn.style.display = 'flex';
    }, 1500);
}

function createOptimizedPrompt(topic, tone, audience) {
    const toneInstructions = {
        professional: "Maintain a professional and authoritative tone throughout.",
        casual: "Use a relaxed, conversational tone that feels approachable.",
        friendly: "Write in a warm, welcoming tone that builds connection.",
        formal: "Use formal language and structure appropriate for official contexts.",
        creative: "Be imaginative and original, using vivid language and creative approaches.",
        persuasive: "Use compelling arguments and persuasive techniques to convince the reader.",
        informative: "Focus on providing clear, accurate, and well-structured information."
    };
    
    const prompt = `Act as an expert content creator specializing in ${topic.toLowerCase()}.

Your task: ${topic}

Target Audience: ${audience}

Tone & Style: ${toneInstructions[tone]}

Requirements:
• Tailor your response specifically for ${audience}
• ${toneInstructions[tone]}
• Provide actionable insights and practical value
• Use clear, engaging language that resonates with your audience
• Include relevant examples or case studies when appropriate
• Structure your content for easy readability and comprehension

Additional Context:
• Consider the current trends and best practices in this field
• Address potential questions or concerns your audience might have
• Ensure your content is both informative and engaging
• Maintain consistency in voice and messaging throughout

Please provide a comprehensive response that delivers maximum value to ${audience} while maintaining the specified ${tone} tone.`;

    return prompt;
}

function showLoading() {
    const outputBox = document.getElementById('outputBox');
    outputBox.innerHTML = `
        <div style="text-align: center; color: var(--text-secondary);">
            <div class="loading"></div>
            <p style="margin-top: 1rem;">Crafting your perfect prompt...</p>
        </div>
    `;
}

function displayPrompt(prompt) {
    const outputBox = document.getElementById('outputBox');
    outputBox.innerHTML = `<div class="generated-prompt">${prompt}</div>`;
}

function showError(message) {
    const outputBox = document.getElementById('outputBox');
    outputBox.innerHTML = `
        <div style="text-align: center; color: #EF4444;">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
            <p>${message}</p>
        </div>
    `;
}

function copyPrompt() {
    const promptText = document.querySelector('.generated-prompt').textContent;
    const copyBtn = document.getElementById('copyBtn');
    
    navigator.clipboard.writeText(promptText).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = '#10B981';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = promptText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = '#10B981';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
    });
}

// Form enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Auto-resize textarea if needed
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Enter key to generate prompt
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && (e.target.id === 'topic' || e.target.id === 'audience')) {
            e.preventDefault();
            generatePrompt();
        }
    });
    
    // Clear output when form changes
    const formInputs = ['topic', 'tone', 'audience'];
    formInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function() {
                const outputBox = document.getElementById('outputBox');
                const copyBtn = document.getElementById('copyBtn');
                if (outputBox.querySelector('.generated-prompt')) {
                    outputBox.innerHTML = `
                        <div class="placeholder">
                            <i class="fas fa-lightbulb"></i>
                            <p>Your optimized prompt will appear here</p>
                        </div>
                    `;
                    copyBtn.style.display = 'none';
                }
            });
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Add hover effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});