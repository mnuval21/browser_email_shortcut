summaryText();

function summaryText() {
  console.log("Issue Request to BG page. Inside summaryText function in infopasser.js");
  chrome.extension.sendRequest(window.getSelection().toString());
}