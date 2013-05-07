<?php

if (! isset ($this->lang_hash['fr'])) {
	$this->lang_hash['fr'] = array ();
}

$this->lang_hash['fr'] = array_merge (
	$this->lang_hash['fr'],
	array (
		'Contents' => 'Contenus',
		'Could not create module directory.' => 'Création du dossier de module impossible.',
		'Created on' => 'Créé le',
		'Invalid upload file.' => 'Fichier envoyé non valide.',
		'Could not unzip the file.' => 'Impossible de décompresser le fichier.',
		'Unable to delete module.' => 'Impossible de supprimer le module',
		'Unzipped folder not found.' => 'Impossible de trouver le dossier décompressé.',
		'Install' => 'Installation',
		'Install a new module from a .zip file' => 'Installer un nouveau module depuis un fichier .zip',
		'File upload failed.' => 'L&apos;envoi du fichier a échoué.',
		'SCORM module installed.' => 'Module SCORM installé.',
		'SCORM module was not specified.' => 'Module SCORM non spécifié.',
		'Module deleted.' => 'Module supprimé.',
		'Invalid module name.' => 'Nom de module non valide.',
		'Module name' => 'Nom du module',
		'SCORM' => 'SCORM',
		'Delete' => 'Supprimer',
		'Please upload a zip file.' => 'Veuillez télécharger un fichier zip.',
		'Are you sure you want to delete this SCORM module?' => 'Êtes-vous sûr de vouloir supprimer ce module SCORM ?'
	)
);

?>