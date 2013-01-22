Adds SCORM module support to the [Elefant CMS](http://www.elefantcms.com/).

## Status: Beta

Needs additional conformance testing, but the core functionality works.

Install modules by uploading zip files through the Tools > SCORM area.
Embed SCORM modules into any page through the Dynamic Objects button in
the page editor. SCORM data is saved to the database and available via
the `scorm\Data` model.

Compatible with SCORM 1.2 and 2004 API versions.

## Data Integration

You can integrate the saved SCORM data into your own applications in one
of two ways:

### Accessing the SCORM data store

To access the SCORM data directly, use the `scorm\Data` class like this:

```php
<?php

// Get a single value
$value = scorm\Data::get_value ($module, $user_id, $key);

// Get all values for a particular user and module
$values = scorm\Data::get_values ($module, $user_id);

```

### Receiving SCORM commit notifications

To "hook" your own application into the SCORM commit action on the server-side,
first create a handler in your app that will be called via
[Elefant's hooks mechanism](http://www.elefantcms.com/wiki/Hooks-and-WebHooks).
Here is an outline of a handler to begin with:

```php
<?php

/**
 * Receives SCORM commits as a notification with the following
 * $data parameters:
 *
 * - module: The name of the SCORM module
 * - data: An array of key/value pairs of SCORM values
 *
 * Note that you can retrieve the current user via User::val('id').
 * For a list of SCORM values, visit:
 *
 * http://scorm.com/scorm-explained/technical-scorm/run-time/run-time-reference/
 */

if (! $this->internal) {
	die ('Must be called by another handler');
}

// Add your handling logic here

?>
```

Next, specify the hook by editing Elefant's `conf/config.php` file to add
the following line to the `[Hooks]` section:

    scorm/commit[] = myapp/myhandler

Note that you would change `myapp/myhandler` to the real name of your app
and handler script. This script will now be called every time a SCORM
`Commit()` action is sent to the server.
