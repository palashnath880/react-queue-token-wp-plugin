<?php

$root = dirname(dirname(dirname(dirname(dirname(__FILE__)))));
$root = str_replace('\\','/' , $root).'/wp-load.php';
require_once $root;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$feedback = new QueueFeedback();

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    $args = (object) array(
        'token_id' => $data->tokenId,
        'remarks'  => $data->remarks,
        'action'   => $data->action, 
    );

    $insert_feedback = $feedback->insert_queue_feedback($args);
    echo json_encode($insert_feedback);
    die();
}

if($_GET['token_id']){
    $get_queue = $feedback->get_queue_token($_GET['token_id']);
    echo json_encode($get_queue);
    die();
}
