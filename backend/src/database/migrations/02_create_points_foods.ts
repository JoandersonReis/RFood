import Knex from "knex"

export async function up(knex: Knex) {
  return knex.schema.createTable("points_foods", table => {
    table.increments("id").primary()

    table.integer("point_id").references("id").inTable("points").notNullable()
    table.integer("food_id").references("id").inTable("foods").notNullable()
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("points_foods")
}