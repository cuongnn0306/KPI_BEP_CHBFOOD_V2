create table if not exists ingredients (
  id serial primary key,
  name text not null unique,
  unit text not null,
  conversion_factor numeric not null default 1,
  conversion_unit text
);

create table if not exists dishes (
  id serial primary key,
  name text not null unique
);

create table if not exists recipe (
  dish_id int not null references dishes(id) on delete cascade,
  ingredient_id int not null references ingredients(id) on delete cascade,
  quantity_per_dish numeric not null,
  primary key(dish_id, ingredient_id)
);

create table if not exists inventory (
  ingredient_id int not null references ingredients(id) on delete cascade,
  quantity numeric not null,
  date date not null,
  primary key(ingredient_id, date)
);

create table if not exists kitchen_capacity (
  ingredient_id int primary key references ingredients(id) on delete cascade,
  batch_size numeric not null,
  batch_time_minutes numeric not null
);

create table if not exists forecast (
  dish_id int not null references dishes(id) on delete cascade,
  forecast_quantity numeric not null,
  date date not null,
  primary key(dish_id, date)
);
