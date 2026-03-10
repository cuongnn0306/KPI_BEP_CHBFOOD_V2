insert into ingredients(name, unit, conversion_factor, conversion_unit) values
('Tofu', 'piece', 8, 'block'),
('Beef', 'g', 1000, 'kg'),
('Broth', 'ml', 1000, 'l')
on conflict (name) do nothing;

insert into dishes(name) values ('Bun Rieu Full Topping') on conflict (name) do nothing;

insert into recipe(dish_id, ingredient_id, quantity_per_dish)
select d.id, i.id, x.qty
from (values ('Tofu', 5::numeric), ('Beef', 35::numeric)) x(name, qty)
join ingredients i on i.name = x.name
join dishes d on d.name = 'Bun Rieu Full Topping'
on conflict (dish_id, ingredient_id) do update set quantity_per_dish = excluded.quantity_per_dish;

insert into kitchen_capacity(ingredient_id, batch_size, batch_time_minutes)
select id,
  case when name = 'Tofu' then 25 when name = 'Beef' then 2 else 20 end,
  case when name = 'Tofu' then 12 when name = 'Beef' then 10 else 15 end
from ingredients
on conflict (ingredient_id) do update set
batch_size = excluded.batch_size,
batch_time_minutes = excluded.batch_time_minutes;

insert into inventory(ingredient_id, quantity, date)
select id,
  case when name = 'Tofu' then 0 when name = 'Beef' then 0 else 0 end,
  current_date
from ingredients
on conflict (ingredient_id, date) do nothing;

insert into forecast(dish_id, forecast_quantity, date)
select id, 300, current_date + interval '1 day'
from dishes where name = 'Bun Rieu Full Topping'
on conflict (dish_id, date) do update set forecast_quantity = excluded.forecast_quantity;
