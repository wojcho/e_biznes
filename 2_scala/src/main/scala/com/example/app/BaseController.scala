package com.example.app

trait CrudController[T] {
  def findAll(): ControllerResult[_]
  def find(id: Int): ControllerResult[_]
  def add(entity: T): ControllerResult[_]
  def update(id: Int, entity: T): ControllerResult[_]
  def delete(id: Int): ControllerResult[_]
}

trait BaseController[Entity] {

  // Helper to wrap optional entity result
  protected def wrapOption(result: Option[Entity], notFoundMessage: String): ControllerResult[Entity] =
    result match {
      case Some(e) => Success(e)
      case None    => Failure(notFoundMessage, 404)
    }

  // Helper to wrap row count result where 1 or more is valid
  protected def wrapChangedAmount(rows: Int, errorMessage: String): ControllerResult[Map[String, Int]] =
    if (rows >= 1) Success(Map("changedRowsAmount" -> rows))
    else Failure(errorMessage, 400)

  // Helper for row count where 0 is valid
  protected def wrapChangedAmountAllowZero(rows: Int, errorMessage: String): ControllerResult[Map[String, Int]] =
    if (rows >= 0) Success(Map("changedRowsAmount" -> rows))
    else Failure(errorMessage, 400)

  // Helper for boolean results
  protected def wrapBool(result: Boolean): ControllerResult[Boolean] =
    Success(result)

  // Helper for list results
  protected def wrapList[T](result: List[T]): ControllerResult[List[T]] =
    Success(result)
}
