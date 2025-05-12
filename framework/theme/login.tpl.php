<!DOCTYPE html>
<html class="login" lang="ru">
<head>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="theme/js/slick.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="theme/style.css">
    <script src="theme/js/second-slider.js"></script>
    <link rel="icon" href="theme/img/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="theme/img/favicon.ico"  type="image/x-icon">
    <title>Project</title>
</head>
<body class="login">
    <div class="content container-fluid mt-sm-0">
      <div class="log">
        <form action="<?php echo url('login'); ?>" method="post">
          <label class="my-2">
            Логин: <br />
            <input name="login" />
          </label><br />
          <label class="my-2">
            Пароль:<br />
            <input name="pass" type="password" />
          </label><br />
          <input type="submit" value="Войти" />
          <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
        </form>
        <a href="<?php echo url('admin'); ?>">Вход для администратора</a>
      </div>
    </div>
    </body>
