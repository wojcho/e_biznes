package com.example

enum class Priority {
    Low, Medium, High, Vital
}

data class Message(
    val from: String,
    val to: String,
    val priority: Priority,
    val content: String
)
