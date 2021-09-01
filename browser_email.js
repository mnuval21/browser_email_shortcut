var toField = "&to=";
var cachedGmailUrl = "";

function rewriteBrowserEmailToGMailUrl(inUrl) {
  
  var retUrl = inUrl;
  retUrl = retUrl.replace("?", "&");
  retUrl = retUrl.replace(/subject=/i, "su=");
  retUrl = retUrl.replace(/CC=/i, "cc=");
  retUrl = retUrl.replace(/BCC=/i, "bcc=");
  retUrl = retUrl.replace(/Body=/i, "body=");
  var gmailUrl = cachedGmailUrl + toField;
  retUrl = retUrl.replace("mailto:", gmailUrl);
  return retUrl;
}

// Content Scripts
function rewriteBrowserEmailOnPage() {
  var result = document.evaluate(
      '//a[contains(@href, "mailto:")]',
      document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

  var item;
  var nodes = [];
  while (item = result.iterateNext()) {
    nodes.push(item);
  }

  for (var i = 0; i < nodes.length; i++) {
    var mailtoStr = nodes[i].getAttribute('href');
    mailtoStr = rewriteBrowserEmailToGMailUrl(mailtoStr);
    nodes[i].setAttribute('href', mailtoStr);
    nodes[i].setAttribute('target', "_blank");
  }
}

if (cachedGmailUrl == "") {
  var bgPort = chrome.extension.connect({name: "GmailUrlConn"});
  bgPort.postMessage({req: "GmailUrlPlease"});
  bgPort.onMessage.addListener(
    function(msg) {
      cachedGmailUrl = msg.gmailDomainUrl;
      rewriteBrowserEmailOnPage();
    });
} else {
  rewriteBrowserEmailOnPage();
}
