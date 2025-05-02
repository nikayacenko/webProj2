<?php
require_once './scripts/db.php';
global $db;
   function logout_post($request, $db) {
       if (isset($request['post']['logout'])) {
           session_unset();
           session_destroy();
           //setcookie(session_name(), '', time() - 3600, "/"); // Удаляем куки сессии
           return redirect('login'); // Перенаправляем на главную
       }
   }
?>
