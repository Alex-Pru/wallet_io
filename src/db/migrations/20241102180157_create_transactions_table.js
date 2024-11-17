/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable("transactions", function (table) {
    table.increments("id").primary();
    table
      .integer("wallet_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("wallets")
      .onDelete("CASCADE");
    table
      .integer("credit_card_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("credit_cards");
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .integer("category_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("categories")
      .onDelete("SET NULL");
    table.enu("type", ["income", "expense"]).notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table.string("title", 255).notNullable();
    table.text("description");
    table.date("date").notNullable();
    table.integer("installments").defaultTo(1);
    table.integer("current_installment").defaultTo(1);
    table.datetime("created_at").defaultTo(knex.fn.now());
    table.datetime("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTableIfExists("transactions");
};
