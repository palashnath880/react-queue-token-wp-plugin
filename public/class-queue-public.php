<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://https://github.com/palashnath880
 * @since      1.0.0
 *
 * @package    Queue
 * @subpackage Queue/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Queue
 * @subpackage Queue/public
 * @author     Palash <palashnath880@gmail.com>
 */
class Queue_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {
		
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {


	}

}


function my_react_app_init() {
    wp_register_script("queue_react_app_js", plugin_dir_url(dirname(__FILE__)).'queue-frontend/build/index.js', array('wp-element'), "1.0", false);
    wp_register_style("queue_react_app_css", plugin_dir_url(dirname(__FILE__))."queue-frontend/build/index.css", array(), "1.0", "all");
}

add_action( 'init', 'my_react_app_init' );


$folder =   dirname(__FILE__); 
$files = glob($folder."/partials/*.php"); // return array files

foreach($files as $phpFile){   
    require_once $phpFile; 
}

