package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.server.request.receiveParameters

import dev.kord.core.Kord
import dev.kord.core.entity.channel.TextChannel
import dev.kord.common.entity.Snowflake

fun Application.configureRouting(kord: Kord) {
    routing {
        post("/messages/") {
            val formContent = call.receiveParameters()

            val params = arrayOf(
                formContent["from"] ?: "",
                formContent["to"] ?: "",
                formContent["priority"] ?: "",
                formContent["content"] ?: ""
            )

            if (params.any { it.isEmpty() }) {
                call.respond(HttpStatusCode.BadRequest)
                return@post
            }

            val token = System.getenv("TOKEN") ?: run {
                call.respond(HttpStatusCode.InternalServerError)
                return@post
            }
            val channelIdString = System.getenv("CHANNEL_ID") ?: run {
                call.respond(HttpStatusCode.InternalServerError)
                return@post
            }
            val channelId = Snowflake(channelIdString)

            try {
                val priority = Priority.valueOf(params.get(2))
                val message = Message(
                    params.get(0),
                    params.get(1),
                    priority,
                    params.get(3)
                )

                val channel = kord.getChannel(channelId) as? TextChannel ?: run {
                    call.respond(HttpStatusCode.BadRequest, "Channel not found or not a text channel")
                    return@post
                }

                channel.createMessage(message.toString())
                call.respond(HttpStatusCode.NoContent)
            } catch (ex: IllegalArgumentException) {
                call.respond(HttpStatusCode.BadRequest)
            } catch (ex: IllegalStateException) {
                call.respond(HttpStatusCode.BadRequest)
            }
        }
    }
}
