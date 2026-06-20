# Сквозное тестирование [Rampus](https://rampus.ru) при помощи playwright

## О проекте
В этом репозитории находятся end-to-end (E2E) автотесты, написанные с использованием **Playwright + JavaScript** для веб-приложения социальной сети (форум, личные сообщения, система друзей).

## Что покрыто тестами
### Авторизация

* успешный вход пользователя
* сохранение сессии

## Технологии
* Playwright
* JavaScript
* dotenv
* Node.js

## Подход к авторизации в тестах
Для ускорения выполнения тестов используется сохранённое состояние авторизации (`storageState`), которое позволяет запускать тесты без повторного логина.

## Структура проекта
```
playwright-rampus
├─ package-lock.json
├─ package.json
├─ playwright
├─ playwright.config.js
├─ README.md
└─ tests
   └─ auth.setup.js
├─ .env
└─ playwright
   └─ .auth
```

## Запуск тестов
```
npx playwright test 
```
