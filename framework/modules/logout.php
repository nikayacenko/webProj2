<?php
   function logout_post($request, $db) {
       if ($request['method'] == 'post' && isset($request['post']['logout'])) {
           session_unset()
           session_destroy();
           //setcookie(session_name(), '', time() - 3600, "/"); // Удаляем куки сессии
           return redirect('./'); // Перенаправляем на главную
       }
   }
?>

if (!empty($_SESSION['login'])) {
    if(isset($_POST['logout'])){
      session_unset();
      session_destroy();
      header('Location: login.php');
      exit();
    }
    header('Location: ./');
    exit();
  }
}