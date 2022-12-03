<?php

// counter on 
add_action('wp_login' , 'queue_counter_status' , 10, 2 );
function queue_counter_status($username , $user ){
	$role = $user->roles;
    if(in_array('queue_counter', $role )){
        update_user_meta( $user->ID, 'queue_counter_status', 'on' );
    }    
}

// counter off
add_action('wp_logout' , function($id){
	update_user_meta( $id, 'queue_counter_status', 'off' );
}, 10 );

add_shortcode('queue', function(){
    if(is_user_logged_in()){
        wp_enqueue_script("queue_react_app_js", '1.0', true);
        wp_enqueue_style("queue_react_app_css");
        return "<div id=\"queue_app\"></div>";
    }
});


