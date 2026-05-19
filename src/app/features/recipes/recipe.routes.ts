import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const RECIPE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./recipe-list/recipe-list.component').then((m) => m.RecipeListComponent),
    title: 'Công thức'
  },
  {
    path: 'new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./recipe-create/recipe-create.component').then((m) => m.RecipeCreateComponent),
    title: 'Tạo công thức'
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./recipe-detail/recipe-detail.component').then((m) => m.RecipeDetailComponent),
    title: 'Chi tiết công thức'
  }
];
