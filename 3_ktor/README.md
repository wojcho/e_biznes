**Zadanie 3** Kotlin

Aplikację należy uruchomić na dockerze.

- :white_check_mark: 3.0 Należy stworzyć aplikację kliencką w Kotlinie we frameworku Ktor, która pozwala na przesyłanie wiadomości na platformę Discord (Aplikacja przyjmuje wiadomości przez API z Ktor i przesyła na Discord) [Commit](https://github.com/wojcho/e_biznes/commit/5c7fe79b8ccf090d6bb3f28121481000ca999d72)
- :white_check_mark: 3.5 Aplikacja jest w stanie odbierać wiadomości użytkowników z platformy Discord skierowane do aplikacji (bota) [Commit](https://github.com/wojcho/e_biznes/commit/52808df8a30897e80a9733322f6c593d6f3ae5e6)
- :x:<!-- :white_check_mark: --> 4.0 Zwróci listę kategorii na określone żądanie użytkownika <!-- [Commit]() -->
- :x:<!-- :white_check_mark: --> 4.5 Zwróci listę produktów wg żądanej kategorii <!-- [Commit]() -->
- :x:<!-- :white_check_mark: --> 5.0 Aplikacja obsłuży dodatkowo jedną z platform: Slack lub Messenger <!-- [Commit]() -->

<!-- [Nagranie]() -->

<!-- TODO Napisać instrukcje uruchomienia w Dockerze -->
<!-- https://github.com/kordlib/kord/wiki/Getting-Started -->

---

## Building & Running

To build or run the project, use one of the following tasks:

| Task                                    | Description                                                          |
| --------------------------------------- | -------------------------------------------------------------------- |
| `./gradlew test`                        | Run the tests                                                        |
| `./gradlew build`                       | Build everything                                                     |
| `./gradlew buildFatJar`                 | Build an executable JAR of the server with all dependencies included |
| `./gradlew buildImage`                  | Build the docker image to use with the fat JAR                       |
| `./gradlew publishImageToLocalRegistry` | Publish the docker image locally                                     |
| `./gradlew run`                         | Run the server                                                       |
| `./gradlew runDocker`                   | Run using the local docker image                                     |

If the server starts successfully, similar output would be printed to below:

```
2024-12-04 14:32:45.584 [main] INFO  Application - Application started in 0.303 seconds.
2024-12-04 14:32:45.682 [main] INFO  Application - Responding at http://0.0.0.0:8080
```
