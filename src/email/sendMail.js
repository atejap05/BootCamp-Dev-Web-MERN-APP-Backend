import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "Hotmail",
    auth: {
        secure: false,
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

const sendMail = (user, matchPermuta) => {
    let messageCurrentUser = ""
    if (matchPermuta.length === 0) {
      messageCurrentUser = `
        <p>${user.name},</p>
        <p>Sua intenção de permuta foi registrada com sucesso!</p>
        <p>No momento, não consta em nossa base de dados intenção registrada por outro usuário que viabilize a permuta.</p>
        <p>Caso seja incluída, você será comunicado. Boa sorte!</p>
        <br><p>PermutaGov</p>`
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
        <p>O sevidor ${user.name} registrou interesse em remover-se</p>
        <ul>
        <li>de: ${match.destinoId.name}</li>
        <li>para: ${match.origemId.name}</li>
        </ul>
        <p>Seu e-mail para contato é ${user.email}.</p>
        <br><p>PermutaGov</p>`
        const mailOptionsMatchedUser = {
            from: process.env.EMAIL,
            to: match.userId.email,
            subject: "Uma nova permuta cadastrada combina com a sua!",
            html: messageMatchedUser
        };
        // await transporter.sendMail(mailOptionsMatchedUser);
        // Concurrent connections limit exceeded. Visit https://aka.ms/concurrent_sending for more information
        // Debuggando o envio para o matchedUser.
      });
      messageCurrentUser += `<br><p>PermutaGov</p>`
    }
    const mailOptionsCurrentUser = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Inclusão de intenção de permuta registrada",
        html: messageCurrentUser,
      };
    transporter.sendMail(mailOptionsCurrentUser);
}

export default sendMail;