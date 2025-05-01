<?php

global $db;
$user = 'u68600'; // Заменить на ваш логин uXXXXX
$pass = '8589415'; // Заменить на пароль
$db = new PDO('mysql:host=localhost;dbname=u68600', $user, $pass,
[PDO::ATTR_PERSISTENT => true, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]); // Заменить test на имя БД, совпадает с логином uXXXXX


function findLoginByUid($update_id, $db)
{
    $update_query = "SELECT login FROM person_LOGIN WHERE id = :id";
    try {
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindParam(':id', $update_id);
        $update_stmt->execute();
        $doplog=$update_stmt->fetchColumn();
    }
    catch (PDOException $e){
        error_log('Database error: ' . $e->getMessage());
        exit();
    }
    return $doplog;

}
function password_check($login, $password, $db) {
    $passw;
    try{
      $stmt = $db->prepare("SELECT pass FROM LOGIN WHERE login = :login");
      $stmt->bindParam(':login', $login, PDO::PARAM_STR);
      $stmt->execute();
      $passw = $stmt->fetchColumn();
      if($passw===false){
        return false;
      }
      return password_verify($password, $passw);
    } 
    catch (PDOException $e){
      error_log('Database error: ' . $e->getMessage());
      return false;
    }
  }

  function check_login($login, $db)
    {
    try{
        $stmt = $db->prepare("SELECT COUNT(*) FROM LOGIN WHERE login = :login");
        $stmt->bindParam(':login', $login, PDO::PARAM_STR);
        $stmt->execute();
        $fl = $stmt->fetchColumn();
    }
    catch (PDOException $e){
        error_log('Database error: ' . $e->getMessage());
        return false;
    }
    return $fl;
    }

    function generate_pass(int $length=9):string{
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $shuff = str_shuffle($characters);
    return substr($shuff, 0, $length);
    }

    function emailExists($email, $pdo) {

        $sql = "SELECT COUNT(*) FROM person WHERE email = :email"; 
        $stmt = $pdo->prepare($sql);


        if ($stmt === false) {
            error_log("Ошибка подготовки запроса: " . $pdo->errorInfo()[2]);
            return true; 
        }


        $stmt->bindValue(':email', $email, PDO::PARAM_STR);


        if (!$stmt->execute()) {

            error_log("Ошибка выполнения запроса: " . $stmt->errorInfo()[2]);  
            return true; 
        }
        // 4. Получение результата запроса.
        $count = $stmt->fetchColumn(); // Получаем сразу значение COUNT(*)
        // 5. Закрытие курсора (необязательно, но рекомендуется)
        $stmt->closeCursor();

        // 6. Возврат true, если email найден в базе, иначе false.
        return $count > 0;
    }//функция для проверки почты
    function dbEmailChecking($db, $email, $uid)
    {
        $id = null;
              try {
                  $dp = $db->prepare("SELECT id FROM person WHERE email = :email");
                  $dp->bindParam(':email', $email, PDO::PARAM_STR);
                  $dp->execute();
                  $id = strip_tags($dp->fetchColumn());
              } catch (PDOException $e) {
                error_log('Database error: ' . $e->getMessage());//Information Disclosure
              }
              if ((int)$id !== (int)strip_tags($uid)) {
                  setcookie('field-email_error', '2');
                  $errors = TRUE;
      }
    }
    function isValid($login, $db) {
    $count=0;
    try{
      $stmt = $db->prepare("SELECT COUNT(*) FROM person_LOGIN WHERE login = :login");
      $stmt->bindParam(':login', $login, PDO::PARAM_STR);
      $stmt->execute();
      $count = $stmt->fetchColumn();
    } 
    catch (PDOException $e){
      error_log('Database error: ' . $e->getMessage());//Information Disclosure
    }
        if($count>0)
            return true;
        $password="12345";
        $passw=password_hash("123",  PASSWORD_DEFAULT);
        password_verify($password, $passw);
        return false;
  }

  function getLangs($db){
    try{
      $allowed_lang=[];
      $stmt = $db->prepare("SELECT namelang FROM languages");
      $stmt->execute();
      $data = $stmt->fetchAll();
      foreach ($data as $lang) {
        $lang_name = $lang['namelang'];
        $allowed_lang[$lang_name] = $lang_name;
      }
      return $allowed_lang;
    } catch(PDOException $e){
      error_log('Database error: ' . $e->getMessage());
    }
  }
  //$_SESSION['login']

function insertData($login, $db) {
    $values = []; // Локальная переменная для хранения данных
    // SQL-запросы и соответствующие ключи в массиве $values
    $queries = [
        'fio' => "SELECT fio FROM person JOIN person_LOGIN USING(id) WHERE login = :login",
        'field-email' => "SELECT email FROM person JOIN person_LOGIN USING(id) WHERE login = :login",
        'field-tel' => "SELECT tel FROM person JOIN person_LOGIN USING(id) WHERE login = :login",
        'field-date' => "SELECT bdate FROM person JOIN person_LOGIN USING(id) WHERE login = :login",
        'radio-group-1' => "SELECT gender FROM person JOIN person_LOGIN USING(id) WHERE login = :login",
        'bio' => "SELECT biography FROM person JOIN person_LOGIN USING(id) WHERE login = :login"
    ];
    foreach ($queries as $key => $sql) {
        try {
            $stmt = $db->prepare($sql);
            if ($stmt === false) {
                error_log("Ошибка подготовки запроса: " . print_r($db->errorInfo(), true));
                throw new Exception("Ошибка подготовки запроса"); 
            }
            $stmt->bindValue(':login', $login, PDO::PARAM_STR);
            if (!$stmt->execute()) {
                error_log("Ошибка выполнения запроса: " . print_r($stmt->errorInfo(), true));
                throw new Exception("Ошибка выполнения запроса"); 
            }
            $values[$key] = $stmt->fetchColumn();
        } catch (Exception $e) {
            error_log("Ошибка при выполнении запроса для ключа " . $key . ": " . $e->getMessage());
            $values[$key] = null;
        }
    }
    $sql = "SELECT lang.namelang
            FROM personlang pl
            JOIN person_LOGIN l ON pl.pers_id = l.id
            JOIN languages lang ON pl.lang_id = lang.id
            WHERE l.login = :login";
    try {
        $stmt = $db->prepare($sql);
        $stmt->bindValue(':login', $login, PDO::PARAM_STR);
        $stmt->execute();
        $lang = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
        $values['languages'] = implode(",", $lang);
    } catch (PDOException $e) {
        error_log("Ошибка при получении языков: " . $e->getMessage());
        $values['languages'] = null; 
    }

    return $values;
}

function updateDB($login, $db)
{
  try {
  $dop=$db->prepare("SELECT id from person_LOGIN where login=:login");
  $dop->bindParam(':login', $login);
  $dop->execute();
  $stmt = $db->prepare("UPDATE person set fio=:fio, tel=:tel, email=:email, bdate=:bdate, gender=:gender, biography=:biography where id=:id");
  $stmt->bindParam(':fio', $_POST['fio']);
  $stmt->bindParam(':id', $dop->fetchColumn());
  $stmt->bindParam(':tel', $tel);
  $stmt->bindParam(':email', $email);
  $stmt->bindParam(':bdate', $bdate);
  $stmt->bindParam(':gender', $gender);
  $stmt->bindParam(':biography', $biography);
  $tel = ($_POST['field-tel']);
  $email = ($_POST['field-email']);
  $bdate = ($_POST['field-date']);
  $gender = ($_POST['radio-group-1']);
  $biography = ($_POST['bio']);
  $stmt->execute();
  $lastInsertId = $db->prepare("SELECT id from person_LOGIN where login=:login");
  $lastInsertId->bindParam(':login', $login);
  $lastInsertId->execute();
  $pers_id=$lastInsertId->fetchColumn();
  $erasure=$db->prepare("DELETE from personlang where pers_id=:pers_id");
  $erasure->bindParam(':pers_id', $pers_id, PDO::PARAM_INT);
  $erasure->execute();
  foreach($_POST['languages'] as $lang) {
    $stmt = $db->prepare("SELECT id FROM languages WHERE namelang = :namelang");
    $stmt->bindParam(':namelang', $lang);
    $stmt->execute();
    $lang_id=$stmt->fetchColumn();
    $stmt = $db->prepare("INSERT INTO personlang (pers_id, lang_id) VALUES (:pers_id, :lang_id)");
    $stmt->bindParam(':pers_id', $pers_id);
    $stmt->bindParam(':lang_id', $lang_id);
    $stmt->execute();
  }
}
catch(PDOException $e){
  error_log('Database error: ' . $e->getMessage());
  header('Location: error.php');
  exit();
}
}
function insertDB($db, $login, $hash_pass)
{
  $stmt = $db->prepare("INSERT INTO person (fio, tel, email, bdate, gender, biography) VALUES (:fio, :tel, :email, :bdate, :gender, :biography)");
  $stmt->bindParam(':fio', $fio);
  $stmt->bindParam(':tel', $tel);
  $stmt->bindParam(':email', $email);
  $stmt->bindParam(':bdate', $bdate);
  $stmt->bindParam(':gender', $gender);
  $stmt->bindParam(':biography', $biography);
  $fio = ($_POST['fio']);
  $tel = ($_POST['field-tel']);
  $email = ($_POST['field-email']);
  $bdate = ($_POST['field-date']);
  $gender = ($_POST['radio-group-1']);
  $biography = ($_POST['bio']);
  $stmt->execute();
  $lastInsertId = $db->lastInsertId();
  foreach($_POST['languages'] as $lang) {
    $stmt = $db->prepare("SELECT id FROM languages WHERE namelang = :namelang");
    $stmt->bindParam(':namelang', $lang);
    $stmt->execute();
    $lang_id=$stmt->fetchColumn();
    $stmt = $db->prepare("INSERT INTO personlang (pers_id, lang_id) VALUES (:pers_id, :lang_id)");
    $stmt->bindParam(':pers_id', $lastInsertId);
    $stmt->bindParam(':lang_id', $lang_id);
    $stmt->execute();
  }
  $stmt = $db->prepare("INSERT INTO LOGIN (login, pass) VALUES (:login, :pass)");
  $stmt->bindParam(':login', $login);
  $stmt->bindParam(':pass', $hash_pass);
  $stmt->execute();
  $stmt = $db->prepare("INSERT INTO person_LOGIN (id, login) VALUES (:id, :login)");
  $stmt->bindParam(':id', $lastInsertId);
  $stmt->bindParam(':login', $login);
  $stmt->execute();
}

function adminlog($db)
{
    $query = "SELECT login FROM LOGIN where role='ADMIN'"; // Запрос с параметром

    $stmt = $db->prepare($query); // Подготавливаем запрос
    $stmt->execute();// Выполняем запрос с параметром
    $adminlogin = $stmt->fetchColumn();
    return $adminlogin;
}


//CSRF
function generateCsrfToken() {
  if (function_exists('random_bytes')) {
    $token = bin2hex(random_bytes(32));
  } else {
    $token = md5(uniqid(rand(), true)); 
  }
  $_SESSION['csrf_token'] = $token;
  $_SESSION['csrf_token_time'] = time();
  return $token;
}

function validateCsrfToken() {
  if (empty($_POST['csrf_token'])) {
    return false; 
  }

  if (empty($_SESSION['csrf_token'])) {
    return false; 
  }

  if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    return false; 
  }

  $token_age = time() - $_SESSION['csrf_token_time'];
  if ($token_age > 3600) {
    return false; 
  }

  unset($_SESSION['csrf_token']); 
  unset($_SESSION['csrf_token_time']);

  return true;
}

?>
