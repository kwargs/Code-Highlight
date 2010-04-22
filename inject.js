var ignore_scripts = [
    /(.*\/)highlight(\.pack)?.js/, // highlight.js
    /.*(syntaxhighlighter|sh(Core|Brush)).*\.js/]; //SyntaxHighlighter 

var main = function(){
    var scripts = document.getElementsByTagName("script");
    for (var idx in scripts) {
        var s = scripts[idx];
        if (s && s.src){ 
            for (var jdx in ignore_scripts) {
                if (ignore_scripts[jdx].test(s.src)){
                    return;
                }
            }
        }
    }

    init_highlight = function(favorite_style){
        var css_path = chrome.extension.getURL("styles/"+favorite_style+".css");
        var css = document.createElement("link");
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("type", "text/css");
        css.setAttribute("href", css_path);
        document.head.appendChild(css);

        hljs.tabReplace = '    ';
        hljs.initHighlighting();
    }

    chrome.extension.sendRequest({ask: "page_settings"}, function(response) {
        if (response.no_highlight){
            return;
        }
        if (response.defered_highlight){
            window.setTimeout(function(){init_highlight(response.favorite_style);}, 1000);
        } else {
            init_highlight(response.favorite_style);
        }
    });
};
main();
