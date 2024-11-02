/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("recurring_transactions", function (table) {
    table.increments("id").primary();
    table
      .integer("wallet_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("wallets");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .integer("category_id")
      .unsigned()
      .references("id")
      .inTable("categories");
    table.enu("tipo", ["income", "expense"]).notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table.string("title", 255).notNullable();
    table.text("description");
    table.date("start_date").notNullable();
    table
      .enu("recurrence_interval", ["daily", "weekly", "monthly", "custom"])
      .notNullable();
    table.integer("custom_interval_days").defaultTo(null);
    table.date("next_execution").notNullable();
    table.datetime("created_at").defaultTo(knex.fn.now());
    table.datetime("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists("recurring_transactions");
};
