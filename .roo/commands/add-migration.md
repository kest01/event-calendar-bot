---
description: Добавить колонку в БД через миграцию
argument-hint: <таблица> <колонка> <тип>
---

Добавь новую колонку в БД:

1. Добавь `ALTER TABLE ... ADD COLUMN ...` в `updateSchema()` в `backend/migrations.js`. Игнорируй ошибку `duplicate column name`, как это сделано для колонки `link`. Уже выполненные в prod миграции из файла удаляй.
2. Продублируй колонку в `CREATE TABLE` в `backend/db.js`.
3. Обнови контроллер в `backend/controller/` и, если нужно, фронтенд.
4. Не добавляй `console.log` в горячих путях.
