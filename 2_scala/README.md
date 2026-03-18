**Zadanie 2** Scala

Należy stworzyć aplikację na frameworku Play lub Scalatra.
- :white_check_mark: 3.0 Należy stworzyć kontroler do Produktów [Commit](https://github.com/wojcho/e_biznes/commit/5cc3dc0272f3fa89385061da9ee31d61d7630b09)
- :x: 3.5 Do kontrolera należy stworzyć endpointy zgodnie z CRUD - dane pobierane z listy [Commit]()
- :x: 4.0 Należy stworzyć kontrolery do Kategorii oraz Koszyka + endpointy zgodnie z CRUD [Commit]()
- :x: 4.5 Należy aplikację uruchomić na dockerze (stworzyć obraz) oraz dodać skrypt uruchamiający aplikację via ngrok [Commit]()
- :x: 5.0 Należy dodać konfigurację CORS dla dwóch hostów dla metod CRUD [Commit]()
Kontrolery mogą bazować na listach zamiast baz danych.
CRUD:
- show all (get na parent directory),
- show by id (get na id),
- update (put na id),
- delete (delete na id),
- add (post na parent directory).

---

# CRUD Shop #

## Build & Run ##

```sh
$ sbt
> warStart
```

Open [http://localhost:8080/](http://localhost:8080/) in your browser.
