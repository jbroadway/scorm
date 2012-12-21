<?php

$this->require_admin ();

if (! isset ($_POST['module'])) {
	$this->redirect ('/scorm/admin');
}

if (! scorm\Util::is_module ($_POST['module'])) {
	$this->add_notification (__ ('Invalid module name.'));
	$this->redirect ('/scorm/admin');
}

if (! rmdir_recursive (Scorm::$path . '/' . $_POST['module'])) {
	$this->add_notification (__ ('Unable to delete module.'));
	$this->redirect ('/scorm/admin');
}

$this->add_notification (__ ('Module deleted.'));
$this->redirect ('/scorm/admin');

?>