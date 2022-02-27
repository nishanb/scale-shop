const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
	// create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		auth: {
			user: process.env.MAIL_USER,
			pass: process.env.MAIL_PASSWORD,
		},
	});

	const message = {
		from: "nishan@nishan.dev", // sender address
		to: options.to,
		subject: options.subject,
		text: options.text,
		//html: `<a href="${options.message}">Link From LCO Mailer</a>`,
	};

	await transporter.sendMail(message);
};

module.exports = sendEmail;
