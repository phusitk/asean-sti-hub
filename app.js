// ---------------- Platforms (sample from COSTI list) ----------------
const platforms = [
  {name:"ASTNET", country:"Indonesia", url:"https://astnet.asean.org", categories:["Network","Publications"], status:"online"},
  {name:"AJSTD (ASEAN Journal on Science and Technology for Development)", country:"Brunei Darussalam", url:"https://ajstd.ubd.edu.bn", categories:["Journal","Open Access"], status:"online"},
  {name:"ASEAN Online Education Platform for Industry 4.0 (STIC)", country:"Lao PDR / Indonesia", url:"https://stic.asuengineeringonline.com", categories:["Education","Training"], status:"online"},
  {name:"ASEAN Talent Mobility", country:"Thailand", url:"https://asean-talent.nxpo.or.th/home", categories:["Talent","Directory"], status:"online"},
  {name:"ASEAN Startup Initiative", country:"Malaysia", url:"https://startup-asean.org", categories:["Startup","Ecosystem"], status:"online"},
  {name:"Technology Management Hub", country:"Cambodia", url:"", categories:["Technology Management"], status:"offline"},
  {name:"Regional Research Infrastructure", country:"Thailand", url:"", categories:["Research Infrastructure"], status:"offline"},
  {name:"ASEAN Young Scientists Network", country:"Malaysia / Thailand", url:"", categories:["Network"], status:"offline"},
  {name:"ASEAN Science & Technology Research and Education Network", country:"Singapore", url:"", categories:["Network"], status:"offline"},
  {name:"ASEAN BCG Network", country:"Thailand", url:"https://www.nstda.or.th/en/about-asean-bcg-network.html", categories:["BCG","Network"], status:"online"},
  {name:"ASEAN Foresight Alliance (AFA)", country:"Malaysia", url:"https://www.akademisains.gov.my/ar22/asean-foresight-alliance-afa/", categories:["Foresight","Alliance"], status:"online"},
  {name:"AnMicro (ASEAN Centre on Microbial Utilization)", country:"Indonesia", url:"https://amibase.org", categories:["Microbiology","Data"], status:"online"},
  {name:"ASEAN LNSN (Large Nuclear & Synchrotron Facilities Network)", country:"Thailand", url:"https://aseanlnsn.com/", categories:["Facilities","Network"], status:"online"},
  {name:"ASEAN NPSR", country:"Thailand", url:"https://aseannpsr.com", categories:["Nuclear","Network"], status:"degraded"},
  {name:"APBioNet (Asia Pacific Bioinformatics Network)", country:"Brunei / Singapore", url:"http://www.apbionet.org", categories:["Bioinformatics","Training"], status:"online"},
  {name:"AHC (ASEAN Hydroinformatics Data Centre)", country:"Vietnam", url:"https://www.aseanwater.net/", categories:["Water","Data"], status:"online"},
  {name:"ASEAN HPC Task Force (NSCC Singapore)", country:"Singapore", url:"https://www.nscc.sg/", categories:["HPC","Supercomputing"], status:"online"},
  {name:"AMNCB (ASEAN Metrology Network in Chemistry and Biology)", country:"Singapore", url:"https://asean.bsn.go.id/", categories:["Metrology","Standards"], status:"online"},
  {name:"ARMN-EGM (ASEAN Reference Material Network)", country:"Regional", url:"https://armn2018.wordpress.com", categories:["Reference Materials","Catalogue"], status:"online"},
  {name:"ASEAN Expert Groups on Metrology (AWMC)", country:"Indonesia", url:"https://awmc.royalrain.go.th/asean/", categories:["Weather Modification","Metrology"], status:"online"},
  {name:"ARTSA (ASEAN Research & Training Centre for Space Technology and Applications)", country:"Thailand", url:"https://artsa.gistda.or.th", categories:["Space","Training"], status:"online"},
  {name:"ASEAN NDI", country:"Regional", url:"http://www.asean-ndi.net", categories:["Health","R&D Directory"], status:"online"},
  {name:"DxD Hub (A*STAR)", country:"Singapore", url:"https://www.a-star.edu.sg/dxdhub/about-dxd-hub", categories:["Diagnostics","Innovation"], status:"online"},
  {name:"ASMC (ASEAN Specialised Meteorological Centre)", country:"Regional", url:"https://asmc.asean.org/home/", categories:["Meteorology","Haze Monitoring"], status:"online"},
  {name:"AEIC (ASEAN Earthquake Information Centre)", country:"Indonesia", url:"https://aeic.bmkg.go.id", categories:["Earthquake","Information"], status:"online"}
];

// ---------------- Directory rendering ----------------
const cardsEl = document.getElementById('cards');
const qEl = document.getElementById('q');
const countryEl = document.getElementById('country');
const categoryEl = document.getElementById('category');
const resultCountEl = document.getElementById('resultCount');
const activeFiltersEl = document.getElementById('activeFilters');

function statusPill(status){
  const map = {online:'s-ok', degraded:'s-warn', offline:'s-bad'};
  const txt = status.charAt(0).toUpperCase()+status.slice(1);
  return `<span class="status ${map[status]}">${txt}</span>`;
}
function displayDomain(url){
  try { const u = new URL(url); return u.hostname.replace(/^www\./,''); } catch(e){ return url; }
}
function render(){
  const q = qEl.value.trim().toLowerCase();
  const ctry = countryEl.value;
  const cat = categoryEl.value;
  activeFiltersEl.innerHTML = '';
  const chips = [];
  if(q) chips.push(`<span class="tag">q: ${q}</span>`);
  if(ctry) chips.push(`<span class="tag">${ctry}</span>`);
  if(cat) chips.push(`<span class="tag">${cat}</span>`);
  activeFiltersEl.innerHTML = chips.join('');

  const filtered = platforms.filter(p => {
    const matchesQ = !q || `${p.name} ${p.country} ${p.categories.join(' ')}`.toLowerCase().includes(q);
    const matchesC = !ctry || p.country === ctry;
    const matchesCat = !cat || p.categories.includes(cat);
    return matchesQ && matchesC && matchesCat;
  });

  resultCountEl.textContent = `Showing ${filtered.length} platform${filtered.length!==1?'s':''}`;
  cardsEl.innerHTML = filtered.map(p => `
    <article class="card" role="article" aria-label="${p.name}">
      <div class="meta">${statusPill(p.status)}</div>
      <h4>${p.name}</h4>
      <div class="meta">${p.country} • ${p.categories.join(', ')}</div>
      <div class="tags">${p.categories.map(x=>`<span class="tag">${x}</span>`).join('')}</div>
      <div class="meta linkline"><strong>Website:</strong> ${p.url ? '<a href="'+p.url+'" target="_blank" rel="noopener noreferrer">'+displayDomain(p.url)+'</a>' : '<span class="muted">—</span>'}</div>
      <div class="actions">
        <button class="btn" onclick="openDrawer('${p.name}')">View profile</button>
        ${p.url ? '<a class="btn primary" href="'+p.url+'" target="_blank" rel="noopener">Go to site</a>' : '<button class="btn" disabled>No website</button>'}
      </div>
    </article>
  `).join('');
}

// ---------------- Tabs & drawer ----------------
const tabs = document.querySelectorAll('.tab');
const views = {
  directory: document.getElementById('view-directory'),
  map: document.getElementById('view-map'),
  network: document.getElementById('view-network'),
  admin: document.getElementById('view-admin')
};
tabs.forEach(t=>{
  t.addEventListener('click', ()=>{
    tabs.forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    Object.values(views).forEach(v=>v.style.display='none');
    views[t.dataset.tab].style.display='block';
    if (t.dataset.tab === 'map') ensureLeaflet();
    if (t.dataset.tab === 'network') ensureNetwork();
  });
});

const drawer = document.getElementById('drawer');
function openDrawer(name){
  document.getElementById('profileTitle').textContent = name + ' (Example Profile)';
  drawer.classList.add('open');
  document.getElementById('open-drawer').setAttribute('aria-expanded','true');
}
document.getElementById('open-drawer').addEventListener('click',()=>openDrawer('ASEAN STI Hub'));
document.getElementById('close-drawer').addEventListener('click',()=>{drawer.classList.remove('open');document.getElementById('open-drawer').setAttribute('aria-expanded','false')});
drawer.addEventListener('click', (e)=>{ if(e.target===drawer){ drawer.classList.remove('open'); document.getElementById('open-drawer').setAttribute('aria-expanded','false') }});

// ---------------- Leaflet Map (ASEAN capitals) ----------------
let leafletMap = null;
const capitals = {
  'Brunei Darussalam': { city: 'Bandar Seri Begawan', lat: 4.8903, lon: 114.9415 },
  'Cambodia':          { city: 'Phnom Penh',          lat: 11.5564, lon: 104.9282 },
  'Indonesia':         { city: 'Jakarta',             lat: -6.2000, lon: 106.8167 },
  'Lao PDR':           { city: 'Vientiane',           lat: 17.9757, lon: 102.6331 },
  'Malaysia':          { city: 'Kuala Lumpur',        lat: 3.1390,  lon: 101.6869 },
  'Myanmar':           { city: 'Naypyidaw',           lat: 19.7633, lon: 96.0785 },
  'Philippines':       { city: 'Manila',              lat: 14.5995, lon: 120.9842 },
  'Singapore':         { city: 'Singapore',           lat: 1.3521,  lon: 103.8198 },
  'Thailand':          { city: 'Bangkok',             lat: 13.7563, lon: 100.5018 },
  'Viet Nam':          { city: 'Hanoi',               lat: 21.0278, lon: 105.8342 }
};
const countryAlias = { 'Brunei':'Brunei Darussalam', 'Laos':'Lao PDR', 'Vietnam':'Viet Nam', 'VietNam':'Viet Nam' };
const aseanCountries = Object.keys(capitals);
const normalizeCountryName = n => countryAlias[n.trim()] || n.trim();
const expandCountries = field => field.split(/[\/ ,]/).map(s=>normalizeCountryName(s.trim())).filter(Boolean);

function buildCountryPlatformIndex(){
  const index = Object.fromEntries(aseanCountries.map(c => [c, []]));
  platforms.forEach(p => expandCountries(p.country).forEach(c => { if (index[c]) index[c].push(p.name); }));
  return index;
}
function ensureLeaflet(){
  if (!leafletMap){
    const container = document.getElementById('leaflet-map');
    leafletMap = L.map(container, { zoomControl: true });
    const bounds = L.latLngBounds(L.latLng(-12,90), L.latLng(23,135));
    leafletMap.fitBounds(bounds);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(leafletMap);
    const idx = buildCountryPlatformIndex();
    const allLatLngs = [];
    aseanCountries.forEach(c => {
      const cap = capitals[c]; allLatLngs.push([cap.lat, cap.lon]);
      const list = idx[c]||[];
      const listHTML = list.length ? `<ul style="padding-left:18px;margin:6px 0 0">${list.map(n=>`<li>${n}</li>`).join('')}</ul>` : `<em>No platforms listed yet</em>`;
      L.marker([cap.lat,cap.lon]).addTo(leafletMap).bindPopup(`<strong>${c}</strong> — ${cap.city}${listHTML}`);
    });
    leafletMap.fitBounds(L.latLngBounds(allLatLngs), { padding:[20,20] });
  } else {
    setTimeout(()=>leafletMap.invalidateSize(), 200);
  }
}

// ---------------- D3 Force-directed Network ----------------
let networkInited = false;
let netSvg, netZoom, netSimulation;

function ensureNetwork(){
  if (networkInited) return;
  networkInited = true;

  const container = document.getElementById('net');
  const width = container.clientWidth || 960;
  const height = container.clientHeight || 420;

  // Nodes and example links
  const nodes = platforms.map(p => ({
    id: p.name,
    group: (p.categories && p.categories[0]) ? p.categories[0] : 'Other',
    country: p.country,
    status: p.status,
    url: p.url
  }));

  const linksData = [
    { source:"ASEAN NDI", target:"DxD Hub (A*STAR)", type:"co-innovation" },
    { source:"ASEAN HPC Task Force (NSCC Singapore)", target:"APBioNet (Asia Pacific Bioinformatics Network)", type:"shared_infra" },
    { source:"ASEAN HPC Task Force (NSCC Singapore)", target:"AnMicro (ASEAN Centre on Microbial Utilization)", type:"shared_infra" },
    { source:"ASEAN LNSN (Large Nuclear & Synchrotron Facilities Network)", target:"ASEAN NPSR", type:"shared_infra" },
    { source:"ASEAN BCG Network", target:"ASEAN Talent Mobility", type:"membership" },
    { source:"ASEAN Foresight Alliance (AFA)", target:"ASEAN BCG Network", type:"membership" },
    { source:"ASMC (ASEAN Specialised Meteorological Centre)", target:"AEIC (ASEAN Earthquake Information Centre)", type:"data_link" },
    { source:"AHC (ASEAN Hydroinformatics Data Centre)", target:"ASMC (ASEAN Specialised Meteorological Centre)", type:"data_link" },
    { source:"ASTNET", target:"AJSTD (ASEAN Journal on Science and Technology for Development)", type:"publication" },
    { source:"ARTSA (ASEAN Research & Training Centre for Space Technology and Applications)", target:"ASMC (ASEAN Specialised Meteorological Centre)", type:"data_link" }
  ];

  // Filter valid links
  const nodeIds = new Set(nodes.map(n=>n.id));
  const links = linksData.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

  // Color by first category
  const catList = Array.from(new Set(nodes.map(n=>n.group)));
  const color = d3.scaleOrdinal(catList, d3.schemeTableau10);

  netZoom = d3.zoom().scaleExtent([0.3, 3]).on('zoom', (event)=> g.attr('transform', event.transform));
  netSvg = d3.select(container).append('svg')
    .attr('viewBox', [0, 0, width, height])
    .call(netZoom);
  const g = netSvg.append('g');

  const link = g.append('g').selectAll('line')
    .data(links)
    .join('line')
    .attr('class', d => `link type-${d.type}`)
    .attr('stroke-linecap','round');

  const node = g.append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .attr('class', d => `node ${d.status}`)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    )
    .on('click', (_, d) => openDrawer(d.id))
    .on('mouseover', (_, d) => highlight(d))
    .on('mouseout', clearHighlight);

  node.append('circle')
    .attr('r', 12)                 // enlarged node size
    .attr('fill', d => color(d.group));

  node.append('title')
    .text(d => `${d.id}
${d.country}
Category: ${d.group}
Status: ${d.status}`);

  node.append('text')
    .text(d => trimLabel(d.id))
    .attr('x', 16)                 // shifted label for larger circle
    .attr('y', 4)
    .attr('font-size', 12)
    .attr('fill', '#111');

  const linkDistance = l => ({ shared_infra:70, data_link:90, membership:110, 'co-innovation':100, publication:100 }[l.type] || 100);
  const linkStrength = l => ({ shared_infra:.35, data_link:.25, membership:.2, 'co-innovation':.22, publication:.2 }[l.type] || .2);

  netSimulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d=>d.id).distance(linkDistance).strength(linkStrength))
    .force('charge', d3.forceManyBody().strength(-140))
    .force('center', d3.forceCenter(width/2, height/2))
    .force('collision', d3.forceCollide(22)); // enlarged collision radius

  netSimulation.on('tick', () => {
    link
      .attr('x1', d=>d.source.x).attr('y1', d=>d.source.y)
      .attr('x2', d=>d.target.x).attr('y2', d=>d.target.y);
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  function dragstarted(event, d){
    if (!event.active) netSimulation.alphaTarget(0.3).restart();
    d.fx = d.x; d.fy = d.y;
  }
  function dragged(event, d){
    d.fx = event.x; d.fy = event.y;
  }
  function dragended(event, d){
    if (!event.active) netSimulation.alphaTarget(0);
    d.fx = null; d.fy = null;
  }

  // Neighbor highlight
  const adj = new Map();
  links.forEach(l => {
    const a = l.source.id || l.source, b = l.target.id || l.target;
    (adj.get(a) || adj.set(a,new Set()).get(a)).add(b);
    (adj.get(b) || adj.set(b,new Set()).get(b)).add(a);
  });
  function highlight(d){
    const nbrs = adj.get(d.id) || new Set();
    node.selectAll('circle').style('opacity', n => (n.id===d.id || nbrs.has(n.id)) ? 1 : 0.2);
    node.selectAll('text').style('opacity', n => (n.id===d.id || nbrs.has(n.id)) ? 1 : 0.15);
    link.style('opacity', l => (l.source.id===d.id || l.target.id===d.id || nbrs.has(l.source.id) || nbrs.has(l.target.id)) ? 1 : 0.1);
  }
  function clearHighlight(){
    node.selectAll('circle, text').style('opacity', 1);
    link.style('opacity', 0.9);
  }

  function trimLabel(s){ return s.length > 26 ? s.slice(0,24)+'…' : s; }

  // Reset handler
  document.getElementById('net-reset').addEventListener('click', resetNetwork);
}

function resetNetwork(){
  if (!networkInited){ ensureNetwork(); }
  if (!netSvg || !netZoom || !netSimulation) return;
  // unlock fixed nodes
  netSimulation.nodes().forEach(n => { n.fx = null; n.fy = null; });
  // zoom/pan reset
  netSvg.transition().duration(400).call(netZoom.transform, d3.zoomIdentity);
  // reheat and cool
  netSimulation.alpha(1).restart();
  setTimeout(()=> netSimulation.alphaTarget(0), 600);
}

// ---------------- Init ----------------
qEl.addEventListener('input', render);
countryEl.addEventListener('change', render);
categoryEl.addEventListener('change', render);
document.getElementById('reset').addEventListener('click', ()=>{ qEl.value=''; countryEl.value=''; categoryEl.value=''; render(); });
document.querySelectorAll('.chip').forEach(ch=>{ ch.addEventListener('click', ()=>{ categoryEl.value = ch.dataset.quick; render(); }); });

render(); // Directory on load
