var __init__ = function(){
    var scripts = document.getElementsByTagName("script");
    for (var idx in scripts) {
        var s = scripts[idx];
        if (s && s.src && /(.*\/)highlight(\.pack)?.js/.test(s.src)) {
            return
        }
    }
    hljs.tabReplace = '    ';
    hljs.initHighlightingOnLoad();
    // inject css
    chrome.extension.sendRequest({ask: "favorite_style"}, function(response) {
        var css_path = chrome.extension.getURL("styles/"+response.favorite_style+".css");
        var css = document.createElement("link");
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("type", "text/css");
        css.setAttribute("href", css_path);
        document.getElementsByTagName("head")[0].appendChild(css);
    });
};
__init__();
