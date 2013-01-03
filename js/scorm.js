/**
 * Handles the initialization from the manifest file.
 */
var scorm = (function ($) {
	var self = {};
	
	/**
	 * The module ID in the system.
	 */
	self.module = '';
	
	/**
	 * The manifest file URL.
	 */
	self.manifest = '';

	/**
	 * The manifest response data.
	 */
	self.res = null;

	/**
	 * The selector of the element to embed the module content into.
	 */
	self.element = '#scorm-object';

	/**
	 * The selector of the element to embed the module navigation into.
	 */
	self.navigation = '#scorm-nav';

	/**
	 * The jQuery object for the content element.
	 */
	self.el = null;
	
	/**
	 * The jQuery object for the navigation element.
	 */
	self.nav = null;

	/**
	 * The list of resources from the manifest.
	 */
	self.resources = [];

	/**
	 * The list of items from the manifest.
	 */
	self.items = [];

	/**
	 * The currently active resource in the module.
	 */
	self.current = 0;

	/**
	 * The in-browser data store.
	 */
	self.store = {};

	/**
	 * Initialize the SCORM module on the page.
	 */
	self.init = function (opts) {
		self.module = opts.module;
		self.manifest = opts.manifest;
		self.element = opts.element;
		self.navigation = opts.navigation;
		self.store = opts.store || {};

		self.el = $(self.element);
		self.nav = $(self.navigation);

		$.get (self.manifest, self.parse_manifest);
	};

	/**
	 * Parse the manifest data.
	 */
	self.parse_manifest = function (res) {
		self.res = res;
		self.current = null;

		self.resources = [];
		$(res).find ('resources>resource').each (function () {
			self.resources.push (this);
		});

		self.items = [];
		$(res).find ('organization>item').each (function () {
			self.items.push (this);
		});

		self.nav.append ('<ul></ul>');
		var ul = self.nav.find ('ul');

		self.build_menu (ul, self.items);

		self.load_resource (self.current);
	};

	/**
	 * Recursively build the menu structure.
	 */
	self.build_menu = function (ul, items) {
		for (var i = 0; i < items.length; i++) {
			var idref = $(items[i]).attr ('identifierref'),
				title = $(items[i]).find ('title:first').text ();
			
			if (idref) {
				if (self.current === null) {
					self.current = idref;
				}

				ul.append ('<li id="scorm-nav-' + idref + '" class="scorm-nav"><a href="#" onclick="return scorm.load_resource (\'' + idref + '\')">' + title + '</a></li>');
			} else {
				var li = $('<li class="scorm-nav"><span>' + title + '</span><ul></ul></li>'),
					sub = li.find ('ul'),
					children = $(items[i]).children ('item');

				self.build_menu (sub, children);

				ul.append (li);
			}
		}
	};

	/**
	 * Load a resource into the module.
	 */
	self.load_resource = function (cur) {
		self.current = cur;

		var resource = $(self.res).find ('resource[identifier=' + cur + ']'),
			url = self.dirname (self.manifest),
			base = resource.attr ('xml:base');

		if (base) {
			url += base;
		}
		
		url += resource.attr ('href');

		self.el.html ('<iframe frameborder="0" scrolling="no" src="' + url + '"></iframe>');

		$('.scorm-nav').removeClass ('scorm-active');
		$('#scorm-nav-' + cur).addClass ('scorm-active');

		return false;
	};

	/**
	 * Get the directory name from an URL or file path.
	 */
	self.dirname = function (url) {
		return url.replace (/\/[^\/]*$/, '/');
	};

	return self;
})(jQuery);

/**
 * SCORM 2004 implementation.
 */
window.API_1484_11 = (function ($) {
	var self = {};

	/**
	 * The URL prefix to the server-side REST API.
	 */
	self.prefix = '/scorm/api/';

	/**
	 * Has the module been initialized.
	 */
	self.initialized = false;

	/**
	 * The last error code.
	 */
	self.error = 0;

	/**
	 * The list of error messages.
	 */
	self.errors = {
		0: 'No error',
		101: 'General exception',
		102: 'General initialization failure',
		103: 'Already initialized',
		104: 'Content instance terminated',
		111: 'General termination failure',
		112: 'Termination before initialization',
		113: 'Termination after termination',
		122: 'Retrieve data before initialization',
		123: 'Retrieve data after termination',
		132: 'Store data before initialization',
		133: 'Store data after termination',
		142: 'Commit before initialization',
		143: 'Commit after termination',
		201: 'Invalid argument',
		301: 'General get failure',
		351: 'General set failure',
		391: 'General commit failure',
		401: 'Undefined data model element',
		402: 'Unimplemented data model element',
		403: 'Data model element value not initialized',
		404: 'Data model element is read only',
		405: 'Data model element is write only',
		406: 'Data model element type mismatch',
		407: 'Data model element value out of range',
		408: 'Data model dependency not established'
	};

	/**
	 * Initialize the SCORM API for the module.
	 */
	self.Initialize = function () {
		if (self.initialized) {
			return 'true';
		}

		if (arguments.length > 1 && arguments[0] !== '') {
			self.error = 201;
			return 'false';
		}

		self.initialized = true;
		return 'true';
	};

	/**
	 * TODO: Terminate.
	 */
	self.Terminate = function () {
		return 'true';
	};

	/**
	 * Get a value from the SCORM backend.
	 */
	self.GetValue = function (name) {
		/*if (name.match (/^adl\.data/)) {
			if (name.match (/\._count$/)) {
				if (! scorm.store.hasOwnProperty ('adl.data')) {
					scorm.store['adl.data'] = [];
				}
				return scorm.store['adl.data'].length.toString ();
			}

			var list = name.replace (/^adl\.data\./, '').split ('.'),
				num = parseInt (list[0]),
				prop = list[1],
				data = scorm.store['adl.data'];

			if (! data[num]) {
				self.error = 407;
				return '';
			}

			if (! data[num].hasOwnProperty (prop)){ 
				self.error = 407;
				return '';
			}

			return data[num][prop];
		}*/

		if (scorm.store.hasOwnProperty (name)) {
			return scorm.store[name];
		}
		return '';
	};

	/**
	 * Set a value from the SCORM module.
	 */
	self.SetValue = function (name, value) {
		/*if (name.match (/^adl\.data/)) {
			var list = name.replace (/^adl\.data\./, '').split ('.'),
				num = parseInt (list[0]),
				prop = list[1];
			
			if (! scorm.store.hasOwnProperty ('adl.data')) {
				scorm.store['adl.data'] = [];
			}

			if (! scorm.store['adl.data'][num]) {
				scorm.store['adl.data'][num] = {};
			}

			scorm.store['adl.data'][num][prop] = value;
			return 'true';
		}*/

		scorm.store[name] = value;
		return 'true';
	};

	/**
	 * TODO: Commit.
	 */
	self.Commit = function () {
		$.post (
			self.prefix + 'commit',
			{module: scorm.module, data: scorm.store},
			function (res) {
				//console.log (res);
			}
		);
		return 'true';
	};

	/**
	 * Get the last error code that occurred.
	 */
	self.GetLastError = function () {
		return self.error;
	};

	/**
	 * Get the error message from an error code.
	 */
	self.GetErrorString = function (code) {
		return self.errors[code];
	};

	/**
	 * Get diagnostic info from an error code.
	 */
	self.GetDiagnostic = function (code) {
		return 'Not implemented';
	};

	return self;
})(jQuery);

/**
 * SCORM 1.2 wrapper.
 */
window.API = (function ($) {
	var self = {};

	var api = window.API_1484_11;

	self.LMSInitialize = function () {
		return api.Initialize ();
	};

	self.LMSFinish = function () {
		return api.Terminate ();
	};

	self.LMSGetValue = function (name) {
		return api.GetValue (name);
	};

	self.LMSSetValue = function (name, value) {
		return api.SetValue (name, value);
	};

	self.LMSCommit = function () {
		return api.Commit ();
	};

	self.LMSGetLastError = function () {
		return api.GetLastError ();
	};

	self.LMSGetErrorString = function (code) {
		return api.GetErrorString (code);
	};

	self.LMSGetDiagnostic = function (code) {
		return api.GetDiagnostic (code);
	};

	return self;
})(jQuery);
