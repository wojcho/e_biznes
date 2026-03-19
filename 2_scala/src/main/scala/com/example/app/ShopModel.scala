package com.example.app

import java.sql.{Connection, PreparedStatement, ResultSet, DriverManager}
import java.math.BigDecimal

// Products

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
  def executeFind[T](sql: String, params: Any*)(onceToT: ResultSet => T): List[T] = {
    withConnection({(conn: Connection) =>
      val pstmt = conn.prepareStatement(sql)
      for ((param: Any, i: Int) <- params.zipWithIndex) {
        pstmt.setObject(i + 1, param)
      }
      val rs = pstmt.executeQuery()
      val products = collection.mutable.ListBuffer.empty[T]
      while (rs.next()) {
        products += onceToT(rs)
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
    executeFind[Product]("SELECT * FROM products")(Product.fromResultSet)
  }
  
  def findProduct(id: Int): Option[Product] = {
    val found = executeFind[Product]("SELECT * FROM products WHERE id = ?", id)(Product.fromResultSet)
    if (found.length < 1) {
      Option.empty
    } else {
      Option(found.head)
    }
  }
  
  def updateProduct(id: Int, updated: Product): Int = {
    executeModify(
      "UPDATE products SET name = ?, description = ?, price_pln = ?, id = ? WHERE id = ?",
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

// Categories

case class Category(id: Int, name: String, description: String)

object Category {
  def fromResultSet(rs: ResultSet): Category = 
    Category(rs.getInt("id"), rs.getString("name"), rs.getString("description"))
}

class CategoryStorage extends DbConnection with SqlExecutor {
  
  {
    initializeCategories()
  }

  def initializeCategories(): Unit = {
    executeModify("""CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL
      )""")
  }
  
  def findAllCategories(): List[Category] = {
    executeFind[Category]("SELECT * FROM categories")(Category.fromResultSet)
  }
  
  def findCategory(id: Int): Option[Category] = {
    val found = executeFind[Category]("SELECT * FROM categories WHERE id = ?", id)(Category.fromResultSet)
    if (found.length < 1) {
      Option.empty
    } else {
      Option(found.head)
    }
  }
  
  def updateCategory(id: Int, updated: Category): Int = {
    executeModify(
      "UPDATE categories SET name = ?, description = ?, id = ? WHERE id = ?",
      updated.name, updated.description, updated.id, id
    )
  }
  
  def deleteCategory(id: Int): Int = {
    executeModify("DELETE FROM categories WHERE id = ?", id)
  }
  
  def addCategory(product: Category): Int = {
    executeModify(
      "INSERT INTO categories (id, name, description) VALUES (?, ?, ?)",
      product.id, product.name, product.description
    )
  }
}

// Baskets

case class Basket(id: Int, name: String)

object Basket {
  def fromResultSet(rs: ResultSet): Basket = 
    Basket(rs.getInt("id"), rs.getString("name"))
}

class BasketStorage extends DbConnection with SqlExecutor {
  
  {
    initializeBaskets()
  }

  def initializeBaskets(): Unit = {
    executeModify("""CREATE TABLE IF NOT EXISTS baskets (
        id INTEGER PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL
      )""")
  }
  
  def findAllBaskets(): List[Basket] = {
    executeFind[Basket]("SELECT * FROM baskets")(Basket.fromResultSet)
  }
  
  def findBasket(id: Int): Option[Basket] = {
    val found = executeFind[Basket]("SELECT * FROM baskets WHERE id = ?", id)(Basket.fromResultSet)
    if (found.length < 1) {
      Option.empty
    } else {
      Option(found.head)
    }
  }
  
  def updateBasket(id: Int, updated: Basket): Int = {
    executeModify(
      "UPDATE baskets SET name = ?, id = ? WHERE id = ?",
      updated.name, updated.id, id
    )
  }
  
  def deleteBasket(id: Int): Int = {
    executeModify("DELETE FROM baskets WHERE id = ?", id)
  }
  
  def addBasket(product: Basket): Int = {
    executeModify(
      "INSERT INTO baskets (id, name) VALUES (?, ?)",
      product.id, product.name
    )
  }
}

// Junction Tables

case class BasketToProducts(basketId: Int, productIds: List[Int])

case class ProductToCategories(productId: Int, categoryIds: List[Int])

class JunctionStorage extends DbConnection with SqlExecutor {
  {
    initializeJunctionTables()
  }

  private def initializeJunctionTables(): Unit = {
    // In SQLite, foreign keys are not enabled by default, but they could be enabled to disallow removing objects which are already in some baskets, etc https://sqlite.org/foreignkeys.html
    executeModify("""CREATE TABLE IF NOT EXISTS basket_to_products (
        basket_id INTEGER,
        product_id INTEGER,
        PRIMARY KEY (basket_id, product_id),
        FOREIGN KEY (basket_id) REFERENCES baskets(id),
        FOREIGN KEY (product_id) REFERENCES products(id),
        UNIQUE (basket_id, product_id),
        UNIQUE (product_id)
      )""") // One-to-many, One product cannot be in many baskets at once, one basket can contain many products at once
    executeModify("""
      CREATE TABLE IF NOT EXISTS product_to_categories (
        product_id INTEGER,
        category_id INTEGER,
        PRIMARY KEY (product_id, category_id),
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (category_id) REFERENCES categories(id),
        UNIQUE (product_id, category_id)
      )""") // Many-to-many, One category can be on many products at once, One product can be in many categories at once
  }

  def addProductToBasket(basketId: Int, productId: Int): Int = {
    executeModify(
      "INSERT INTO basket_to_products (basket_id, product_id) VALUES (?, ?)",
      basketId,
      productId
    )
  }

  def addCategoryToProduct(productId: Int, categoryId: Int): Int = {
    executeModify(
      "INSERT INTO product_to_categories (product_id, category_id) VALUES (?, ?)",
      productId,
      categoryId
    )
  }

  def findProductIdsInBasket(basketId: Int): List[Int] = {
    executeFind[Int](
      "SELECT product_id FROM basket_to_products WHERE basket_id = ?",
      basketId
    )(rs => rs.getInt("product_id"))
  }

  def findCategoriesOfProduct(productId: Int): List[Int] = {
    executeFind[Int](
      "SELECT category_id FROM product_to_categories WHERE product_id = ?",
      productId
    )(rs => rs.getInt("category_id"))
  }

  def deleteReferencesToProduct(productId: Int): Int = {
    executeModify(
      "DELETE FROM basket_to_products WHERE product_id = ?",
      productId
    ) + executeModify(
      "DELETE FROM product_to_categories WHERE product_id = ?",
      productId
    )
  }

  def deleteReferencesToBasket(basketId: Int): Int = {
    executeModify(
      "DELETE FROM basket_to_products WHERE basket_id = ?",
      basketId
    )
  }

  def deleteReferencesToCategory(categoryId: Int): Int = {
    executeModify(
      "DELETE FROM product_to_categories WHERE category_id = ?",
      categoryId
    )
  }

  def isProductInCategory(productId: Int, categoryId: Int): Boolean = {
    executeFind[Boolean](
      "SELECT COUNT(*) FROM product_to_categories WHERE product_id = ? AND category_id = ?",
      productId, categoryId
    )(rs => rs.getInt(1) > 0)
      .headOption
      .getOrElse(false)
  }

  def isProductInBasket(productId: Int, basketId: Int): Boolean = {
    executeFind[Boolean](
      "SELECT COUNT(*) FROM basket_to_products WHERE product_id = ? AND basket_id = ?",
      productId, basketId
    )(rs => rs.getInt(1) > 0)
      .headOption
      .getOrElse(false)
  }

  def checkoutBasket(basketId: Int): Int = {
    withConnection { conn =>
      // Find all products which are in that basket
      val productIds = executeFind[Int](
        "SELECT product_id FROM basket_to_products WHERE basket_id = ?",
        basketId
      )(rs => rs.getInt("product_id"))
      // Delete these products from the basket_to_products junction table
      executeModify(
        "DELETE FROM basket_to_products WHERE basket_id = ?",
        basketId
      )
      // Delete the basket from the baskets table
      executeModify(
        "DELETE FROM baskets WHERE id = ?",
        basketId
      )
      // Delete the junction table entries relating to the product and basket
      for (productId <- productIds) {
        executeModify(
          "DELETE FROM product_to_categories WHERE product_id = ?",
          productId
        )
      }
      // Delete the products from the storage
      if (productIds.nonEmpty) {
        val placeholders = productIds.map(_ => "?").mkString(", ")
        executeModify(
          s"DELETE FROM products WHERE id IN ($placeholders)",
          productIds: _*
        )
      }
      productIds.length
    }
  }

}
