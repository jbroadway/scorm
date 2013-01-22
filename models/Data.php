<?php

namespace scorm;

/**
 * Stores/retrieves SCORM data on the server.
 *
 * Usage:
 *
 *     $value = scorm\Data::get_value ($module, $user, $key);
 *     printf ('<p>%s: %s</p>', $key, $value);
 */
class Data extends \Model {
	public $table = '#prefix#scorm_data';

	/**
	 * If an error occurred in update_values(), see this for
	 * the error message.
	 */
	public static $update_error = false;

	/**
	 * Get all data for a module and user.
	 */
	public static function get_values ($module, $user) {
		return self::query ()
			->where ('module', $module)
			->where ('user', $user)
			->fetch_assoc ('datakey', 'value');
	}

	/**
	 * Get the value for a module, user, and key.
	 */
	public static function get_value ($module, $user, $key) {
		$res = self::query ()
			->where ('module', $module)
			->where ('user', $user)
			->where ('datakey', $key)
			->single ();

		return $res->value;
	}

	/**
	 * Update the values for a module and user.
	 */
	public static function update_values ($module, $user, $values) {
		$current = self::get_values ($module, $user);

		\DB::beginTransaction ();

		foreach ($values as $key => $value) {
			if (isset ($current[$key])) {
				// Value exists
				if ($value !== $current[$key]) {
					// Value has changed, update
					if (! \DB::execute (
						'update #prefix#scorm_data set value = ?
						where user = ? and module = ? and datakey = ?',
						$value,
						$user,
						$module,
						$key
					)) {
						self::$update_error = \DB::error ();
						\DB::rollback ();
						return false;
					}
					$current[$key] = $value;
				}
			} else {
				// Insert new value
				if (! \DB::execute (
					'insert into #prefix#scorm_data
						(user, ts, module, datakey, value)
					values
						(?, ?, ?, ?, ?)',
					$user,
					gmdate ('Y-m-d H:i:s'),
					$module,
					$key,
					$value
				)) {
					self::$update_error = \DB::error ();
					\DB::rollback ();
					return false;
				}
				$current[$key] = $value;
			}
		}
		
		\DB::commit ();
		return $current;
	}
}

?>