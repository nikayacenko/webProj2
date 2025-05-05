<?php
    header('Content-Type: application/json');
// error_reporting(0);

//Этот PHP код определяет два обработчика HTTP-запросов, 
// предназначенные для модуля с именем "front". 
// Эти обработчики предназначены для разных HTTP-методов: GET и POST.
global $db;
// Обработчик запросов методом GET.
require_once './scripts/db.php';
function front_get($request, $db) {
  
    $allowed_lang=getLangs($db);
    // Массив для временного хранения сообщений пользователю.
    $messages = array();
  
    // В суперглобальном массиве $_COOKIE PHP хранит все имена и значения куки текущего запроса.
    // Выдаем сообщение об успешном сохранении.
    if (!empty($_COOKIE['save'])) {
      // Удаляем куку, указывая время устаревания в прошлом.
      setcookie('save', '', 100000);
      setcookie('login', '', 100000);
      setcookie('pass', '', 100000);
      // Выводим сообщение пользователю.
      $messages[] = strip_tags('Спасибо, результаты сохранены.');
      // Если в куках есть пароль, то выводим сообщение.
      if (empty($_SERVER['PHP_AUTH_USER']) || empty($_SERVER['PHP_AUTH_PW']) || $_SERVER['PHP_AUTH_USER'] !=  adminlog($db) || !password_check(adminlog($db), $_SERVER['PHP_AUTH_PW'], $db))
      {
        if (!empty($_COOKIE['pass'])) {
          $messages[] = sprintf(
            'Вы можете <a href="%s">Login</a> войти с логином <strong>%s</strong> и паролем <strong>%s</strong> для изменения данных.',
            htmlspecialchars(url('login'), ENT_QUOTES, 'UTF-8'),
            htmlspecialchars($_COOKIE['login'], ENT_QUOTES, 'UTF-8'),
            htmlspecialchars($_COOKIE['pass'], ENT_QUOTES, 'UTF-8')
        );
        
        }
      }
    }
  
    // Складываем признак ошибок в массив.
    $errors = array();
    $errors['fio'] = !empty($_COOKIE['fio_error']);
    $errors['field-tel'] = !empty($_COOKIE['field-tel_error']);
    $errors['field-email'] = !empty($_COOKIE['field-email_error']);
    $errors['field-date'] = !empty($_COOKIE['field-date_error']);
    $errors['radio-group-1'] = !empty($_COOKIE['radio-group-1_error']);
    $errors['languages'] = !empty($_COOKIE['languages_error']);
    $errors['check-1'] = !empty($_COOKIE['check-1_error']);
    $errors['bio'] = !empty($_COOKIE['bio_error']);
  
  
    // Выдаем сообщения об ошибках.
    if ($errors['fio'] AND $_COOKIE['fio_error']==1) {
      // Удаляем куки, указывая время устаревания в прошлом.
      setcookie('fio_error', '', 100000);
      setcookie('fio_value', '', 100000);
      // Выводим сообщение.
      $messages[] = '<div>Заполните имя.</div>';
    }
  
    if ($errors['fio'] AND $_COOKIE['fio_error']==2) {
      // Удаляем куки, указывая время устаревания в прошлом.
      setcookie('fio_error', '', 100000);
      setcookie('fio_value', '', 100000);
      // Выводим сообщение.
      $messages[] ='<div>ФИО должно содержать не более 150 символов.</div>';
    }
  
    if ($errors['fio'] AND $_COOKIE['fio_error']==3) {
      // Удаляем куки, указывая время устаревания в прошлом.
      setcookie('fio_error', '', 100000);
      setcookie('fio_value', '', 100000);
      // Выводим сообщение.
      $messages[] = '<div>ФИО должно содержать только буквы (русские и английские) и пробелы.</div>';
    }
  
    if ($errors['field-tel']) {
      // Удаляем куки, указывая время устаревания в прошлом.
      setcookie('field-tel_error', '', 100000);
      setcookie('field-tel_value', '', 100000);
      // Выводим сообщение.
      $messages[] = '<div>Телефон должен содержать только цифры и знак +</div>';
    }
  
    if ($errors['field-email'] AND  $_COOKIE['field-email_error']==1) {
      // Удаляем куки, указывая время устаревания в прошлом.
      setcookie('field-email_error', '', 100000);
      setcookie('field-email_value', '', 100000);
      // Выводим сообщение.
      $messages[] = '<div>Email введен некорректно</div>';
    }
  
    if ($errors['field-email'] AND  $_COOKIE['field-email_error']==2) {
      // Удаляем куки, указывая время устаревания в прошлом.
      setcookie('field-email_error', '', 100000);
      setcookie('field-email_value', '', 100000);
      // Выводим сообщение.
      $messages[] = '<div>Такой email уже зарегестрирован</div>';
    }
  
    if ($errors['field-date']) {
      // Удаляем куки, указывая время устаревания в прошлом.
      setcookie('field-date_error', '', 100000);
      setcookie('field-date_value', '', 100000);
      // Выводим сообщение.
      $messages[] = '<div>Заполните дату</div>';
    }
  
    
    if ($errors['radio-group-1']) {
      // Удаляем куки, указывая время устаревания в прошлом.
      setcookie('radio-group-1_error', '', 100000);
      setcookie('radio-group-1_value', '', 100000);
      // Выводим сообщение.
      $messages[] = '<div>Выберите пол</div>';
    }
  
    if ($errors['check-1']) {
      // Удаляем куки, указывая время устаревания в прошлом.
      setcookie('check-1_error', '', 100000);
      setcookie('check-1_value', '', 100000);
      // Выводим сообщение.
      $messages[] = '<div>Ознакомьтесь с контрактом</div>';
    }
  
    if ($errors['languages']) {
      if($_COOKIE['languages_error']=='1'){
        $messages[] = '<div>Укажите любимый(ые) язык(и) программирования.</div>';
      }
      elseif($_COOKIE['languages_error']=='2'){
        $messages[] = '<div>Указан недопустимый язык.</div>';
      }
      setcookie('languages_error', '', 100000);
      setcookie('languages_value', '', 100000);
    }
  
    if ($errors['bio'] AND  $_COOKIE['bio_error']==1) {
      // Удаляем куки, указывая время устаревания в прошлом.
      setcookie('bio_error', '', 100000);
      setcookie('bio_value', '', 100000);
      // Выводим сообщение.
      $messages[] = '<div>Заполните биографию.</div>';
    }
  
    if ($errors['bio'] AND  $_COOKIE['bio_error']==2) {
      // Удаляем куки, указывая время устаревания в прошлом.
      setcookie('bio_error', '', 100000);
      setcookie('bio_value', '', 100000);
      // Выводим сообщение.
      $messages[] = '<div>Используйте только допустимые символы: буквы, цифры, знаки препинания.</div>';
    }
  
  
    $values = array();
    $values['fio'] = empty($_COOKIE['fio_value']) ? '' : htmlspecialchars(($_COOKIE['fio_value']), ENT_QUOTES, 'UTF-8');//XSS
    $values['field-tel'] = empty($_COOKIE['field-tel_value']) ? '' : htmlspecialchars(($_COOKIE['field-tel_value']), ENT_QUOTES, 'UTF-8');
    $values['field-email'] = empty($_COOKIE['field-email_value']) ? '' : htmlspecialchars(($_COOKIE['field-email_value']), ENT_QUOTES, 'UTF-8');
    $values['field-date'] = empty($_COOKIE['field-date_value']) ? '' : htmlspecialchars(($_COOKIE['field-date_value']), ENT_QUOTES, 'UTF-8');
    $values['radio-group-1'] = empty($_COOKIE['radio-group-1_value']) ? '' : htmlspecialchars(($_COOKIE['radio-group-1_value']), ENT_QUOTES, 'UTF-8');
    $values['check-1'] = empty($_COOKIE['check-1_value']) ? '' : htmlspecialchars(($_COOKIE['check-1_value']), ENT_QUOTES, 'UTF-8');
    $values['bio'] = empty($_COOKIE['bio_value']) ? '' : htmlspecialchars(($_COOKIE['bio_value']), ENT_QUOTES, 'UTF-8');
    $values['languages'] = empty($_COOKIE['languages_value']) ? '' : htmlspecialchars(($_COOKIE['languages_value']), ENT_QUOTES, 'UTF-8');
  
    //вставка для админа
    if (!empty($_SERVER['PHP_AUTH_USER']) && !empty($_SERVER['PHP_AUTH_PW']) && $_SERVER['PHP_AUTH_USER'] ==  adminlog($db) && password_check(adminlog($db), $_SERVER['PHP_AUTH_PW'], $db))
      {
        if(!empty($_GET['uid']))
        {
          $update_id = intval($request['get']['uid']);//XSS
          $doplog=findLoginByUid($update_id, $db);
          $values=insertData($doplog, $db);
          $values['uid']=htmlspecialchars($update_id, ENT_QUOTES, 'UTF-8');
        }
    }
    //вставка для ползователя
    if (isset($_COOKIE[session_name()]) && !empty($_SESSION['login'])) {
          $values=insertData($_SESSION['login'],  $db);
          $messages[] = ("<div>Вы успешно вошли в аккаунт.</div>");//Information Disclosure
  
    }
  // Формирование данных для шаблона
  $data = [
    'messages' => $messages,
    'errors' => $errors,
    'allowed_lang' => $allowed_lang,
    'values' => $values,
  ];

  return theme('form', $data);
}























<?php

function front_post($request, $db) {
  //Валидация CSRF token.
  if (!validateCsrfToken()) {
    return access_denied();
  }

  $is_ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
  $post_data = $request['post'];
  $errors = [];
  $cookies_to_set = [];

  // 1. Валидация ФИО
  $fio = trim(strip_tags($post_data['fio'] ?? ''));
  $fio_key = 'fio';

  if (empty($fio)) {
    $errors[$fio_key] = 'Поле ФИО обязательно для заполнения.';
  } elseif (strlen($fio) > 150) {
    $errors[$fio_key] = 'Длина ФИО не должна превышать 150 символов.';
  } elseif (!preg_match('/^[а-яА-Яa-zA-Z\s]+$/u', $fio)) {
    $errors[$fio_key] = 'Поле ФИО должно содержать только буквы и пробелы.';
  }

  $cookies_to_set[$fio_key . '_value'] = htmlspecialchars($fio, ENT_QUOTES, 'UTF-8');

  // 2. Валидация телефона
  $tel = trim(strip_tags($post_data['field-tel'] ?? ''));
  $tel_key = 'field-tel';

  if (!preg_match('/^[0-9+]+$/', $tel)) {
    $errors[$tel_key] = 'Неверный формат телефона. Допускаются только цифры и символ "+".';
  }
  $cookies_to_set[$tel_key . '_value'] = htmlspecialchars($tel, ENT_QUOTES, 'UTF-8');

  // 3. Валидация radio-group-1
  $radio_group_1 = $post_data['radio-group-1'] ?? '';
  $radio_group_1_key = 'radio-group-1';

  if (empty($radio_group_1)) {
    $errors[$radio_group_1_key] = 'Выберите один из вариантов.';
  }
  $cookies_to_set[$radio_group_1_key . '_value'] = htmlspecialchars($radio_group_1, ENT_QUOTES, 'UTF-8');

  // 4. Валидация email
  $email = trim(strip_tags($post_data['field-email'] ?? ''));
  $email_key = 'field-email';

  if (!preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u', $email)) {
    $errors[$email_key] = 'Неверный формат email.';
  } else {
    if (emailExists($email, $db)) {
      $id = null;
      try {
        $dp = $db->prepare("SELECT id FROM person WHERE email = ?");
        $dp->execute([$email]);
        $id = $dp->fetchColumn();
      } catch (PDOException $e) {
        error_log('Database error: ' . $e->getMessage());
        if($is_ajax) {
          header('Content-Type: application/json');
          echo json_encode(['error' => 'Database error']);
          exit;
        }
        return not_found();
      }

      if (empty($_SERVER['PHP_AUTH_USER']) || empty($_SERVER['PHP_AUTH_PW']) || $_SERVER['PHP_AUTH_USER'] !=  adminlog($db) || !password_check(adminlog($db), $_SERVER['PHP_AUTH_PW'], $db)) {
        if ((int)$id !== (int)strip_tags($_SESSION['uid'])) {
          $errors[$email_key] = 'Этот email уже зарегистрирован.';
        }
      } else {
        if ((int)$id !== (int)strip_tags($post_data['uid'])) {
          $errors[$email_key] = 'Этот email уже зарегистрирован.';
        }
      }
    }
  }

  $cookies_to_set[$email_key . '_value'] = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');

  // 5. Валидация languages
  $fav_languages = $post_data['languages'] ?? [];
  $languages_key = 'languages';
  $allowed_lang = getLangs($db);

  if (empty($fav_languages)) {
    $errors[$languages_key] = 'Выберите хотя бы один язык.';
  } else {
    foreach ($fav_languages as $lang) {
      if (!in_array($lang, $allowed_lang)) {
        $errors[$languages_key] = 'Выбран недопустимый язык.';
        break;
      }
    }
  }

  $langs_value = strip_tags(implode(",", $fav_languages));
  $cookies_to_set[$languages_key . '_value'] = htmlspecialchars($langs_value, ENT_QUOTES, 'UTF-8');

  // 6. Валидация field-date
  $date = $post_data['field-date'] ?? '';
  $date_key = 'field-date';
  if (empty($date)) {
    $errors[$date_key] = 'Укажите дату.';
  }
  $cookies_to_set[$date_key . '_value'] = htmlspecialchars($date, ENT_QUOTES, 'UTF-8');

  // 7. Валидация check-1
  $check_1 = $post_data['check-1'] ?? '';
  $check_1_key = 'check-1';
  if (!isset($check_1) || empty($check_1)) {
    $errors[$check_1_key] = 'Необходимо принять условия.';
  }
  $cookies_to_set[$check_1_key . '_value'] = htmlspecialchars($check_1, ENT_QUOTES, 'UTF-8');

  // Установка cookies
  $cookie_lifetime = time() + 365 × 24 × 60 * 60;
  foreach ($cookies_to_set as $cookie_name => $cookie_value) {
    setcookie($cookie_name, $cookie_value, $cookie_lifetime, '/');
  }

  //Установка cookies с ошибками
  foreach ($errors as $field => $error_message) {
      setcookie($field . '_error', '1', $cookie_lifetime, '/');
  }

  if (!empty($errors)) {
    if ($is_ajax) {
      header('Content-Type: application/json');
      echo json_encode(['errors' => $errors]);
      exit;
    } else {
      $_SESSION['form_errors'] = $errors;
      return redirect($_SERVER['HTTP_REFERER']);
    }
  }

  //Сохраняем данные в базу данных (пример)

  if ($is_ajax) {
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Данные успешно сохранены.']);
    exit;
  } else {
    return redirect('./success');
  }
}


//массив $request содержит всю необходимую информацию о входящем HTTP-запросе, 
// что позволяет фреймворку правильно его обработать и сформировать соответствующий HTTP-ответ. 
// Эта информация включает:
// •  URL запроса.
// •  HTTP-метод.
// •  Параметры, переданные методом GET.
// •  Параметры, переданные методом POST.
// •  Параметры, переданные методами PUT и DELETE (эмулированными через POST).
// •  Тип контента по умолчанию.