# Recipe Social Frontend (Angular 18)

Frontend cho dự án **Recipe Social Network & Planner**. Backend Spring Boot nằm trong `../Recipe-Project/`.

## 1. Yêu cầu môi trường

- **Node.js** ≥ 20 LTS (kèm npm) — tải tại https://nodejs.org/
- **Angular CLI** (tuỳ chọn, có thể dùng `npx`)
  ```bash
  npm install -g @angular/cli@18
  ```

Kiểm tra:

```bash
node --version
npm --version
ng version
```

## 2. Cài dependencies

```bash
cd frontend
npm install
```

## 3. Chạy dev server

Backend Spring Boot phải chạy ở `http://localhost:8080`. Frontend dùng proxy (`proxy.conf.json`) để forward `/api/*` đến backend, tránh CORS khi dev.

```bash
npm start
```

Mở http://localhost:4200

## 4. Build production

```bash
npm run build
```

Output: `dist/recipe-social-frontend/`.

## 5. Cấu trúc thư mục

```
frontend/
├── angular.json              # cấu hình Angular CLI
├── package.json
├── proxy.conf.json           # proxy /api → http://localhost:8080
├── tsconfig*.json
├── src/
│   ├── environments/         # apiBaseUrl theo môi trường
│   ├── styles.scss           # token CSS toàn cục
│   ├── index.html
│   ├── main.ts
│   └── app/
│       ├── app.component.ts
│       ├── app.config.ts     # providers: router, http + interceptors
│       ├── app.routes.ts     # lazy-load các feature
│       ├── core/
│       │   ├── guards/       # authGuard
│       │   ├── interceptors/ # auth.interceptor, error.interceptor
│       │   ├── models/       # user, auth, recipe
│       │   └── services/     # TokenStorageService
│       ├── layout/
│       │   ├── navbar/
│       │   └── footer/
│       └── features/
│           ├── home/
│           ├── auth/         # login, register + AuthService
│           ├── recipes/      # list, detail, create + RecipeService
│           ├── favorites/
│           ├── comments/     # service-only (hiển thị nested sau)
│           ├── meal-planner/
│           ├── shopping-list/
│           └── cooking-mode/
```

## 6. Map endpoint backend

| Feature       | Backend route prefix             |
| ------------- | -------------------------------- |
| Auth          | `/api/v1/auth/*`                 |
| Recipes       | `/api/v1/recipes/*`              |
| Favorites     | `/api/v1/favorites/*`            |
| Comments      | `/api/v1/recipes/{id}/comments`  |
| Meal Plans    | `/api/v1/meal-plans/*`           |
| Shopping List | `/api/v1/shopping-lists/*`       |
| Categories    | `/api/v1/categories/*`           |
| Ingredients   | `/api/v1/ingredients/*`          |
| Tags          | `/api/v1/tags/*`                 |

Đổi `environment.apiBaseUrl` trong [src/environments/](src/environments/) nếu deploy tách domain.

