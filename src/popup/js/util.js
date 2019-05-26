//@ts-check
var browser = browser || chrome || msBrowser;
var CONTENT_CONNECTED = false;

function getURLParams() {
	return window.location.search.replace('?','').split('&').reduce((obj,p)=>{
        obj[p.split('=')[0]] = p.split('=')[1];
        return obj;
    },{});
}


/**
 * 
 * @param {string} url 
 */
function getJSON(url) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    return new Promise((resolve, reject) => {
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == 200) {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                resolve(JSON.parse(xobj.responseText));
            }
        };
        xobj.send(null);
    });
}

function getCurrentVersionInfo() {
    return getJSON('https://bc-mod-api.herokuapp.com/');
}

async function getCurrentAssetsFolder() {
    return (await getCurrentVersionInfo()).assetsFolder;
}

async function getFileURL(url) {
    var bc = "https://boxcritters.com/media";
    var bcv = await getCurrentAssetsFolder();

    if (!url.startsWith("http")) {
        if(url.startsWith("/")) {
            url = bc + url;
        } else {
            url = bcv + url;
        }
    }
    return url;

}

function getFormats() {
    return getJSON('/formats.json');

}

/**
 * 
 * @param {Event} e 
 */
function noRedirectForm(e) {
    e.preventDefault();
}

function cleanEmpty(obj) {
    Object.keys(obj).forEach(key => obj[key] === undefined||obj[key] === "" ? delete obj[key] : '');
    return obj;
}

/**
 * 
 * @param {string} type 
 * @param {object} content 
 * @returns {Promise}
 */
function sendMessage(type, content={}) {
    console.log("Sending message:", { type, content });

    return new Promise((resolve, reject) => {
        browser.tabs.query({ currentWindow: true, active: true },
            (tabs) => {
                browser.tabs.sendMessage(tabs[0].id, { type, content }, resolve);
            }
        );
    });
}

function sendMessageBG(type, content) {
    return new Promise((resolve, reject) => {
        browser.runtime.sendMessage({ type, content }, resolve);
    })
}

function findTabWithURl(url) {
    console.log("Finding tab with url:", url);

    return new Promise((resolve, reject) => {
        browser.tabs.query({ currentWindow: true, url:url },
            (tabs) => {
                resolve(tabs[0]);
            }
        );
    });
}

function decode(text) {
    return JSON.parse(atob(text));
};

function encode(text) {
    return btoa(JSON.stringify(text));
};

(function displayVersion() {
    var manifest = browser.runtime.getManifest();
    var versionNums = manifest.version.split(".");
    
    var versionInfo = "v" + manifest.version_name
    if(manifest.version_name.endsWith("beta")|manifest.version_name.endsWith("alpha")) {
       versionInfo = "v" + manifest.version_name;
       versionInfo += " build " + Number(versionNums[versionNums.length-1]);
    }        
    $('#version-display').text(versionInfo);
})();