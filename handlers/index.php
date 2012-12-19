<?php

/**
 * Output a SCORM object from the URL to its manifest file.
 */

$this->require_login ();

if (! isset ($data['module'])) {
	printf ('<p>%s</p>', __ ('SCORM module was not specified.'));
	return;
}

$page->add_script ('/apps/scorm/js/scorm-2004.js');

echo $tpl->render ('scorm/index', array (
	'path' => Scorm::$path,
	'module' => $data['module'],
	'manifest' => Scorm::$manifest,
	'data' => Scorm::get_data ($data['module'], User::val ('id'))
));

?>