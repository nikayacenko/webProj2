<?php
   function logout_post($request, $db) {
       if ($request['method'] == 'post' && isset($request['post']['logout'])) {
           session_start(); // Возобновляем сессию, если она еще не активна

           $_SESSION = array();// очищаем переменные сессии.
           // Уничтожаем сессию.
           session_destroy();
           setcookie(session_name(), '', time() - 3600, "/"); // Удаляем куки сессии

           return redirect('./'); // Перенаправляем на главную
       }
   }
?>