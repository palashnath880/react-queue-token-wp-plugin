<?php 

if(isset($_POST['video_link'])){
    $args = array(
        'post_type'   => 'queue_video_ads',
        'post_status' => 'publish',
        'post_author' => get_current_user_id(),
        'post_title'  => $_POST['video_link'],
    );
    wp_insert_post($args);
}

if(isset($_GET['video_id'])){
    wp_delete_post($_GET['video_id']);
    echo '<script>
    window.history.back();
    </script>';
}

?>
<div class='queue_wrapper'>
    <div class='queue_branch_add'>
        <form action="<?php echo $_SERVER['REQUEST_URI'];?>" method="post" autocomplete="off">
            <h1>Queue Video Ads </h1>
            <fieldset>        
                <label for="video_link">Video Link:</label>
                <input type="url" id="video_link" name="video_link" placeholder='Video Link' value='' required>
            </fieldset>
            <button type="submit">Add Link</button>
        </form>
    </div>
    <div class='queue_branchs'>
        <h1>Queue Video Ads Link</h1>
        <table border='1px'>
            <thead>
                <tr>
                    <th>Link</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php 
                $args = array(
                    'post_type'   => 'queue_video_ads',
                    'post_status' => 'publish',
                );
                $videos = get_posts($args);

                if($videos){
                    foreach($videos as $video ){
                        echo '<tr>
                                <td>'.$video->post_title.'</td>
                                <td><a href="'.$_SERVER['REQUEST_URI'].'&video_id='.$video->ID.'">Delete</a></td>
                            </tr>';
                    }
                }
                ?>
                
            </tbody>
        </table>
    </div>
</div>