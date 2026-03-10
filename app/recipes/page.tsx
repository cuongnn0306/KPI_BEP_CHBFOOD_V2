"use client";

import { NumericKeypadInput } from "@/components/NumericKeypadInput";
import { useEffect, useState } from "react";

type Dish = { id: number; name: string };
type Ingredient = { id: number; name: string; unit: string };

type RecipeRow = {
  dish_id: number;
  ingredient_id: number;
  quantity_per_dish: number;
  dish_name: string;
  ingredient_name: string;
  unit: string;
};

export default function RecipesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipe, setRecipe] = useState<RecipeRow[]>([]);
  const [dishId, setDishId] = useState<number>(0);
  const [ingredientId, setIngredientId] = useState<number>(0);
  const [quantity, setQuantity] = useState(0);
  const [newIngredient, setNewIngredient] = useState("");
  const [newUnit, setNewUnit] = useState("g");
  const [conversionFactor, setConversionFactor] = useState(1);
  const [conversionUnit, setConversionUnit] = useState("");

  const load = async () => {
    const [dishRes, ingredientRes, recipeRes] = await Promise.all([
      fetch("/api/dishes").then((r) => r.json()),
      fetch("/api/ingredients").then((r) => r.json()),
      fetch("/api/recipes").then((r) => r.json())
    ]);
    setDishes(dishRes);
    setIngredients(ingredientRes);
    setRecipe(recipeRes);
  };

  useEffect(() => {
    load();
  }, []);

  const addIngredient = async () => {
    await fetch("/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newIngredient,
        unit: newUnit,
        conversion_factor: conversionFactor,
        conversion_unit: conversionUnit || null
      })
    });
    setNewIngredient("");
    setConversionFactor(1);
    setConversionUnit("");
    load();
  };

  const addRecipe = async () => {
    if (!dishId || !ingredientId) return;
    await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dish_id: dishId, ingredient_id: ingredientId, quantity_per_dish: quantity })
    });
    setQuantity(0);
    load();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Recipe Editor</h2>

      <div className="rounded-xl bg-white p-3 shadow space-y-2">
        <h3 className="font-semibold">+ Add Ingredient</h3>
        <input className="w-full border p-3" value={newIngredient} onChange={(e) => setNewIngredient(e.target.value)} placeholder="Ingredient name" />
        <div className="grid grid-cols-3 gap-2">
          <input className="border p-3" value={newUnit} onChange={(e) => setNewUnit(e.target.value)} placeholder="Base unit" />
          <NumericKeypadInput value={conversionFactor} onChange={setConversionFactor} placeholder="Conversion factor" />
          <input className="border p-3" value={conversionUnit} onChange={(e) => setConversionUnit(e.target.value)} placeholder="Prep unit" />
        </div>
        <button className="w-full bg-brand p-3 font-semibold text-white" onClick={addIngredient}>Save Ingredient</button>
      </div>

      <div className="rounded-xl bg-white p-3 shadow space-y-2">
        <h3 className="font-semibold">Recipe Builder</h3>
        <select className="w-full border p-3" value={dishId} onChange={(e) => setDishId(Number(e.target.value))}>
          <option value={0}>Choose dish</option>
          {dishes.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className="w-full border p-3" value={ingredientId} onChange={(e) => setIngredientId(Number(e.target.value))}>
          <option value={0}>Choose ingredient</option>
          {ingredients.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <NumericKeypadInput value={quantity} onChange={setQuantity} placeholder="Quantity per dish" />
        <button className="w-full bg-brand p-3 font-semibold text-white" onClick={addRecipe}>Save Recipe Line</button>
      </div>

      <div className="rounded-xl bg-white p-3 shadow">
        <h3 className="mb-2 font-semibold">Current Recipes</h3>
        <div className="space-y-2 text-sm">
          {recipe.map((r, idx) => (
            <div key={idx} className="rounded-lg bg-slate-50 p-2">
              {r.dish_name}: {r.ingredient_name} {r.quantity_per_dish} {r.unit}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
