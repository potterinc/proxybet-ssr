import mailer, { SendMailOptions, Transporter } from 'nodemailer';
import AppConfig from '../configs/app.config';

/**@description Sends email to via SMTP */
class Mailer {
	private transporter: Transporter;
	options: SendMailOptions;

	/**
	 * 
	 * @param subject Email subject
	 * @param email Recepients email
	 * @param message message content
	 */
	constructor(subject: string, email: string, message: string) {
		this.options = {
			from: AppConfig.mailer.USER,
			to: email,
			subject,
			html: message
		}

		this.transporter = mailer.createTransport({
			host: AppConfig.mailer.HOST,
			port: 465,
			secure: true,
			ignoreTLS: true,
			auth: {
				user: AppConfig.mailer.USER,
				pass: AppConfig.mailer.PASSWORD
			},
			// tls:{rejectUnauthorized: false}
		});
		this.SendEmail();
	}

	private SendEmail() {
		this.transporter.sendMail(this.options)
			.then((response) => {
				console.log('SUCCESS RESPONSE FROM MAIL', response)
			}).catch((error) => {
				console.log('FAILED RESPONSE FROM MAIL', error.message);
			});
	}
}

class MailerTemplates {

}

export default Mailer;
export { MailerTemplates }