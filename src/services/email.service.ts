import mailer, { SendMailOptions, Transporter } from 'nodemailer';
import AppConfig from '../configs/app.config';

type Recepient = { email: string; firstName: string }

/**@description Sends email to via SMTP */
class Mailer {
	private transporter: Transporter;
	content: string | undefined;
	recepient: Recepient;
	options: SendMailOptions;

	/**
	 * 
	 * @param subject Email subject
	 * @param recepient Recepients object
	 * @param message message content
	 */
	constructor(subject: string, recepient: Recepient, message?: string) {
		this.content = message;
		this.recepient = recepient;
		this.options = {
			from: `ProxyBet <${AppConfig.mailer.USER}>`,
			to: recepient.email,
			subject,
			html: this.WelcomeMessage()
		}

		this.transporter = mailer.createTransport({
			host: AppConfig.mailer.HOST,
			port: 465,
			secure: true,
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

	/**
	 * Email template for welcome message
	 * @returns String
	 */
	WelcomeMessage(): string {
			const template = `<h1 style="text-align:center">Welcome ${this.recepient.firstName},</h1>
                <p style="text-align:center">
                Thank you for signing up with ProxyBET, we're so happy to have you
                on board. You are now one step closer to becoming a bet king!<br>
                Your account has been Activated!</p>
                
                <div style="text-align:center; margin: 50px 0">
                <a 
                    href="https://proxybet.com/dashboard" 
                    target="_blank"
                    style="
                        width: 70%; 
                        padding:15px; 
                        background: #008080;
                        text-decoration: none;
                        text-align:center;
                        border-radius: 5px;
                        margin: 20px;
                        box-shadow: 0 1px 2px #333;
                        font-weight: bold;
                        color: #fff"
                >Click Here to Fund Wallet</a>
                </div>
                <hr>
                 <small>
                    <p>&copy; ${new Date().getUTCFullYear()} <a style="color: #008080; text-decoration: none" href="https://proxybet.com" target="_blank">ProxyBet</a>. All rights reserved.</p>
                </small>
                <p>
                `

		return template
	}
}


export default Mailer;