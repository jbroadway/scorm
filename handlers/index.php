<?php

/**
 * Output a SCORM object from the URL to its manifest file.
 */

$page->add_script ('/apps/scorm/js/scorm-2004.js');

echo $tpl->render ('scorm/index', array (
	'manifest' => isset ($data['manifest']) ? $data['manifest'] : $_GET['manifest']
));

?>