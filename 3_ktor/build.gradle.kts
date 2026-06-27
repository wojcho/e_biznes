import org.gradle.api.JavaVersion

plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktor)
    kotlin("plugin.serialization") version "2.0.21"
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
    implementation(libs.ktor.server.content.negotiation)
    implementation(libs.ktor.serialization.kotlinx.json)
    implementation("dev.kord:kord-core:${kordVersion}")
    implementation("com.slack.api:bolt:${boltVersion}")
    implementation("com.slack.api:bolt-socket-mode:${boltVersion}")
    implementation("org.glassfish.tyrus.bundles:tyrus-standalone-client:${wsVersion}")
    testImplementation(libs.ktor.server.test.host)
    testImplementation(libs.kotlin.test.junit)
}

ktor {
    docker {
        jreVersion.set(JavaVersion.VERSION_25)
        localImageName.set("ktor-sample")
        imageTag.set("latest")

        environmentVariable("DISCORD_TOKEN", "")
        environmentVariable("DISCORD_CHANNEL_ID", "")
        environmentVariable("SLACK_BOT_TOKEN", "")
        environmentVariable("SLACK_SIGNING_SECRET", "")
        environmentVariable("SLACK_APP_TOKEN", "")
        environmentVariable("SLACK_CHANNEL_ID", "")
    }
}
