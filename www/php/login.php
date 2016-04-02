<?php

require_once ('config/config.php');
require_once ('model/functions.fn.php');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$password = md5($request->password);
$email = $request->email;

$result = array(
    'success' => utf8_encode('false'),
    'error' => utf8_encode('')
);

if(isset($email) && isset($password)) {
    if (!empty($email) && !empty($password)) {
        $connect = userConnection($db, $email, $password);

        if ($connect == true) {
            $result = array(
                'success' => utf8_encode('true'),
                'error' => ''
            );
        } else {
            $result = array(
                'success' => utf8_encode('false'),
                'error' => utf8_encode('E-mail ou mot de passe incorrect')
            );
        }

    }else{
        $result = array(
            'success' => utf8_encode('false'),
            'error' => utf8_encode('Vous devez remplir tous les champs !')
        );
    }
}else{
    $result = array(
        'success' => utf8_encode('false'),
        'error' => utf8_encode('Erreur champs')
    );
}


//var_dump(json_encode($result));

exit(json_encode($result));
