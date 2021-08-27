var toField = "&to=";
var cachedGmailUrl = "";

function rewriteMailtoToGMailUrl(inUrl) {
  
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
function rewriteMailtosOnPage() {
  console.log("rewriteMailtosOnPage")
  // Find all the mailto links.
  var result = document.evaluate(
      '//a[contains(@href, "mailto:")]',
      document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

  var item;
  var nodes = [];
  // cannot change the NODE_ITERATOR nodes' attributes in this loop itself
  // since iterateNext will invalidate the state; Need to store temporarily.
  while (item = result.iterateNext()) {
    nodes.push(item);
  }

  for (var i = 0; i < nodes.length; i++) {
    console.log("in the for loop mailto.js")
    var mailtoStr = nodes[i].getAttribute('href');
    mailtoStr = rewriteMailtoToGMailUrl(mailtoStr);
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
      rewriteMailtosOnPage();
    });
} else {
  rewriteMailtosOnPage();
}
