package com.example.app

class CategoriesController(storage: CategoryStorage, junctions: JunctionStorage) extends BaseController[Category] with CrudController[Category] {

  // Basic CRUD

  def findAll() = wrapList(storage.findAllCategories())

  def find(id: Int) = wrapOption(storage.findCategory(id), "Category not found")

  def add(category: Category) = wrapChangedAmount(storage.addCategory(category), "Could not add the category")

  def update(id: Int, category: Category) = wrapChangedAmount(storage.updateCategory(id, category), "Could not update the category")

  def delete(id: Int) = wrapChangedAmountAllowZero(storage.deleteCategory(id), "Could not delete category")

  // Junction-related
  def addCategoryToProduct(productId: Int, categoryId: Int) =
    wrapChangedAmount(junctions.addCategoryToProduct(productId, categoryId), "Could not add category to product")

  def findCategoriesOfProduct(productId: Int) =
    wrapList(junctions.findCategoriesOfProduct(productId))

  def deleteReferencesToCategory(categoryId: Int) =
    wrapChangedAmountAllowZero(junctions.deleteReferencesToCategory(categoryId), "Could not delete category references")

  def isProductInCategory(productId: Int, categoryId: Int) =
    wrapBool(junctions.isProductInCategory(productId, categoryId))
}
