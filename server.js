const app = require("./app");

app.listen(process.env.PORT || 5000, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Started At Port 5000");
  }
});
