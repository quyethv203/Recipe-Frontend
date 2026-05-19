import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Recipe Social — Trang chủ'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'recipes',
    loadChildren: () =>
      import('./features/recipes/recipe.routes').then((m) => m.RECIPE_ROUTES)
  },
  {
    path: 'favorites',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/favorites/favorites.component').then((m) => m.FavoritesComponent),
    title: 'Yêu thích'
  },
  {
    path: 'meal-planner',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/meal-planner/meal-planner.component').then((m) => m.MealPlannerComponent),
    title: 'Lịch nấu ăn'
  },
  {
    path: 'shopping-list',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/shopping-list/shopping-list.component').then((m) => m.ShoppingListComponent),
    title: 'Danh sách đi chợ'
  },
  {
    path: 'cooking/:recipeId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cooking-mode/cooking-mode.component').then((m) => m.CookingModeComponent),
    title: 'Cooking Mode'
  },
  { path: '**', redirectTo: '' }
];
