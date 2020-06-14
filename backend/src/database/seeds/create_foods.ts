import Knex from "knex"

export async function seed(knex: Knex) {
  await knex("foods").insert([
    { name: "Hamburguer", image: "cheeseburguer.svg" },
    { name: "Cupcake", image: "cupcake.svg" },
    { name: "Frango Frito", image: "fried-chicken.svg" },
    { name: "Batata Frita", image: "fries.svg" },
    { name: "Cachorro Quente", image: "hotdog.svg" },
    { name: "Pizza", image: "pizza.svg" },
  ])
}