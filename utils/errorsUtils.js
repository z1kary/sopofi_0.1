module.exports.signupErrors = (err) => {
  let errors = { pseudo: "dqsd", email: "", password: ""}

  // console.log(err);

  if (err.message.includes('username')) errors.pseudo = "Pseudo incorrect ou déjà pris"

  if (err.message.includes('email')) errors.email = "Email incorrect"

  if (err.message.includes('password')) errors.password = "Le mot de passe doit faire 6 caractères minimum"
  
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("username"))
    errors.pseudo = "Ce pseudo est déjà pris";

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "Cet email est déjà enregistré";

  return errors;
}

module.exports.signinErrors = (err) => {
  let errors = { username: '', password: ''}

  if (err.message.includes("username")) 
    errors.username = "username inconnu";
  
  if (err.message.includes('password'))
    errors.password = "Le mot de passe ne correspond pas"

  console.log(err);

  return err
}