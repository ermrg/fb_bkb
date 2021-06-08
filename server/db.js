/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var fs = require("fs");
var dbFile = "./.data/sqlite.db";
var exists = fs.existsSync(dbFile);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(dbFile);

db.serialize(function () {
  if (!exists) {
    db.run(
      "CREATE TABLE Matches (context TEXT, game_code TEXT, player_one_id TEXT, player_one_name TEXT, player_one_role TEXT, player_two_id TEXT, player_two_name TEXT, player_two_role TEXT, has_started TEXT)"
    );
  }
});

module.exports = function (app) {
  app.db = db;
};
