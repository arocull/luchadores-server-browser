// 😭 but my global scope 😭
// Temporary hacks because I'm too lazy/scared to setup webpack
(function() {
  const tblMainBody = $("#tableId > tbody");

  function getServers() {
    return fetch('/list')
      .then(response => response.json());
  }

  function updateServerList() {
    getServers()
      .then(data => {
        console.log('Got server list', data);

        // TODO: Something is wrong with this still
        tblMainBody.html(""); // idk why -- https://stackoverflow.com/a/16444715/97964
        data.forEach(entry => {
          const link = $('a').attr('href', entry.address).text(entry.title);
          const row = $('tr');
          const cellName = $('td');
          cellName.append(link);
          const cellPlayers = $('td');
          cellPlayers.text(`{entry.playerCount} / {entry.playerCapacity}`);
          row.append(cellName);
          row.append(cellPlayers);
          tblMainBody.append(row);
        });
        if (data.length == 0) {
          const row = $('tr');
          const cell = $('td').attr('colspan', 2).text('No servers 😭');
          row.append(cell);
          tblMainBody.append(row);
        }
      });
  }

  // Run initially and again if refreshed
  updateServerList();
  $('#btn-refresh').click(updateServerList);
})();