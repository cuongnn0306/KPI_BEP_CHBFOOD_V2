import { Dish, ForecastLine, Ingredient, InventoryLine, KitchenCapacity, KPIResult, RecipeLine } from "./types";

const toFixed = (value: number) => Number(value.toFixed(2));

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + Math.round(minutes);
  const hh = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export function calculateKPI(args: {
  ingredients: Ingredient[];
  dishes: Dish[];
  recipes: RecipeLine[];
  inventory: InventoryLine[];
  forecast: ForecastLine[];
  capacities: KitchenCapacity[];
  startTime: string;
}): KPIResult {
  const { ingredients, recipes, inventory, forecast, capacities, startTime } = args;
  const requiredByIngredient = new Map<number, number>();

  // Core logic: aggregate ingredient demand from forecast and recipe definitions.
  for (const fc of forecast) {
    const recipeLines = recipes.filter((r) => r.dish_id === fc.dish_id);
    for (const line of recipeLines) {
      const next = (requiredByIngredient.get(line.ingredient_id) ?? 0) + line.quantity_per_dish * fc.forecast_quantity;
      requiredByIngredient.set(line.ingredient_id, next);
    }
  }

  const tasks = ingredients
    .map((ingredient) => {
      const required = requiredByIngredient.get(ingredient.id) ?? 0;
      const onHand = inventory
        .filter((item) => item.ingredient_id === ingredient.id)
        .reduce((sum, item) => sum + item.quantity, 0);
      const netRaw = Math.max(0, required - onHand);
      const prepareAmount = ingredient.conversion_factor > 0 ? netRaw / ingredient.conversion_factor : netRaw;
      const cap = capacities.find((c) => c.ingredient_id === ingredient.id);
      const batches = cap ? prepareAmount / cap.batch_size : 0;
      const prepMinutes = cap ? batches * cap.batch_time_minutes : 0;

      return {
        ingredientId: ingredient.id,
        ingredientName: ingredient.name,
        prepareAmount: toFixed(prepareAmount),
        unit: ingredient.conversion_unit || ingredient.unit,
        batches: toFixed(batches),
        prepMinutes: toFixed(prepMinutes)
      };
    })
    .filter((task) => task.prepareAmount > 0);

  const totalMinutes = toFixed(tasks.reduce((sum, task) => sum + task.prepMinutes, 0));

  return {
    tasks,
    totalMinutes,
    startTime,
    finishTime: addMinutes(startTime, totalMinutes)
  };
}
