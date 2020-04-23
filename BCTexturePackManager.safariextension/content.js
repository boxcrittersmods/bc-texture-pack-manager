//@ts-check
console.log("CONTENT.JS");

var browser = browser || chrome || msBrowser;

function getAsserFolderVersion(assetsFolder) {
    var regex = "(https:\/\/boxcritters.com\/media\/)|(-[^]*)";
    var version = assetsFolder.replace(regex, "");
    return version;
}

function refreshRedirects() {
    return new Promise((resolve,reject)=>{
        browser.runtime.sendMessage({ type: "refreshtp", content: data.currentTP }, resolve);
    });
}

browser.runtime.onMessage.addListener(({ type, content }, sender, sendResponse) => {
    switch (type) {
        case "refreshpage":
            browser.tabs.reload();
            break;
        case "ping":
            sendResponse(true);
            break;
        default:
            sendResponse();
            break;
    }
});