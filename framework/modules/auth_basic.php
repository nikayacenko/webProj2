<?php

// auth_basic.php - HTTP Authentication Script v 1.0
//##################################################

function auth(&$request, $r) {
  // TODO: запрашивать пользователя из БД.
  $users = array(//хранение паролей, но надо заменить на получение из бд
    'admin' => '123',
  );
  //empty($users)Проверяет, установлена ли переменная $user.
  //  Это позволяет не переопределять пользователя, если он уже был аутентифицирован ранее.
  if (empty($user) && !empty($_SERVER['PHP_AUTH_USER'])) {
    $user = array(//массив с логином и паролем
      'login' => $_SERVER['PHP_AUTH_USER'],
      'pass' => $users[$_SERVER['PHP_AUTH_USER']]
    );
    $request['user'] = $user;//Информация о пользователе добавляется в массив $request, 
    // чтобы она была доступна другим частям фреймворка.
  }
  //следующий блок кода проверяет, прошла ли аутентификация успешно.
  if (!isset($_SERVER['PHP_AUTH_USER']) || empty($user) || $_SERVER['PHP_AUTH_USER'] != $user['login'] || $_SERVER['PHP_AUTH_PW'] != $user['pass']) {
    unset($user);
    $response = array(
      'headers' => array(sprintf('WWW-Authenticate: Basic realm="%s"', conf('sitename')), 'HTTP/1.0 401 Unauthorized'),
      'entity' => theme('401', $request),
    );
    return $response;
  }
}
 