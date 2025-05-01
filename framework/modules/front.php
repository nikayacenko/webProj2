<?php


//Этот PHP код определяет два обработчика HTTP-запросов, 
// предназначенные для модуля с именем "front". 
// Эти обработчики предназначены для разных HTTP-методов: GET и POST.
global $db;
// Обработчик запросов методом GET.
require_once './scripts/db.php';
function front_get($request, $db) {
  
  $messages = array();
  $errors = array();

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
          $messages[] = sprintf('Вы можете <a href="login.php">войти</a> с логином <strong>%s</strong>
            и паролем <strong>%s</strong> для изменения данных.',
            htmlspecialchars($_COOKIE['login'], ENT_QUOTES, 'UTF-8'),
            htmlspecialchars($_COOKIE['pass'], ENT_QUOTES, 'UTF-8'));//XSS
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
          $update_id = intval($_GET['uid']);//XSS
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

// Обработчик запросов методом POST.
function front_post($request) {
  // Пример возврата редиректа.
  return redirect('new-location');
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