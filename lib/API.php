<?php

namespace scorm;

/**
 * Provides the REST API for the SCORM modules.
 */
class API extends \Restful {
	/**
	 * Commit a set of key/value pairs to storage for
	 * a given SCO module. Parameters include:
	 *
	 * - module: The module ID in the system
	 * - data: A list of key/value pairs
	 */
	public function post_commit () {
		$res = Data::update_values (
			$_POST['module'],
			\User::val ('id'),
			$_POST['data']
		);

		if (! $res) {
			return $this->error (Data::$update_error);
		}

		$this->controller->hook ('scorm/commit', array (
			'module' => $_POST['module'],
			'data' => $_POST['data']
		));

		return $res;
	}
}

?>