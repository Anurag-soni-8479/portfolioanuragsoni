const express = require('express');
const nodemailer = require('nodemailer')
const cors = require('cors')
const bodyparser = require('body-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
// app.use(cors());
// app.use(cors({
//     origin: 'https://anurag-soni-8479.github.io/portfolioanuragsoni',
//     methods: ['GET', 'POST', 'OPTIONS'],
//     credentials: false
// }));

app.get('/', (req, res) => {
    res.send('hello world');
})

app.post("/sendemail", async (req, res) => {
    const { fullName, email, phone, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },

    })

    const mailOption = {
        from: email,
        to: process.env.EMAIL_TO,
        html: `
        <p><strong>Name:</strong>${fullName}</p>
        <p><strong>Email:</strong>${email}</p>
        <p><strong>Phone:</strong>${phone}</p>
        <p><strong>Subject:</strong>${subject}</p>
        <p><strong>Message:</strong>${message}</p>
        `
    };

    try {
        await transporter.sendMail(mailOption);
        res.status(200).json({ message: "Email sending successfully" });
    } catch (err) {
        console.log(err)
        console.error("email errors", err);
        res.status(500).json({ message: "internel server error", err })
    }
});

app.listen(port, () => {
    console.log(`Server is listen on port ${port}`)
})