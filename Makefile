PYTHON=python

PDIR = pack
scripts = \
	highlight.pack.js\
	inject.js\
	styles.js\
	background.html\
	options.html\
	test.html\
	icon.png



pack:
	install -d $(PDIR)
	fgrep -v 'file://' manifest.json >>$(PDIR)/mainfest.json
	install -m644 $(scripts) $(PDIR)
	install -d $(PDIR)/styles
	install -m644 styles/*.css $(PDIR)/styles
	zip -r $(PDIR).zip $(PDIR)
	rm -rf $(PDIR)

highlight.js:
	bzr branch http://bazaar.launchpad.net/~isagalaev/+junk/highlight highlight.js

build:
	$(PYTHON) highlight.js/tools/pack.py
	$(PYTHON) highlight.js/tools/build.py
	ln -sf highlight.js/src/highlight.pack.js

styles:
	rm -rf styles && mkdir styles
	for style in `ls highlight.js/src/styles/*.css`; do\
		cat $$style | python add_prefix.py > styles/`basename $$style`;\
	done;
	cat native.css | python add_prefix.py > styles/native.css

.PHONY: pack styles
