import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  auth: {
    secure: false,
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// const transporterFeedback = nodemailer.createTransport({
//     service: "Hotmail",
//     auth: {
//         secure: false,
//         user: process.env.EMAIL_FEEDBACK,
//         pass: process.env.EMAIL_FEEDBACK_PASS
//     }
// });

const sendMail = async (user, unidadeDestino, matchPermuta) => {
  let messageCurrentUser = "";
  if (matchPermuta.length === 0) {
    messageCurrentUser = `
        <p>${user.name},</p>
        <p>Sua intenção de permuta para <b>${unidadeDestino.name}</b> foi registrada com sucesso!</p>
        <p>No momento, não consta em nossa base de dados intenção registrada por outro usuário que viabilize a permuta.</p>
        <p>Caso seja incluída, você será comunicado. Boa sorte!</p>
        <br><p>PermutaGov</p>`;
  } else {
    messageCurrentUser = `
        <p>${user.name},</p>
        <p>Sua intenção de permuta foi registrada com sucesso!</p>
        <p>Consta da nossa base de dados, intenção(ões) registrada(s) por outro(s) usuário(s) que viabiliza(m) a permuta:</p>`;
    matchPermuta.forEach(async (match) => {
      messageCurrentUser += `
            <br><p><b>${match.userId.name}</b>, lotado no(a) <b>${match.origemId.name}</b>,</p>
            <p>tem interesse em remover-se para <b>${match.destinoId.name}</b>.</p>
            <p>Seu e-mail para contato é <a href="mailto:${match.userId.email}">${match.userId.email}</a>.</p>`
      const messageMatchedUser = `
        <p>${match.userId.name},</p>
        <p>O sevidor <b>${user.name}</b> registrou interesse em remover-se</p>
        <ul>
        <li>de: <b>${match.destinoId.name}</b></li>
        <li>para: <b>${match.origemId.name}</b></li>
        </ul>
        <p>Seu e-mail para contato é <a href="mailto:${user.email}">${user.email}</a>.</p>
        <br><p>PermutaGov</p>`;
      // const mailOptionsMatchedUser = {
      //     from: process.env.EMAIL_FEEDBACK,
      //     to: match.userId.email,
      //     subject: "Uma nova permuta cadastrada combina com a sua!",
      //     html: messageMatchedUser
      // };
      // await transporterFeedback.sendMail(mailOptionsMatchedUser);
      const mailOptionsMatchedUser = {
        from: process.env.EMAIL,
        to: match.userId.email,
        subject: "Uma nova permuta cadastrada combina com a sua!",
        html: messageMatchedUser
      };
      try {
        await transporter.sendMail(mailOptionsMatchedUser);
      } catch (error) {
        console.log(error);
      }
    });
    messageCurrentUser += `<br><p>PermutaGov</p>`;
  }
  const mailOptionsCurrentUser = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "Intenção de permuta registrada",
    html: messageCurrentUser,
  };
  try {
    await transporter.sendMail(mailOptionsCurrentUser);
  } catch (error) {
    console.log(error);
  }
};

const sendNewPassword = (user, password) => {

  const messageCurrentUser = `A sua nova senha temporária é ${password}. Por favor, defina uma nova senha assim que acessar o sistema.`

  const mailOptionsCurrentUser = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "PremutaGov - nova senha",
    html: messageCurrentUser,
  };
  transporter.sendMail(mailOptionsCurrentUser);

}

export default sendMail;
export {sendNewPassword}