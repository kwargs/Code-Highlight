
PDIR = pack
scripts = \
	manifest.json\
	highlight.pack.js\
	inject.js\
	styles.js\
	background.html\
	options.html\
	test.html\
	icon.png

pack:
	install -d $(PDIR)
	install -m644 $(scripts) $(PDIR)
	install -d $(PDIR)/styles
	install -m644 styles/*.css $(PDIR)/styles
	zip -r $(PDIR).zip $(PDIR)
	rm -rf $(PDIR)

.PHONY: pack
