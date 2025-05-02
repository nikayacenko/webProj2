<div class="content container-fluid mt-sm-0">
  <div class="log">
    <form action="<?php echo url('login'); ?>" method="post">
      <label>
        Логин:  <?php echo url('login'); ?><br />
        <input name="login" />
      </label><br />
      <label>
        Пароль:<br />
        <input name="pass" type="password" />
      </label><br />
      <input type="submit" value="Войти" />
      <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
    </form>
    <a href="<?php echo url('adm_page'); ?>">Вход для администратора</a>
  </div>
</div>
