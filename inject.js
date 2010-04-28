var ignore_scripts = [
    /(.*\/)highlight(\.pack)?.js/, // highlight.js
    /.*(syntaxhighlighter|sh(Core|Brush)).*\.js/]; //SyntaxHighlighter 

var highlight_css = null;

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

    var inject_style = function(favorite_style){
        if (highlight_css) return;
        highlight_css = document.createElement("link");
        highlight_css.setAttribute("rel", "stylesheet");
        highlight_css.setAttribute("type", "text/css");
        highlight_css.setAttribute("href", chrome.extension.getURL("styles/"+favorite_style+".css"));
        document.head.appendChild(highlight_css);
    }
    var is_already_highlighted = function(block){
        for (var i = 0; i < block.childNodes.length; i++){
            var child = block.childNodes[i];
            if (child.nodeType == 3)
                continue;
            if (child.nodeName == 'BR' || child.nodeName == 'WBR')
                continue;
            return true;
        }
        return false;
    }

    init_highlight = function(favorite_style, live_page){
        hljs.tabReplace = '    ';
        hljs.initHighlighting();

        // XXX: copy-paste from highlight.js
        var do_highlighting = function(root){
            if (!root.getElementsByTagName) return;
            var pres = root.getElementsByTagName('pre');
            for (var i = 0; i < pres.length; i++) {
              var code = hljs.findCode(pres[i]);
              if (code && !is_already_highlighted(code)){
                hljs.highlightBlock(code, hljs.tabReplace);
                inject_style(favorite_style);
              }
            }
        }
        do_highlighting(document);
        if (live_page){
            document.body.addEventListener("DOMNodeInserted", function(event){ 
                do_highlighting(event.target);
            });
        }
    }

    chrome.extension.sendRequest({ask: "page_settings"}, function(response) {
        if (response.no_highlight){
            return;
        }
        init_highlight(response.favorite_style, response.defered_highlight);
    });
};
main();
