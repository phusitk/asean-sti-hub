// ASEAN STI Digital Gateway - Clean Working Version
console.log('Loading ASEAN STI app...');

// Platform data
const platforms = [
  {
    name: "ASTNET",
    country: "Indonesia", 
    url: "https://astnet.asean.org",
    categories: ["Network", "Publications"],
    status: "online",
    description: "ASEAN Science & Technology Network facilitating research collaboration",
    users: 2847
  },
  {
    name: "AJSTD Journal",
    country: "Brunei Darussalam",
    url: "https://ajstd.ubd.edu.bn",
    categories: ["Journal", "Open Access"],
    status: "online", 
    description: "ASEAN Journal on Science and Technology for Development",
    users: 1567
  },
  {
    name: "ASEAN Education Platform",
    country: "Lao PDR",
    url: "https://stic.asuengineeringonline.com",
    categories: ["Education", "Training"], 
    status: "online",
    description: "Online Education Platform for Industry 4.0",
    users: 5234
  },
  {
    name: "ASEAN Talent Mobility",
    country: "Thailand",
    url: "https://asean-talent.nxpo.or.th/home",
    categories: ["Talent", "Directory"],
    status: "online",
    description: "Platform connecting researchers and professionals", 
    users: 3456
  },
  {
    name: "ASEAN Startup Initiative",
    country: "Malaysia",
    url: "https://startup-asean.org", 
    categories: ["Startup", "Ecosystem"],
    status: "online",
    description: "Supporting innovation ecosystem development",
    users: 4567
  },
  {
    name: "ASEAN BCG Network", 
    country: "Thailand",
    url: "https://www.nstda.or.th/en/about-asean-bcg-network.html",
    categories: ["BCG", "Network"],
    status: "online",
    description: "Bio-Circular-Green Economy network",
    users: 2134
  }
];

// Global variables
let currentView = 'directory';
let leafletMap = null;

// Utility functions
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = '<div style="display: flex; align-items: center; justify-content: space-between;"><span>' + message + '</span><button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; margin-left: 12px;">&times;</button></div>';
  
  toastContainer.appendChild(toast);
  
  setTimeout(function() {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 3000);
}

function formatNumber(num) {
  if (!num) return '0';
  return new Intl.NumberFormat().format(num);
}

function statusPill(status) {
  const map = { online: 's-ok', degraded: 's-soon', offline: 's-soon' };
  const textMap = { online: 'Online', degraded: 'Limited Access', offline: 'Coming Soon' };
  const txt = textMap[status] || 'Coming Soon';
  return '<span class="status ' + (map[status] || 's-soon') + '">' + txt + '</span>';
}

function displayDomain(url) {
  if (!url) return 'No website available';
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch (e) {
    return 'No website available';
  }
}

// Tab switching function
function switchTab(tabName) {
  console.log('Switching to tab:', tabName);
  
  // Remove active class from all tabs
  document.querySelectorAll('.tab').forEach(function(tab) {
    tab.classList.remove('active');
  });
  
  // Add active class to clicked tab
  const activeTab = document.querySelector('[data-tab="' + tabName + '"]');
  if (activeTab) {
    activeTab.classList.add('active');
    console.log('Tab activated:', tabName);
  }
  
  // Hide all views
  document.querySelectorAll('.view').forEach(function(view) {
    view.style.display = 'none';
  });
  
  // Show selected view
  const targetView = document.getElementById('view-' + tabName);
  if (targetView) {
    targetView.style.display = 'block';
    console.log('View shown:', 'view-' + tabName);
    currentView = tabName;
    
    // Initialize specific view functionality with delay
    setTimeout(function() {
      if (tabName === 'map') {
        initializeMapView();
      } else if (tabName === 'network') {
        initializeNetworkView();
      }
    }, 100);
    
  } else {
    console.error('View not found:', 'view-' + tabName);
  }
}

// Render platform cards
function renderPlatforms() {
  const cardsContainer = document.getElementById('cards');
  if (!cardsContainer) return;
  
  const searchQuery = document.getElementById('q') ? document.getElementById('q').value.toLowerCase() : '';
  const selectedCountry = document.getElementById('country') ? document.getElementById('country').value : '';
  const selectedCategory = document.getElementById('category') ? document.getElementById('category').value : '';
  
  // Filter platforms
  const filteredPlatforms = platforms.filter(function(platform) {
    const matchesSearch = !searchQuery || 
      platform.name.toLowerCase().includes(searchQuery) ||
      platform.description.toLowerCase().includes(searchQuery) ||
      platform.country.toLowerCase().includes(searchQuery);
    
    const matchesCountry = !selectedCountry || platform.country === selectedCountry;
    const matchesCategory = !selectedCategory || platform.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCountry && matchesCategory;
  });
  
  // Update result count
  const resultCount = document.getElementById('resultCount');
  if (resultCount) {
    resultCount.textContent = 'Showing ' + filteredPlatforms.length + ' platform' + (filteredPlatforms.length !== 1 ? 's' : '');
  }
  
  // Update active filters
  updateActiveFilters(searchQuery, selectedCountry, selectedCategory);
  
  // Render cards
  cardsContainer.innerHTML = filteredPlatforms.map(function(platform) {
    const isOnline = platform.status === 'online';
    const userCount = platform.users ? formatNumber(platform.users) + ' users' : 'No data';
    
    return '<article class="card" role="article">' +
      '<div class="meta">' +
        statusPill(platform.status) +
        '<span class="muted">' + userCount + '</span>' +
      '</div>' +
      '<h4>' + platform.name + '</h4>' +
      '<div class="meta">' + platform.country + ' • ' + platform.categories.join(', ') + '</div>' +
      (platform.description ? '<p style="font-size: 13px; color: var(--muted); line-height: 1.4; margin: 8px 0;">' + platform.description + '</p>' : '') +
      '<div class="tags">' + platform.categories.map(function(cat) { return '<span class="tag">' + cat + '</span>'; }).join('') + '</div>' +
      '<div class="meta linkline">' +
        '<strong>Website:</strong> ' +
        (platform.url ? 
          '<a href="' + platform.url + '" target="_blank" rel="noopener">' + displayDomain(platform.url) + '</a>' : 
          '<span class="muted">Coming soon</span>'
        ) +
      '</div>' +
      '<div class="actions">' +
        '<button class="btn" onclick="openProfile(\'' + platform.name + '\')">View Profile</button>' +
        (isOnline ? 
          '<a class="btn primary" href="' + platform.url + '" target="_blank" rel="noopener">Visit Platform</a>' : 
          '<button class="btn" disabled>Platform Offline</button>'
        ) +
      '</div>' +
    '</article>';
  }).join('');
}

function updateActiveFilters(search, country, category) {
  const activeFilters = document.getElementById('activeFilters');
  if (!activeFilters) return;
  
  const filters = [];
  if (search) filters.push('<span class="tag">Search: ' + search + '</span>');
  if (country) filters.push('<span class="tag">Country: ' + country + '</span>');
  if (category) filters.push('<span class="tag">Category: ' + category + '</span>');
  
  activeFilters.innerHTML = filters.join('');
}

// Profile drawer
function openProfile(platformName) {
  const platform = platforms.find(function(p) { return p.name === platformName; });
  if (!platform) return;
  
  const drawer = document.getElementById('drawer');
  const profileTitle = document.getElementById('profileTitle');
  
  if (profileTitle) {
    profileTitle.textContent = platform.name;
  }
  
  if (drawer) {
    drawer.classList.add('open');
  }
  
  console.log('Profile opened for:', platformName);
}

// Map initialization
function initializeMapView() {
  console.log('Initializing map view...');
  
  if (typeof L !== 'undefined') {
    initializeLeafletMap();
  } else {
    initializeSVGMap();
  }
}

function initializeLeafletMap() {
  const container = document.getElementById('leaflet-map');
  if (!container || leafletMap) return;

  try {
    container.innerHTML = '';
    
    leafletMap = L.map(container, { 
      zoomControl: true,
      attributionControl: true
    });
    
    // Expand view to show more of the region with better zoom level
    leafletMap.setView([8, 115], 3.5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(leafletMap);

    // Detailed platform data by country from COSTI document
    const countryPlatformData = {
      'Thailand': {
        capital: 'Bangkok',
        platforms: [
          { name: 'ASEAN Talent Mobility', url: 'https://asean-talent.nxpo.or.th/home', status: 'active' },
          { name: 'ASEAN BCG Network', url: 'https://www.nstda.or.th/en/about-asean-bcg-network.html', status: 'active' },
          { name: 'ASEAN LNSN', url: 'https://aseanlnsn.com/', status: 'active' },
          { name: 'ASEAN NPSR', url: 'https://aseannpsr.com/', status: 'inactive', note: 'ไม่พบ/ไม่ถูก index' },
          { name: 'ARTSA', url: 'https://artsa.gistda.or.th', status: 'active' }
        ]
      },
      'Indonesia': {
        capital: 'Jakarta',
        platforms: [
          { name: 'ASTNET', url: 'https://astnet.asean.org', status: 'active' },
          { name: 'AnMicro', url: 'https://amibase.org', status: 'active' },
          { name: 'ASEAN Expert Groups on Metrology', url: 'https://awmc.royalrain.go.th/asean/', status: 'active' },
          { name: 'ASEAN Earthquake Information Centre', url: 'https://aeic.bmkg.go.id', status: 'active' }
        ]
      },
      'Singapore': {
        capital: 'Singapore',
        platforms: [
          { name: 'ASEAN HPC Task Force (NSCC)', url: 'https://www.nscc.sg/', status: 'active' },
          { name: 'AMNCB', url: 'https://asean.bsn.go.id/', status: 'active' },
          { name: 'DxD Hub (A*STAR)', url: 'https://www.a-star.edu.sg/dxdhub/about-dxd-hub', status: 'active' }
        ]
      },
      'Malaysia': {
        capital: 'Kuala Lumpur',
        platforms: [
          { name: 'ASEAN Startup Initiative', url: 'https://startup-asean.org', status: 'active' },
          { name: 'ASEAN Foresight Alliance (AFA)', url: 'https://www.akademisains.gov.my/ar22/asean-foresight-alliance-afa/', status: 'active' }
        ]
      },
      'Brunei Darussalam': {
        capital: 'Bandar Seri Begawan',
        platforms: [
          { name: 'AJSTD Journal', url: 'https://ajstd.ubd.edu.bn', status: 'active' },
          { name: 'APBioNet', url: 'http://www.apbionet.org', status: 'active' }
        ]
      },
      'Vietnam': {
        capital: 'Hanoi',
        platforms: [
          { name: 'AHC (ASEAN Hydroinformatics Data Centre)', url: 'https://www.aseanwater.net/', status: 'active' }
        ]
      },
      'Lao PDR': {
        capital: 'Vientiane',
        platforms: [
          { name: 'ASEAN Online Education Platform for Industry 4.0', url: 'https://stic.asuengineeringonline.com', status: 'active' }
        ]
      },
      'Cambodia': {
        capital: 'Phnom Penh',
        platforms: [
          { name: 'Technology Management Hub', url: '', status: 'inactive', note: 'ไม่มีเว็บไซต์' }
        ]
      },
      'Philippines': {
        capital: 'Manila',
        platforms: []
      },
      'Myanmar': {
        capital: 'Naypyidaw',
        platforms: []
      }
    };

    // ASEAN capitals coordinates
    const capitals = {
      'Thailand': { lat: 13.7563, lon: 100.5018 },
      'Indonesia': { lat: -6.2000, lon: 106.8167 },
      'Singapore': { lat: 1.3521, lon: 103.8198 },
      'Malaysia': { lat: 3.1390, lon: 101.6869 },
      'Brunei Darussalam': { lat: 4.8903, lon: 114.9415 },
      'Vietnam': { lat: 21.0278, lon: 105.8342 },
      'Lao PDR': { lat: 17.9757, lon: 102.6331 },
      'Cambodia': { lat: 11.5564, lon: 104.9282 },
      'Philippines': { lat: 14.5995, lon: 120.9842 },
      'Myanmar': { lat: 19.7633, lon: 96.0785 }
    };

    Object.entries(countryPlatformData).forEach(function([country, data]) {
      const coord = capitals[country];
      if (!coord) return;

      const totalPlatforms = data.platforms.length;
      const activePlatforms = data.platforms.filter(function(p) { return p.status === 'active'; }).length;
      
      // Create uniform marker icon - same color for all countries
      const icon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #0ea5e9; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.25);"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      
      // Create detailed popup content
      let popupContent = '<div style="min-width: 320px; max-width: 400px; font-family: system-ui, sans-serif;">';
      popupContent += '<h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 18px; font-weight: 600;">' + country + '</h3>';
      popupContent += '<p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;"><strong>Capital:</strong> ' + data.capital + '<br><strong>STI Platforms:</strong> ' + totalPlatforms + ' total';
      
      if (activePlatforms !== totalPlatforms && totalPlatforms > 0) {
        popupContent += ' (' + activePlatforms + ' active)';
      }
      popupContent += '</p>';
      
      if (data.platforms.length > 0) {
        // Group platforms by status
        const active = data.platforms.filter(function(p) { return p.status === 'active'; });
        const inactive = data.platforms.filter(function(p) { return p.status === 'inactive'; });
        
        if (active.length > 0) {
          popupContent += '<div style="margin-bottom: 16px;">';
          popupContent += '<h4 style="margin: 0 0 8px 0; color: #059669; font-size: 15px; font-weight: 600;">Active Platforms:</h4>';
          popupContent += '<div style="display: flex; flex-direction: column; gap: 6px;">';
          
          active.forEach(function(platform) {
            if (platform.url) {
              popupContent += '<a href="' + platform.url + '" target="_blank" rel="noopener noreferrer" style="color: #059669; text-decoration: none; padding: 8px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; font-size: 13px; font-weight: 500; transition: background 0.2s ease;" onmouseover="this.style.background=\'#dcfce7\'" onmouseout="this.style.background=\'#f0fdf4\'">';
              popupContent += '🔗 ' + platform.name;
              popupContent += '</a>';
            } else {
              popupContent += '<div style="padding: 8px 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 13px; color: #374151;">';
              popupContent += platform.name;
              popupContent += '</div>';
            }
          });
          
          popupContent += '</div></div>';
        }
        
        if (inactive.length > 0) {
          popupContent += '<div style="margin-bottom: 12px;">';
          popupContent += '<h4 style="margin: 0 0 8px 0; color: #dc2626; font-size: 15px; font-weight: 600;">Under Development:</h4>';
          popupContent += '<div style="display: flex; flex-direction: column; gap: 4px;">';
          
          inactive.forEach(function(platform) {
            popupContent += '<div style="padding: 6px 10px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; font-size: 12px; color: #991b1b;">';
            popupContent += platform.name;
            if (platform.note) {
              popupContent += '<br><em style="font-size: 11px; color: #6b7280;">(' + platform.note + ')</em>';
            }
            popupContent += '</div>';
          });
          
          popupContent += '</div></div>';
        }
      } else {
        popupContent += '<div style="padding: 16px; text-align: center; color: #6b7280; font-style: italic; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">';
        popupContent += 'No STI platforms registered yet';
        popupContent += '</div>';
      }
      
      popupContent += '</div>';
      
      // Add marker to map
      const marker = L.marker([coord.lat, coord.lon], { icon })
        .addTo(leafletMap)
        .bindPopup(popupContent, {
          maxWidth: 400,
          className: 'custom-popup'
        });
        
      // Add tooltip on hover showing country name only
      marker.bindTooltip(country, {
        direction: 'top',
        offset: [0, -30],
        className: 'custom-tooltip'
      });
    });

    // Expand bounds to show more of the region
    const bounds = L.latLngBounds([[-25, 75], [40, 155]]);
    leafletMap.setMaxBounds(bounds);
    
    // Add custom CSS for popups and tooltips
    const style = document.createElement('style');
    style.textContent = '.custom-popup .leaflet-popup-content { margin: 8px 12px 12px 12px; line-height: 1.4; } .custom-tooltip { background: rgba(14, 165, 233, 0.9); color: white; border: none; border-radius: 4px; font-size: 12px; font-weight: 500; }';
    document.head.appendChild(style);
    
    console.log('Leaflet map with uniform markers initialized successfully');

  } catch (error) {
    console.error('Error initializing Leaflet map:', error);
    initializeSVGMap();
  }
}

function initializeSVGMap() {
  const mapContainer = document.getElementById('leaflet-map');
  if (!mapContainer) return;
  
  if (mapContainer.innerHTML.trim()) return;
  
  mapContainer.innerHTML = '<div style="position: relative; width: 100%; height: 400px; background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%); border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center;"><div style="text-align: center; color: #374151;"><h3>ASEAN Region Map</h3><p>Interactive map showing STI platform distribution</p><small>Leaflet library not available - showing placeholder</small></div></div>';
}

// Network visualization
function initializeNetworkView() {
  console.log('Initializing network view...');
  initializeNetwork();
}

function initializeNetwork() {
  const networkContainer = document.getElementById('net');
  if (!networkContainer) return;
  
  if (networkContainer.innerHTML.trim()) return;
  
  networkContainer.innerHTML = '<div style="position: relative; width: 100%; height: 420px; border: 1px solid var(--line); border-radius: 12px; background: #fff; display: flex; align-items: center; justify-content: center;"><div style="text-align: center; color: #374151;"><h3>Platform Network Graph</h3><p>Visualizing connections between ASEAN STI platforms</p><small>D3.js library not available - showing placeholder</small></div></div>';
}

// Authentication
function showLogin() {
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.style.display = 'flex';
  }
}

function hideLogin() {
  const authModal = document.getElementById('auth-modal');
  if (authModal) {
    authModal.style.display = 'none';
  }
}

function doLogin() {
  const emailInput = document.querySelector('#auth-modal input[type="email"]');
  const email = emailInput ? emailInput.value : '';
  
  if (email) {
    const loginBtn = document.getElementById('login-btn');
    const roleSelector = document.getElementById('role-selector');
    
    if (loginBtn) loginBtn.textContent = email.split('@')[0] + ' ▼';
    if (roleSelector) roleSelector.style.display = 'block';
    
    hideLogin();
    showToast('Successfully logged in!', 'success');
  }
}

// Initialize the application
function initApp() {
  console.log('Initializing ASEAN STI Digital Gateway...');
  
  // Setup tab event listeners
  document.querySelectorAll('.tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      if (tabName) {
        switchTab(tabName);
      }
    });
  });
  
  // Setup search and filter event listeners
  const searchInput = document.getElementById('q');
  const countryFilter = document.getElementById('country');
  const categoryFilter = document.getElementById('category');
  const resetBtn = document.getElementById('reset');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      setTimeout(renderPlatforms, 300);
    });
  }
  
  if (countryFilter) {
    countryFilter.addEventListener('change', renderPlatforms);
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', renderPlatforms);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (searchInput) searchInput.value = '';
      if (countryFilter) countryFilter.value = '';
      if (categoryFilter) categoryFilter.value = '';
      renderPlatforms();
      showToast('Filters reset', 'info');
    });
  }
  
  // Setup quick filter chips
  document.querySelectorAll('.chip[data-quick]').forEach(function(chip) {
    chip.addEventListener('click', function() {
      const category = this.dataset.quick;
      if (categoryFilter) {
        categoryFilter.value = category;
        renderPlatforms();
        showToast('Filtered by: ' + category, 'info');
      }
    });
  });
  
  // Setup modal close handlers
  document.addEventListener('click', function(e) {
    const drawer = document.getElementById('drawer');
    const authModal = document.getElementById('auth-modal');
    
    if (e.target === drawer) {
      drawer.classList.remove('open');
    }
    
    if (e.target === authModal) {
      authModal.style.display = 'none';
    }
  });
  
  // Setup close buttons
  document.querySelectorAll('#close-drawer, #close-auth').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (this.id === 'close-drawer') {
        const drawer = document.getElementById('drawer');
        if (drawer) drawer.classList.remove('open');
      } else if (this.id === 'close-auth') {
        hideLogin();
      }
    });
  });
  
  // Setup authentication
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', showLogin);
  }
  
  const authForm = document.querySelector('.auth-form');
  if (authForm) {
    authForm.addEventListener('submit', function(e) {
      e.preventDefault();
      doLogin();
    });
  }
  
  // Setup role selector
  const roleSelector = document.getElementById('role-selector');
  if (roleSelector) {
    roleSelector.addEventListener('change', function(e) {
      showToast('Role changed to: ' + e.target.value, 'info');
    });
  }
  
  // Setup keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const drawer = document.getElementById('drawer');
      const authModal = document.getElementById('auth-modal');
      
      if (drawer && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
      }
      if (authModal && authModal.style.display === 'flex') {
        authModal.style.display = 'none';
      }
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });
  
  // Initial render
  renderPlatforms();
  
  // Show welcome message
  setTimeout(function() {
    if (!localStorage.getItem('asean-sti-visited')) {
      localStorage.setItem('asean-sti-visited', 'true');
      showToast('Welcome to ASEAN STI Digital Gateway!', 'success', 5000);
    }
  }, 1000);
  
  console.log('ASEAN STI Digital Gateway initialized successfully!');
}

// Global functions for HTML onclick handlers
window.switchTab = switchTab;
window.openProfile = openProfile;
window.showLogin = showLogin;
window.hideLogin = hideLogin;
window.doLogin = doLogin;

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}