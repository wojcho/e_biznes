package com.example

data class Product(
    val id: Int,
    val name: String,
    val price: Int,
    val categoryId: Int
)

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
  Product(1, "Zielona Herbata", 100, 3),
  Product(2, "Biała Herbata", 100, 3),
  Product(3, "Żółta Herbata", 100, 3),
  Product(4, "Czarna Herbata", 100, 3),
  Product(5, "Oolong", 100, 3),
  Product(6, "Earl Gray", 100, 3),
  Product(7, "Kawa Inka", 100, 2),
  Product(8, "Rooibos", 100, 2),
  Product(9, "Yerba Mate", 100, 2),
  Product(10, "Wywar z Mięty", 100, 2),
  Product(11, "Wywar z Pokrzywy", 100, 2),
  Product(12, "Wywar z Szałwi", 100, 2),
  Product(13, "Kurkuma", 100, 1),
  Product(14, "Szafran", 100, 1),
  Product(15, "Koper", 100, 1),
  Product(16, "Gorczyca", 100, 1),
  Product(17, "Wanilia", 100, 1),
  Product(18, "Imbir", 100, 1),
  Product(19, "Cynamon", 100, 1),
)

fun productsOfCategory(products: Array<Product>, categoryId: Int): List<Product> {
    return products.filter { it.categoryId == categoryId }
}

fun categoryIdOfName(categories: Array<Category>, name: String): Int? {
    return categories.firstOrNull { it.name == name }?.id
}
