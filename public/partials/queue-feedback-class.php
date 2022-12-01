<?php

class QueueFeedback{
    private $wpdb;
    private $queue_table;

    public function __construct(){
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->queue_table = $this->wpdb->prefix.'queue_token';
    }

    public function get_queue_token($tokenId){
        $get_token = $this->wpdb->get_row(
            $this->wpdb->prepare("SELECT * FROM $this->queue_table WHERE `id` = '$tokenId' ORDER BY id ASC ")
        );

        $args = array(
            'post_author' => $tokenId,
            'post_type'   => 'queue_feedback',
        );

        $get_feedback = get_posts($args);
        if($get_feedback){
            return array('status' => 'already_have');
        }else{
            if($get_token){
                return array('status'=> 'good', 'token' => $get_token );
            }else{
                return array('status' => 'bad', 'message' => 'Not Found');
            }
        }
    }

    public function insert_queue_feedback($data){
        $tokenId = $data->token_id;
        $remarks = $data->remarks;
        $action = $data->action;

        $args = array(
            'post_title'  => $remarks,
            'post_type'   => 'queue_feedback',
            'post_author' => $tokenId,
            'post_status' => 'publish',
            'meta_input'  => array(
                'queue_feedback' => $action,
            ),
        );
        if(wp_insert_post($args)){
            return array('status' => 'good');
        }else{
            return array('status' => 'good');
        }
    }

}