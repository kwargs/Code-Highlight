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

    var findCodeStrict = function(pre) {
        var code = null;
        for (var i=0; i < pre.childNodes.length; ++i){
            var node = pre.childNodes[i];

            if (node.nodeName == 'CODE'){
                if (code) {
                    return null;
                }
                code = node;
            } else if (!(node.nodeType == 3 && node.nodeValue.search(/^\s+$/) == 0)){
                return null;
            }
        }
        return code;
    }

    add_style_prefix_to_spans = function(element, to_elements, prefix){
        if (element.nodeType != 1) return;
        var spans = element.getElementsByTagName(to_elements);
        for (var i=0; i < spans.length; ++i){
            var s = spans[i];
            var newClass = "";
            for (var j=0; j<s.classList.length; ++j){
                if (newClass) newClass += " ";
                newClass += prefix + s.classList[j];
            }
            s.className = newClass;
        }
    }

    init_highlight = function(favorite_style, live_page){
        hljs.tabReplace = '    ';

        var do_highlighting = function(root){
            if (!root.getElementsByTagName) return;
            var pres = root.getElementsByTagName('pre');
            for (var i = 0; i < pres.length; i++) {
              var pre = pres[i];
              var code = findCodeStrict(pre);
              if (code && !is_already_highlighted(code)){
                var result = hljs.highlightBlock(code, hljs.tabReplace);
                if (pre.className)
                    pre.className + " ch-inject";
                else
                    pre.className = "ch-inject";
                add_style_prefix_to_spans(pre, 'span', "ch-inject-");
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
