/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("wallets", (table) => {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.text("description");
    table.date("created_at").nullable();
    table.date("updated_at").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists("wallets");
};
