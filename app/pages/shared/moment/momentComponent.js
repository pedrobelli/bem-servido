define(['moment'], function(moment) {

  function convertStringToDateTime(data, horario) {
    var momentDate = moment(data + " " + horario, "DD/MM/YYYY HH:mm");
    return momentDate.toDate();
  }

  function convertDateToString(data) {
    return moment(data).utcOffset(-3).format("DD/MM/YYYY");
  }

  function convertTimeToString(time) {
    return moment(time).utcOffset(-3).format("HH:mm");
  }

  function calculateFinTime(data, horario, duracao) {
    var momentDate = moment(data + ' ' + horario,'DD/MM/YYYY HH:mm', true);

    if (momentDate.isValid()) {
      momentDate.add(duracao, 'minutes');
      return momentDate.utcOffset(-3).format("HH:mm");
    }
  }

  return {
    convertStringToDateTime:convertStringToDateTime,
    convertDateToString:convertDateToString,
    convertTimeToString:convertTimeToString,
    calculateFinTime:calculateFinTime
  }

});
