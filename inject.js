var main = function(){
    var scripts = document.getElementsByTagName("script");
    for (var idx in scripts) {
        var s = scripts[idx];
        if (s && s.src && /(.*\/)highlight(\.pack)?.js/.test(s.src)) {
            return;
        }
    }

    init_highlight = function(){
        chrome.extension.sendRequest({ask: "favorite_style"}, function(response) {
            var css_path = chrome.extension.getURL("styles/"+response.favorite_style+".css");
            var css = document.createElement("link");
            css.setAttribute("rel", "stylesheet");
            css.setAttribute("type", "text/css");
            css.setAttribute("href", css_path);
            document.getElementsByTagName("head")[0].appendChild(css);
        });

        hljs.tabReplace = '    ';
        hljs.initHighlighting();
    }
    chrome.extension.sendRequest({ask: "page_settings"}, function(response) {
        if (response.no_highlight){
            console.debug("no hl" + response.no_highlight);
            return;
        }
        if (response.defered_highlight){
            console.debug("defered");
            window.setTimeout(init_highlight, 1000);
        } else {
            console.debug("normal");
            init_highlight();
        }
    });
};
main();
