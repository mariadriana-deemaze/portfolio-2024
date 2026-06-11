type ContactEmailTemplateParams = {
	email: string;
	message: string;
	name: string;
};

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;');
}

export function buildContactEmailHtml({
	email,
	message,
	name
}: ContactEmailTemplateParams): string {
	const safeName = escapeHtml(name);
	const safeEmail = escapeHtml(email);
	const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

	return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
            </head>
            <body>
              <div class="container" style="margin-left: 20px;margin-right: 20px;">
                <h3>You've got a new mail from ${safeName}, their email is:
                  <br>${safeEmail}
                </h3>
                <div style="font-size: 16px;">
                  <p>Message:</p>
                  <p>${safeMessage}</p>
                  <br>
                </div>
                <p class="footer" style="font-size: 16px;padding-bottom: 20px;border-bottom: 1px solid #D1D5DB;">
                  Regards,
                  <br>Maria Adriana
                  <br>Software Developer
                </p>
              </div>
            </body>
          </html>`;
}
