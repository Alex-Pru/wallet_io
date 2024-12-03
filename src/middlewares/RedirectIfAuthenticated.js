const redirectIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    // Redireciona para a página inicial se o usuário já estiver autenticado
    return res.redirect("http://localhost:3000/home");
  }
  // Caso não esteja autenticado, segue para o próximo middleware ou rota
  next();
};

export default redirectIfAuthenticated;
