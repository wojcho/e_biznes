package com.example;

import java.sql.Connection;
import java.sql.DriverManager;

public class Main {
  public static void main(String[] args) throws Exception {
    String url = "jdbc:sqlite:test.db";

    try (Connection conn = DriverManager.getConnection(url)) {
      System.out.println("Connected to SQLite!");
    }
  }
}
