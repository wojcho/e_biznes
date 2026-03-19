package com.example.app

import org.scalatra._
import org.json4s._
import org.json4s.jackson.JsonMethods._
import org.json4s.jackson.Serialization.write

// https://scalatra.org/guides/2.7/formats/json.html

class ShopServlet(
  productStorage: ProductStorage,
  basketStorage: BasketStorage,
  categoryStorage: CategoryStorage,
  junctionStorage: JunctionStorage
) extends ScalatraServlet {

  // Boilerplate

  private val productsController = new ProductsController(productStorage, junctionStorage)
  private val basketController = new BasketsController(basketStorage, junctionStorage)
  private val categoryController = new CategoriesController(categoryStorage, junctionStorage)

  protected implicit lazy val jsonFormats: Formats = DefaultFormats.withBigDecimal

  before() {
    contentType = "application/json"
  }

  // Special cases

  notFound {
    NotFound(write(Map("error" -> "Endpoint not recognized")))
  }

  error {
    case e: Exception =>
      InternalServerError(write(Map(
        "error" -> e.getMessage // Sometimes it is better to not expose that kind of information, but here it is done
      )))
  }

  // Serialization/deserialization, write uses jsonFormats

  private def handleResult[T](result: ControllerResult[T]): ActionResult = result match {
    case Success(data) =>
      Ok(write(data.asInstanceOf[AnyRef]))

    case Failure(message, status) =>
      ActionResult(
        body = write(Map("error" -> message)),
        status = status,
        headers = Map(),
      )
  }

  private def parseJsonBody[T: Manifest]: Either[ActionResult, T] = {
    try {
      val json = parse(request.body)
      Right(json.extract[T])
    } catch {
      case e: Exception =>
        Left(BadRequest(write(Map("error" -> e.toString))))
    }
  }

  private def parseId(idName: String = "id"): Either[ActionResult, Int] = {
    params.get(idName).flatMap(_.toIntOption) match {
      case Some(id) => Right(id)
      case None     => Left(BadRequest(write(Map("error" -> "Non-integer product ID"))))
    }
  }

  private def parseTwoIds(name1: String, name2: String): Either[ActionResult, (Int, Int)] =
    (params.get(name1).flatMap(_.toIntOption), params.get(name2).flatMap(_.toIntOption)) match {
      case (Some(id1), Some(id2)) => Right((id1, id2))
      case _ => Left(BadRequest(write(Map("error" -> s"Non-integer $name1 or $name2"))))
    }

  // CRUD basic endpoints

  private def crudRoutes[T: Manifest](path: String, controller: CrudController[T]): Unit = {
    get(s"$path/")       { handleResult(controller.findAll()) }
    get(s"$path/:id")    { parseId() match { case Left(err) => err; case Right(id) => handleResult(controller.find(id)) } }
    post(s"$path/")      { parseJsonBody[T] match { case Left(err) => err; case Right(e) => handleResult(controller.add(e)) } }
    put(s"$path/:id")    { (parseId(), parseJsonBody[T]) match {
      case (Left(err), _) => err
      case (_, Left(err)) => err
      case (Right(id), Right(e)) => handleResult(controller.update(id, e))
    }}
    delete(s"$path/:id") { parseId() match { case Left(err) => err; case Right(id) => handleResult(controller.delete(id)) } }
  }

  crudRoutes("/products", productsController)
  crudRoutes("/baskets", basketController)
  crudRoutes("/categories", categoryController)

  // Junction-related /composite endpoints

  post("/baskets/:basketId/products/:productId") {
    parseTwoIds("basketId", "productId") match {
      case Left(err) => err
      case Right((bId, pId)) => handleResult(basketController.addProductToBasket(bId, pId))
    }
  }

  get("/baskets/:basketId/products") {
    parseId("basketId") match {
      case Left(err) => err
      case Right(basketId) => handleResult(basketController.findProductIdsInBasket(basketId))
    }
  }

  get("/baskets/:basketId/products/:productId/exist") {
    parseTwoIds("basketId", "productId") match {
      case Left(err) => err
      case Right((bId, pId)) => handleResult(basketController.isProductInBasket(pId, bId))
    }
  }

  delete("/baskets/:basketId/products") {
    parseId("basketId") match {
      case Left(err) => err
      case Right(basketId) => handleResult(basketController.deleteReferencesToBasket(basketId))
    }
  }

  post("/baskets/:basketId/checkout") {
    parseId("basketId") match {
      case Left(err) => err
      case Right(basketId) => handleResult(basketController.checkoutBasket(basketId))
    }
  }

  post("/products/:productId/categories/:categoryId") {
    parseTwoIds("productId", "categoryId") match {
      case Left(err) => err
      case Right((pId, cId)) => handleResult(categoryController.addCategoryToProduct(pId, cId))
    }
  }

  get("/products/:productId/categories") {
    parseId("productId") match {
      case Left(err) => err
      case Right(productId) => handleResult(categoryController.findCategoriesOfProduct(productId))
    }
  }

  get("/products/:productId/categories/:categoryId/exist") {
    parseTwoIds("productId", "categoryId") match {
      case Left(err) => err
      case Right((pId, cId)) => handleResult(categoryController.isProductInCategory(pId, cId))
    }
  }

  delete("/categories/:categoryId/products") {
    parseId("categoryId") match {
      case Left(err) => err
      case Right(categoryId) => handleResult(categoryController.deleteReferencesToCategory(categoryId))
    }
  }

}
