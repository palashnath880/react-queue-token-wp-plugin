<?php

$root = dirname(dirname(dirname(dirname(dirname(__FILE__)))));
$root = str_replace('\\','/' , $root).'/wp-load.php';
require_once $root;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$headers = getallheaders();
$queue_counter = new QueueCounter();

// get all counters
if( isset($_GET['branch_id']) && isset($headers['GET_ALL_COUNTER']) ){
    $all_counter = $queue_counter->all_counters($_GET['branch_id']);
    echo json_encode($all_counter);
    die();
}

// counter recall
if(isset($headers['QUEUE_RECALL_TOKEN']) && isset($headers['QUEUE_BRANCH_ID']) && $_SERVER['REQUEST_METHOD'] === 'POST'){
    $recall_token = $queue_counter->queue_counter_recall($headers['QUEUE_RECALL_TOKEN'], $headers['QUEUE_BRANCH_ID']);
    echo json_encode($recall_token);
    die();
}

// update counter status on / off
if($_SERVER['REQUEST_METHOD'] === 'PATCH' && isset($_GET['counter_id']) && isset($_GET['counter_status'])){
    $counter_status_update = $queue_counter->counter_status_update($_GET['counter_id'], $_GET['counter_status']);
    echo json_encode($counter_status_update);
    die();
}

// get queue token 
if(isset($_GET['counter_id']) && isset($_GET['branch_id']) && isset($headers['GET_QUEUE_TOKEN'])){
    $get_queue_token = $queue_counter->get_queue_token($_GET['counter_id'] , $_GET['branch_id']);
    echo json_encode($get_queue_token);
    die();
}

// get transferred queue token 
if(isset($_GET['cou_id']) && isset($_GET['bra_id']) && isset($headers['GET_TRANSFERRED_QUEUE_TOKEN'])){
    $get_transferred_queue_token = $queue_counter->get_transferred_queue_token($_GET['cou_id'] , $_GET['bra_id']);
    echo json_encode($get_transferred_queue_token);
    die();
}

// get counter status
if(isset($_GET['counter_id'])){
    $queue_counter = new QueueCounter($_GET['counter_id']);
    echo json_encode(array('counter_status' => $queue_counter->counter_status));
    die();
}

// queue transfer
if( isset($_GET['queue_id']) && isset($_GET['transfer_counter'])&& $_SERVER['REQUEST_METHOD'] === 'PATCH' ){
    $transfer_queue = $queue_counter->transfer_queue($_GET['queue_id'] , $_GET['transfer_counter']);
    echo json_encode($transfer_queue);
    die();
}

// close queue token 
if(isset($_GET['queue_id']) && $_SERVER['REQUEST_METHOD'] === 'PATCH'){
    $json = file_get_contents('php://input');
    $data = json_decode($json);
    $queue_close = $queue_counter->queue_status_update($_GET['queue_id'], $data->remarks, $data->status );
    echo json_encode($queue_close);
    die();
}

//counter break
if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($headers['Queue-Break'])){
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    $queue_break = $queue_counter->queue_counter_break($data->reason, $data->status);
    echo json_encode($queue_break);
    
    die();
}

// counter pause
if($_SERVER['REQUEST_METHOD'] === 'PATCH' && isset($headers['Queue-Pause'])){

    $id = $_GET['id'];

    $queue_pause = $queue_counter->queue_counter_break( null , 'pause', $id );
    echo json_encode($queue_pause);
    
    die();
}
