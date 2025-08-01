console.log("Content script loaded");

function stupidGame() {
  console.log("Stupic game started");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract") {
    sendResponse({ status: "started" });
    var tables = findTableElements();
    tables.forEach((table, index) => {
      console.log(`Table ${index + 1}:`, table);
      // Create a button for each table
      const button = document.createElement("img");
      // button.textContent = "Click me!";
      button.style.position = 'absolute';
      button.style.zIndex = '1000'
      button.style.width = '32px';
      button.style.height = '32px';
      button.style.opacity = '0.5';
      button.src = 'chrome-extension://' + chrome.runtime.id + '/images/icon.png';

      button.addEventListener("click", () => buttonOnClick(table, request.mode));
      button.addEventListener("mouseover", () => buttonOnHover(table));
      button.addEventListener("mouseout", () => buttonOnHoverOut(table));
      table.insertAdjacentElement("beforebegin", button);
    });
  } else {
    sendResponse({ status: "failed" });
  }
});

function findTableElements() {
  const tables = document.querySelectorAll("table");
  if (tables.length === 0) {
    console.log("No tables found on the page.");
    return;
  }

  tables.forEach((table, index) => {
    console.log(`Table ${index + 1}:`, table);
  });
  return tables;
}

function buttonOnClick(table, mode) {
  console.log("Button clicked on element:", table);
  // create a csv file based on the table data
  const rows = table.querySelectorAll("tr");
  var allRowsData = [];
  const csvData = [];
  rows.forEach(row => {
    const cells = row.querySelectorAll("td, th");
    const rowData = Array.from(cells).map(cell => cell.textContent.trim());
    allRowsData.push(rowData);
  });
  if (mode === "stock") {
    allRowsData = StockProcessor(allRowsData);
  }
  allRowsData.forEach(row => {
    csvData.push(row.map(cell => cell.replace(/\r/g, '\\r').replace(/\n/g, '\\n')).join(","));
  });
  // Join \n if it is mac/linux, \r\n if it is windows
  const isWindows = navigator.userAgentData.platform.indexOf("Win") > -1;
  const BOM = "\ufeff";
  const csvContent = BOM + csvData.join(isWindows ? "\r\n" : "\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  // perform download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  // system time in milliseconds
  const timestamp = new Date().getTime();
  link.download = `table_data_${timestamp}.csv`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log("CSV file downloaded.");
}

function buttonOnHover(table) {
  const cover = document.createElement("div");
  cover.style.position = 'absolute';
  cover.style.top = table.offsetTop + 'px';
  cover.style.left = table.offsetLeft + 'px';
  cover.style.width = table.offsetWidth + 'px';
  cover.style.height = table.offsetHeight + 'px';
  cover.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
  cover.style.zIndex = '999';
  cover.style.pointerEvents = 'none';
  table.parentElement.appendChild(cover);

  table.cachedCover = cover;
}

function buttonOnHoverOut(table) {
  if (table.cachedCover) {
    table.parentElement.removeChild(table.cachedCover);
    var cover = table.cachedCover;
    table.cachedCover = null;
    delete cover;
  }
  console.log("Button hover out on element:", table);
}
