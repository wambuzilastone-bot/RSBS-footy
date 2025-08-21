/* Monospace viewer for your Vercel API */

const els = {
  baseInput: document.getElementById("baseUrl"),
  applyBaseUrl: document.getElementById("applyBaseUrl"),
  reloadAll: document.getElementById("reloadAll"),

  countriesList: document.getElementById("countries"),
  countriesStatus: document.getElementById("countriesStatus"),
  countrySearch: document.getElementById("countrySearch"),

  leaguesList: document.getElementById("leagues"),
  leaguesStatus: document.getElementById("leaguesStatus"),
  leagueSearch: document.getElementById("leagueSearch"),

  fixturesList: document.getElementById("fixtures"),
  fixturesStatus: document.getElementById("fixturesStatus"),

  selectedCountry: document.getElementById("selectedCountry"),
  selectedLeague: document.getElementById("selectedLeague"),
};

const state = {
  baseUrl: localStorage.getItem("rsbs_base_url") || "https://rsbs-footy.vercel.app",
  countries: [],
  leagues: [],
  fixtures: [],
  countryFilter: "",
  leagueFilter: "",
  activeCountry: null,
  activeLeague: null
};

els.baseInput.value = state.baseUrl;

els.applyBaseUrl.addEventListener("click", () => {
  state.baseUrl = els.baseInput.value.trim().replace(/\/+$/, "");
  localStorage.setItem("rsbs_base_url", state.baseUrl);
  clearUI(true);
  loadCountries();
});

els.reloadAll.addEventListener("click", () => {
  clearUI(true);
  loadCountries();
});

els.countrySearch.addEventListener("input", (e) => {
  state.countryFilter = e.target.value.toLowerCase();
  renderCountries();
});

els.leagueSearch.addEventListener("input", (e) => {
  state.leagueFilter = e.target.value.toLowerCase();
  renderLeagues();
});

// Fetch helpers with tidy error display
async function getJSON(url, statusEl){
  statusEl.textContent = `GET ${url}`;
  try{
    const res = await fetch(url, { headers: { "accept": "application/json" } });
    if(!res.ok){
      const text = await res.text().catch(()=> "");
      throw new Error(`${res.status} ${res.statusText} – ${text.slice(0,180)}`);
    }
    const data = await res.json();
    statusEl.textContent = `OK ${url}`;
    return data;
  }catch(err){
    statusEl.textContent = `ERROR ${url}\n→ ${err.message}`;
    console.error("Fetch error:", err);
    return null;
  }
}

function clearUI(clearSelections){
  state.leagues = [];
  state.fixtures = [];
  renderLeagues();
  renderFixtures();
  els.leaguesStatus.textContent = "";
  els.fixturesStatus.textContent = "";
  if(clearSelections){
    state.activeCountry = null;
    state.activeLeague = null;
    els.selectedCountry.textContent = "—";
    els.selectedLeague.textContent = "—";
    [...document.querySelectorAll(".list li")].forEach(li => li.classList.remove("active"));
  }
}

/* Countries */
async function loadCountries(){
  const url = `${state.baseUrl}/api/countries`;
  const data = await getJSON(url, els.countriesStatus);
  state.countries = Array.isArray(data) ? data.slice().sort((a,b)=>a.localeCompare(b)) : [];
  renderCountries();
}

function renderCountries(){
  const ul = els.countriesList;
  ul.innerHTML = "";
  const q = state.countryFilter;
  const items = state.countries.filter(c => c.toLowerCase().includes(q));
  if(items.length === 0){
    ul.innerHTML = `<li class="empty">No countries</li>`;
    return;
  }
  items.forEach(c => {
    const li = document.createElement("li");
    li.textContent = c;
    if(state.activeCountry === c) li.classList.add("active");
    li.addEventListener("click", () => onSelectCountry(c, li));
    ul.appendChild(li);
  });
}

async function onSelectCountry(country, li){
  state.activeCountry = country;
  state.activeLeague = null;
  els.selectedCountry.textContent = country;
  els.selectedLeague.textContent = "—";
  [...els.countriesList.children].forEach(el => el.classList.remove("active"));
  li.classList.add("active");
  state.leagues = [];
  renderLeagues();
  state.fixtures = [];
  renderFixtures();
  await loadLeagues(country);
}

/* Leagues */
async function loadLeagues(country){
  const url = `${state.baseUrl}/api/leagues?country=${encodeURIComponent(country)}`;
  const data = await getJSON(url, els.leaguesStatus);
  state.leagues = Array.isArray(data) ? data : [];
  renderLeagues();
}

function renderLeagues(){
  const ul = els.leaguesList;
  ul.innerHTML = "";
  const q = state.leagueFilter;
  const items = state.leagues.filter(l => String(l).toLowerCase().includes(q));
  if(items.length === 0){
    ul.innerHTML = `<li class="empty">No leagues</li>`;
    return;
  }
  items.forEach(l => {
    const li = document.createElement("li");
    li.textContent = l;
    if(state.activeLeague === l) li.classList.add("active");
    li.addEventListener("click", () => onSelectLeague(l, li));
    ul.appendChild(li);
  });
}

async function onSelectLeague(league, li){
  state.activeLeague = league;
  els.selectedLeague.textContent = league;
  [...els.leaguesList.children].forEach(el => el.classList.remove("active"));
  li.classList.add("active");
  state.fixtures = [];
  renderFixtures();
  await loadFixtures(league);
}

/* Fixtures */
async function loadFixtures(league){
  const url = `${state.baseUrl}/api/fixtures?league=${encodeURIComponent(league)}`;
  const data = await getJSON(url, els.fixturesStatus);
  state.fixtures = Array.isArray(data) ? data : [];
  renderFixtures();
}

function renderFixtures(){
  const ul = els.fixturesList;
  ul.innerHTML = "";
  if(state.fixtures.length === 0){
    ul.innerHTML = `<li class="fixture">No fixtures</li>`;
    return;
  }
  state.fixtures.forEach(f => {
    const li = document.createElement("li");
    li.className = "fixture";
    const line1 = document.createElement("div");
    line1.className = "line1";
    line1.textContent = `${f.home} vs ${f.away}`;

    const m1 = document.createElement("div");
    const m2 = document.createElement("div");
    const m3 = document.createElement("div");
    m1.className = m2.className = m3.className = "m";
    m1.textContent = f?.metrics?.score ?? "—";
    m2.textContent = f?.metrics?.wdl_ratio ?? "—";
    m3.textContent = f?.metrics?.home_away_wdl ?? "—";

    li.appendChild(line1);
    li.appendChild(m1);
    li.appendChild(m2);
    li.appendChild(m3);
    ul.appendChild(li);
  });
}

// Kick off
loadCountries();
