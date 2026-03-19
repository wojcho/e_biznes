package com.example.app

class BasketsController(storage: BasketStorage, junctions: JunctionStorage) extends BaseController[Basket] with CrudController[Basket] {

  // Basic CRUD

  def findAll() = wrapList(storage.findAllBaskets())

  def find(id: Int) = wrapOption(storage.findBasket(id), "Basket not found")

  def add(basket: Basket) = wrapChangedAmount(storage.addBasket(basket), "Could not add the basket")

  def update(id: Int, basket: Basket) = wrapChangedAmount(storage.updateBasket(id, basket), "Could not update the basket")

  def delete(id: Int) = wrapChangedAmountAllowZero(storage.deleteBasket(id), "Could not delete basket")

  // Junction-related
  def addProductToBasket(basketId: Int, productId: Int) =
    wrapChangedAmount(junctions.addProductToBasket(basketId, productId), "Could not add product to basket")

  def findProductIdsInBasket(basketId: Int) =
    wrapList(junctions.findProductIdsInBasket(basketId))

  def deleteReferencesToBasket(basketId: Int) =
    wrapChangedAmountAllowZero(junctions.deleteReferencesToBasket(basketId), "Could not delete basket references")

  def isProductInBasket(productId: Int, basketId: Int) =
    wrapBool(junctions.isProductInBasket(productId, basketId))

  def checkoutBasket(basketId: Int) =
    wrapChangedAmountAllowZero(junctions.checkoutBasket(basketId), "Checkout failed")
}
