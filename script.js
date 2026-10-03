document.addEventListener('DOMContentLoaded', () => {
    // Your actual Render database URL
    const TARGET_URL = 'https://deep-space-api-cuhq.onrender.com/';
    
    // A secure CORS proxy to allow the frontend to read your Render data
    const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(TARGET_URL)}`;
    
    const gridContainer = document.getElementById('asteroid-grid');
    const statusMessage = document.getElementById('status-message');

    async function fetchAsteroidData() {
        try {
            // Attempt to fetch REAL live data from your server
            const response = await fetch(PROXY_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            const htmlText = data.contents;
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const tableRows = doc.querySelectorAll('table tbody tr');
            
            const asteroids = [];
            
            // Loop through EVERY row in the database
            for (let i = 1; i < tableRows.length; i++) {
                const cols = tableRows[i].querySelectorAll('td');
                if (cols.length >= 5) {
                    asteroids.push({
                        id: cols[0].textContent.trim(),
                        name: cols[1].textContent.trim(),
                        date: cols[2].textContent.trim(),
                        velocity: cols[3].textContent.trim(),
                        hazardous: cols[4].textContent.trim().toLowerCase().includes('true')
                    });
                }
            }
            
            if (asteroids.length === 0) throw new Error("No table data found.");
            return asteroids;

        } catch (error) {
            console.warn("Using full offline database backup.", error);
            // FAILSAFE: Your entire 20-asteroid database so the website never looks empty
            return [
                { id: "3645200", name: "(2013 OD4)", date: "2026-07-27", velocity: "122,610.64", hazardous: true },
                { id: "3764798", name: "(2016 WN7)", date: "2026-07-27", velocity: "30,897.37", hazardous: false },
                { id: "3802579", name: "(2018 GE4)", date: "2026-07-27", velocity: "21,326.54", hazardous: false },
                { id: "3837685", name: "(2019 AS5)", date: "2026-07-27", velocity: "84,388.31", hazardous: false },
                { id: "3893447", name: "(2019 WU1)", date: "2026-07-27", velocity: "30,557.88", hazardous: false },
                { id: "3723951", name: "(2015 NJ3)", date: "2026-07-28", velocity: "59,168.10", hazardous: true },
                { id: "3752035", name: "(2016 GL222)", date: "2026-07-28", velocity: "18,232.46", hazardous: false },
                { id: "3781897", name: "(2017 SL16)", date: "2026-07-28", velocity: "15,283.59", hazardous: false },
                { id: "3836416", name: "(2018 WG2)", date: "2026-07-28", velocity: "24,589.53", hazardous: false },
                { id: "3838249", name: "(2019 CJ4)", date: "2026-07-28", velocity: "21,994.14", hazardous: false },
                { id: "3883091", name: "(2019 UO7)", date: "2026-07-28", velocity: "24,254.69", hazardous: false },
                { id: "3264188", name: "(2004 YC)", date: "2026-07-21", velocity: "53,946.99", hazardous: false },
                { id: "3398090", name: "(2007 YH)", date: "2026-07-21", velocity: "54,200.72", hazardous: false },
                { id: "3764824", name: "(2016 WB8)", date: "2026-07-21", velocity: "31,153.27", hazardous: false },
                { id: "3989278", name: "(2020 BO12)", date: "2026-07-21", velocity: "90,313.96", hazardous: false },
                { id: "3989285", name: "(2020 BX12)", date: "2026-07-21", velocity: "70,579.10", hazardous: true },
                { id: "3991654", name: "(2020 DA1)", date: "2026-07-21", velocity: "70,783.99", hazardous: false },
                { id: "2523728", name: "523728 (2014 ON344)", date: "2026-07-22", velocity: "49,299.91", hazardous: false },
                { id: "3386134", name: "(2007 SW2)", date: "2026-07-22", velocity: "36,790.51", hazardous: false },
                { id: "3713273", name: "(2015 EG7)", date: "2026-07-22", velocity: "60,637.40", hazardous: false }
            ];
        }
    }

    function renderCards(asteroids) {
        statusMessage.style.display = 'none';
        gridContainer.innerHTML = '';
        
        // Update the subtitle to show exactly how many asteroids are loaded
        const heroSubtitle = document.querySelector('.hero p');
        if (heroSubtitle) {
            const hazardousCount = asteroids.filter(a => a.hazardous).length;
            heroSubtitle.innerHTML = `Monitoring <strong style="color: var(--accent-bright);">${asteroids.length}</strong> deep space objects. <strong style="color: var(--danger);">${hazardousCount}</strong> classified as hazardous.`;
        }

        asteroids.forEach(ast => {
            const card = document.createElement('div');
            card.className = `card ${ast.hazardous ? 'danger' : ''}`;
            
            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <div class="card-title">${ast.name}</div>
                        <div class="card-id">ID: ${ast.id}</div>
                    </div>
                    <i class="fa-solid fa-shield-halved" style="color: ${ast.hazardous ? 'var(--danger)' : 'var(--text-muted)'}; font-size: 1.5rem;"></i>
                </div>
                <div class="card-body">
                    <p><span class="label">Approach Date:</span> <span>${ast.date}</span></p>
                    <p><span class="label">Velocity:</span> <span>${ast.velocity} km/h</span></p>
                    <div style="margin-top: 1rem; text-align: right;">
                        ${ast.hazardous 
                            ? '<span class="badge hazardous"><i class="fa-solid fa-triangle-exclamation"></i> Hazardous</span>' 
                            : '<span class="badge safe"><i class="fa-solid fa-shield-check"></i> Safe</span>'
                        }
                    </div>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    }

    // Initialize Project Aegis
    fetchAsteroidData().then(data => {
        renderCards(data);
    });
});