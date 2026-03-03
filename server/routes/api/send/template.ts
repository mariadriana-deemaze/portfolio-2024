type ContactEmailTemplateParams = {
  email: string
  message: string
  name: string
}

export function buildContactEmailHtml({
  email,
  message,
  name,
}: ContactEmailTemplateParams): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
            </head>
            <body>
              <div class="container" style="margin-left: 20px;margin-right: 20px;">
                <h3>You've got a new mail from ${name}, their email is:
                  <br>${email}
                </h3>
                <div style="font-size: 16px;">
                  <p>Message:</p>
                  <p>${message}</p>
                  <br>
                </div>
                <p class="footer" style="font-size: 16px;padding-bottom: 20px;border-bottom: 1px solid #D1D5DB;">
                  Regards,
                  <br>Maria Adriana
                  <br>Software Developer
                </p>
              </div>
            </body>
          </html>`
}
