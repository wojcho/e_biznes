**Zadanie 3** Kotlin

Aplikację należy uruchomić na dockerze.

- :x:<!-- :white_check_mark: --> 3.0 Należy stworzyć aplikację kliencką w Kotlinie we frameworku Ktor, która pozwala na przesyłanie wiadomości na platformę Discord <!-- [Commit]() -->
- :x:<!-- :white_check_mark: --> 3.5 Aplikacja jest w stanie odbierać wiadomości użytkowników z platformy Discord skierowane do aplikacji (bota) <!-- [Commit]() -->
- :x:<!-- :white_check_mark: --> 4.0 Zwróci listę kategorii na określone żądanie użytkownika <!-- [Commit]() -->
- :x:<!-- :white_check_mark: --> 4.5 Zwróci listę produktów wg żądanej kategorii <!-- [Commit]() -->
- :x:<!-- :white_check_mark: --> 5.0 Aplikacja obsłuży dodatkowo jedną z platform: Slack lub Messenger <!-- [Commit]() -->

<!-- [Nagranie]() -->

---

# ktor-sample

## Features

Here's a list of features included in this project:

| Name                                               | Description                                                 |
| ----------------------------------------------------|------------------------------------------------------------- |
| [Routing](https://start.ktor.io/p/routing-default) | Allows to define structured routes and associated handlers. |

## Building & Running

To build or run the project, use one of the following tasks:

| Task                                    | Description                                                          |
| -----------------------------------------|---------------------------------------------------------------------- |
| `./gradlew test`                        | Run the tests                                                        |
| `./gradlew build`                       | Build everything                                                     |
| `./gradlew buildFatJar`                 | Build an executable JAR of the server with all dependencies included |
| `./gradlew buildImage`                  | Build the docker image to use with the fat JAR                       |
| `./gradlew publishImageToLocalRegistry` | Publish the docker image locally                                     |
| `./gradlew run`                         | Run the server                                                       |
| `./gradlew runDocker`                   | Run using the local docker image                                     |

If the server starts successfully, you'll see the following output:

```
2024-12-04 14:32:45.584 [main] INFO  Application - Application started in 0.303 seconds.
2024-12-04 14:32:45.682 [main] INFO  Application - Responding at http://0.0.0.0:8080
```
