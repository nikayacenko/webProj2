<?php

// Обработчик запросов методом GET.
function admin_get($request, $db) {
  session_start();
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
  $data = [
    'results' => $results,
  ];
  return theme('admin', $data)
}

// Обработчик запросов методом POST.
function admin_post($request, $url_param_1) {
  // Санитизуем параметр в URL и удаляем строку в БД.
  $id = intval($url_param_1);
  
  // Пример возврата редиректа после обработки формы для реализации принципа Post-redirect-Get.
  return redirect('admin');
}
