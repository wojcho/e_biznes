**Zadanie 2** Scala

Należy stworzyć aplikację na frameworku Play lub Scalatra.
- :white_check_mark: 3.0 Należy stworzyć kontroler do Produktów [Commit](https://github.com/wojcho/e_biznes/commit/5cc3dc0272f3fa89385061da9ee31d61d7630b09)
- :white_check_mark: 3.5 Do kontrolera należy stworzyć endpointy zgodnie z CRUD - dane pobierane z listy [Commit](https://github.com/wojcho/e_biznes/commit/02af5a0251e88c186244b999de02d6f521911b04)
- :white_check_mark: 4.0 Należy stworzyć kontrolery do Kategorii oraz Koszyka + endpointy zgodnie z CRUD [Commit](https://github.com/wojcho/e_biznes/commit/d12fc23d3db90d15628e222b297c6fb58083f881)
- :x: 4.5 Należy aplikację uruchomić na dockerze (stworzyć obraz) oraz dodać skrypt uruchamiający aplikację via ngrok [Commit]()
- :x: 5.0 Należy dodać konfigurację CORS dla dwóch hostów dla metod CRUD [Commit]()

Kontrolery mogą bazować na listach zamiast baz danych.

CRUD dla produktów:
- show all (get na parent directory),
- show by id (get na id),
- update (put na id),
- delete (delete na id),
- add (post na parent directory).

---

W implementacji korzystano z SQLite do przechowywania danych.

## Uruchamianie ##

Wywołać komendę `sbt`, a następnie wewnątrz SBT uruchomić servlet Web Application Resource za pomocą `warStart`
```sh
$ sbt
> warStart
```

Możliwa jest wtedy interakcja z API z poziomu przeglądarki [http://localhost:8080/](http://localhost:8080/).

Dostępny jest także plik `run.sh` za pomocą `curl` pokazujący przykładowe działanie aplikacji.
