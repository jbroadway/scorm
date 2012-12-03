/**
 * SCORM 2004 implementation.
 */
window.API_1484_11 = (function ($) {
	var self = {};

	self.prefix = '/scorm/api/1.2/';

	self.initialized = false;

	self.error = 0;

	self.errors = {
		201: 'Invalid argument'
	};

	var _store = {};

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

	self.Terminate = function () {
		return 'true';
	};

	self.GetValue = function (name) {
		if (_store.hasOwnProperty (name)) {
			return _store[name];
		}
		return 'false';
	};

	self.SetValue = function (name, value) {
		_store[name] = value;
		return 'true';
	};

	self.Commit = function (value) {
		return 'true';
	};

	self.GetLastError = function () {
		return self.error;
	};

	self.GetErrorString = function (code) {
		return self.errors[code];
	};

	self.GetDiagnostic = function (code) {
		return 'Not implemented';
	};

	return self;
})(jQuery);

/**
 * Handles the initialization from the manifest file.
 */
var scorm = (function ($) {
	var self = {};
	
	self.manifest = '';

	self.res = null;

	self.element = '#scorm-object';

	self.navigation = '#scorm-nav';

	self.el = null;
	
	self.nav = null;

	self.resources = [];

	self.current = 0;

	self.init = function (opts) {
		self.manifest = opts.manifest;
		self.element = opts.element;
		self.navigation = opts.navigation;

		self.el = $(self.element);
		self.nav = $(self.navigation);

		$.get (self.manifest, self.parse_manifest);
	};

	self.parse_manifest = function (res) {
		self.res = res;
		$(res).find ('resource').each (function () {
			if ($(this).attr ('adlcp:scormType') === 'sco') {
				self.resources.push (this);
			}
		});

		self.nav.append ('<ul></ul>');
		var ul = self.nav.find ('ul');

		for (var i = 0; i < self.resources.length; i++) {
			var item = $(res).find ('item[identifierref=' + $(self.resources[i]).attr ('identifier') + ']')[0],
				title = $(item).find ('title').text ();

			ul.append ('<li id="scorm-nav-' + i + '" class="scorm-nav"><a href="#" onclick="return scorm.load_resource (' + i + ')">' + title + '</a></li>');
		}

		self.load_resource (self.current);
	};

	self.load_resource = function (num) {
		self.current = num;

		var resource = $(self.resources[num]),
			url = self.dirname (self.manifest) + resource.attr ('xml:base') + resource.attr ('href');

		self.el.html ('<iframe frameborder="0" scrolling="no" src="' + url + '"></iframe>');

		$('.scorm-nav').removeClass ('active');
		$('#scorm-nav-' + num).addClass ('active');
	};

	self.dirname = function (url) {
		return url.replace (/\/[^\/]*$/, '/');
	};

	return self;
})(jQuery);