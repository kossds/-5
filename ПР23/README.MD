# Документация API: Аутентификация и авторизация

## Оглавление
- [Установка и запуск](#установка-и-запуск)
- [API Endpoints](#api-endpoints)
- [Примеры запросов](#примеры-запросов)
- [Тестирование](#тестирование)

---

## Установка и запуск

### Установите зависимости:
```bash
npm install
```

### Запустите сервер:
```bash
npm run dev
```

**Сервер будет доступен по адресу:** `http://localhost:3000`

---

##  API Endpoints

### 1. Регистрация
**URL:** `POST /api/auth/register`

**Тело запроса:**
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

**Успешный ответ:**
```json
{
  "message": "Пользователь успешно зарегистрирован",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "role": "user"
  }
}
```

---

### 2. Логин
**URL:** `POST /api/auth/login`

**Тело запроса:**
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

**Успешный ответ:**
```json
{
  "message": "Успешный вход",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Профиль (требует токен)
**URL:** `GET /api/profile`

**Заголовки:**
```
Authorization: Bearer <ваш_токен>
```

**Успешный ответ:**
```json
{
  "message": "Доступ к профилю разрешён",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "role": "user"
  }
}
```

---

### 4. Админка (только для администраторов)
**URL:** `GET /api/admin`

**Заголовки:**
```
Authorization: Bearer <ваш_токен>
```

**Успешный ответ:**
```json
{
  "message": "Доступ к админке разрешён"
}
```

---

##  Примеры запросов

### cURL

**Регистрация:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

**Логин:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

**Доступ к профилю:**
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer <ваш_токен>"
```

**Доступ к админке:**
```bash
curl -X GET http://localhost:3000/api/admin \
  -H "Authorization: Bearer <ваш_токен>"
```

---

### PowerShell

**Регистрация:**
```powershell
$body = @{ email = "test@example.com"; password = "123456" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/api/auth/register -Method Post -Body $body -ContentType "application/json"
```

**Логин:**
```powershell
$body = @{ email = "test@example.com"; password = "123456" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method Post -Body $body -ContentType "application/json"
$token = $response.token
```

**Доступ к профилю:**
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri http://localhost:3000/api/profile -Method Get -Headers $headers
```

**Доступ к админке:**
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri http://localhost:3000/api/admin -Method Get -Headers $headers
```

---

## Тестирование

### Последовательность действий для тестирования:

1. **Запустите сервер:**
   ```b
   npm run dev
   ```

2. **Выполните регистрацию пользователя**

3. **Войдите в систему и получите токен**

4. **Используйте токен для доступа к защищённым маршрутам**

---

> **Примечание:** Для доступа к админ-панели пользователь должен иметь роль `admin`. Обычные пользователи с ролью `user` получат ошибку доступа.