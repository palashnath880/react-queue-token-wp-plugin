<?php

/**
 * Fired during plugin activation
 *
 * @link       https://https://github.com/palashnath880
 * @since      1.0.0
 *
 * @package    Queue
 * @subpackage Queue/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Queue
 * @subpackage Queue/includes
 * @author     Palash <palashnath880@gmail.com>
 */
class Queue_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {

		add_role('queue_branch','Queue Branch',   array());
		add_role('queue_counter','Queue Counter', array());
		add_role('queue_creator','Queue Creator', array());
		add_role('queue_display','Queue Display', array());

		global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $queue_token_table = $wpdb->prefix.'queue_token';
        $queue_token_sql = "CREATE TABLE `$queue_token_table`(
                            `id` int(11) NOT NULL AUTO_INCREMENT,
							`queue_token` varchar(255) NOT NULL,
							`queue_branch` int(11) NOT NULL,
							`creator_id` int(11) NOT NULL,
							`received_id` int(11) NOT NULL DEFAULT 0,
							`transfer_id` int(11) NOT NULL DEFAULT 0,
                            `service_type` varchar(255) NOT NULL,
                            `customer_type` varchar(255) NOT NULL,
                            `product_type` varchar(255) NOT NULL,
                            `cus_name` varchar(255) NOT NULL,
                            `cus_mobile` varchar(255) NOT NULL,
                            `status` varchar(255) NOT NULL DEFAULT 'publish',
                            `remarks` text NOT NULL DEFAULT 'null',
                            `issue_date` datetime NOT NULL,
                            `start_date` datetime NOT NULL,
                            `transfer_date` datetime NOT NULL,
                            `close_date` datetime NOT NULL,
                            PRIMARY KEY (`id`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ";

        dbDelta($queue_token_sql);

	}

}
