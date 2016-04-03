exports.writeErrors = function(res, errors) {
  res.statusCode = 400;
  res.json({errors: errors});
}
