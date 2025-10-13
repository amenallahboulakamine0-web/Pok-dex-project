const teamContainer = document.getElementById("teamContainer");
let team = JSON.parse(localStorage.getItem("team")) || [];

function displayTeam() {
  teamContainer.innerHTML = "";
  if(team.length === 0){
    teamContainer.innerHTML = `<h2 class="text-center">Votre équipe est vide Ajoutez des Pokémon depuis le Pokédex</h2>`;
    return;
  }

  team.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-md-2";
    col.innerHTML = `
      <div class="card p-2 text-center">
        <img src="${p.sprites.front_default}" alt="${p.name}" onclick="viewStats('${p.name}')">
        <h6 class="mt-2 text-capitalize">${p.name}</h6>
        <button class="btn btn-sm btn-danger" onclick="removeFromTeam('${p.name}')">Retirer</button>
      </div>
    `;
    teamContainer.appendChild(col);
  });
}

function removeFromTeam(name){
  team = team.filter(p => p.name !== name);
  localStorage.setItem("team", JSON.stringify(team));
  displayTeam();
}

function viewStats(name){
  window.location.href = `stats.html?name=${name}`;
}

displayTeam();
