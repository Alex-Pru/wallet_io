/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("credit_cards", function (table) {
    table.increments("id").primary();
    table
      .integer("wallet_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("wallets")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("card_name", 255);
    table.decimal("limit_amount", 15, 2).notNullable();
    table.integer("billing_day").notNullable();
    table.integer("due_day").notNullable();
    table.datetime("created_at").defaultTo(knex.fn.now());
    table.datetime("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists("credit_cards");
};
