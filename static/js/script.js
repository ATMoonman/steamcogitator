/**
 * Steam Cogitator - Frontend JavaScript
 * Handles UI interactions and API communication
 */

// ============ Utility Functions ============

function showMessage(message, type = 'info') {
    /**
     * Display a status message to the user
     * Types: 'success', 'error', 'info', 'warning'
     */
    const messageDiv = document.getElementById('message-container');
    if (!messageDiv) return;
    
    const statusEl = document.createElement('div');
    statusEl.className = `status-message ${type}`;
    statusEl.textContent = message;
    
    messageDiv.innerHTML = '';
    messageDiv.appendChild(statusEl);
    
    // Auto-remove info/success messages after 5 seconds
    if (type === 'info' || type === 'success') {
        setTimeout(() => {
            statusEl.style.opacity = '0';
            statusEl.style.transition = 'opacity 0.3s ease';
        }, 5000);
    }
}

function showLoading(show = true) {
    /**
     * Show/hide loading spinner
     */
    const loader = document.getElementById('loader');
    const button = document.querySelector('button[type="submit"]');
    
    if (!loader || !button) return;
    
    if (show) {
        loader.style.display = 'inline-block';
        button.disabled = true;
        showMessage('🙏 Seeking knowledge from the Omnissiah...', 'info');
    } else {
        loader.style.display = 'none';
        button.disabled = false;
    }
}

function formatNumber(num) {
    /**
     * Format numbers with thousand separators
     */
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ============ API Communication ============

async function analyzeLibrary(steamId) {
    /**
     * Send Steam ID to backend for analysis
     */
    if (!steamId.trim()) {
        showMessage('⚠️ Please enter your Steam ID', 'warning');
        return false;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                steam_id: steamId.trim()
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showLoading(false);
            displayResults(data);
            return true;
        } else {
            showMessage(`⚠️ ${data.error}`, 'error');
            showLoading(false);
            return false;
        }
        
    } catch (error) {
        console.error('Error:', error);
        showMessage(`❌ Network error: ${error.message}`, 'error');
        showLoading(false);
        return false;
    }
}

// ============ Results Display ============

function displayResults(data) {
    /**
     * Display analysis results and recommendations
     */
    const resultsContainer = document.getElementById('results-container');
    
    if (!resultsContainer) return;
    
    let html = `
        <div class="card">
            <h2>✨ The Cogitator Speaks ✨</h2>
            <p style="font-style: italic; color: #a0a0a0; margin: 15px 0;">
                "The sacred machine has processed thy digital library and divined thy true gaming nature..."
            </p>
        </div>
    `;
    
    // Display library statistics
    html += `
        <div class="analytics-card">
            <div class="analytics-title">📊 Library Analysis</div>
            <div class="stat-item">
                <span class="stat-label">Total Games Catalogued:</span>
                <span class="stat-value">${formatNumber(data.library_size)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Genres Discovered:</span>
                <span class="stat-value">${Object.keys(data.genres).length}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Primary Vocations:</span>
                <span class="stat-value">${data.top_genres.join(', ') || 'Unknown'}</span>
            </div>
        </div>
    `;
    
    // Display genre breakdown
    if (Object.keys(data.genres).length > 0) {
        html += '<div class="analytics-card"><div class="analytics-title">🎮 Genre Distribution</div>';
        
        for (const [genre, count] of Object.entries(data.genres)) {
            const playtime = data.playtime_by_genre[genre] || 0;
            const playtimeText = playtime > 0 ? ` (${Math.round(playtime)} hrs)` : '';
            html += `
                <div class="stat-item">
                    <span class="stat-label">${genre}:</span>
                    <span class="stat-value">${count} games${playtimeText}</span>
                </div>
            `;
        }
        
        html += '</div>';
    }
    
    // Display recommendations
    if (data.recommendations && data.recommendations.length > 0) {
        html += `
            <div class="card" style="margin-top: 30px;">
                <h2>⚡ Blessed Recommendations from the Machine Spirit ⚡</h2>
                <p style="color: #a0a0a0; margin-bottom: 20px;">
                    "These sacred games align with thy demonstrated tastes and proclivities..."
                </p>
            </div>
            
            <div class="recommendations-grid">
        `;
        
        for (const rec of data.recommendations) {
            const genreHtml = rec.genres
                .map(g => `<span class="rec-genre">${g}</span>`)
                .join('');
            
            html += `
                <div class="recommendation-card">
                    <div class="rec-status">✓ ${rec.status}</div>
                    <div class="rec-title">${rec.title}</div>
                    <div class="rec-genres">${genreHtml}</div>
                    <div class="rec-reason">"${rec.reason}"</div>
                    <div class="rec-score">
                        <span class="rec-score-label">Alignment:</span>
                        <div class="rec-score-bar">
                            <div class="rec-score-fill" style="width: ${rec.score}%"></div>
                        </div>
                        <span class="rec-score-label">${rec.score}%</span>
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
    }
    
    html += `
        <div class="card" style="text-align: center; margin-top: 30px;">
            <button onclick="location.href='/'">← Return to the Cogitator</button>
        </div>
    `;
    
    resultsContainer.innerHTML = html;
    
    // Show success message
    showMessage('✨ The Machine Spirit has blessed you with sacred recommendations!', 'success');
}

// ============ Page Load Handlers ============

document.addEventListener('DOMContentLoaded', function() {
    /**
     * Initialize page on load
     */
    
    // Handle form submission on index page
    const analyzeForm = document.getElementById('analyze-form');
    if (analyzeForm) {
        analyzeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const steamId = document.getElementById('steam-id').value;
            analyzeLibrary(steamId);
        });
    }
    
    // Check if we need to display results (for results page)
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer && resultsContainer.dataset.results) {
        try {
            const results = JSON.parse(resultsContainer.dataset.results);
            displayResults(results);
        } catch (e) {
            console.error('Error parsing results:', e);
        }
    }
    
    // Add easter egg
    let konamiCode = [];
    const konamiCodeSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode.splice(-konamiCodeSequence.length - 1);
        
        if (konamiCode.join(',').includes(konamiCodeSequence.join(','))) {
            showMessage('🙏 PRAISE THE OMNISSIAH! 🙏', 'success');
        }
    });
});

// ============ Warhammer 40K Flavor Text ============

const flavorTexts = [
    '"In the grim darkness of the far future, there is only... game recommendations."',
    '"The Machine Spirit is appeased by thy library choices."',
    '"Blessed be the code that compiles on the first try."',
    '"The Omnissiah guides our selection algorithms."',
    '"For the Emperor and good gaming!"',
    '"Let us celebrate this union of technology and entertainment."',
    '"The sacred cogitator approves of thy gaming preferences."'
];

function getRandomFlavorText() {
    return flavorTexts[Math.floor(Math.random() * flavorTexts.length)];
}

// Export functions for HTML usage
window.analyzeLibrary = analyzeLibrary;
window.showMessage = showMessage;
window.getRandomFlavorText = getRandomFlavorText;
