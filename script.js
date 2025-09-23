// --- Mock data ---
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
  try { 
    const u = new URL(url); 
    return u.hostname.replace(/^www\./,''); 
  } catch(e){ 
    return url; 
  }
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
      <div class="meta linkline"><strong>Website:</strong> ${p.url ? '<a href="'+p.url+'" target="_blank" rel="noopener noreferrer">'+displayDomain(p.url)+'</a>' : '<span class="muted">–</span>'}</div>
      <div class="actions">
        <button class="btn" onclick="openDrawer('${p.name}')">View profile</button>
        ${p.url ? '<a class="btn primary" href="'+p.url+'" target="_blank" rel="noopener">Go to site</a>' : '<button class="btn" disabled>No website</button>'}
      </div>
    </article>
  `).join('');
}

// Event listeners
qEl.addEventListener('input', render);
countryEl.addEventListener('change', render);
categoryEl.addEventListener('change', render);

document.getElementById('reset').addEventListener('click', ()=>{
  qEl.value=''; 
  countryEl.value=''; 
  categoryEl.value=''; 
  render();
});

document.querySelectorAll('.chip').forEach(ch=>{
  ch.addEventListener('click', ()=>{ 
    categoryEl.value = ch.dataset.quick; 
    render(); 
  });
});

// Tabs functionality
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
  });
});

// Drawer functionality
const drawer = document.getElementById('drawer');

function openDrawer(name){
  document.getElementById('profileTitle').textContent = name + ' (Example Profile)';
  drawer.classList.add('open');
  document.getElementById('open-drawer').setAttribute('aria-expanded','true');
}

document.getElementById('open-drawer').addEventListener('click',()=>openDrawer('ASEAN STI Hub'));

document.getElementById('close-drawer').addEventListener('click',()=>{
  drawer.classList.remove('open');
  document.getElementById('open-drawer').setAttribute('aria-expanded','false');
});

drawer.addEventListener('click', (e)=>{ 
  if(e.target===drawer){ 
    drawer.classList.remove('open'); 
    document.getElementById('open-drawer').setAttribute('aria-expanded','false');
  }
});

// Network mock nodes/edges
(function(){
  const net = document.getElementById('net');
  const nodes = [
    {id:'TH', x:120, y:140, label:'TH'},
    {id:'SG', x:360, y:240, label:'SG'},
    {id:'MY', x:240, y:300, label:'MY'},
    {id:'VN', x:520, y:140, label:'VN'},
    {id:'ID', x:580, y:300, label:'ID'},
    {id:'PH', x:740, y:180, label:'PH'}
  ];
  
  const edges = [ 
    ['TH','SG'], ['TH','MY'], ['SG','MY'], 
    ['VN','PH'], ['VN','SG'], ['MY','ID'] 
  ];
  
  // draw edges
  edges.forEach(([a,b])=>{
    const na = nodes.find(n=>n.id===a);
    const nb = nodes.find(n=>n.id===b);
    const dx = nb.x - na.x;
    const dy = nb.y - na.y; 
    const len = Math.hypot(dx,dy);
    const ang = Math.atan2(dy,dx)*180/Math.PI;
    const edge = document.createElement('div'); 
    edge.className='edge';
    edge.style.left = na.x+17+'px'; 
    edge.style.top = na.y+17+'px'; 
    edge.style.width = len+'px'; 
    edge.style.transform = `rotate(${ang}deg)`;
    net.appendChild(edge);
  });
  
  // draw nodes
  nodes.forEach(n=>{
    const el = document.createElement('div'); 
    el.className='node'; 
    el.style.left=n.x+'px'; 
    el.style.top=n.y+'px'; 
    el.textContent=n.label; 
    net.appendChild(el);
  });
})();

// Initialize the application
render();