/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("categories", function (table) {
    table
      .integer("wallet_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("wallets")
      .onDelete("CASCADE");
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.text("description");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists("categories");
};
