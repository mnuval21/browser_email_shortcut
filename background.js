
//compose window url
var baseGmailUrl = "https://mail.google.com/";
var gmailUrlSuffix = "mail/?view=cm&fs=1&tf=1";

function makeGmailDomainUrl() {
  var gmailUrl = baseGmailUrl;
  var domainName = window.localStorage["domainName"];
  if (domainName) {
    gmailUrl += "a/" + domainName + "/";
  }
    return gmailUrl + gmailUrlSuffix;
}


var title = '';
var url = '';
var selectedText = '';


chrome.extension.onConnect.addListener(
  function(port) {
    if (port.name == "GmailUrlConn") {
      port.onMessage.addListener(function(msg) {
      if (msg.req == "GmailUrlPlease") {
        port.postMessage({gmailDomainUrl: makeGmailDomainUrl()});
      } else {
        console.log("Unsupported req on valid port");
      }
    });
  }
});

chrome.extension.onRequest.addListener(
  function(connectionInfo) {
    selectedText = connectionInfo;
    makeGmailWin(selectedText);
});


chrome.browserAction.onClicked.addListener(
  function(tab) {
    chrome.tabs.executeScript(null, {file: "infopasser.js"});
    title = tab.title;
    url = tab.url;
});

function makeGmailWin(summary) {
  var body = '';
  var gmailURL = makeGmailDomainUrl() +
                 "&body=" + encodeURIComponent(body);
  chrome.windows.create({
    url: gmailURL,
    left: 20,
    top: 30,
    width: 700,
    height: 600
    });
}
