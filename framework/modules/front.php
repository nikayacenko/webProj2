<?php
error_reporting(E_ALL & ~E_NOTICE); // Скрываем Notice (но оставляем другие ошибки)
ini_set('display_errors', 0); // Не выводить ошибки в ответ

//Этот PHP код определяет два обработчика HTTP-запросов, 
// предназначенные для модуля с именем "front". 
// Эти обработчики предназначены для разных HTTP-методов: GET и POST.
global $db;
// Обработчик запросов методом GET.
require_once './scripts/db.php';
function front_get($request, $db) {
  echo htmlspecialchars($_COOKIE['save']);
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
            'Вы можете <a href="%s">войти</a> с логином <strong>%s</strong> и паролем <strong>%s</strong> для изменения данных.',
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
      $messages[] = '<div>Такой email уже зарегистрирован</div>';
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
























// Обработчик запросов методом POST.
function front_post($request, $db) {
    // Проверяем AJAX-запрос
  $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
              strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';  strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
  if ($isAjax) {
    header('Content-Type: application/json');
  }
  // Пример возврата редиректа.
  if (!validateCsrfToken()) {
    if ($isAjax) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Ошибка CSRF токена',
            'csrf_error' => true
        ]);
        exit;
    }
    http_response_code(403);
    exit;
}
$fav_languages = ($request['post']['languages']) ?? [];
// Проверяем ошибки.
$errors = FALSE;
if (empty(strip_tags($request['post']['fio']))) {
  setcookie('fio_error', '1');
  $errors = TRUE;
}

if(!empty(strip_tags($request['post']['fio'])) && strip_tags(strlen($request['post']['fio']))>150) {//XSS
  setcookie('fio_error', '2');
  $errors = TRUE;
}

if(!empty(strip_tags($request['post']['fio'])) && !preg_match('/^[а-яА-Яa-zA-Z ]+$/u', strip_tags($request['post']['fio']))) {
  setcookie('fio_error', '3');
  $errors = TRUE;
}

// Сохраняем ранее введенное в форму значение на год.
setcookie('fio_value', htmlspecialchars($request['post']['fio'], ENT_QUOTES, 'UTF-8'), time() + 365 * 24 * 60 * 60);

// $_POST['field-tel']=trim($_POST['field-tel']);
$request['post']['field-tel']=strip_tags(trim($request['post']['field-tel']));//XSS
if(!preg_match('/^[0-9+]+$/', $request['post']['field-tel'])) {
  setcookie('field-tel_error', '1');
  $errors = TRUE;
}
setcookie('field-tel_value', htmlspecialchars($request['post']['field-tel'], ENT_QUOTES, 'UTF-8'), time() + 365 * 24 * 60 * 60);

if(!isset($request['post']['radio-group-1']) || empty($request['post']['radio-group-1'])) {
  setcookie('radio-group-1_error', '1');
  $errors = TRUE;
}
setcookie('radio-group-1_value', htmlspecialchars($request['post']['radio-group-1'], ENT_QUOTES, 'UTF-8'), time() + 365 * 24 * 60 * 60);

$email=strip_tags($request['post']['field-email']);
if(!preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u', $email)) {
  setcookie('field-email_error', '1');
  $errors = TRUE;
}
if (empty($_SERVER['PHP_AUTH_USER']) || empty($_SERVER['PHP_AUTH_PW']) || $_SERVER['PHP_AUTH_USER'] !=  adminlog($db) || !password_check(adminlog($db), $_SERVER['PHP_AUTH_PW'], $db))
{
  if (emailExists($email, $db)) {
          $id = null;
     try {
         $dp = $db->prepare("SELECT id FROM person WHERE email = ?");
         $dp->execute([$email]);
         $id = strip_tags($dp->fetchColumn());
     } catch (PDOException $e) {
         error_log('Database error: ' . $e->getMessage());//Information Disclosure
         exit();
     }
     if ((int)$id !== (int)strip_tags($_SESSION['uid'])) {
         setcookie('field-email_error', '2');
         $errors = TRUE;
     }
  }
}
else {
  if (emailExists($email, $db)) {
     $id = null;
     try {
         $dp = $db->prepare("SELECT id FROM person WHERE email = ?");
         $dp->execute([$email]);
         $id = $dp->fetchColumn();
     } catch (PDOException $e) {
        error_log('Database error: ' . $e->getMessage());//Information Disclosure
         exit();
     }
     if ((int)$id !== (int)strip_tags($request['post']['uid'])) {
         setcookie('field-email_error', '2');
         $errors = TRUE;
     }
  }
}

setcookie('field-email_value', htmlspecialchars($request['post']['field-email'], ENT_QUOTES, 'UTF-8'), time() + 365 * 24 * 60 * 60);
$allowed_lang=getLangs($db);
if(empty($fav_languages)) {
  setcookie('languages_error', '1');
  $errors = TRUE;
} else {
  foreach ($fav_languages as $lang) {
    if (!in_array($lang, $allowed_lang)) {
        setcookie('languages_error', '2');
        $errors = TRUE;
    }
  }
}
$langs_value =strip_tags(implode(",", $fav_languages));
setcookie('languages_value', htmlspecialchars($langs_value, ENT_QUOTES, 'UTF-8'), time() + 365 * 24 * 60 * 60);

if (empty($request['post']['field-date'])) {
  setcookie('field-date_error', '1');
  $errors = TRUE;
}
setcookie('field-date_value', htmlspecialchars($request['post']['field-date'], ENT_QUOTES, 'UTF-8'), time() + 365 * 24 * 60 * 60);//XSS

if(!isset($request['post']['check-1']) || empty($request['post']['check-1'])) {
  setcookie('check-1_error', '1');
  $errors = TRUE;
}
setcookie('check-1_value', htmlspecialchars($request['post']['check-1'], ENT_QUOTES, 'UTF-8'), time() + 365 * 24 * 60 * 60);

if (empty($request['post']['bio'])) {
  setcookie('bio_error', '1');
  $errors = TRUE;
}

if (!empty($request['post']['bio']) && !preg_match('/^[а-яА-Яa-zA-Z1-9.,?!:() ]+$/u', $request['post']['bio'])) {
  setcookie('bio_error', '2');
  $errors = TRUE;
}
setcookie('bio_value', htmlspecialchars($request['post']['bio'], ENT_QUOTES, 'UTF-8'), time() + 365 * 24 * 60 * 60);


if ($errors) {
    if ($isAjax) {
      // Для AJAX возвращаем ошибки в JSON
      $responseErrors = [];
      foreach ($_COOKIE as $key => $value) {
          if (strpos($key, '_error') !== false) {
              $field = str_replace('_error', '', $key);
              $responseErrors[$field] = $value;
          }
      }
      http_response_code(422);
      echo json_encode([
        'success' => false,
                'message' => 'Ошибки валидации',
                'errors' => $responseErrors
    ]);
    exit;
  } else {
      // Редирект для обычной формы
    
    if (!empty($_SERVER['PHP_AUTH_USER']) && !empty($_SERVER['PHP_AUTH_PW']) && $_SERVER['PHP_AUTH_USER'] ==  adminlog($db) && password_check(adminlog($db), $_SERVER['PHP_AUTH_PW'], $db))
    {
      return redirect('./', ['uid' => $request['post']['uid']]);
    }
    return redirect('./');
  }
}
else {
  
  setcookie('fio_error', '', 100000);
  setcookie('field-tel_error', '', 100000);
  setcookie('field-email_error', '', 100000);
  setcookie('field-date_error', '', 100000);
  setcookie('radio-group-1_error', '', 100000);
  setcookie('check-1_error', '', 100000);
  setcookie('languages_error', '', 100000);
  setcookie('bio_error', '', 100000);
}

// Проверяем меняются ли ранее сохраненные данные или отправляются новые.

if (!empty($_SERVER['PHP_AUTH_USER']) && !empty($_SERVER['PHP_AUTH_PW']) && $_SERVER['PHP_AUTH_USER'] == adminlog($db) && password_check(adminlog($db), $_SERVER['PHP_AUTH_PW'], $db)) {
  if(!empty($request['post']['uid'])) {
      try {
          $update_id = intval($request['post']['uid']); //XSS
          $doplog = findLoginByUid($update_id, $db);
          updateDB($doplog, $db);
          
          if ($isAjax) {
              echo json_encode([
                  'success' => true,
                  'message' => 'Данные администратора успешно обновлены',
                  'redirect' => 'admin'
              ]);
              exit;
          } else {
              return redirect('admin');
          }
      } catch(PDOException $e) {
          if ($isAjax) {
              echo json_encode([
                  'success' => false,
                  'message' => 'Ошибка базы данных при обновлении'
              ]);
              exit;
          } else {
              return redirect('admin');
          }
      }
  } else {
      if ($isAjax) {
          echo json_encode([
              'success' => false,
              'message' => 'Вы не выбрали пользователя для изменения'
          ]);
          exit;
      } else {
          print('Вы не выбрали пользователя для изменения');
          exit();
      }
  }
} else {
  if (isset($_COOKIE[session_name()]) && session_start() && !empty($_SESSION['login'])) {
      try {
          updateDB($_SESSION['login'], $db);
          
          // Сохраняем куку с признаком успешного сохранения
          //setcookie('save', '1');
          
          if ($isAjax) {
              echo json_encode([
                  'success' => true,
                    'message' => 'Данные сохранены'
              ]);
              exit;
          } 
              setcookie('save', '1', time() + 3600);
              return redirect();
          
      } catch(PDOException $e) {
          if ($isAjax) {
            http_response_code(500);
              echo json_encode([
                  'success' => false,
                  'message' => 'Ошибка базы данных',
                    'error' => $e->getMessage()
              ]);
              exit;
          } else {
              print('Error : ' . $e->getMessage());
              exit();
          }
      }
  } else {
      $login = generate_pass(7);
      while(check_login($login, $db) > 0) {
          $login = generate_pass(7);
      }
      $pass = generate_pass();
      $hash_pass = password_hash($pass, PASSWORD_DEFAULT);
      
      try {
          insertDB($db, $login, $hash_pass);
          
          // Сохраняем в Cookies
          // setcookie('login', $login);
          // setcookie('pass', $pass);
          // setcookie('save', '1', time() + 3600, '/', '', false, true);
          
          if ($isAjax) {
              echo json_encode([
                'success' => true,
                'message' => 'Новый пользователь создан',
                'login' => $login,
                'pass' => $pass,
              ]);
              exit;
          }
              setcookie('login', $login);
              setcookie('pass', $pass);
              setcookie('save', '1');
              return redirect();
          
      } catch(PDOException $e) {
          if ($isAjax) {
              echo json_encode([
                  'success' => false,
                'message' => 'Ошибка при создании пользователя',
                'error' => $e->getMessage()
              ]);
              exit;
          } else {
              print('Error : ' . $e->getMessage());
              exit();
          }
      }
  }
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