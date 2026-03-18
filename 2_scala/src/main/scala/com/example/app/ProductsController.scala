package com.example.app

// Almost entirely no-op controller

class ShopController(storage: ProductStorage) {

  def getAllProducts(): ControllerResult[List[Product]] =
    Success(storage.findAllProducts())

  def getProduct(id: Int): ControllerResult[Product] =
    storage.findProduct(id) match {
      case Some(product) => Success(product)
      case None          => Failure("Product not found", 404)
    }

  def addProduct(product: Product): ControllerResult[Map[String, Int]] = {
    val rows = storage.addProduct(product)
    if (rows >= 1)
      Success(Map("changedRowsAmount" -> rows))
    else
      Failure("Could not add the product", 500)
  }

  def updateProduct(id: Int, product: Product): ControllerResult[Map[String, Int]] = {
    val rows = storage.updateProduct(id, product)
    if (rows >= 1)
      Success(Map("changedRowsAmount" -> rows))
    else
      Failure("Could not update the product", 500)
  }

  def deleteProduct(id: Int): ControllerResult[Map[String, Int]] = {
    val rows = storage.deleteProduct(id)
    if (rows >= 1)
      Success(Map("changedRowsAmount" -> rows))
    else
      Failure("Could not delete product", 500)
  }
}
