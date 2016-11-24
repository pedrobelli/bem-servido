define(['momentComponent'], function(momentComponent) {

  function mapResponseToHoraDeTrabalho(horaTrabalho){
    if(!horaTrabalho) return [];

    profissionalHorasTrabalho = [];
    var horaAtual = momentComponent.convertTimeStringToMoment(momentComponent.convertTimeToString(horaTrabalho.horaInicio));
    var horaFim = momentComponent.convertTimeStringToMoment(momentComponent.convertTimeToString(horaTrabalho.horaFim));

    for ( ; horaFim.diff(horaAtual, 'minutes') >= 0; ) {
      payload = {};
      var inicioRoundUp = momentComponent.roundUp(momentComponent.convertTimeToStringNoOffset(horaAtual));

      if (horaFim .diff(horaAtual, 'minutes') == 0) {
        payload.hora = momentComponent.convertTimeToStringNoOffset(horaFim.toDate());
        payload.height = 0;
        horaAtual.add(30, 'minutes')
      } else if (horaFim.diff(inicioRoundUp, 'minutes') >= 0) {
        payload = generateHoraTrabalho(horaAtual, inicioRoundUp.diff(horaAtual, 'minutes'));
        horaAtual.add(payload.height, 'minutes')
      } else {
        payload = generateHoraTrabalho(horaAtual, horaFim.diff(horaAtual, 'minutes'));
        horaAtual.add(payload.height, 'minutes')
      }

      profissionalHorasTrabalho.push(payload);
    }

    return profissionalHorasTrabalho;
  };

  function mapResponseToAtendimentos(atendimentos, horasTrabalho){
    if(!atendimentos.length || !horasTrabalho.length) return [];

    var horaTrabalhoInicial = momentComponent.convertTimeStringToMoment(horasTrabalho[0].hora)
    var atendimentos = atendimentos.map(function(atendimento){
      var horaAtual = momentComponent.convertTimeStringToMoment(momentComponent.convertTimeToString(atendimento.dataInicio));
      return {
        top     : (horaAtual.diff(horaTrabalhoInicial, 'minutes')),
        height  : atendimento.duracao,
        cliente : atendimento.cliente.nome,
        servico : atendimento.detalhe_servico.servico.nome,
        horario : momentComponent.convertTimeToString(atendimento.dataInicio) + " - " + momentComponent.convertTimeToString(atendimento.dataFim)
      }
    });

    return atendimentos;
  };

  var generateHoraTrabalho = function(horaAtual, diferenca) {
    payload.hora = momentComponent.convertTimeToStringNoOffset(horaAtual.toDate());
    if (diferenca <= 30) {
      payload.height = diferenca;
    } else {
      diferenca = diferenca - 30
      payload.height = diferenca;
    }
    return payload;
  };

  return {
    mapResponseToHoraDeTrabalho:mapResponseToHoraDeTrabalho,
    mapResponseToAtendimentos:mapResponseToAtendimentos
  };
});
