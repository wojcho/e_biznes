val ScalatraVersion = "3.1.2"
val Json4sVersion   = "4.1.0"

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
    ),
  )

enablePlugins(SbtTwirl)
enablePlugins(SbtWar)

Test / fork := true
