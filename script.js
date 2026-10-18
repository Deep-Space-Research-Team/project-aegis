document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const tabAsteroids = document.getElementById('tab-asteroids');
    const tabPlanets = document.getElementById('tab-planets');
    const sectionAsteroids = document.getElementById('section-asteroids');
    const sectionPlanets = document.getElementById('section-planets');

    const asteroidGrid = document.getElementById('asteroid-grid');
    const asteroidStatus = document.getElementById('asteroid-status');
    const asteroidSubtitle = document.getElementById('asteroid-subtitle');

    const planetGrid = document.getElementById('planet-grid');
    const planetStatus = document.getElementById('planet-status');
    const planetSubtitle = document.getElementById('planet-subtitle');

    const searchInput = document.getElementById('planet-search');
    const filterMethod = document.getElementById('filter-method');
    const filterTemp = document.getElementById('filter-temp');

    // Island Modal Elements
    const islandBackdrop = document.getElementById('island-backdrop');
    const islandWindow = document.getElementById('island-window');
    const islandClose = document.getElementById('island-close');
    const islandContent = document.getElementById('island-content');

    let allPlanetsData = [];
    let planetsLoaded = false;

    // --- ISLAND MODAL CONTROLS ---
    function openIslandModal(htmlMarkup, themeClass = '') {
        islandWindow.className = `island-window ${themeClass}`;
        islandContent.innerHTML = htmlMarkup;
        islandBackdrop.classList.add('open');
        islandBackdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeIslandModal() {
        islandBackdrop.classList.remove('open');
        islandBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    islandClose.addEventListener('click', closeIslandModal);
    islandBackdrop.addEventListener('click', (e) => {
        if (e.target === islandBackdrop) closeIslandModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && islandBackdrop.classList.contains('open')) {
            closeIslandModal();
        }
    });

    // --- TAB NAVIGATION ---
    tabAsteroids.addEventListener('click', () => {
        tabAsteroids.classList.add('active');
        tabPlanets.classList.remove('active');
        sectionAsteroids.style.display = 'block';
        sectionPlanets.style.display = 'none';
    });

    tabPlanets.addEventListener('click', () => {
        tabPlanets.classList.add('active');
        tabAsteroids.classList.remove('active');
        sectionPlanets.style.display = 'block';
        sectionAsteroids.style.display = 'none';

        if (!planetsLoaded) {
            initPlanetArchive();
            planetsLoaded = true;
        }
    });

    // ==========================================
    // 1. ASTEROID TRACKER MODULE
    // ==========================================
    const TARGET_URL = 'https://deep-space-api-cuhq.onrender.com/';
    const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(TARGET_URL)}`;

    async function fetchAsteroidData() {
        try {
            const response = await fetch(PROXY_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');
            const tableRows = doc.querySelectorAll('table tbody tr');
            
            const asteroids = [];
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
            console.warn("Using full offline NEO database backup.", error);
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

    function showAsteroidIsland(ast) {
        const rawVel = parseFloat(String(ast.velocity).replace(/,/g, '')) || 0;
        const velKmS = (rawVel / 3600).toFixed(2);
        const velMph = (rawVel * 0.621371).toLocaleString('en-US', { maximumFractionDigits: 2 });
        const machNumber = (rawVel / 1234.8).toFixed(1);

        // Calculate relative days from current system date
        const approachDate = new Date(ast.date);
        const now = new Date();
        const diffDays = Math.ceil((approachDate - now) / (1000 * 60 * 60 * 24));
        const timeStatus = isNaN(diffDays)
            ? ast.date
            : diffDays > 0
                ? `In ${diffDays} days`
                : diffDays === 0
                    ? 'Today'
                    : `${Math.abs(diffDays)} days ago`;

        const jplUrl = `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${encodeURIComponent(ast.id)}`;

        const html = `
            <div class="island-header">
                <div class="island-eyebrow">Near-Earth Object Telemetry Dossier</div>
                <div class="island-title">${ast.name}</div>
                <div class="island-subtitle">NASA SPK-ID / NEO Reference: ${ast.id}</div>
            </div>

            <div class="island-section-title">
                <i class="fa-solid fa-gauge-high"></i> Kinematic &amp; Approach Telemetry
            </div>
            <div class="island-grid">
                <div class="island-stat-box">
                    <span class="stat-label">Close Approach Date</span>
                    <span class="stat-value">${ast.date}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Temporal Window</span>
                    <span class="stat-value">${timeStatus}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Relative Velocity (km/h)</span>
                    <span class="stat-value">${ast.velocity} km/h</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Velocity (km/s)</span>
                    <span class="stat-value">${velKmS} km/s</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Imperial Velocity</span>
                    <span class="stat-value">${velMph} mph</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Atmospheric Equivalent</span>
                    <span class="stat-value">Mach ${machNumber}</span>
                </div>
            </div>

            <div class="island-section-title">
                <i class="fa-solid fa-shield-halved"></i> Planetary Defense Assessment
            </div>
            <div class="island-grid">
                <div class="island-stat-box">
                    <span class="stat-label">PHA Classification</span>
                    <span class="stat-value" style="color: ${ast.hazardous ? 'var(--danger)' : 'var(--safe)'};">
                        ${ast.hazardous ? 'POTENTIALLY HAZARDOUS' : 'NON-HAZARDOUS'}
                    </span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">MOID Threshold Criteria</span>
                    <span class="stat-value">${ast.hazardous ? '< 0.05 AU (≤ 19.5 LD)' : '> 0.05 AU Safe Margin'}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Absolute Magnitude (H)</span>
                    <span class="stat-value">${ast.hazardous ? '≤ 22.0 mag (>140m)' : 'Standard NEO Profile'}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Tracking Source</span>
                    <span class="stat-value">NASA NeoWs / JPL CNEOS</span>
                </div>
            </div>

            <div class="island-summary-box">
                ${ast.hazardous 
                    ? `<strong>Priority Planetary Defense Target:</strong> Object <strong>${ast.name}</strong> meets the NASA CNEOS criteria for a Potentially Hazardous Asteroid (Minimum Orbit Intersection Distance under 0.05 AU and estimated diameter exceeding 140 meters). Continuous radar and optical astrometry is maintained.`
                    : `<strong>Standard Near-Earth Passage:</strong> Object <strong>${ast.name}</strong> poses no elevated collision risk during its${ast.date} close approach window. Trajectory remains well outside critical gravitational keyhole corridors.`
                }
            </div>

            <div class="island-actions">
                ${ast.hazardous 
                    ? '<span class="badge hazardous"><i class="fa-solid fa-triangle-exclamation"></i> Hazardous Object</span>' 
                    : '<span class="badge safe"><i class="fa-solid fa-shield-check"></i> Safe Trajectory</span>'
                }
                <a href="${jplUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    <i class="fa-solid fa-up-right-from-square"></i> Open NASA JPL Small-Body Database
                </a>
            </div>
        `;

        openIslandModal(html, ast.hazardous ? 'danger-island' : '');
    }

    function renderAsteroids(asteroids) {
        asteroidStatus.style.display = 'none';
        asteroidGrid.innerHTML = '';
        
        const hazardousCount = asteroids.filter(a => a.hazardous).length;
        asteroidSubtitle.innerHTML = `Monitoring <strong style="color: var(--accent-bright);">${asteroids.length}</strong> deep space objects (<strong style="color: var(--danger);">${hazardousCount}</strong> hazardous). Click any card to open full telemetry island.`;

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
                    <div class="card-footer-row">
                        <span class="inspect-hint"><i class="fa-solid fa-expand"></i> Inspect Telemetry</span>
                        ${ast.hazardous 
                            ? '<span class="badge hazardous"><i class="fa-solid fa-triangle-exclamation"></i> Hazardous</span>' 
                            : '<span class="badge safe"><i class="fa-solid fa-shield-check"></i> Safe</span>'
                        }
                    </div>
                </div>
            `;
            card.addEventListener('click', () => showAsteroidIsland(ast));
            asteroidGrid.appendChild(card);
        });
    }

    // ==========================================
    // 2. EXOPLANET RESEARCH ARCHIVE MODULE
    // ==========================================
    async function fetchExoplanetData() {
        const query = encodeURIComponent(
            "select top 100 pl_name,hostname,discoverymethod,disc_year,disc_facility,disc_telescope,pl_orbper,pl_orbsmax,pl_rade,pl_bmasse,pl_orbeccen,pl_orbincl,pl_eqt,st_spectype,st_teff,st_rad,st_mass,sy_dist,sy_snum,sy_pnum,ra,dec from ps where default_flag=1 order by disc_year desc"
        );
        const NASA_TAP_URL = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${query}&format=json`;
        const EXO_PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(NASA_TAP_URL)}`;

        try {
            const response = await fetch(EXO_PROXY_URL);
            if (!response.ok) throw new Error('NASA TAP API error');
            const wrapper = await response.json();
            const planets = JSON.parse(wrapper.contents);
            if (!Array.isArray(planets) || planets.length === 0) throw new Error('Empty dataset');
            return planets;
        } catch (error) {
            console.warn("Loading curated NASA Exoplanet Reference Catalog for Researchers.", error);
            return [
                { pl_name: "Proxima Cen b", hostname: "Proxima Cen", discoverymethod: "Radial Velocity", disc_year: 2016, disc_facility: "La Silla Observatory", disc_telescope: "ESO 3.6 m", pl_orbper: 11.186, pl_orbsmax: 0.0485, pl_rade: 1.03, pl_bmasse: 1.07, pl_orbeccen: 0.02, pl_orbincl: 70.0, pl_eqt: 234, st_spectype: "M5.5 V", st_teff: 3050, st_rad: 0.141, st_mass: 0.122, sy_dist: 1.301, sy_snum: 3, sy_pnum: 2, ra: 217.4289, dec: -62.6795 },
                { pl_name: "TRAPPIST-1 e", hostname: "TRAPPIST-1", discoverymethod: "Transit", disc_year: 2017, disc_facility: "Multiple Observatories", disc_telescope: "Spitzer / Very Large Telescope", pl_orbper: 6.101, pl_orbsmax: 0.0292, pl_rade: 0.92, pl_bmasse: 0.692, pl_orbeccen: 0.005, pl_orbincl: 89.79, pl_eqt: 251, st_spectype: "M8 V", st_teff: 2566, st_rad: 0.119, st_mass: 0.090, sy_dist: 12.43, sy_snum: 1, sy_pnum: 7, ra: 346.6223, dec: -5.0414 },
                { pl_name: "TRAPPIST-1 d", hostname: "TRAPPIST-1", discoverymethod: "Transit", disc_year: 2016, disc_facility: "La Silla Observatory", disc_telescope: "TRAPPIST 0.6 m", pl_orbper: 4.049, pl_orbsmax: 0.0222, pl_rade: 0.788, pl_bmasse: 0.388, pl_orbeccen: 0.008, pl_orbincl: 89.89, pl_eqt: 288, st_spectype: "M8 V", st_teff: 2566, st_rad: 0.119, st_mass: 0.090, sy_dist: 12.43, sy_snum: 1, sy_pnum: 7, ra: 346.6223, dec: -5.0414 },
                { pl_name: "TRAPPIST-1 f", hostname: "TRAPPIST-1", discoverymethod: "Transit", disc_year: 2017, disc_facility: "Spitzer Space Telescope", disc_telescope: "0.85 m Spitzer", pl_orbper: 9.207, pl_orbsmax: 0.0384, pl_rade: 1.045, pl_bmasse: 1.039, pl_orbeccen: 0.010, pl_orbincl: 89.74, pl_eqt: 219, st_spectype: "M8 V", st_teff: 2566, st_rad: 0.119, st_mass: 0.090, sy_dist: 12.43, sy_snum: 1, sy_pnum: 7, ra: 346.6223, dec: -5.0414 },
                { pl_name: "Kepler-186 f", hostname: "Kepler-186", discoverymethod: "Transit", disc_year: 2014, disc_facility: "Kepler", disc_telescope: "0.95 m Kepler Telescope", pl_orbper: 129.944, pl_orbsmax: 0.432, pl_rade: 1.17, pl_bmasse: 1.71, pl_orbeccen: 0.04, pl_orbincl: 89.96, pl_eqt: 188, st_spectype: "M1 V", st_teff: 3755, st_rad: 0.52, st_mass: 0.54, sy_dist: 177.5, sy_snum: 1, sy_pnum: 5, ra: 298.6527, dec: 43.9550 },
                { pl_name: "Kepler-452 b", hostname: "Kepler-452", discoverymethod: "Transit", disc_year: 2015, disc_facility: "Kepler", disc_telescope: "0.95 m Kepler Telescope", pl_orbper: 384.843, pl_orbsmax: 1.046, pl_rade: 1.63, pl_bmasse: 3.29, pl_orbeccen: 0.035, pl_orbincl: 89.806, pl_eqt: 265, st_spectype: "G2 V", st_teff: 5757, st_rad: 1.11, st_mass: 1.04, sy_dist: 551.7, sy_snum: 1, sy_pnum: 1, ra: 296.0037, dec: 44.2776 },
                { pl_name: "TOI-700 d", hostname: "TOI-700", discoverymethod: "Transit", disc_year: 2020, disc_facility: "Transiting Exoplanet Survey Satellite (TESS)", disc_telescope: "TESS CCD Array", pl_orbper: 37.424, pl_orbsmax: 0.163, pl_rade: 1.073, pl_bmasse: 1.25, pl_orbeccen: 0.042, pl_orbincl: 89.8, pl_eqt: 269, st_spectype: "M2 V", st_teff: 3480, st_rad: 0.42, st_mass: 0.415, sy_dist: 31.13, sy_snum: 1, sy_pnum: 4, ra: 97.0968, dec: -65.5793 },
                { pl_name: "K2-18 b", hostname: "K2-18", discoverymethod: "Transit", disc_year: 2015, disc_facility: "K2", disc_telescope: "0.95 m Kepler Telescope", pl_orbper: 32.940, pl_orbsmax: 0.1429, pl_rade: 2.61, pl_bmasse: 8.63, pl_orbeccen: 0.09, pl_orbincl: 89.578, pl_eqt: 255, st_spectype: "M2.5 V", st_teff: 3457, st_rad: 0.44, st_mass: 0.495, sy_dist: 38.02, sy_snum: 1, sy_pnum: 2, ra: 172.5605, dec: 7.5884 },
                { pl_name: "LHS 1140 b", hostname: "LHS 1140", discoverymethod: "Transit", disc_year: 2017, disc_facility: "MEarth Project", disc_telescope: "MEarth-South Array", pl_orbper: 24.737, pl_orbsmax: 0.0946, pl_rade: 1.73, pl_bmasse: 5.60, pl_orbeccen: 0.043, pl_orbincl: 89.89, pl_eqt: 226, st_spectype: "M4.5 V", st_teff: 3096, st_rad: 0.216, st_mass: 0.184, sy_dist: 14.99, sy_snum: 1, sy_pnum: 2, ra: 11.2472, dec: -15.2715 },
                { pl_name: "51 Peg b", hostname: "51 Peg", discoverymethod: "Radial Velocity", disc_year: 1995, disc_facility: "Haute-Provence Observatory", disc_telescope: "1.93 m Telescope", pl_orbper: 4.230, pl_orbsmax: 0.0527, pl_rade: 13.5, pl_bmasse: 150.0, pl_orbeccen: 0.013, pl_orbincl: 80.0, pl_eqt: 1284, st_spectype: "G2 IV", st_teff: 5793, st_rad: 1.237, st_mass: 1.12, sy_dist: 15.46, sy_snum: 1, sy_pnum: 1, ra: 344.3666, dec: 20.7688 },
                { pl_name: "HD 209458 b", hostname: "HD 209458", discoverymethod: "Transit", disc_year: 1999, disc_facility: "Multiple Observatories", disc_telescope: "Keck / Lick / STEx", pl_orbper: 3.524, pl_orbsmax: 0.047, pl_rade: 15.5, pl_bmasse: 220.0, pl_orbeccen: 0.0, pl_orbincl: 86.71, pl_eqt: 1449, st_spectype: "G0 V", st_teff: 6065, st_rad: 1.155, st_mass: 1.119, sy_dist: 48.3, sy_snum: 1, sy_pnum: 1, ra: 330.7948, dec: 18.8843 },
                { pl_name: "55 Cnc e", hostname: "55 Cnc", discoverymethod: "Radial Velocity", disc_year: 2004, disc_facility: "McDonald Observatory", disc_telescope: "9.2 m Hobby-Eberly", pl_orbper: 0.736, pl_orbsmax: 0.0154, pl_rade: 1.875, pl_bmasse: 7.99, pl_orbeccen: 0.05, pl_orbincl: 83.59, pl_eqt: 1958, st_spectype: "G8 V", st_teff: 5172, st_rad: 0.943, st_mass: 0.905, sy_dist: 12.59, sy_snum: 2, sy_pnum: 5, ra: 133.1492, dec: 28.3308 },
                { pl_name: "WASP-39 b", hostname: "WASP-39", discoverymethod: "Transit", disc_year: 2011, disc_facility: "SuperWASP", disc_telescope: "SuperWASP Camera Array", pl_orbper: 4.055, pl_orbsmax: 0.0486, pl_rade: 14.2, pl_bmasse: 88.9, pl_orbeccen: 0.0, pl_orbincl: 87.83, pl_eqt: 1166, st_spectype: "G8", st_teff: 5400, st_rad: 0.895, st_mass: 0.93, sy_dist: 213.9, sy_snum: 1, sy_pnum: 1, ra: 217.3267, dec: -3.4445 },
                { pl_name: "WASP-121 b", hostname: "WASP-121", discoverymethod: "Transit", disc_year: 2015, disc_facility: "SuperWASP-South", disc_telescope: "200mm Telephoto Array", pl_orbper: 1.274, pl_orbsmax: 0.0254, pl_rade: 19.6, pl_bmasse: 375.9, pl_orbeccen: 0.0, pl_orbincl: 87.6, pl_eqt: 2358, st_spectype: "F6 V", st_teff: 6460, st_rad: 1.458, st_mass: 1.353, sy_dist: 269.9, sy_snum: 1, sy_pnum: 1, ra: 107.6002, dec: -39.0974 },
                { pl_name: "HR 8799 e", hostname: "HR 8799", discoverymethod: "Imaging", disc_year: 2010, disc_facility: "W. M. Keck Observatory", disc_telescope: "10 m Keck II Telescope", pl_orbper: 18000, pl_orbsmax: 16.4, pl_rade: 13.1, pl_bmasse: 3178, pl_orbeccen: 0.15, pl_orbincl: 25.0, pl_eqt: 1150, st_spectype: "A5 V", st_teff: 7400, st_rad: 1.44, st_mass: 1.47, sy_dist: 41.29, sy_snum: 1, sy_pnum: 4, ra: 346.8696, dec: 21.1342 },
                { pl_name: "Beta Pic b", hostname: "beta Pic", discoverymethod: "Imaging", disc_year: 2008, disc_facility: "Paranal Observatory", disc_telescope: "8.2 m ESO VLT UT4", pl_orbper: 7665, pl_orbsmax: 9.0, pl_rade: 16.4, pl_bmasse: 3700, pl_orbeccen: 0.08, pl_orbincl: 88.81, pl_eqt: 1724, st_spectype: "A6 V", st_teff: 8052, st_rad: 1.8, st_mass: 1.76, sy_dist: 19.75, sy_snum: 1, sy_pnum: 2, ra: 86.8212, dec: -51.0665 },
                { pl_name: "OGLE-2005-BLG-390L b", hostname: "OGLE-2005-BLG-390L", discoverymethod: "Microlensing", disc_year: 2005, disc_facility: "OGLE", disc_telescope: "1.3 m Warsaw Telescope", pl_orbper: 3285, pl_orbsmax: 2.6, pl_rade: 2.1, pl_bmasse: 5.5, pl_orbeccen: null, pl_orbincl: null, pl_eqt: 50, st_spectype: "M4", st_teff: 3300, st_rad: 0.22, st_mass: 0.22, sy_dist: 6500, sy_snum: 1, sy_pnum: 1, ra: 268.5800, dec: -30.3772 },
                { pl_name: "GJ 1214 b", hostname: "GJ 1214", discoverymethod: "Transit", disc_year: 2009, disc_facility: "MEarth Project", disc_telescope: "MEarth-North Array", pl_orbper: 1.580, pl_orbsmax: 0.0149, pl_rade: 2.74, pl_bmasse: 8.17, pl_orbeccen: 0.06, pl_orbincl: 88.7, pl_eqt: 596, st_spectype: "M4.5 V", st_teff: 3250, st_rad: 0.215, st_mass: 0.178, sy_dist: 14.64, sy_snum: 1, sy_pnum: 1, ra: 258.8289, dec: 4.9639 },
                { pl_name: "Ross 128 b", hostname: "Ross 128", discoverymethod: "Radial Velocity", disc_year: 2017, disc_facility: "La Silla Observatory", disc_telescope: "ESO 3.6 m (HARPS)", pl_orbper: 9.865, pl_orbsmax: 0.0496, pl_rade: 1.11, pl_bmasse: 1.40, pl_orbeccen: 0.116, pl_orbincl: null, pl_eqt: 301, st_spectype: "M4 V", st_teff: 3192, st_rad: 0.197, st_mass: 0.168, sy_dist: 3.374, sy_snum: 1, sy_pnum: 1, ra: 176.9350, dec: 0.8046 },
                { pl_name: "Teegarden's Star b", hostname: "Teegarden's Star", discoverymethod: "Radial Velocity", disc_year: 2019, disc_facility: "Calar Alto Observatory", disc_telescope: "3.5 m Telescope (CARMENES)", pl_orbper: 4.91, pl_orbsmax: 0.0252, pl_rade: 1.02, pl_bmasse: 1.05, pl_orbeccen: 0.0, pl_orbincl: null, pl_eqt: 264, st_spectype: "M7 V", st_teff: 2904, st_rad: 0.107, st_mass: 0.089, sy_dist: 3.831, sy_snum: 1, sy_pnum: 2, ra: 43.2537, dec: 16.8819 }
            ];
        }
    }

    function formatValue(val, unit = '', decimals = 2) {
        if (val === null || val === undefined || val === '') return 'N/A';
        const num = Number(val);
        if (isNaN(num)) return `${val}${unit}`;
        return `${num.toFixed(decimals)}${unit}`;
    }

    function classifyPlanetType(rade, bmasse) {
        const r = Number(rade);
        const m = Number(bmasse);
        if (!r && !m) return 'Unclassified Exoplanet';
        if (r > 6 || m > 50) return 'Gas Giant / Jovian World';
        if (r > 2.0 || m > 10) return 'Sub-Neptune / Mini-Neptune';
        if (r > 1.25 || m > 2.0) return 'Super-Earth';
        return 'Terrestrial / Rocky World';
    }

    function showPlanetIsland(p) {
        const isTemperate = p.pl_eqt && p.pl_eqt >= 200 && p.pl_eqt <= 320;
        const planetClass = classifyPlanetType(p.pl_rade, p.pl_bmasse);

        // Derived scientific parameters for researchers
        const distLy = p.sy_dist ? (Number(p.sy_dist) * 3.26156).toFixed(2) + ' ly' : 'N/A';
        const tempC = p.pl_eqt ? (Number(p.pl_eqt) - 273.15).toFixed(1) + ' °C' : 'N/A';
        const jupMass = p.pl_bmasse ? (Number(p.pl_bmasse) / 317.83).toFixed(4) + ' M♃' : 'N/A';
        const jupRad = p.pl_rade ? (Number(p.pl_rade) / 11.209).toFixed(3) + ' R♃' : 'N/A';
        const calcGravity = (p.pl_bmasse && p.pl_rade)
            ? (Number(p.pl_bmasse) / Math.pow(Number(p.pl_rade), 2)).toFixed(2) + ' g (Earth = 1)'
            : 'N/A';
        const calcDensity = (p.pl_bmasse && p.pl_rade)
            ? ((Number(p.pl_bmasse) / Math.pow(Number(p.pl_rade), 3)) * 5.514).toFixed(2) + ' g/cm³'
            : 'N/A';

        const nasaOverviewUrl = `https://exoplanetarchive.ipac.caltech.edu/overview/${encodeURIComponent(p.pl_name || '')}`;

        const html = `
            <div class="island-header">
                <div class="island-eyebrow">${planetClass} • Confirmed Exoplanet Dossier</div>
                <div class="island-title">${p.pl_name || 'Unknown Exoplanet'}</div>
                <div class="island-subtitle">Host System: ${p.hostname || 'N/A'} | Spectral Type: ${p.st_spectype || 'Unclassified'}</div>
            </div>

            <div class="island-section-title">
                <i class="fa-solid fa-globe"></i> Planetary Physical &amp; Bulk Properties
            </div>
            <div class="island-grid">
                <div class="island-stat-box">
                    <span class="stat-label">Planetary Radius (Earth)</span>
                    <span class="stat-value">${formatValue(p.pl_rade, ' R⊕')}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Planetary Radius (Jupiter)</span>
                    <span class="stat-value">${jupRad}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Mass / Min Mass (Earth)</span>
                    <span class="stat-value">${formatValue(p.pl_bmasse, ' M⊕')}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Mass (Jupiter)</span>
                    <span class="stat-value">${jupMass}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Est. Surface Gravity</span>
                    <span class="stat-value">${calcGravity}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Est. Bulk Density</span>
                    <span class="stat-value">${calcDensity}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Equilibrium Temp (K)</span>
                    <span class="stat-value">${formatValue(p.pl_eqt, ' K', 0)}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Equilibrium Temp (°C)</span>
                    <span class="stat-value">${tempC}</span>
                </div>
            </div>

            <div class="island-section-title">
                <i class="fa-solid fa-circle-nodes"></i> Orbital Architecture &amp; Ephemeris
            </div>
            <div class="island-grid">
                <div class="island-stat-box">
                    <span class="stat-label">Orbital Period</span>
                    <span class="stat-value">${formatValue(p.pl_orbper, ' days', 3)}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Semi-Major Axis</span>
                    <span class="stat-value">${formatValue(p.pl_orbsmax, ' AU', 4)}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Orbital Eccentricity (e)</span>
                    <span class="stat-value">${formatValue(p.pl_orbeccen, '', 3)}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Orbital Inclination (i)</span>
                    <span class="stat-value">${formatValue(p.pl_orbincl, '°', 2)}</span>
                </div>
            </div>

            <div class="island-section-title">
                <i class="fa-solid fa-sun"></i> Host Star &amp; Astrometric Parameters
            </div>
            <div class="island-grid">
                <div class="island-stat-box">
                    <span class="stat-label">Stellar Effective Temp</span>
                    <span class="stat-value">${formatValue(p.st_teff, ' K', 0)}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Stellar Radius (Solar = 1)</span>
                    <span class="stat-value">${formatValue(p.st_rad, ' R☉', 3)}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Stellar Mass (Solar = 1)</span>
                    <span class="stat-value">${formatValue(p.st_mass, ' M☉', 3)}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Distance (Parsecs)</span>
                    <span class="stat-value">${formatValue(p.sy_dist, ' pc', 2)}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Distance (Light-Years)</span>
                    <span class="stat-value">${distLy}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">System Multiplicity</span>
                    <span class="stat-value">${p.sy_snum || 1} Star(s) / ${p.sy_pnum || 1} Planet(s)</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Sky Coordinates (ICRS)</span>
                    <span class="stat-value">RA ${formatValue(p.ra, '°', 2)}, Dec ${formatValue(p.dec, '°', 2)}</span>
                </div>
                <div class="island-stat-box">
                    <span class="stat-label">Discovery Instrument</span>
                    <span class="stat-value">${p.disc_telescope || p.disc_facility || 'N/A'}</span>
                </div>
            </div>

            <div class="island-summary-box">
                <strong>Research Summary:</strong> <strong>${p.pl_name}</strong> was discovered in <strong>${p.disc_year || 'N/A'}</strong> via <strong>${p.discoverymethod || 'astronomical observation'}</strong> at <strong>${p.disc_facility || 'its discovery observatory'}</strong>. 
                ${isTemperate 
                    ? 'Its equilibrium temperature places it within the circumstellar temperate zone (200K–320K), making it a high-priority target for atmospheric spectroscopy and astrobiological habitability modeling.'
                    : 'Its orbital and radiative parameters provide key constraints on planetary system formation and migration models.'}
            </div>

            <div class="island-actions">
                ${isTemperate 
                    ? '<span class="badge habitable-badge"><i class="fa-solid fa-seedling"></i> Temperate Zone Candidate (200K–320K)</span>' 
                    : '<span class="badge planet-badge"><i class="fa-solid fa-satellite"></i> Confirmed Exoplanet</span>'
                }
                <a href="${nasaOverviewUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    <i class="fa-solid fa-up-right-from-square"></i> Full NASA NExScI Archive Record
                </a>
            </div>
        `;

        openIslandModal(html, isTemperate ? 'habitable-island' : '');
    }

    function renderPlanets(planets) {
        planetStatus.style.display = 'none';
        planetGrid.innerHTML = '';

        const habitableCount = planets.filter(p => p.pl_eqt >= 200 && p.pl_eqt <= 320).length;
        planetSubtitle.innerHTML = `Displaying <strong style="color: var(--accent-bright);">${planets.length}</strong> confirmed exoplanets (<strong style="color: var(--habitable);">${habitableCount}</strong> temperate). Click any planet card to open full research dossier.`;

        if (planets.length === 0) {
            planetGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No exoplanets match your current research filter parameters.</p>`;
            return;
        }

        planets.forEach(planet => {
            const isTemperate = planet.pl_eqt && planet.pl_eqt >= 200 && planet.pl_eqt <= 320;
            const card = document.createElement('div');
            card.className = `card planet-card ${isTemperate ? 'habitable-candidate' : ''}`;

            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <div class="card-title">${planet.pl_name || 'Unknown'}</div>
                        <div class="card-id">Host Star: ${planet.hostname || 'N/A'} (${planet.st_spectype || 'Unclassified'})</div>
                    </div>
                    <i class="fa-solid fa-globe" style="color: ${isTemperate ? 'var(--habitable)' : 'var(--planet-accent)'}; font-size: 1.5rem;"></i>
                </div>
                <div class="card-body">
                    <p><span class="label">Discovery Method:</span> <span>${planet.discoverymethod || 'N/A'} (${planet.disc_year || 'N/A'})</span></p>
                    <p><span class="label">Facility:</span> <span>${planet.disc_facility || 'N/A'}</span></p>
                    
                    <div class="telemetry-grid">
                        <div class="telemetry-item">
                            <span class="telemetry-label">Radius (Earth = 1)</span>
                            <span class="telemetry-value">${formatValue(planet.pl_rade, ' R⊕')}</span>
                        </div>
                        <div class="telemetry-item">
                            <span class="telemetry-label">Mass (Earth = 1)</span>
                            <span class="telemetry-value">${formatValue(planet.pl_bmasse, ' M⊕')}</span>
                        </div>
                        <div class="telemetry-item">
                            <span class="telemetry-label">Orbital Period</span>
                            <span class="telemetry-value">${formatValue(planet.pl_orbper, ' days')}</span>
                        </div>
                        <div class="telemetry-item">
                            <span class="telemetry-label">Semi-Major Axis</span>
                            <span class="telemetry-value">${formatValue(planet.pl_orbsmax, ' AU', 3)}</span>
                        </div>
                        <div class="telemetry-item">
                            <span class="telemetry-label">Equilibrium Temp</span>
                            <span class="telemetry-value">${formatValue(planet.pl_eqt, ' K', 0)}</span>
                        </div>
                        <div class="telemetry-item">
                            <span class="telemetry-label">Stellar Distance</span>
                            <span class="telemetry-value">${formatValue(planet.sy_dist, ' pc')}</span>
                        </div>
                    </div>

                    <div class="card-footer-row">
                        <span class="inspect-hint"><i class="fa-solid fa-expand"></i> Open Full Dossier</span>
                        ${isTemperate 
                            ? '<span class="badge habitable-badge"><i class="fa-solid fa-seedling"></i> Temperate</span>' 
                            : '<span class="badge planet-badge"><i class="fa-solid fa-satellite"></i> Confirmed</span>'
                        }
                    </div>
                </div>
            `;
            card.addEventListener('click', () => showPlanetIsland(planet));
            planetGrid.appendChild(card);
        });
    }

    function applyPlanetFilters() {
        const query = searchInput.value.toLowerCase().trim();
        const method = filterMethod.value;
        const tempRegime = filterTemp.value;

        const filtered = allPlanetsData.filter(p => {
            const matchesSearch = 
                (p.pl_name && p.pl_name.toLowerCase().includes(query)) ||
                (p.hostname && p.hostname.toLowerCase().includes(query)) ||
                (p.disc_facility && p.disc_facility.toLowerCase().includes(query));

            const matchesMethod = method === 'ALL' || p.discoverymethod === method;

            let matchesTemp = true;
            if (tempRegime === 'HABITABLE') {
                matchesTemp = p.pl_eqt >= 200 && p.pl_eqt <= 320;
            } else if (tempRegime === 'HOT') {
                matchesTemp = p.pl_eqt > 320;
            } else if (tempRegime === 'COLD') {
                matchesTemp = p.pl_eqt !== null && p.pl_eqt < 200;
            }

            return matchesSearch && matchesMethod && matchesTemp;
        });

        renderPlanets(filtered);
    }

    async function initPlanetArchive() {
        allPlanetsData = await fetchExoplanetData();
        renderPlanets(allPlanetsData);
    }

    searchInput.addEventListener('input', applyPlanetFilters);
    filterMethod.addEventListener('change', applyPlanetFilters);
    filterTemp.addEventListener('change', applyPlanetFilters);

    // Initialize Asteroid Tracker on Startup
    fetchAsteroidData().then(data => {
        renderAsteroids(data);
    });
});