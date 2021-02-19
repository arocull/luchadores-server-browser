// 😭 but my global scope 😭
// Temporary hacks because I'm too lazy/scared to setup webpack
// TODO: set up OnLoad in JS
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
          const cell = $('<td>').attr('colspan', 2).text('No servers - let the tears flow');
          row.append(cell);
          tblBody.append(row);
        }
      })
      .catch(err => {
        console.error('Error while reloading', err);
        tblBody.empty();
        const row = $('<tr>');
        const cell = $('<td>').attr('colspan', 2).text('Error reloading - try again');
        row.append(cell);
        tblBody.append(row);
      })
      .then(() => {
        btnRefresh.removeAttr('disabled');
      });
  }

  // Run initially and again if refreshed
  updateServerList();
  btnRefresh.click(updateServerList);
});