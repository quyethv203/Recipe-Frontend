export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface Category {
  id: number;
  name: string;
  slug?: string;
}

export interface RecipeIngredient {
  ingredientId?: number;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  timerSeconds?: number;
  imageUrl?: string;
}

export interface RecipeSummary {
  id: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: Difficulty;
  category?: Category;
  authorUsername?: string;
  averageRating?: number;
  favoriteCount?: number;
  createdAt?: string;
}

export interface RecipeDetail extends RecipeSummary {
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

export interface RecipeCreateRequest {
  title: string;
  description?: string;
  categoryId?: number;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: Difficulty;
  thumbnailUrl?: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}
