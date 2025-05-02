<?php
require_once './scripts/db.php';
global $db;
   function logout_post($request, $db) {
    var_dump($request);
       if (isset($request['post']['logout'])) {
        var_dump("yyy");
           session_unset();
           session_destroy();
           //setcookie(session_name(), '', time() - 3600, "/"); // Удаляем куки сессии
           return redirect(url('login')); // Перенаправляем на главную
       }
   }
?>
