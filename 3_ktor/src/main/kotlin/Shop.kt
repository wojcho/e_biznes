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
