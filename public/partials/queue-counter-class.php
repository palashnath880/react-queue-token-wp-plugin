<?php

class QueueCounter{

    public $counter_status;
    private $wpdb;
    private $queue_table;
    private $post_table;
    private $cu_date;

    public function __construct($counter_id = 0){

        global $wpdb;
        $this->wpdb = $wpdb;
        $this->queue_table = $wpdb->prefix.'queue_token';
        $this->post_table = $wpdb->prefix.'posts';

        date_default_timezone_set('Asia/Dhaka');
        $this->cu_date = date("Y-m-d H:i:s");

        $get_counter_status = get_user_meta($counter_id, 'queue_counter_status', true );
        if($get_counter_status){
            $this->counter_status = $get_counter_status;
        }else{
            $this->counter_status = 'off';
        }
    }

    public function all_counters($branch_id){
        $get_counter = get_users(
            array(
                'meta_key'   => 'queue_counter_branch',
                'meta_value' => $branch_id,
                'role'       => 'queue_counter',
                'orderby'    => 'display_name',
                'order'      => 'DESC',
            )
        );

        if($get_counter){
            $arr = [];
            foreach($get_counter as $counter ){
                $arr[] = (object) array(
                    'counter_id'   => $counter->ID,
                    'counter_name' => $counter->display_name,
                );
            }
            return array('status' => 'good', 'counters' => $arr );
        }else{
            return array('status' => 'bad', 'counters' => array() );
        }
    }

    public function counter_status_update($counter_id, $counter_status ){

        $update = update_user_meta($counter_id, 'queue_counter_status', $counter_status );
        
        if($update){
            return array('status' => 'good' , 'counter_status' => $counter_status);
        }else{
            return array('status' => 'bad' ,'message' => 'Sorry! Something Went Wrong. Please Try Again');
        }
    }

    private function customer_type($customer_type){
        if($customer_type === 'end_user'){
            return 'End User';
        }else if($customer_type === 'corporate'){
            return 'Corporate';
        }else{
            return 'Dealer';
        }
    }

    private function getTimeDiff($dtime,$atime) {
        $nextDay=$dtime>$atime?1:0;
        $dep=explode(':',$dtime);
        $arr=explode(':',$atime);
    
    
        $diff=abs(mktime($dep[0],$dep[1],0,date('n'),date('j'),date('y'))-mktime($arr[0],$arr[1],0,date('n'),date('j')+$nextDay,date('y')));
    
        //Hour
    
        $hours=floor($diff/(60*60));
    
        //Minute 
    
        $mins=floor(($diff-($hours*60*60))/(60));
    
        //Second
    
        $secs=floor(($diff-(($hours*60*60)+($mins*60))));
    
        if(strlen($hours)<2)
        {
            $hours="0".$hours;
        }
    
        if(strlen($mins)<2)
        {
            $mins="0".$mins;
        }
    
        if(strlen($secs)<2)
        {
            $secs="0".$secs;
        }
    
        return $hours.':'.$mins.':'.$secs;

    }

    public function get_queue_token($counter_id , $branch_id){

        $fr_date = date('Y-m-d');
        $get_queue_row = $this->wpdb->get_row(
            $this->wpdb->prepare("SELECT * FROM $this->queue_table WHERE `queue_branch` = '$branch_id' 
            AND `status` = 'publish' AND Date(issue_date) = '$fr_date' ORDER BY id ASC LIMIT 1 ")
        );

        if($get_queue_row){

            $queue_id = $get_queue_row->id;
            $queue_token = $get_queue_row->queue_token;

            $update_data = array(
                'received_id' => $counter_id,
                'status'      => 'received',
                'start_date'  => $this->cu_date,
            );

            $update_des = array(
                'id'           => $queue_id,
                'queue_branch' => $branch_id,
            );

            $update = $this->wpdb->update($this->queue_table , $update_data, $update_des );
            $cou = get_user_by('id', $counter_id );
            $counter_name = $cou->display_name;

            if($update){
                $this->queue_counter_recall( $counter_name.'Token Number '.$queue_token , $branch_id);
                $get_updated_row = $this->wpdb->get_row(
                    $this->wpdb->prepare("SELECT * FROM $this->queue_table WHERE `id` = '$queue_id' AND `queue_branch` = '$branch_id' 
                        AND `received_id` = '$counter_id' AND `status` = 'received' ORDER BY id ASC")
                    );
                if($get_updated_row){
                    return array( 
                        'status' => 'good', 
                        'queue_token' => array(
                            'id'           => $get_updated_row->id,
                            'queue_token'  => $get_updated_row->queue_token,
                            'queue_branch' => $get_updated_row->queue_branch,
                            'creator_id'   => $get_updated_row->creator_id,
                            'received_id'  => $get_updated_row->received_id,
                            'service_type' => $get_updated_row->service_type === 'service_request' ? 'Service Request' : 'Service Delivery',
                            'customer_type' => $this->customer_type($get_updated_row->customer_type),
                            'product_type'  => unserialize($get_updated_row->product_type),
                            'cus_name'      => $get_updated_row->cus_name,
                            'cus_mobile'    => $get_updated_row->cus_mobile,
                            'issue_date'    => $get_updated_row->issue_date,
                            'start_date'    => $get_updated_row->start_date,
                            'waiting_token' => $this->getTimeDiff(date('h:i:s' , strtotime($get_updated_row->issue_date)), date('h:i:s' , strtotime($get_updated_row->start_date)) ),
                        )
                    );
                }else{
                    return array('status' => 'bad', 'message' => 'No Queue Token Available. ');
                }    
            }

        }else{
            return array('status' => 'bad', 'message' => 'No Queue Token Available');
        }
    }

    public function transfer_queue($queue_id, $counter_id ){
        $update_data = array(
            'transfer_id' => $counter_id,
            'transfer_date' => $this->cu_date,
        );

        $update_des = array(
            'id' => $queue_id,
        );

        $update = $this->wpdb->update($this->queue_table, $update_data, $update_des );

        if($update){
            return array('status' => 'good','message' => 'Queue Token Transfer Successfully.');
        }else{
            return array('status' => 'bad','message' => 'Queue Token Could Not Be Transfer.');
        }

    }

    public function queue_status_update($queue_id, $remarks, $status ){

        $update_data = array(
            'remarks' => $remarks,
            'status'  => $status,
            'close_date' => $this->cu_date,
        );

        $update_des = array(
            'id' => $queue_id,
        );

        $update = $this->wpdb->update($this->queue_table, $update_data, $update_des );

        if($update){
            return array('status' => 'good');
        }else{
            return array('status' => 'bad');
        }

    }

    public function queue_counter_break($reason, $status , $id = 0 ){

        // total break time 60 minutes
        $total_break = 60 * 60 ;
        $today = getdate();

        $get_break_time = get_posts(array(
            'post_type'   => 'queue_counter_break',
            'post_status' => 'private',
            'post_author' => get_current_user_id(),
            'date_query'  => array(
	        	array(
	        		'year'  => $today['year'],
	        		'month' => $today['mon'],
	        		'day'   => $today['mday'],
	        	),
	        ),
        ));

        $args = array(
            'post_type'   => 'queue_counter_break',
            'post_title'  => 'null',
            'post_status' => 'draft',
            'post_author' => get_current_user_id(),
            'post_date'   => date('Y-m-d h:i:s'),
            'meta_input'  => array(
                'queue_break_reason' => $reason,
            )
        );

        if($status === 'break'){
            if($get_break_time){
                $total_break_time = 0;
                foreach($get_break_time as $break_time ){
                    $time_1 = date('h:i:s' , strtotime($break_time->post_date));
                    $time_2 = date('h:i:s' , strtotime($break_time->post_title));
                    $total_break_time += strtotime($time_2) - strtotime($time_1); 
                }

                update_user_meta(get_current_user_id(), 'queue_counter_break', 'break' );

                $insert_id  = wp_insert_post($args);
                return array('id' => $insert_id, 'time' => $total_break - $total_break_time );
            }else{
                $insert_id  = wp_insert_post($args);
                return array('id' => $insert_id, 'time' => $total_break);
            }
            //wp_insert_post($args);
        }elseif($status === 'pause'){
            $update_data = array(
                'post_status' => 'private',
                'post_title'  => date('Y-m-d h:i:s'),
            );
            $update_des = array(
                'ID' => $id,
            );
            $update = $this->wpdb->update($this->post_table , $update_data, $update_des );
            
            if($update){
                update_user_meta(get_current_user_id(), 'queue_counter_break', 'pause' );
                return array( 'status' => 'good', 'message' => 'Updated');
            }else{
                return array( 'status' => 'bad', 'message' => 'Sorry! Something Went Wrong.');
            }
        }
        
    }

    public function get_transferred_queue_token($counter_id , $branch_id){

        $fr_date = date('Y-m-d');
        $get_queue_row = $this->wpdb->get_row(
            $this->wpdb->prepare("SELECT * FROM $this->queue_table WHERE `queue_branch` = '$branch_id' 
            AND `transfer_id` = '$counter_id' AND `status` = 'received' AND Date(issue_date) = '$fr_date' ORDER BY id ASC LIMIT 1 ")
        );

        if($get_queue_row){
            return array( 
                'status' => 'good', 
                'queue_token' => array(
                    'id'           => $get_queue_row->id,
                    'queue_token'  => $get_queue_row->queue_token,
                    'queue_branch' => $get_queue_row->queue_branch,
                    'creator_id'   => $get_queue_row->creator_id,
                    'received_id'  => $get_queue_row->received_id,
                    'service_type' => $get_queue_row->service_type === 'service_request' ? 'Service Request' : 'Service Delivery',
                    'customer_type' => $this->customer_type($get_queue_row->customer_type),
                    'product_type'  => unserialize($get_queue_row->product_type),
                    'cus_name'      => $get_queue_row->cus_name,
                    'cus_mobile'    => $get_queue_row->cus_mobile,
                    'issue_date'    => $get_queue_row->issue_date,
                    'start_date'    => $get_queue_row->start_date,
                    'waiting_token' => $this->getTimeDiff(date('h:i:s' , strtotime($get_queue_row->issue_date)), date('h:i:s' , strtotime($get_queue_row->start_date)) ),
                ),
            );
        }else{
            return array('status' => 'bad', 'message' => 'No Queue Token Available');
        }
    }

    public function queue_counter_recall($token, $branch_id){
        $args = array(
            'post_type'   => 'queue_recall_token',
            'post_status' => 'publish',
            'post_title'  => $token,
            'post_author' => $branch_id,
        );
        wp_insert_post($args);
    }

}
