**Zadanie 8** Oauth2

Należy skonfigurować klienta Oauth2 (4.0).
Dane o użytkowniku wraz z tokenem powinny być przechowywane po stronie bazy serwera, a nowy token (inny niż ten od dostawcy) powinien zostać wysłany do klienta (React).
Można zastosować mechanizm sesji lub inny dowolny (5.0).
Zabronione jest tworzenie klientów bezpośrednio po stronie React'a wyłączając z komunikacji aplikację serwerową.

Prawidłowa komunikacja: react-sewer-dostawca-serwer(via return uri)-react.

Klucz należy uzyskać na:
- https://console.cloud.google.com/apis/dashboard,
- https://developers.facebook.com/

- :white_check_mark: 3.0 logowanie przez aplikację serwerową (bez Oauth2) [Commit](https://github.com/wojcho/e_biznes/commit/d22dda90acab62de240b7016e75fc10413e84e3e)
- :white_check_mark: 3.5 rejestracja przez aplikację serwerową (bez Oauth2) [Commit](https://github.com/wojcho/e_biznes/commit/500ba6f53af49e2baef1b81fcd50e6d05d9bae20)
- :white_check_mark: 4.0 logowanie via Google OAuth2 [Commit](https://github.com/wojcho/e_biznes/commit/81046dc6eadafb910cde168e7da04aa8be7e1d87)
- :white_check_mark: 4.5 logowanie via ~~Facebook lub~~ Github OAuth2 [Commit](https://github.com/wojcho/e_biznes/commit/263cea1d6a7c5ba67c09506b33ceb3833195e367)
- :x: <!-- :white_check_mark: --> 5.0 zapisywanie danych logowania OAuth2 po stronie serwera ~~[Commit]()~~

[Nagranie 3.5](https://github.com/wojcho/e_biznes/blob/main/8_oauth/video_3_5.mp4)
[Nagranie 4.0](https://github.com/wojcho/e_biznes/blob/main/8_oauth/video_4.mp4)
[Nagranie 4.5](https://github.com/wojcho/e_biznes/blob/main/8_oauth/video_4_5.mp4)
