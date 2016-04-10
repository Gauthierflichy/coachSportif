<?php

require_once ('config/config.php');
require_once ('model/functions.fn.php');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$email = $request->email;
$name = $request->name;
$password = md5($request->password);
$password2 = md5($request->password2);

$email_check = isEmailAvailable($db, $email);

if(isset($email) && isset($password) && isset($password2) && isset($name)) {
    if (!empty($email) && !empty($password) && !empty($password2) && !empty($name)) {
        if($password === $password2){
            if ($email_check !== false){

                $connect = userRegistration($db, $name, $email, $password);

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
            } else {
                $result = array(
                    'success' => utf8_encode('false'),
                    'error' => utf8_encode('E-mail déjà utilisé !')
                );
            }
        } else {
            $result = array(
                'success' => utf8_encode('false'),
                'error' => utf8_encode('Les mots de passes ne correspondent pas !')
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

exit(json_encode($result));