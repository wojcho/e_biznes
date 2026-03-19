import com.example.app._
import org.scalatra._
import jakarta.servlet.ServletContext

class ScalatraBootstrap extends LifeCycle {
  override def init(context: ServletContext): Unit = {
    context.mount(new ShopServlet(new ProductStorage(), new BasketStorage(), new CategoryStorage(), new JunctionStorage()), "/*")
  }
}
