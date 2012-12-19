<?php

$page->layout = 'admin';

if (! User::require_admin ()) {
	header ('Location: /admin');
	exit;
}

if ($this->installed ('scorm', $appconf['Admin']['version']) === true) {
	$page->title = 'Already up-to-date';
	echo '<p><a href="/scorm/admin">Home</a></p>';
	return;
}

$page->title = 'Upgrading App: SCORM';

echo '<p><a href="/scorm/admin">Done.</a></p>';

$this->mark_installed ('scorm', $appconf['Admin']['version']);

?>