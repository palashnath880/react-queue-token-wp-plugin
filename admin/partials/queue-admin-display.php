<?php

add_action( 'admin_menu', function(){
    add_menu_page('Queue','Queue','manage_options','queue','queue_admin_func','',20);
    add_submenu_page('queue','Queue','Queue','manage_options','queue','queue_admin_func');
    add_submenu_page('queue','Queue Product','Queue Product','manage_options','queue_product','queue_product_type_func');
    add_submenu_page('queue','Queue Video','Queue Video','manage_options','queue_video','queue_video_func');
} );



function queue_admin_func(){
    require_once plugin_dir_path(__FILE__).'queue-admin-func.php';
}

function queue_product_type_func() {
    require_once plugin_dir_path(__FILE__).'queue-admin-product-type.php';
}

function queue_video_func(){
    require_once plugin_dir_path(__FILE__).'queue-admin-video.php';
}