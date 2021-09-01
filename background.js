
//compose window url
var baselUrl = "https://mail.google.com/";
var urlSuffix = "mail/?view=cm&fs=1&tf=1";

function createGmailUrl() {
  var url = baselUrl;
  var domainName = window.localStorage["domainName"];
  if (domainName) {
    url += "a/" + domainName + "/";
  }
    return url + urlSuffix;
}

//For selected text in body?
var selectedText = '';


chrome.extension.onConnect.addListener(
  function(port) {
    if (port.name == "GmailUrlConn") {
      port.onMessage.addListener(function(msg) {
      if (msg.req == "GmailUrlPlease") {
        port.postMessage({gmailDomainUrl: createGmailUrl()});
      } else {
        console.log("Unsupported req on valid port");
      }
    });
  }
});

chrome.extension.onRequest.addListener(
  function(connectionInfo) {
    selectedText = connectionInfo;
    gmailWin(selectedText);
});


chrome.browserAction.onClicked.addListener(
  function(tab) {
    chrome.tabs.executeScript(null, {file: "infopasser.js"});
    title = tab.title;
    url = tab.url;
});

function gmailWin(summary) {
  var body = '';
  if (summary == '') {
    body = url;
  } else {
    body = summary + "\n" + url
    ;
  }
  var gmailURL = createGmailUrl() +
                 "&body=" + encodeURIComponent(body);
  chrome.windows.create({
    url: gmailURL,
    left: 20,
    top: 30,
    width: 600,
    height: 500
    });
}
