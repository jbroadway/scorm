<?php

namespace scorm;

/**
 * Stores/retrieves SCORM data on the server.
 * Usage:
 *
 *     $data = new scorm\Data (123);
 *     printf ('<p>%s: %s</p>', $data->key, $data->value);
 */
class Data extends \Model {
	public $table = '#prefix#scorm_data';
}

?>