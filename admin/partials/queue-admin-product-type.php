<?php 

$err_product_type = '';
$product_err = null;
$product_success = null;

// delete product type 
if(isset($_GET['delete'])){
    $id = $_GET['delete'];
    wp_delete_post($id);
}

// add product type
if(isset($_POST['queue_product'])){
    $queue_product = $_POST['queue_product'];
    $is_have_product = get_posts(array(
        'title' => $queue_product,
        'post_type' => 'queue_product'
    ));

    if($is_have_product){
        $err_product_type = $queue_product;
        $product_err = 'Product Type All Ready Exists';
    }else{
        $args = array(
            'post_title' => $queue_product,
            'post_type' => 'queue_product',
            'post_status' => 'publish',
        );
        wp_insert_post($args);
        $product_success = 'Product Added Successfully';
    }

}

?>
<div class='queue_wrapper'>
    <div class='queue_branch_add'>
        <form action="<?php echo $_SERVER['REQUEST_URI'];?>" method="post" autocomplete="off">
            <h1>Queue Add Product Type</h1>
            <fieldset>        
                <label for="queue_product">Queue Product Type:</label>
                <input type="text" id="queue_product" name="queue_product" placeholder='Queue Product Type' value='<?php echo $err_product_type;?>' required>
                <?php 
                if($product_err !== null){
                    echo '<p class="branch_error">'.$product_err.'</p>';
                }

                if($product_success !== null){
                    echo '<p class="branch_success">'.$product_success.'</p>';
                }
                ?>
            </fieldset>
            <button type="submit">Add Product</button>
        </form>
    </div>
    <div class='queue_branchs'>
        <h1>Queue Product Type </h1>
        <table border='1px'>
            <thead>
                <tr>
                    <th>Queue Product Type</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php 
                $args = array(
                    'post_type' => 'queue_product',
                    'orderby' => 'id',
                    'post_status' => 'publish'
                );
                $products = get_posts($args);

                if($products){
                    foreach($products as $product ){
                        echo '<tr>
                                <td>'.$product->post_title.'</td>
                                <td><a href="'.$_SERVER['REQUEST_URI'].'&delete='.$product->ID.'">Delete</a></td>
                            </tr>';
                    }
                }
                ?>
                
            </tbody>
        </table>
    </div>
</div>