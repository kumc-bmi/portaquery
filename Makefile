RSYNC=rsync

TEST_HOST=i2b2-host
HTDOCS=/srv/www/htdocs
WEBCLIENT=$(HTDOCS)/i2b2/webclient/
PLUGINS=$(WEBCLIENT)/js-i2b2/cells/plugins
NAME=PortQuery

testpub:
	$(RSYNC) -av ./ $(TEST_HOST):$(PLUGINS)/WIP/$(NAME)/
