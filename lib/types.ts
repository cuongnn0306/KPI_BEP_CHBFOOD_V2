export type Ingredient = {
  id: number;
  name: string;
  unit: string;
  conversion_factor: number;
  conversion_unit?: string | null;
};

export type Dish = { id: number; name: string };

export type RecipeLine = {
  dish_id: number;
  ingredient_id: number;
  quantity_per_dish: number;
};

export type KitchenCapacity = {
  ingredient_id: number;
  batch_size: number;
  batch_time_minutes: number;
};

export type ForecastLine = {
  dish_id: number;
  forecast_quantity: number;
  date: string;
};

export type InventoryLine = {
  ingredient_id: number;
  quantity: number;
  date: string;
};

export type KPITask = {
  ingredientId: number;
  ingredientName: string;
  prepareAmount: number;
  unit: string;
  batches: number;
  prepMinutes: number;
};

export type KPIResult = {
  tasks: KPITask[];
  totalMinutes: number;
  startTime: string;
  finishTime: string;
};
