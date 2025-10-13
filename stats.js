const urlParams = new URLSearchParams(window.location.search);
const pokemonName = urlParams.get("name"); 
const container = document.getElementById("statsContainer");

function fetchPokemonData(name) {
  fetch("https://pokeapi.co/api/v2/pokemon/" + name)
    .then(function(res) {
      if (!res.ok) {
        container.innerHTML = "<p>Erreur : Pokémon introuvable</p>";
        return;
      }
      return res.json();
    })
    .then(function(pokemon) {
      if (!pokemon) return;

      fetch(pokemon.species.url)
        .then(function(res) { return res.json(); })
        .then(function(species) {
          fetch(species.evolution_chain.url)
            .then(function(res) { return res.json(); })
            .then(function(evolutionChain) {
              displayPokemon(pokemon, evolutionChain.chain);
            })
            .catch(function(err) {
              container.innerHTML = "<p>Erreur lors du chargement des évolutions</p>";
              console.log(err);
            });
        })
        .catch(function(err) {
          container.innerHTML = "<p>Erreur lors du chargement de l'espèce</p>";
          console.log(err);
        });
    })
    .catch(function(err) {
      container.innerHTML = "<p>Erreur : " + err.message + "</p>";
      console.log(err);
    });
}

function displayPokemon(pokemon, chain) {
  var img = (pokemon.sprites 
    && pokemon.sprites.other 
    && pokemon.sprites.other["official-artwork"] 
    && pokemon.sprites.other["official-artwork"].front_default) 
    || pokemon.sprites.front_default;

  var types = "";
  for (var i = 0; i < pokemon.types.length; i++) {
    types += '<span class="type-badge">' + pokemon.types[i].type.name + '</span> ';
  }

  var abilities = "";
  for (var i = 0; i < pokemon.abilities.length; i++) {
    abilities += pokemon.abilities[i].ability.name;
    if (i < pokemon.abilities.length - 1) {
      abilities += ", ";
    }
  }

  var height = (pokemon.height/10).toFixed(2);
  var weight = (pokemon.weight/10).toFixed(2);

  var statsHtml = "";
  for (var i = 0; i < pokemon.stats.length; i++) {
    var s = pokemon.stats[i];
    var pct = Math.round(s.base_stat/255*100);
    statsHtml += `
      <div class="stat-row">
        <div class="stat-name">${s.stat.name}</div>
        <div class="progress col-6">
          <div class="progress-bar" style="width:${pct}%"></div>
        </div>
        <div class="text-end fw-bold">${s.base_stat}</div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="stats-card">
      <h2 class="text-center text-capitalize">${pokemon.name}</h2>
      <img src="${img}" alt="${pokemon.name}">
      <div class="text-center mb-2">${types}</div>
      <p><strong>Taille:</strong> ${height} m | <strong>Poids:</strong> ${weight} kg</p>
      <p><strong>Capacités:</strong> ${abilities}</p>
      <h4>Statistiques de base</h4>
      ${statsHtml}
      <h4 class="mt-3">Évolutions</h4>
      <div class="evo-list">${renderEvolutions(chain)}</div>
    </div>
  `;
}

function renderEvolutions(chain) {
  var html = `<div class="evo-card" onclick="viewStats('${chain.species.name}')">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getIdFromUrl(chain.species.url)}.png">
                <div class="text-capitalize">${chain.species.name}</div>
              </div>`;
  if(chain.evolves_to.length > 0){
    for (var i = 0; i < chain.evolves_to.length; i++) {
      html += " => " + renderEvolutions(chain.evolves_to[i]);
    }
  }
  return html;
}

function getIdFromUrl(url){
  var parts = url.split("/");
  return parts[parts.length-2];
}

function viewStats(name){
  window.location.href = "stats.html?name=" + name;
}

if(pokemonName){
  fetchPokemonData(pokemonName);
} else {
  container.innerHTML = "<h2>Aucun Pokémon sélectionné</h2>";
}
