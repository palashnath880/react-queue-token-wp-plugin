<?php

add_shortcode('queue', function(){
    if(is_user_logged_in()){
        wp_enqueue_script("queue_react_app_js", '1.0', true);
        wp_enqueue_style("queue_react_app_css");
        return "<div id=\"queue_app\"></div>";
    }
});