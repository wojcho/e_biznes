val ScalatraVersion = "3.1.2"
val Json4sVersion   = "4.1.0"
val JettyVersion    = "12.0.20"

ThisBuild / scalaVersion := "3.3.3"
ThisBuild / organization := "com.example"

lazy val hello = (project in file("."))
  .settings(
    name := "CRUD Shop",
    version := "0.1.0-SNAPSHOT",
    libraryDependencies ++= Seq(
      "org.scalatra" %% "scalatra-jakarta" % ScalatraVersion,
      "org.scalatra" %% "scalatra-scalatest-jakarta" % ScalatraVersion % "test",
      "ch.qos.logback" % "logback-classic" % "1.5.19" % "runtime",
      "org.xerial" % "sqlite-jdbc" % "3.51.3.0", // SQLite https://mvnrepository.com/artifact/org.xerial/sqlite-jdbc
      "io.github.json4s"  %% "json4s-jackson" % "4.1.0",     // JSON https://mvnrepository.com/artifact/org.json4s/json4s-jackson
      "org.eclipse.jetty.ee10" % "jetty-ee10-servlet" % JettyVersion,
      "org.eclipse.jetty" % "jetty-server" % JettyVersion,
    ),
    Compile / mainClass := Some("com.example.app.JettyLauncher"),
  )

// enablePlugins(SbtTwirl)
// enablePlugins(SbtWar)

Test / fork := true

// Discard information about JPMS, instead of attempting to merge with module-info.class provided by libraries
assembly / assemblyMergeStrategy := {
  case "module-info.class" => MergeStrategy.discard
  case PathList("META-INF", "versions", "9", "module-info.class") => MergeStrategy.discard
  case PathList("META-INF", xs @ _*) =>
    xs.map(_.toLowerCase) match {
      case ("manifest.mf" :: Nil) => MergeStrategy.discard
      case _ => MergeStrategy.first
    }
  case _ => MergeStrategy.first
}
