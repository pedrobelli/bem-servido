define(['momentComponent'], function(momentComponent) {

  function mapResponseToHoraDeTrabalho(horaTrabalho){
    if(!horaTrabalho) return [];

    profissionalHorasTrabalho = [];
    var horaAtual = momentComponent.convertTimeStringToMoment(momentComponent.convertTimeToString(horaTrabalho.horaInicio));
    var horaFim = momentComponent.convertTimeStringToMoment(momentComponent.convertTimeToString(horaTrabalho.horaFim));

    for ( ; horaFim.diff(horaAtual, 'minutes') >= 0; ) {
      payload = {};
      var inicioRoundUp = momentComponent.roundUp(momentComponent.convertTimeToStringNoOffset(horaAtual));

      if (horaFim.diff(horaAtual, 'minutes') == 0) {
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

  function mapResponseToAgendamentos(agendamentos, horasTrabalho){
    if(!agendamentos.length || !horasTrabalho.length) return [];

    var horaTrabalhoInicial = momentComponent.convertTimeStringToMoment(horasTrabalho[0].hora)
    var agendamentos = agendamentos.map(function(agendamento){
      var horaAtual = momentComponent.convertTimeStringToMoment(momentComponent.convertTimeToString(agendamento.dataInicio));
      var nome = "";

      if (!!agendamento.cliente) {
        nome = agendamento.cliente.nome;
      } else if (!!agendamento.nomeCliente) {
        nome = agendamento.nomeCliente;
      } else {
        nome = "Bloqueio"
      }

      return {
        id         : agendamento.id,
        top        : (horaAtual.diff(horaTrabalhoInicial, 'minutes')),
        height     : agendamento.duracao,
        cliente    : nome,
        servico    : !agendamento.bloqueio ? agendamento.detalhe_servico.servico.nome : "",
        horario    : momentComponent.convertTimeToString(agendamento.dataInicio) + " - " + momentComponent.convertTimeToString(agendamento.dataFim),
        isBlockade : agendamento.bloqueio
      }
    });

    return agendamentos;
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
    mapResponseToAgendamentos:mapResponseToAgendamentos
  };
});
