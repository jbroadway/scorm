<?php

/**
 * Output a SCORM object from the URL to its manifest file.
 */

$this->require_login ();

if (! isset ($data['module'])) {
	printf ('<p>%s</p>', __ ('SCORM module was not specified.'));
	return;
}

$page->add_script ('/apps/scorm/js/scorm.js');

echo $tpl->render ('scorm/index', array (
	'path' => scorm\Util::$path,
	'module' => $data['module'],
	'manifest' => scorm\Util::$manifest,
	'data' => scorm\Data::get_values ($data['module'], User::val ('id'))
));

?>