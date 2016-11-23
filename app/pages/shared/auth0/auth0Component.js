define(['auth0', 'bridge'], function(auth0, bridge) {

  function createAuth0Instance(date, horario) {
    return new auth0({
      domain: 'pedrobelli.auth0.com',
      clientID: 'hneM83CMnlnsW0K7qjVHZJ88qkD4ULSM'
    });
  }

  function deleteAuth0User(profile) {
    var headers = {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJqaUFvZGNtaHgwRWlpUnhIYUJ6RUR5RUI1RXQzTXBJaSIsInNjb3BlcyI6eyJ1c2VycyI6eyJhY3Rpb25zIjpbImRlbGV0ZSJdfX0sImlhdCI6MTQ3OTIzMTg4NiwianRpIjoiM2I2YWIyMGI1NjllMDc5ZDBkNjg3MjViN2Y2OTc1OWUifQ.fjPTPC0BBV1ibLAD40KXgD28sq7pvW5dAuEQ6_K5pog'};

    bridge.del('https://pedrobelli.auth0.com/api/v2/users/' + profile.user_id, headers)
    .fail(function(context, errorMessage, serverError){
      console.log(context);
    })
    .done(function(){
      console.log("Usuário deletado do auth0");
    });
  }

  function mapClienteToLocalStorage(response, result, profile)  {
    localStorage.setItem('id_token', result.idToken);
    localStorage.setItem('current_user_id', response.cliente.id);
    localStorage.setItem('current_user_auth_id', response.cliente.uuid);
    localStorage.setItem('current_user_name', response.cliente.nome);
    localStorage.setItem('current_user_role', profile.user_metadata.role);
    localStorage.setItem('exp', result.idTokenPayload.exp);
    // TODO arrumar esse redirecionamento bosta
    return window.location.hash = "#home";
  }

  function mapProfissionalToLocalStorage(response, result, profile)  {
    localStorage.setItem('id_token', result.idToken);
    localStorage.setItem('current_user_id', response.profissional.id);
    localStorage.setItem('current_user_auth_id', response.profissional.uuid);
    localStorage.setItem('current_user_name', response.profissional.nome);
    localStorage.setItem('current_user_role', profile.user_metadata.role);
    localStorage.setItem('exp', result.idTokenPayload.exp);
    // TODO arrumar esse redirecionamento bosta
    return window.location.hash = "#home";
  }

  return {
    createAuth0Instance:createAuth0Instance,
    deleteAuth0User:deleteAuth0User,
    mapClienteToLocalStorage:mapClienteToLocalStorage,
    mapProfissionalToLocalStorage:mapProfissionalToLocalStorage
  };
});
