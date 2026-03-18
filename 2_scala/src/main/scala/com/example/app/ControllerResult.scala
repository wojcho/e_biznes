package com.example.app

sealed trait ControllerResult[+T]

case class Success[T](data: T) extends ControllerResult[T]

case class Failure(message: String, status: Int = 400) extends ControllerResult[Nothing]
