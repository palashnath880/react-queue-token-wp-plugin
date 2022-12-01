<?php

$root = dirname(dirname(dirname(dirname(dirname(__FILE__)))));
$root = str_replace('\\','/' , $root).'/wp-load.php';
require_once $root;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$headers = getallheaders();

if(isset($_GET['branch_id']) && isset($headers['get_all_counters'])){
    $queue_display = new QueueDisplay();
    echo json_encode($queue_display->get_all_counters($_GET['branch_id']));
    die();
}

if(isset($_GET['branch_id']) && isset($headers['get_video_ads'])){
    $queue_display = new QueueDisplay();
    echo json_encode($queue_display->get_queue_video($_GET['branch_id']));
    die();
}

if(isset($_GET['branch_id']) && isset($headers['get_next_queue'])){
    $queue_display = new QueueDisplay();
    echo json_encode($queue_display->next_queue_tokens($_GET['branch_id']));
    die();
}

if(isset($_GET['branch_id']) && isset($headers['get_recall_token'])){
    $queue_display = new QueueDisplay();
    echo json_encode($queue_display->recall_queue_token($_GET['branch_id']));
    die();
}