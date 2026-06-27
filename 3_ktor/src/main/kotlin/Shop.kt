package com.example

import kotlinx.serialization.Serializable

@Serializable
data class Product(
    val id: Int,
    val name: String,
    val price: Int,
    val categoryId: Int
)

@Serializable
data class Category(
    val id: Int,
    val name: String,
)

val categories = arrayOf(
  Category(1, "Przyprawy"),
  Category(2, "Napary"),
  Category(3, "Herbaty")
)

val products = arrayOf(
  Product(1, "Zielona Herbata", 65, 3),
  Product(2, "Biała Herbata", 140, 3),
  Product(3, "Żółta Herbata", 180, 3),
  Product(4, "Czarna Herbata", 45, 3),
  Product(5, "Oolong", 160, 3),
  Product(6, "Earl Grey", 55, 3),

  Product(7, "Kawa Inka", 85, 2),
  Product(8, "Rooibos", 95, 2),
  Product(9, "Yerba Mate", 75, 2),
  Product(10, "Wywar z Mięty", 35, 2),
  Product(11, "Wywar z Pokrzywy", 30, 2),
  Product(12, "Wywar z Szałwi", 45, 2),

  Product(13, "Kurkuma", 55, 1),
  Product(14, "Szafran", 12000, 1),
  Product(15, "Koper", 25, 1),
  Product(16, "Gorczyca", 18, 1),
  Product(17, "Wanilia", 1500, 1),
  Product(18, "Imbir", 60, 1),
  Product(19, "Cynamon", 70, 1),
)

fun productsOfCategory(products: Array<Product>, categoryId: Int): List<Product> {
    return products.filter { it.categoryId == categoryId }
}

fun categoryIdOfName(categories: Array<Category>, name: String): Int? {
    return categories.firstOrNull { it.name == name }?.id
}
