/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var crypto = require("crypto-js");

module.exports = function (app) {
  const db = app.db;

  /**
   * POST /save-match
   *
   * Inserts or updates database match information for the specified context
   * after validating that the data sent is actually from a valid client
   *
   */
  app.post("/save-match", function (request, response) {
    var contextId = request.body.contextId;
    var signature = request.body.signature;
    var userData = request.body.data;
    // Validate request data
    // (see FBInstant.player.getSignedPlayerInfo documentation)
    var isValid = validate(signature);

    if (isValid) {
      // Retrieves data payload from the signed info
      var data = getEncodedData(signature);
      // Saves data specified in the payload, for the specified context
      saveMatchData(contextId, userData)
        // Returns sucess:true if data was successfully saved
        .then(function (result) {
          response.json({ success: true, data: result });
        })
        // Returns success:false and error if information was not saved
        .catch(function (err) {
          response.json({ success: false, error: err });
        });
    } else {
      response.json({
        success: false,
        error: { message: "invalid signature" },
      });
    }
  });
  app.post("/join-match", function (request, response) {
    var signature = request.body.signature;
    var userData = request.body.data;
    var game_code = request.body.game_code;
    // Validate request data
    // (see FBInstant.player.getSignedPlayerInfo documentation)
    var isValid = validate(signature);

    if (isValid) {
      // Retrieves data payload from the signed info
      // Saves data specified in the payload, for the specified context
      joinMatchData(game_code, userData)
        // Returns sucess:true if data was successfully saved
        .then(function (result) {
          console.log(result);
          response.json({ success: true, data: result });
        })
        // Returns success:false and error if information was not saved
        .catch(function (err) {
          response.json({ success: false, error: err });
        });
    } else {
      response.json({
        success: false,
        error: { message: "invalid signature" },
      });
    }
  });

  /**
   * GET /get-match
   *
   * Returns match information stored for the specified context
   * after validating that the request is from a valid client
   */
  app.post("/get-match", function (request, response) {
    var signature = request.body.signature;

    // Validate request data
    // (see FBInstant.player.getSignedPlayerInfo documentation)
    var isValid = validate(signature);

    if (isValid) {
      // Retrieves the context Id from encoded signature payload
      var contextId = getEncodedData(signature);
      // Tries to load data from the database respective to this context
      loadMatchData(contextId)
        .then(function (result) {
          // Returns a json with data and success:true if data was found
          if (result) {
            response.json({
              success: true,
              contextId: contextId,
              empty: false,
              data: result,
            });
            // Returns a json with empty:true and success:true
            // if all operations were successful, but no data was found
          } else {
            response.json({
              success: true,
              contextId: contextId,
              empty: true,
            });
          }
        })
        // Returns a json with success:false in case of any errors
        .catch(function (err) {
          response.json({ success: false, error: err });
        });
    } else {
      // Returns a json with success:false and invalid signature
      // in case signature couldn't be verified
      // Invalid signature errors can happen for many reasons, like:
      //  - APP_SECRET not specified on .env
      //  - Request being sent from the mock SDK
      //   (set USE_SECURE_COMMUNICATION=true to use the mock SDK,
      //   otherwise use the embedded player)
      response.json({
        success: false,
        error: { message: "invalid signature" },
      });
    }
  });

  /**
   * saveMatchData(contextId, data)
   *
   * Updates or inserts information in the database for the specified context
   */

  const joinMatchData = function (game_code, data) {
    console.log("1111111");
    return new Promise(function (resolve, reject) {
      db.serialize(function () {
        db.all(
          "SELECT * FROM Matches WHERE game_code=?",
          [game_code],
          function (err, rows) {
            if (err) {
              console.log("error 1", err);
              reject(err);
            } else if (rows.length > 0) {
              let updateData = [data.userId, data.name, game_code.toString()];
              let sql = `UPDATE Matches
            SET player_two_id = ?, player_two_name = ?
            WHERE game_code = ?`;
              db.run(sql, updateData, function (err) {
                if (err) {
                console.log(`Error update`, err);

                  reject(err);
                }
                console.log(`Row(s) updated: ${this.changes}`);

                db.all(
                  "SELECT * FROM Matches WHERE game_code=?",
                  [game_code],
                  function (err, rows) {
                    if (err) {
                      console.log("error 1", err);
                      reject(err);
                    } else if (rows.length > 0) {
                      console.log(" fuck uou", rows);
                      resolve(rows[0]);
                    }
                  }
                );
              });
            }
          }
        );
      });
    });
  };
  const saveMatchData = function (contextId, data) {
    return new Promise(function (resolve, reject) {
      db.serialize(function () {
        db.all(
          "SELECT * FROM Matches WHERE context=?",
          [contextId],
          function (err, rows) {
            if (err) {
              console.log("error 1", err);
              reject(err);
              // Update existing record for the context
            } else {
              console.log("gesssse");

              // Row doesn't exist, create one
              var game_code = Math.floor(0000 + Math.random() * 9999);
              console.log("game_code 1", game_code);

              // var unique = true;
              // // do  {
              // //   console.log('unique', unique)

              //   db.all(
              //     "SELECT context FROM Matches WHERE game_code=?",
              //     [game_code],
              //     function (err, rows) {
              //       console.log('rows', rows)
              //       if (err) {
              //         reject(err);
              //       }
              //       if (rows.length > 0) {
              //         game_code = Math.floor(0000 + Math.random() * 9999);
              //       } else {
              //         unique = false;
              //       }
              //     }
              //   );
              // // }while((unique))
              db.run(
                "INSERT INTO Matches (context, game_code, player_one_id, player_one_name, player_one_role, player_two_id, player_two_name, player_two_role, has_started) VALUES (?,?,?,?,?,?,?,?,?)",
                [
                  contextId,
                  game_code,
                  data.userId,
                  data.name,
                  "tiger",
                  "",
                  "",
                  "goat",
                  0,
                ],
                function (err) {
                  if (err) {
              console.log("error", err);

                    reject(err);
                  }
                  resolve();
                }
              );
            }
          }
        );
      });
    });
  };

  /**
   * loadMatchData(contextId)
   *
   * Retrieves data from the database for the specified context
   */
  const loadMatchData = function (contextId) {
    console.log("Load Match");
    return new Promise(function (resolve, reject) {
      db.serialize(function () {
        db.all(
          "SELECT * FROM Matches WHERE context=?",
          [contextId],
          function (err, rows) {
            if (err) {
              reject(err);
            } else if (rows.length > 0) {
              resolve(rows[0]);
            } else {
              resolve("");
            }
          }
        );
      });
    });
  };

  /**
   * Validates a signed request, returning a boolean
   * See FBInstant.player.getSignedPlayerInfo for more information
   */
  const validate = function (signedRequest) {
    // You can set USE_SECURE_COMMUNICATION=false
    // in the .env file to bypass validation
    // while doing local testing and using the FBInstant mock SDK.
    if (process.env.USE_SECURE_COMMUNICATION === "false") {
      console.log("Not validating signature");
      return true;
    }

    try {
      var firstpart = signedRequest.split(".")[0];
      var replaced = firstpart.replace(/-/g, "+").replace(/_/g, "/");
      var signature = crypto.enc.Base64.parse(replaced).toString();
      const dataHash = crypto
        .HmacSHA256(signedRequest.split(".")[1], process.env.APP_SECRET)
        .toString();
      var isValid = signature === dataHash;
      if (!isValid) {
        console.log("Invalid signature");
        console.log("Expected", dataHash);
        console.log("Actual", signature);
      }

      return isValid;
    } catch (e) {
      return false;
    }
  };

  /**
   * Gets payload data encoded into a signed request.
   * See FBInstant.player.getSignedPlayerInfo for more information
   */
  const getEncodedData = function (signedRequest) {
    // You can set USE_SECURE_COMMUNICATION=false
    //  in the .env file to bypass validation
    // while doing local testing and using the FBInstant mock SDK.
    if (process.env.USE_SECURE_COMMUNICATION === "false") {
      return signedRequest;
    }

    try {
      const json = crypto.enc.Base64.parse(
        signedRequest.split(".")[1]
      ).toString(crypto.enc.Utf8);
      const encodedData = JSON.parse(json);

      /*
             Here's an example of encodedData can look like
             {
                 algorithm: 'HMAC-SHA256',
                 issued_at: 1520009634,
                 player_id: '123456789',
                 request_payload: 'backend_save'
             }
             */
      return encodedData.request_payload;
    } catch (e) {
      return null;
    }
  };
};
