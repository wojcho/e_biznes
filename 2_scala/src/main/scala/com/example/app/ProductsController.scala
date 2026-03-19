package com.example.app

class ProductsController(storage: ProductStorage, junctions: JunctionStorage) extends BaseController[Product] with CrudController[Product] {

  // Basic CRUD

  def findAll() = wrapList(storage.findAllProducts())

  def find(id: Int) = wrapOption(storage.findProduct(id), "Product not found")

  def add(product: Product) = wrapChangedAmount(storage.addProduct(product), "Could not add the product")

  def update(id: Int, product: Product) = wrapChangedAmount(storage.updateProduct(id, product), "Could not update the product")

  def delete(id: Int) = wrapChangedAmountAllowZero(storage.deleteProduct(id), "Could not delete product")

  // Junction-related
  def deleteReferencesToProduct(id: Int) =
    wrapChangedAmountAllowZero(junctions.deleteReferencesToProduct(id), "Could not delete product references")
}
