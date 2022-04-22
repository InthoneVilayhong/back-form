const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config(); //! require de dotenv

const app = express();
app.use(cors());
app.use(formidable());

const API_KEY = process.env.API_KEY; //! On definit les requis pour recevoir les mails
const DOMAIN = process.env.DOMAIN;
const MAIL = "thonouu@gmail.com";

const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN }); //! le require de mailgun

app.post("/form", (req, res) => {
    const { firstname, lastname, email, message } = req.fields; //*!DESTRUCTURING
    //   console.log(req.fields);

    const data = {
        from: `${firstname} ${lastname} <${email}>`,
        to: MAIL,
        subject: `Form send by ${firstname}`,
        text: message,
    };

    //   console.log(data);
    mailgun.messages().send(data, (error, body) => {
        console.log(error); //! en cas d'erreur
        console.log(body); //! Si tout se pass bien on recoit un id et un message de remerciement cool :D
    });

    res.status(200).json({ message: "Message send" });
});

app.all("*", (req, res) => {
    res.status(404).json({ message: "Not found" });
});
app.listen(process.env.PORT, () => {
    console.log("Server started");
});
