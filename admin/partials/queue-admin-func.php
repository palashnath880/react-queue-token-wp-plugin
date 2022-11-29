<?php

$branch_name = "";
    $branch_email = "";
    $branch_error = null;
    $branch_success = null ;

    if(isset($_POST['branch_name']) && isset($_POST['branch_email']) && isset($_POST['branch_password'])){
        
        $user_name = str_replace(' ','_', trim(strtolower($_POST['branch_name'])));

        $is_have_user_name = username_exists($user_name);
        $is_have_user_email = email_exists($_POST['branch_email']);

        if($is_have_user_name || $is_have_user_email){
            $branch_name = $_POST['branch_name'];
            $branch_email = $_POST['branch_email'];
            if($is_have_user_name){
                $branch_error = 'All ready have an branch.';
            }else{
                $branch_error = 'Email all ready use.';
            }
        }else{

            $args = array(
                'first_name' => $_POST['branch_name'],
                'user_login' => $user_name,
                'user_email' => $_POST['branch_email'],
                'user_pass'  => $_POST['branch_password'],
                'role'       => 'queue_branch',
                'show_admin_bar_front' => 'false',
            );

            $branch = wp_insert_user($args);
            if($branch){
                $branch_success = 'Branch Added Successfully';
            }
        }
    }

    ?>
    <div class='queue_wrapper'>
        <div class='queue_branch_add'>
            <form action="<?php echo $_SERVER['REQUEST_URI'];?>" method="post" autocomplete="off">
                <h1>Queue Add Branch</h1>
                <fieldset>        
                    <label for="branch_name">Branch Name:</label>
                    <input type="text" id="branch_name" name="branch_name" placeholder='Branch Name' value='<?php echo $branch_name; ?>' required>
                
                    <label for="branch_email">Email:</label>
                    <input type="email" id="branch_email" name="branch_email" autocomplete="off" placeholder='Branch Email' value='<?php echo $branch_email; ?>' required>
                
                    <label for="branch_password">Password:</label>
                    <input type="password" id="branch_password" name="branch_password" autocomplete="off" placeholder='Branch Password' required>

                    <?php 

                    if($branch_error !== null){
                        echo '<p class="branch_error">'.$branch_error.'</p>';
                    }

                    if($branch_success !== null){
                        echo '<p class="branch_success">'.$branch_success.'</p>';
                    }

                    ?>
                </fieldset>
                <button type="submit">Add Branch</button>
            </form>
        </div>
        <div class='queue_branchs'>
            <h1>Queue Branch</h1>
            <table border='1px'>
                <thead>
                    <tr>
                        <th>Branch Name</th>
                        <th>Branch Email</th>
                    </tr>
                </thead>
                <tbody>

                    <?php 
                    $args = array(
                        'role'    => 'queue_branch',
                        'orderby' => 'id',
                        'order'   => 'ASC'
                    );
                    $branchs = get_users($args);
    
                    if($branchs){
                        foreach($branchs as $branch ){
                            echo '<tr>
                                    <td>'.$branch->first_name.'</td>
                                    <td>'.$branch->user_email.'</td>
                                </tr>';
                        }
                    }
                    ?>
                    
                </tbody>
            </table>
        </div>
    </div>