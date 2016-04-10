<?php

/* Login Function */

function userConnection(PDO $db, $email, $password){
    if(!empty($email) && !empty($password)){
        //Requête SQL
        $sql = "SELECT * FROM users WHERE email = :eml AND password = :passwd LIMIT 1";

        $req = $db->prepare($sql);
        $req->execute(array(
            ':eml' =>   $email,
            ':passwd' => $password
        ));

        $result = $req->fetch(PDO::FETCH_ASSOC);

        //Si le fetch réussi, alors un résultat a été retourné donc le couple email / password est correct
        if($result == true){

            //on définit la SESSION
            /*
            $_SESSION['id'] = $result['id'];
            $_SESSION['username'] = $result['username'];
            $_SESSION['email'] = $result['email'];
            $_SESSION['created_at'] = $result['created_at'];
            $_SESSION['image'] = $result['picture'];
            §
            */

            return true;
        }else{
            return false;
        }
    }else{

        return false;
    }
}

/* Verification de la disponibilirté de l'email */

function isEmailAvailable(PDO $db, $email){
    $sql = "SELECT id FROM users WHERE email = :eml LIMIT 1";

    $req = $db->prepare($sql);
    $req->execute(array(':eml' => $email));

    $result = $req->fetch(PDO::FETCH_ASSOC);

    if(!empty($result)) return false;
    else return true;
}

/* Enregistrement d'un nouvel utilisateur */

function userRegistration(PDO $db, $name, $email, $password){
    $sql = "INSERT INTO users
				  SET
				  email = :eml,
				  name = :name,
				  password = :passwd";


    $req = $db->prepare($sql);
    $req->execute(array(
        ':name' => $name,
        ':eml' => $email,
        ':passwd' => $password,
    ));

    return true;

}