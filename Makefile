RSYNC=rsync

TEST_HOST=i2b2-host
HTDOCS=/srv/www/htdocs
WEBCLIENT=$(HTDOCS)/i2b2/webclient/
PLUGINS=$(WEBCLIENT)/js-i2b2/cells/plugins
NAME=PortQuery

testpub:
	$(RSYNC) -av ./ $(TEST_HOST):$(PLUGINS)/WIP/$(NAME)/


# We assume the following has been added to i2b2.hive.tempCellsList
# in i2b2_loader.js
# per "Web Client Plug-in Developers Guide"
# https://community.i2b2.org/wiki/display/webclient/Web+Client+Plug-in+Developers+Guide
#
#                { code: "PortQuery",
#		  forceLoading: true,
#		  forceConfigMsg: { params: [] },
#		  roles: [ "DATA_LDS" ],
#		  forceDir: "cells/plugins/WIP"
#                }
