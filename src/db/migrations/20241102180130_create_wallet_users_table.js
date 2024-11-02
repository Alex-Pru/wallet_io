/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("wallet_users", function (table) {
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
    table.enu("role", ["owner", "participant", "viewer"]).notNullable();
    table.datetime("added_at").defaultTo(knex.fn.now());
    table.primary(["wallet_id", "user_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists("wallet_users");
};
