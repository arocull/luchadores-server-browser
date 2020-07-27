// 😭 but my global scope 😭
// Temporary hacks because I'm too lazy/scared to setup webpack
$(function() {
  const btnRefresh = $('#btn-refresh');
  const tblBody = $('#tbl-main > tbody');

  function getServers() {
    return fetch('/list')
      .then(response => response.json());
  }

  function updateServerList() {
    Promise.resolve()
      .then(() => {
        tblBody.empty();
        btnRefresh.attr('disabled', 'disabled');
        const row = $('<tr>');
        const cell = $('<td>').attr('colspan', 2).text('Refreshing...');
        row.append(cell);
        tblBody.append(row);
        return getServers();
      })
      .then(data => {
        console.log('Got server list', data);
        btnRefresh.removeAttr('disabled');
        tblBody.empty();
        data.forEach(entry => {
          const link = $('<a>').attr('href', entry.address).text(entry.title);
          const row = $('<tr>');
          const cellName = $('<td>');
          cellName.append(link);
          const cellPlayers = $('<td>');
          cellPlayers.text(`${entry.playerCount} / ${entry.playerCapacity}`);
          row.append(cellName);
          row.append(cellPlayers);
          tblBody.append(row);
        });
        if (data.length == 0) {
          const row = $('<tr>');
          const cell = $('<td>').attr('colspan', 2).text('No servers 😭');
          row.append(cell);
          tblBody.append(row);
        }
      });
  }

  // Run initially and again if refreshed
  updateServerList();
  btnRefresh.click(updateServerList);
});