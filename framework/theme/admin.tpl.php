<div class="content container-fluid mt-sm-0" >
            <h3>Вы видите защищенные паролем данные</h3>
            <table>
            <tr class="nametb px-sm-2 pt-sm-2 pb-sm-2">
                <th>ID</th>
                <th>FIO</th>
                <th>Tel</th>
                <th>Email</th>
                <th>Bdate</th>
                <th>Gender</th>
                <th>Biography</th>
                <th>Languages</th>
                <th>Действия</th>
            </tr>

            <?php
            foreach ($results as $row): ?>
                <tr>
                <td><?= htmlspecialchars($row['id']) ?></td>
                <td><?= htmlspecialchars($row['fio']) ?></td>
                <td><?= htmlspecialchars($row['tel']) ?></td>
                <td><?= htmlspecialchars($row['email']) ?></td>
                <td><?= htmlspecialchars($row['bdate']) ?></td>
                <td><?= htmlspecialchars($row['gender']) ?></td>
                <td><?= htmlspecialchars($row['biography']) ?></td>
                <td>
                <?php
                    $person_id = $row['id'];
                    if (isset($languages_by_person[$person_id])) {
                        $languages_string = implode(', ', $languages_by_person[$person_id]);
                        echo htmlspecialchars($languages_string);
                    } else {
                        echo "Нет данных";
                    }
                    ?>
                    </td>
                    <td>
                    <form method="post" action="">
                    <input type="hidden" name="delete_id" value="<?= htmlspecialchars($row['id']) ?>">
                    <button type="submit">Удалить</button>
                    </form>
                    <a href="index.php?uid=<?= htmlspecialchars($row['id']) ?>">Изменить</a>
                </td>
                </tr>
        <?php endforeach; ?>
        </table>

        <?php
        try {
            echo "<table class='stat'><thead> <tr class='nametb px-sm-2 pt-sm-2 pb-sm-2'><td>LANGUAGE</td><td>COUNT</td></tr></thead> ";
            foreach($stat as $row){
                echo "<tr><td>" . htmlspecialchars($row['namelang'], ENT_QUOTES, 'UTF-8'). "</td><td>" . htmlspecialchars($row['cnt'], ENT_QUOTES, 'UTF-8') . "</td></tr>";
            }
            echo "</table>";
            echo"</div>";
        }
        catch (PDOException $e){
            error_log('Database error: ' . $e->getMessage());
            exit();
        }
    ?>