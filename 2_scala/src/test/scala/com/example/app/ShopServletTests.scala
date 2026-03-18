package com.example.app

import org.scalatra.test.scalatest._

class ShopServletTests extends ScalatraFunSuite {

  addServlet(classOf[ShopServlet], "/*")

  // test("GET / on ShopServlet should return status 200") {
  //   get("/") {
  //     status should equal (200)
  //   }
  // }

}
