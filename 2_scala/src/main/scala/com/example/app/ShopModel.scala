package com.example.app

import java.sql.{Connection, PreparedStatement, ResultSet, DriverManager}
import java.math.BigDecimal

case class Product(id: Int, name: String, description: String, pricePln: BigDecimal)

object Product { // Companion singleton object, Scala does not have static methods
  def fromResultSet(rs: ResultSet): Product = 
    Product(rs.getInt("id"), rs.getString("name"), rs.getString("description"), rs.getBigDecimal("price_pln"))
}

trait DbConnection {
  def withConnection[T](f: Connection => T, url: String = "jdbc:sqlite:shop.db"): T = {
    val conn = DriverManager.getConnection(url)
    try {
      conn.setAutoCommit(false)
      val result = f(conn)
      conn.commit()
      result
    } catch {
      case e: Exception =>
        conn.rollback()
        throw e
    } finally {
      conn.close()
    }
  }
}

trait SqlExecutor { self: DbConnection => // https://docs.scala-lang.org/tour/self-types.html
  def executeFind(sql: String, params: Any*): List[Product] = {
    withConnection({(conn: Connection) =>
      val pstmt = conn.prepareStatement(sql)
      for ((param: Any, i: Int) <- params.zipWithIndex) {
        pstmt.setObject(i + 1, param)
      }
      val rs = pstmt.executeQuery()
      val products = collection.mutable.ListBuffer.empty[Product]
      while (rs.next()) {
        products += Product.fromResultSet(rs)
      }
      products.toList
    })
  }
  
  def executeModify(sql: String, params: Any*): Int = {
    withConnection({(conn: Connection) =>
      val pstmt = conn.prepareStatement(sql)
      for ((param: Any, i: Int) <- params.zipWithIndex) {
        pstmt.setObject(i + 1, param)
      }
      pstmt.executeUpdate()
    })
  }
}

class ProductStorage extends DbConnection with SqlExecutor {
  
  {
    initializeProducts()
  }

  def initializeProducts(): Unit = {
    executeModify("""
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price_pln DECIMAL(10, 5)
      )
    """)
  }
  
  def findAllProducts(): List[Product] = {
    executeFind("SELECT * FROM products")
  }
  
  def findProduct(id: Int): Option[Product] = {
    val found = executeFind("SELECT * FROM products WHERE id = ?", id)
    if (found.length < 1) {
      Option.empty
    } else {
      Option(found.head)
    }
  }
  
  def updateProduct(id: Int, updated: Product): Int = {
    executeModify(
      "UPDATE products SET name = ?, description = ?, price_pln = ? id = ? WHERE id = ?",
      updated.name, updated.description, updated.pricePln, updated.id, id
    )
  }
  
  def deleteProduct(id: Int): Int = {
    executeModify("DELETE FROM products WHERE id = ?", id)
  }
  
  def addProduct(product: Product): Int = {
    executeModify(
      "INSERT INTO products (id, name, description, price_pln) VALUES (?, ?, ?, ?)",
      product.id, product.name, product.description, product.pricePln
    )
  }
}
