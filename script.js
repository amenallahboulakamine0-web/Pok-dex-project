const baseUrl = "https://pokeapi.co/api/v2/";
const pokemonList = document.getElementById("pokemonList");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const teamDiv = document.getElementById("team");

let pokemons = [];
let team = JSON.parse(localStorage.getItem("team")) || [];

fetch(`${baseUrl}pokemon?limit=450`)
  .then(res => res.json())
  .then(data => {
    const promises = data.results.map(p => fetch(p.url).then(res => res.json()));
    return Promise.all(promises);
  })
  .then(data => {
    pokemons = data;
    displayPokemons(pokemons);
    loadTypes();
    displayTeam();
  });

function displayPokemons(list){
  pokemonList.innerHTML = "";
  list.forEach(pokemon => {
    const card = document.createElement("div");
    card.className = "col-md-2";
    card.innerHTML = `
      <div class="card p-2 text-center">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" onclick="viewStats('${pokemon.name}')">
        <h6 class="mt-2 text-capitalize">${pokemon.name}</h6>
        <button class="btn btn-sm btn-primary" onclick="addToTeam('${pokemon.name}')">Ajouter</button>
      </div>
    `;
    pokemonList.appendChild(card);
  });
}

function addToTeam(name){
  if(team.length >= 6){ alert("Équipe pleine !"); return; }
  const p = pokemons.find(p=>p.name===name);
  if(!team.find(e=>e.name===name)){
    team.push(p);
    saveTeam();
    displayTeam();
  }
}
function removeFromTeam(name){
  team = team.filter(p=>p.name!==name);
  saveTeam();
  displayTeam();
}
function saveTeam(){ localStorage.setItem("team", JSON.stringify(team)); }

function displayTeam(){
  teamDiv.innerHTML = "";
  team.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card p-2 text-center";
    card.innerHTML = `
      <img src="${p.sprites.front_default}" alt="${p.name}" onclick="viewStats('${p.name}')">
      <h6 class="mt-1 text-capitalize">${p.name}</h6>
      <button class="btn btn-sm btn-danger" onclick="removeFromTeam('${p.name}')">Retirer</button>
    `;
    teamDiv.appendChild(card);
  });
}

function viewStats(name){ window.location.href = `stats.html?name=${name}`; }

searchInput.addEventListener("input", filterPokemons);
typeFilter.addEventListener("change", filterPokemons);

function filterPokemons(){
  const s = searchInput.value.toLowerCase();
  const t = typeFilter.value;
  const filtered = pokemons.filter(p=>{
    return p.name.includes(s) && (t==="" || p.types.some(tt=>tt.type.name===t));
  });
  displayPokemons(filtered);
}

function loadTypes(){
  const types = new Set();
  pokemons.forEach(p=>p.types.forEach(t=>types.add(t.type.name)));
  types.forEach(type=>{
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    typeFilter.appendChild(opt);
  });
}

