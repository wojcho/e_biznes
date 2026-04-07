plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktor)
}

group = "com.example"
version = "0.0.1"
val kordVersion = "0.18.1"
val boltVersion = "1.48.0"
val wsVersion = "1.19"

application {
    mainClass = "io.ktor.server.netty.EngineMain"
}

kotlin {
    jvmToolchain(25)
}

repositories {
    mavenCentral()
    maven("https://snapshots.kord.dev")
}

dependencies {
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.netty)
    implementation(libs.logback.classic)
    implementation(libs.ktor.server.core)
    implementation(libs.ktor.server.config.yaml)
    implementation("dev.kord:kord-core:${kordVersion}")
    implementation("com.slack.api:bolt:${boltVersion}")
    implementation("com.slack.api:bolt-socket-mode:${boltVersion}")
    implementation("org.glassfish.tyrus.bundles:tyrus-standalone-client:${wsVersion}")
    testImplementation(libs.ktor.server.test.host)
    testImplementation(libs.kotlin.test.junit)
}
