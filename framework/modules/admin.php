<?php

// Обработчик запросов методом GET.
require_once './scripts/db.php';
global $db;
function admin_get($request, $db) {
  $adminlogin=adminlog($db);
  if (empty($_SERVER['PHP_AUTH_USER']) || empty($_SERVER['PHP_AUTH_PW']) || $_SERVER['PHP_AUTH_USER'] !=  $adminlogin || !password_check($adminlogin, $_SERVER['PHP_AUTH_PW'], $db)) 
  {
      header('HTTP/1.1 401 Unanthorized');
      header('WWW-Authenticate: Basic realm="My site"');
      print('<h1>401 Требуется авторизация</h1>');
      exit();
  }
  $query = "SELECT id, fio, tel, email, bdate, gender, biography FROM person"; 

  $stmt = $db->prepare($query); 
  $stmt->execute();
  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $query_languages = "SELECT
                      pl.pers_id,
                      l.namelang
                  FROM
                      personlang pl
                  JOIN
                      languages l ON pl.lang_id = l.id";
  $stmt_languages = $db->prepare($query_languages);
  $stmt_languages->execute();
  $person_languages = $stmt_languages->fetchAll(PDO::FETCH_ASSOC);
  $languages_by_person = [];
  foreach ($person_languages as $row) {
      $person_id = $row['pers_id'];
      $language_name = $row['namelang'];
      if (!isset($languages_by_person[$person_id])) {
          $languages_by_person[$person_id] = [];
      }
      $languages_by_person[$person_id][] = $language_name; 
  }
  $stmt = $db->prepare("SELECT l.namelang, COUNT(pl.pers_id) AS cnt
  FROM personlang pl
  JOIN languages l ON pl.lang_id = l.id
  GROUP BY l.namelang");
  $stmt->execute();
  $stat = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $data = [
    'results' => $results,
    'languages_by_person'=>$languages_by_person,
    'stat'=>$stat
  ];
  return theme('admin', $data);
}

// Обработчик запросов методом POST.
function admin_post($request, $db) {
  $delete_id = intval($request['post']['delete_id']); // Преобразуем в целое число
  $adminlogin=adminlog($db);
  if (!empty($_SERVER['PHP_AUTH_USER']) && !empty($_SERVER['PHP_AUTH_PW']) && $_SERVER['PHP_AUTH_USER'] ==  $adminlogin && password_check($adminlogin, $_SERVER['PHP_AUTH_PW'], $db))
  {

  if ($delete_id === false) {
      echo "<p style='color: red;'>Недопустимый ID для удаления.</p>";
      exit;
  }
  $delete_query = "DELETE FROM person WHERE id = :id";
  $delete_querylang="DELETE FROM personlang WHERE pers_id=:id";
  $delete_querylogin="DELETE FROM person_LOGIN WHERE id=:id";
  $addition_query="SELECT login FROM person_LOGIN WHERE id=:id";
  $delete_LOGIN="DELETE FROM LOGIN WHERE login=:login";
  try {
      $delete_stmt = $db->prepare($addition_query);
      $delete_stmt->bindParam(':id', $delete_id, PDO::PARAM_INT);
      $delete_stmt->execute();
      $doplog=$delete_stmt->fetchColumn();
      $delete_stmt = $db->prepare($delete_querylogin);
      $delete_stmt->bindParam(':id', $delete_id, PDO::PARAM_INT); 
      $delete_stmt->execute();
      $delete_stmt = $db->prepare($delete_LOGIN);
      $delete_stmt->bindParam(':login', $doplog, PDO::PARAM_STR); 
      $delete_stmt->execute();
      $delete_stmt = $db->prepare($delete_querylang);
      $delete_stmt->bindParam(':id', $delete_id, PDO::PARAM_INT); 
      $delete_stmt->execute();
      $delete_stmt = $db->prepare($delete_query);
      $delete_stmt->bindParam(':id', $delete_id, PDO::PARAM_INT);
      $delete_stmt->execute();
  
      return redirect('admin');
      } catch (PDOException $e) {
          error_log('Database error: ' . $e->getMessage());
      }
  }
}
