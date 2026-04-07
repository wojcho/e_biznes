package com.example

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import kotlinx.coroutines.*

import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.core.entity.Message
import dev.kord.gateway.PrivilegedIntent
import dev.kord.gateway.Intent

import com.slack.api.bolt.App
import com.slack.api.model.event.MessageEvent
import com.slack.api.bolt.socket_mode.SocketModeApp
import com.slack.api.Slack
import com.slack.api.webhook.WebhookResponse
import com.slack.api.methods.SlackApiException
import com.slack.api.methods.MethodsClient

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

suspend fun startKordResponder(kord: Kord) {
    kord.on<MessageCreateEvent> {
        if (message.author?.isBot != false) return@on
        if (message.content.trim().equals("categories")) {
            message.channel.createMessage(categories.contentToString())
        } else if (message.content.trimStart().startsWith("list")) {
            val categoryName = message.content.removePrefix("list").trim()
            if (categoryName.isEmpty()) {
                message.channel.createMessage("Category name was not ptovided after `list`.")
            } else {
                val catId = categoryIdOfName(categories, categoryName)
                if (catId == null) {
                    message.channel.createMessage("Category not found: \"$categoryName\"")
                } else {
                    val productsInCategory = productsOfCategory(products, catId)
                    message.channel.createMessage(productsInCategory.toString())
                }
            }
        }
    }

    CoroutineScope(Dispatchers.Default).launch { // Without it there could be trouble with 10 seconds of cancellation, here it should run in background coroutine
        kord.login {
            @OptIn(PrivilegedIntent::class)
            intents += Intent.MessageContent
        }
    }
}

fun createSlackApp(): App {
    val app = App()

    app.event(MessageEvent::class.java) { payload, ctx ->
        val event = payload.event
        val text = event.text ?: return@event ctx.ack()

        when {
            text.trim().equals("categories") -> {
                ctx.client().chatPostMessage { r ->
                    r.channel(event.channel).text(categories.contentToString())
                }
            }
            text.trimStart().startsWith("list") -> {
                val categoryName = text.removePrefix("list").trim()
                if (categoryName.isEmpty()) {
                    ctx.client().chatPostMessage { r ->
                        r.channel(event.channel).text("Category name was not provided after `list`.")
                    }
                } else {
                    val catId = categoryIdOfName(categories, categoryName)
                    if (catId == null) {
                        ctx.client().chatPostMessage { r ->
                            r.channel(event.channel).text("Category not found: \"$categoryName\"")
                        }
                    } else {
                        val productsInCategory = productsOfCategory(products, catId)
                        ctx.client().chatPostMessage { r ->
                            r.channel(event.channel).text(productsInCategory.toString())
                        }
                    }
                }
            }
        }
        ctx.ack()
    }

    return app
}

suspend fun Application.module() {
    val kordToken = System.getenv("DISCORD_TOKEN") ?: run {
        throw IllegalStateException();
    }
    val kord = Kord(kordToken)
    startKordResponder(kord)

    val slackBotToken = System.getenv("SLACK_BOT_TOKEN") ?: throw IllegalStateException("Missing token")
    val slackSigningSecret = System.getenv("SLACK_SIGNING_SECRET") ?: throw IllegalStateException("Missing signing secret")
    val slackAppToken = System.getenv("SLACK_APP_TOKEN")
    if (!slackAppToken.isNullOrBlank()) {
        val app = createSlackApp()
        app.config().singleTeamBotToken = slackBotToken
        app.config().signingSecret = slackSigningSecret
        val socketModeApp = SocketModeApp(slackAppToken, app)
        socketModeApp.startAsync()
    } else {
        throw IllegalStateException("Missing application token")
    }

    val slackClient = Slack.getInstance().methods(slackBotToken)

    configureRouting(kord, slackClient)
}
