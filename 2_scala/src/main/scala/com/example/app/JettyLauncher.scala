package com.example.app

import org.eclipse.jetty.server.Server
import org.eclipse.jetty.ee10.servlet.{ServletContextHandler, ServletHolder}

object JettyLauncher {
  def main(args: Array[String]): Unit = {
    val server = new Server(8080)

    val context = new ServletContextHandler()
    context.setContextPath("/")

    context.addServlet(
      new ServletHolder(
        new ShopServlet(
          new ProductStorage(),
          new BasketStorage(),
          new CategoryStorage(),
          new JunctionStorage()
        )
      ),
      "/*"
    )

    server.setHandler(context)

    server.start()
    server.join()
  }
}
