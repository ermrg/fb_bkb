var fs = require('fs')
fs.readFile('build/index.html', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result1 = data.replace(/main.*.css/g, 'main.css');

  fs.writeFile('build/index.html', result1, 'utf8', function (err) {
     if (err) return console.log(err);
  });

});