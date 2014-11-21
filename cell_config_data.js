{
    files: [
	'pqctrl.js'],
    css: ['style.css'],
    config: {
	short_name: 'PortQuery',
	name: 'Port Query',
	description: ('Migrate Query between i2b2 sites'),
	category: ["celless", "plugin", "kumc"],
	plugin: {
	    isolateHtml: false,
	    isolateComm: true,
	    standardTabs: false,
	    html: {
		source: 'ui.html',
		mainDivId: 'pq-plugin-mainDiv'
	    }
	}
    }
}
