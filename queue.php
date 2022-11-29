<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://https://github.com/palashnath880
 * @since             1.0.0
 * @package           Queue
 *
 * @wordpress-plugin
 * Plugin Name:       Queue
 * Plugin URI:        https://https://wordpress.org/plugins/
 * Description:       Queue Management
 * Version:           1.0.0
 * Author:            Palash
 * Author URI:        https://https://github.com/palashnath880
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       queue
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'QUEUE_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-queue-activator.php
 */
function activate_queue() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-queue-activator.php';
	Queue_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-queue-deactivator.php
 */
function deactivate_queue() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-queue-deactivator.php';
	Queue_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_queue' );
register_deactivation_hook( __FILE__, 'deactivate_queue' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-queue.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_queue() {

	$plugin = new Queue();
	$plugin->run();

}
run_queue();
