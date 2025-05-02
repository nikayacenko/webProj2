<?php
require_once './scripts/db.php';
global $db;
function login_get($request, $db) {
    // Проверка, авторизован ли пользователь
    if (isset($_COOKIE[session_name()]) && session_start() && !empty($_SESSION['login'])) {
        return redirect('./'); // Перенаправляем на главную, если авторизован
    }
  
    // Генерация CSRF token
    $csrf_token = htmlspecialchars(generateCsrfToken());
    $data = [
      'csrf_token' => $csrf_token,
    ];
    // Формируем HTML-код формы входа
      return theme('login', $data);
  }
  


function login_post($request, $db) {
    // Проверяем, был ли отправлен запрос методом POST
      // Валидация CSRF token
      var_dump("kjkjhjk");
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
        return redirect();
        exit();
      } else {
        return 'Неверный логин или пароль'; // Возвращаем сообщение об ошибке
      }
    }
  ?>