<?php

class QueueDisplay{
    
    private $wpdb;
    private $queue_table;

    public function __construct(){
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->queue_table = $this->wpdb->prefix.'queue_token';
    }

    public function running_queue_token($counter_id , $branch_id ){
        date_default_timezone_set('Asia/Dhaka');
        $date = date('Y-m-d');
        $get_running_token = $this->wpdb->get_row(
            $this->wpdb->prepare("SELECT * FROM $this->queue_table WHERE `queue_branch` = '$branch_id' 
            AND `received_id` = '$counter_id' AND `transfer_id` = '0' AND `status` = 'received' 
            AND Date(issue_date) = '$date' ORDER BY id DESC ")
        );
        if($get_running_token){
            return $get_running_token->queue_token;
        }else{
            return false;
        }
    }

    public function get_all_counters($branch_id){
        $get_counters = get_users(array(
            'meta_query' => array(
                array(
                    'key'   => 'queue_counter_branch',
                    'value' => $branch_id,
                ),
                array(
                    'key'   => 'queue_counter_status',
                    'value' => 'on',
                ),
                array(
                    'key'   => 'queue_counter_break',
                    'value' => 'pause',
                )
            ),
            'role'    => 'queue_counter',
            'orderby' => 'display_name',
            'order'   => 'DESC',
        ));    
        if($get_counters){
            $arr = [];
            foreach($get_counters as $counter ){
                $arr[] = (object) array(
                    'counter_type' => $counter->roles[0],
                    'counter_id'   => $counter->ID,
                    'counter_name' => $counter->display_name,
                    'running_token'=> $this->running_queue_token($counter->ID, $branch_id),
                );
            }
            return array('status' => 'good' , 'counters' => $arr );
        }else{
            return array('status' => 'bad' , 'counters' => array());
        }
    }

    public function get_queue_video($branch_id){
        $args = array(
            'post_type'   => 'queue_video_ads',
            'post_status' => 'publish',
        );
        
        $get_videos = get_posts($args);
        $videos = array();
        if($get_videos){
            foreach($get_videos as $video ){
                $videos[] = $video->post_title;
            }
        }
        return array('videos' => $videos);  
    }

    public function next_queue_tokens($branch_id){
        date_default_timezone_set('Asia/Dhaka');
        $date = date('Y-m-d');
        $get_next_tokens = $this->wpdb->get_results("SELECT * FROM $this->queue_table 
                            WHERE `queue_branch` = '$branch_id' AND `status` = 'publish' 
                            AND Date(issue_date) = '$date' ORDER BY id ASC ");
        $tokens = array();
        if($get_next_tokens){
            foreach($get_next_tokens as $token ){
                $tokens[] = $token->queue_token;
            }
        }
        return array('tokens' => $tokens);
    }

    public function recall_queue_token($branch_id){

        $today = date('Y-m-d');

        $posts_table = $this->wpdb->prefix.'posts';
        $get_recall_token = $this->wpdb->get_row(
            $this->wpdb->prepare("SELECT * FROM $posts_table WHERE `post_author` = '$branch_id' 
                                AND `post_type` = 'queue_recall_token' AND Date(post_date) = '$today' 
                                AND `post_status` = 'publish' ORDER BY id ASC ")
        );

        if($get_recall_token){

            $update_token = array(
                'post_status' => 'private',
            );

            $update_des = array(
                'ID' => $get_recall_token->ID,
                'post_author' => $branch_id,
            );

            $update = $this->wpdb->update($posts_table, $update_token, $update_des);
            return array('status' => 'good', 'token' => $get_recall_token->post_title);
        }else{
            return array( 'status' => 'bad', 'message'=> 'Not Found','b'=>$branch_id);
        }
    }

}