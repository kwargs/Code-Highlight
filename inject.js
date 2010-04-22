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



    init_highlight = function(favorite_style, live_page){
        var css_path = chrome.extension.getURL("styles/"+favorite_style+".css");
        var css = document.createElement("link");
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("type", "text/css");
        css.setAttribute("href", css_path);
        document.head.appendChild(css);

        hljs.tabReplace = '    ';
        hljs.onHighlight = function(code, language){
            console.debug("code= " + code + " lang = " + language);
        }
        hljs.initHighlighting();

        // XXX: copy-paste from highlight.js
        var do_highlighting = function(root){
            var pres = root.getElementsByTagName('pre');
            for (var i = 0; i < pres.length; i++) {
              var code = hljs.findCode(pres[i]);
              if (code)
                hljs.highlightBlock(code, hljs.tabReplace);
            }
        }
        //do_highlighting(document);
        if (live_page){
            document.body.addEventListener("DOMNodeInserted", function(event){ 
                console.debug(event.type + " " + event.target + " " + event.target.tagName + "'");
                do_highlighting(event.target);
            });
        }
    }

    chrome.extension.sendRequest({ask: "page_settings"}, function(response) {
        if (response.no_highlight){
            return;
        }
        console.debug(response);
        init_highlight(response.favorite_style, response.defered_highlight);
    });
};
main();
