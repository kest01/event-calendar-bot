# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Проект

Event Calendar Mini App — Telegram Mini App: календарь событий сообщества.

- frontend: Vite + Vanilla JS (ES-модули), FullCalendar, стили через CSS-переменные `--tg-theme-*`
- backend: Node.js (ESM), Express, sqlite3 (callback API), node-telegram-bot-api
- Точка входа бэкенда: `backend/index.js`; БД: `backend/db.js`; миграции: `backend/migrations.js`
- Контроллеры: `backend/controller/{events,groups,participants}.js`

## Команды

- dev: `npm run dev` (frontend на vite + backend параллельно; vite проксирует `/api` на `localhost:3000`)
- сборка: `npm run build` (vite build + `build.js`, который копирует `backend` в `dist/backend`)
- тестов и линтера в проекте нет

## Соглашения

- Без сторонних UI-библиотек, без `<select>` (кнопки-чипы)
- Цвета только через CSS-переменные `--tg-theme-*`
- Все строки UI на русском, идентификаторы в коде на английском
- Типы события (`event_type`) хранятся русскими строками: "Тренировка", "Встреча", "Клубный старт", "Прочее"
- Новые колонки добавлять через миграцию и дублировать в `db.js` правкой CREATE TABLE. В `backend/migrations.js` хранятся только изменения, не выполненные в prod.
- Не добавлять `console.log` в горячих путях

## Окружение

- Переменные `.env` (не коммитится): `BOT_ENABLED`, `BOT_TOKEN`, `APP_URL`, `FRONTEND_ENABLED`, `LOCAL`, `PORT`
- БД: `data/db.sqlite` (папка `data` в .gitignore)
