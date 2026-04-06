package com.example

import io.ktor.server.application.*

import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.core.entity.Message
import dev.kord.gateway.PrivilegedIntent
import dev.kord.gateway.Intent

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

suspend fun startKordResponder(kord: Kord) {
    kord.on<MessageCreateEvent> {
        if (message.author?.isBot != false) return@on
        if (message.content == "categories") {
            message.channel.createMessage(categories.contentToString())
        } else if (message.content.startsWith("list")) {
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

suspend fun Application.module() {
    val token = System.getenv("TOKEN") ?: run {
        throw IllegalStateException();
    }
    val kord = Kord(token)
    configureRouting(kord)
    startKordResponder(kord)
}
