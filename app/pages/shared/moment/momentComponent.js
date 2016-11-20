define(['moment'], function(moment) {

  function convertStringToDateTime(date, horario) {
    var momentDate = moment(date + " " + horario, "DD/MM/YYYY HH:mm");
    return momentDate.toDate();
  }

  function convertStringToDate(date) {
    var momentDate = moment(date + " 00:00", "DD/MM/YYYY HH:mm");
    return momentDate.toDate();
  }

  function convertStringToTime(time) {
    var momentDate = moment("11/11/1900 " + time, "DD/MM/YYYY HH:mm");
    return momentDate.toDate();
  }

  function convertStringToMomentTime(time) {
    return moment(time, "HH:mm");
  }

  function convertTimeStringToMoment(time) {
    return moment("11/11/1900 " + time, "DD/MM/YYYY HH:mm");
  }

  function convertDateToString(date) {
    return moment(date).format("DD/MM/YYYY");
  }

  function convertDayMonthToString(date) {
    return moment(date).format("DD/MM");
  }

  function convertTimeToString(time) {
    return moment(time).utcOffset(0).format("HH:mm");
  }

  function convertTimeToStringNoOffset(time) {
    return moment(time).format("HH:mm");
  }

  function returnDateWeekday(date) {
    var momentDate = moment(date, "DD/MM/YYYY");
    return momentDate.weekday() + 1;
  }

  function roundUp(horaAtual) {
    return moment('11/11/1900 ' + horaAtual).utcOffset(0).add(1, 'hour').startOf('hour');
  }

  function calculateHoraFim(date, horario, duracao) {
    var momentDate = moment(date + ' ' + horario,'DD/MM/YYYY HH:mm', true);

    if (momentDate.isValid()) {
      momentDate.add(duracao, 'minutes');
      return momentDate.format("HH:mm");
    }
  }

  return {
    convertStringToDateTime:convertStringToDateTime,
    convertStringToDate:convertStringToDate,
    convertStringToTime:convertStringToTime,
    convertStringToMomentTime:convertStringToMomentTime,
    convertTimeStringToMoment:convertTimeStringToMoment,
    convertDateToString:convertDateToString,
    convertDayMonthToString:convertDayMonthToString,
    convertTimeToString:convertTimeToString,
    convertTimeToStringNoOffset:convertTimeToStringNoOffset,
    returnDateWeekday:returnDateWeekday,
    roundUp:roundUp,
    calculateHoraFim:calculateHoraFim
  };
});
