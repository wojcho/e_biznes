package com.example.app

import org.scalatra._
import org.json4s._
import org.json4s.jackson.JsonMethods._
import org.json4s.jackson.Serialization.write

// https://scalatra.org/guides/2.7/formats/json.html

class ShopServlet(storage: ProductStorage) extends ScalatraServlet {

  // Boilerplate

  private val controller = new ShopController(storage)

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
        "error" -> "Internal server error", // Sometimes it is better to not expose that kind of information, but here it is done
        "message" -> e.getMessage
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
      case _: Exception =>
        Left(BadRequest(write(Map("error" -> "Invalid JSON body"))))
    }
  }

  private def parseId(): Either[ActionResult, Int] = {
    params.get("id").flatMap(_.toIntOption) match {
      case Some(id) => Right(id)
      case None     => Left(BadRequest(write(Map("error" -> "Non-integer product ID"))))
    }
  }

  // Handling of endpoints

  get("/products/") {
    handleResult(controller.getAllProducts())
  }

  get("/products/:id") {
    parseId() match {
      case Left(err) => err
      case Right(id) => handleResult(controller.getProduct(id))
    }
  }

  post("/products/") {
    parseJsonBody[Product] match {
      case Left(err)      => err
      case Right(product) => handleResult(controller.addProduct(product))
    }
  }

  put("/products/:id") {
    (parseId(), parseJsonBody[Product]) match {
      case (Left(err), _) => err
      case (_, Left(err)) => err
      case (Right(id), Right(product)) =>
        handleResult(controller.updateProduct(id, product))
    }
  }

  delete("/products/:id") {
    parseId() match {
      case Left(err) => err
      case Right(id) => handleResult(controller.deleteProduct(id))
    }
  }

}
