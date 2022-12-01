<?php

class QueueManage {

    public $queue_name;
    public $queue_type;
    public $queue_id;
    public $queue_table;
    public $wpdb;
    public $cu_date;
    public $branch_id;
    public $branch_name;

    public function __construct(){
        global $wpdb;
        $this->wpdb = $wpdb;
        $this->queue_table = $wpdb->prefix.'queue_token'; 
        $this->queue_id = get_current_user_id();
        $queue_branch = get_userdata($this->queue_id);
        $this->queue_name = $queue_branch->display_name;
        $this->queue_type = $queue_branch->roles[0];
        date_default_timezone_set('Asia/Dhaka');
        $this->cu_date = date("Y-m-d H:i:s");
        $this->queue_current_branch_id();
    }

    private function queue_current_branch_id(){
        $get_branch = get_user_meta($this->queue_id, 'queue_counter_branch', true );
        if($get_branch){
            $this->branch_id = $get_branch;
            $queue_branch = get_userdata($get_branch);
            $this->branch_name = $queue_branch->display_name; 
        }else{
            $this->branch_id = 0;
        }
    }

    public function queue_counters(){
        $get_counter = get_users(array(
            'meta_key' => 'queue_counter_branch',
            'meta_value' => $this->queue_id,
            'orderby'    => 'display_name',
            'order'      => 'DESC',
        ));
        if($get_counter){
            $arr = [];
            foreach($get_counter as $counter ){
                $arr[] = (object) array(
                    'counter_type' => $counter->roles[0],
                    'counter_id'   => $counter->ID,
                    'counter_name' => $counter->display_name,
                    'counter_email' => $counter->user_email,
                    'counter_login' => $counter->user_login,
                    'registered_date' => date('d-M-Y' , strtotime($counter->user_registered)),
                );
            }
            return $arr;
        }else{
            return array();
        }
    }

    public function queue_products(){
        $products = get_posts(array(
            'post_type' => 'queue_product',
        ));
        $arr = [];
        foreach($products as $product ){
            $arr[] = $product->post_title;
        }
        return $arr;
    }

    public function create_queue_counter($data){

        $counter_name  = $data['counter_name'];
        $counter_pwd   = $data['counter_pwd'];
        $counter_email = $data['counter_email'];
        $counter_type  = $data['counter_type'];

        $counter_login = $this->queue_id.'_'.str_replace(' ','_', trim(strtolower($counter_name)));

        $args =  array(
            'first_name' => $counter_name,
            'user_email' => $counter_email,
            'user_pass'  => $counter_pwd,
            'user_login' => $counter_login,
            'role'       => $counter_type,
            'show_admin_bar_front' => 'false'
        );

        $is_have_user_name = username_exists($counter_login);
        $is_have_user_email = email_exists($counter_email);

        if($is_have_user_name || $is_have_user_email){
            if($is_have_user_name){
                return array('status' => 'bad', 'message' => 'Already have an counter.');
            }else{
                return array('status' => 'bad', 'message' => 'Email all ready use.');
            }
        }else{
            $create_counter = wp_insert_user($args);
            if($create_counter){
                add_user_meta($create_counter, 'queue_counter_branch', $this->queue_id);
                add_user_meta($create_counter, 'queue_counter_break', 'pause');
                add_user_meta($create_counter, 'queue_counter_status', 'off');
                return array('status' => 'good', 'message' => 'Counter Create Successfully.' , 'counters' => $this->queue_counters());
            }else{
                return array('status' => 'bad', 'message' => 'Counter Could Not Be Create');
            }
        }

    }

    public function get_queue_report($data){
        $from_date = $data['from_date'];
        $to_date = $data['to_date'];
        $queue_id = $data['queue_id'];
        
    }

    private function queue_token($service, $product){

        $today = date('Y-m-d');

        if($service == 'service_delivery'){
            $get_last_row = $this->wpdb->get_row(
                                $this->wpdb->prepare("SELECT * FROM $this->queue_table  
                                    WHERE `service_type` = 'service_delivery'
                                    AND `creator_id` = '$this->queue_id' AND Date(issue_date) = '$today'
                                    ORDER BY id DESC LIMIT 1")
                            );
            if($get_last_row){
                $prev_queue_token = $get_last_row->queue_token;
                $separate_d = explode('D' , $prev_queue_token );
                $separate_number = number_format($separate_d[1]) + 1;
                if($separate_number > 99){
                    return 'D'. $separate_number;
                }elseif($separate_number > 9){
                    return 'D0'. $separate_number;
                }else{
                    return 'D00'. $separate_number;
                }
            }else{
                return 'D001';
            }
        }else{
            if(count($product) > 1){
                $get_last_row = $this->wpdb->get_row(
                                    $this->wpdb->prepare("SELECT * FROM $this->queue_table  
                                        WHERE `service_type` = 'service_request' AND `creator_id` = '$this->queue_id' AND
                                        `queue_token` LIKE '%SM%'  AND Date(issue_date) = '$today'
                                        ORDER BY id DESC LIMIT 1")
                                );
                if($get_last_row){
                    $prev_queue_token = $get_last_row->queue_token;
                    $separate_d = explode('SM' , $prev_queue_token );
                    $separate_number = number_format($separate_d[1]) + 1;
                    if($separate_number > 99){
                        return 'SM'. $separate_number;
                    }elseif($separate_number > 9){
                        return 'SM0'. $separate_number;
                    }else{
                        return 'SM00'. $separate_number;
                    }
                }else{
                    return 'SM001';
                }
            }else{
                $get_last_row = $this->wpdb->get_row(
                                    $this->wpdb->prepare("SELECT * FROM $this->queue_table  
                                        WHERE `service_type` = 'service_request' AND `creator_id` = '$this->queue_id' AND
                                        `queue_token` NOT LIKE '%SM%'  AND Date(issue_date) = '$today'
                                        ORDER BY id DESC LIMIT 1")
                                );
                if($get_last_row){
                    $prev_queue_token = $get_last_row->queue_token;
                    $separate_d = explode('S' , $prev_queue_token );
                    $separate_number = number_format($separate_d[1]) + 1;
                    if($separate_number > 99){
                        return 'S'. $separate_number;
                    }elseif($separate_number > 9){
                        return 'S0'. $separate_number;
                    }else{
                        return 'S00'. $separate_number;
                    }
                }else{
                    return 'S001';
                }
            }
        }
        
    }

    public function create_queue_token($data){

        $service  = $data->service_type;
        $customer = $data->customer_type;
        $product  = $data->productType;
        $cus_name = $data->customer_name;
        $mobile   = $data->customer_mobile;

        $queue_token = $this->queue_token($service, $product );

        $insert_data = array(
            'queue_token'  => $queue_token,
            'queue_branch' => $this->branch_id,
            'creator_id'   => $this->queue_id,
            'service_type' => $service, 
            'customer_type'=> $customer,
            'product_type' => serialize($product),
            'cus_name'     => $cus_name,
            'cus_mobile'   => $mobile,
            'issue_date'   => $this->cu_date,
        );
        
        $insert = $this->wpdb->insert($this->queue_table, $insert_data );
        
        if($insert){
            return array(
                'status'      => 'good' , 
                'message'     => 'Queue Token Create Successfully.',
                'api_key'     => 'cd212a1279639193',
                'secret_key'  => 'b1350b16',
                'caller_id'   => '1000fix',
                'queue_token' => $queue_token
            );
        }else{
            return array('status' => 'bad' , 'message' => 'Queue Token Could Not Be Created.' );
        }

    }

    public function create_query_queue_token($data){

        $cus_name = $data->customer_name;
        $cus_mobile   = $data->customer_mobile;
        $today = date('Y-m-d');
        $queue_token = 0;

        $get_last_query = $this->wpdb->get_row(
                                $this->wpdb->prepare("SELECT * FROM $this->queue_table  
                                    WHERE `creator_id` = '$this->queue_id' AND `queue_branch` = '$this->branch_id' 
                                    AND `queue_token` LIKE '%Q%' AND Date(issue_date) = '$today' ORDER BY id DESC LIMIT 1")
                            );
        if($get_last_query){
            $prev_queue_token = $get_last_query->queue_token;
            $separate_d = explode('Q' , $prev_queue_token );
            $separate_number = number_format($separate_d[1]) + 1;
            if($separate_number > 99){
                $queue_token = 'Q'. $separate_number;
            }elseif($separate_number > 9){
                $queue_token = 'Q0'. $separate_number;
            }else{
                $queue_token = 'Q00'. $separate_number;
            }
        }else{
            $queue_token = 'Q001';
        }

        $insert_data = array(
            'queue_token'  => $queue_token,
            'queue_branch' => $this->branch_id,
            'creator_id'   => $this->queue_id,
            'cus_name'     => $cus_name,
            'cus_mobile'   => $cus_mobile,
            'issue_date'   => $this->cu_date,
        );
        
        $insert = $this->wpdb->insert($this->queue_table, $insert_data );
        
        if($insert){
            return array(
                'status'      => 'good' , 
                'message'     => 'Queue Token Create Successfully.',
                'api_key'     => 'cd212a1279639193',
                'secret_key'  => 'b1350b16',
                'caller_id'   => '1000fix',
                'queue_token' => $queue_token
            );
        }else{
            return array('status' => 'bad' , 'message' => 'Queue Token Could Not Be Created.' );
        }

    }

    public function get_define_counter(){
        $get_user = wp_get_current_user();
        $role = $get_user->roles[0];

        if($role === 'queue_branch'){
            $get_printer_counter = get_user_meta(get_current_user_id(), 'queue_printer_counter', true );
            $get_corporate_counter = get_user_meta(get_current_user_id(), 'queue_corporate_counter', true );
            return array(
                'status' => 'good',
                'corporate_counter' => $get_corporate_counter ? $get_corporate_counter : 0,
                'printer_counter'   => $get_printer_counter ? $get_printer_counter : 0,
                'counters'          => $this->queue_counters(),
            );
        }else{
            return array();
        }

    }

    public function update_define_counter($data){
        $printerCounter = $data->printerCounter;
        $corporateCounter = $data->corporateCounter;
        update_user_meta(get_current_user_id(), 'queue_printer_counter', $printerCounter );
        update_user_meta(get_current_user_id(), 'queue_corporate_counter', $corporateCounter );
        return array('status' => 'good');
    }

}