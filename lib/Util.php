<?php

namespace scorm;

/**
 * Helper methods for accessing installed SCORM modules.
 */
class Util {
	/**
	 * The path to the scorm folder.
	 */
	public static $path = 'cache/scorm';

	/**
	 * The name of the manifest file to look for in a module.
	 */
	public static $manifest = 'imsmanifest.xml';

	/**
	 * Error message.
	 */
	public static $error = false;

	/**
	 * Get a list of all installed modules.
	 */
	public static function get_modules ($details = false) {
		$modules = array ();
		$files = glob (self::$path . '/*/imsmanifest.xml');
		$files = is_array ($files) ? $files : array ();
		foreach ($files as $file) {
			$mod = basename (dirname ($file));
			if ($details) {
				$modules[] = (object) array (
					'module' => $mod,
					'name' => ucfirst (str_replace ('_', ' ', $mod)),
					'created' => gmdate ('Y-m-d H:i:s', filemtime ($file))
				);
			} else {
				$modules[] = $mod;
			}
		}
		return $modules;
	}

	/**
	 * Is this the name of an installed SCORM module?
	 */
	public static function is_module ($name) {
		if (! is_dir (self::$path . '/' . $name)) {
			return false;
		}

		if (! file_exists (self::$path . '/' . $name . '/' . self::$manifest)) {
			return false;
		}
		
		return true;
	}

	/**
	 * Install a SCORM module from an uploaded zip file.
	 * Takes the upload data from `$_FILES['field_name']`.
	 */
	public static function install ($file) {
		if (! is_uploaded_file ($file['tmp_name'])) {
			self::$error = __ ('Invalid upload file.');
			return false;
		}

		if (! preg_match ('/\.zip$/i', $file['name'])) {
			self::$error = __ ('Please upload a zip file.');
			return false;
		}

		if (! is_dir (self::$path)) {
			if (! mkdir (self::$path)) {
				self::$error = __ ('Could not create module directory.');
				return false;
			}
			chmod (self::$path, 0777);
		}

		$folder = basename ($file['name'], '.zip');

		try {
			\Zipper::unzip ($file['tmp_name'], self::$path . '/' . $folder);
		} catch (\Exception $e) {
			self::$error = __ ('Could not unzip the file.');
			return false;
		}

		if (! is_dir (self::$path . '/' . $folder)) {
			self::$error = __ ('Unzipped folder not found.');
			return false;
		}

		return array (
			'name' => basename ($folder),
			'tmp_name' => self::$path . '/' . basename ($folder)
		);
	}
}

?>