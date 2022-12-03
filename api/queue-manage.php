<?php

$root = dirname(dirname(dirname(dirname(dirname(__FILE__)))));
$root = str_replace('\\','/' , $root).'/wp-load.php';
require_once $root;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$headers = getallheaders();

$queue = new QueueManage();

// create counter and token creator
if( $_SERVER['REQUEST_METHOD'] === 'POST' && isset($headers['create-queue'])){
    
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    $create_counter = $queue->create_queue_counter(array(
        'counter_name'  => $data->counter_name,
        'counter_email' => $data->counter_email,
        'counter_pwd'   => $data->counter_pwd,
        'counter_type'  => $data->counter_type,
    ));
    echo json_encode($create_counter);
    die();
}

// get define counter 
if(isset($headers['get-counter-define'])){
    $define_counter = $queue->get_define_counter();
    echo json_encode($define_counter);
    die();
}

// update define counter 
if(isset($headers['update_define_counter']) && $_SERVER['REQUEST_METHOD'] === 'PATCH'){
    $json = file_get_contents('php://input');
    $data = json_decode($json);
    $update_define_counter = $queue->update_define_counter($data);
    echo json_encode($update_define_counter);
    die();
}

// create queue token 
if( $_SERVER['REQUEST_METHOD'] === 'POST' && isset($headers['queue-creator'])){
    
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    $create_token = $queue->create_queue_token($data);
    echo json_encode($create_token);
    die();
}

// create query queue token
if( $_SERVER['REQUEST_METHOD'] === 'POST' && isset($headers['query_queue_create'])){
    
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    $create_token = $queue->create_query_queue_token($data);
    echo json_encode($create_token);
    die();
}

// get branch report
if(isset($_GET['queue_id']) && isset($_GET['from_date']) && isset($_GET['to_date'])){

    $from_date = date("Y-m-d" , strtotime($_GET['from_date']));
    $to_date = date("Y-m-d" , strtotime($_GET['to_date'] .'+1 day'));

    $get_queue_reports = $queue->get_queue_report(array(
        'queue_id'  => $_GET['queue_id'],
        'from_date' => $from_date,
        'to_date'   => $to_date,
    ));

    echo json_encode($get_queue_reports);

    die();   
}

echo json_encode(
    array(
        'queue_name'       => $queue->queue_name,
        'queue_type'       => $queue->queue_type,
        'queue_id'         => $queue->queue_id,
        'branch_name'      => $queue->branch_name,
        'branch_id'        => $queue->branch_id,
        'counters'         => $queue->queue_counters(),
        'queue_products'   => $queue->queue_products(),
        'logout_url'       => wp_logout_url(),
        'define_customer'  => get_user_meta($queue->branch_id, 'queue_customer' , true ),
        'queue_customer_counter'  => get_user_meta($queue->branch_id, 'queue_customer_counter' , true ),
        'define_product'  => get_user_meta($queue->branch_id, 'queue_product' , true ),
        'queue_product_counter'  => get_user_meta($queue->branch_id, 'queue_product_counter' , true ),
    )
);

