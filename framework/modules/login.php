<?php
require_once './scripts/db.php';

function login_get($request, $db) {
  // Проверка, авторизован ли пользователь
  if (isset($_COOKIE[session_name()]) && session_start() && !empty($_SESSION['login'])) {
      redirect();
      exit();
  }

  // Генерация CSRF token
  $csrf_token = htmlspecialchars(generateCsrfToken());

  // Формируем HTML-код формы вход;
    return theme('login', $csrf_token);
}


function login_post($request, $db) {
    // Проверяем, был ли отправлен запрос методом POST
    if ($request['method'] == 'post') {
      // Валидация CSRF token
      if (!validateCsrfToken()) {
        http_response_code(403);
        die('error');
      }
  
      $login = $request['post']['login'];
      $password = $request['post']['pass'];
  
      // Начинаем сессию, если она еще не была начата
      if (!isset($_COOKIE[session_name()])) {
        session_start();
      }
  
      // Проверяем логин и пароль
      if (isValid($login, $db) && password_check($login, $password, $db)) {
        // Устанавливаем логин в сессии
        $_SESSION['login'] = $login;
  
        // Получаем ID пользователя из базы данных
        try {
          $stmt_select = $db->prepare("SELECT id FROM person_LOGIN WHERE login=?");
          $stmt_select->execute([$login]);
          $_SESSION['uid'] = $stmt_select->fetchColumn();
        } catch (PDOException $e) {
          print('Error : ' . $e->getMessage());
          exit();
        }
  
        // Делаем перенаправление на главную страницу
        redirect();
        exit();
      } else {
        return 'Неверный логин или пароль'; // Возвращаем сообщение об ошибке
      }
    }
  }
  ?>