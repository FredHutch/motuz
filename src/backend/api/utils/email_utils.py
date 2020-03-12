from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header
import smtplib

class Email:
    def __init__(self, *,
        MAIL_SERVER,
        MAIL_USERNAME=None,
        MAIL_PASSWORD=None,
        MAIL_DEFAULT_SENDER=None,
        MAIL_USE_TLS=False,
        MAIL_DEBUG=False,
    ):
        self._MAIL_SERVER = MAIL_SERVER
        self._MAIL_USERNAME = MAIL_USERNAME
        self._MAIL_PASSWORD = MAIL_PASSWORD
        self._MAIL_DEFAULT_SENDER = MAIL_DEFAULT_SENDER
        self._MAIL_USE_TLS = MAIL_USE_TLS
        self._MAIL_DEBUG = MAIL_DEBUG


    def send(self, *, to, subject, body):
        try:
            with smtplib.SMTP(self._MAIL_SERVER) as smtp:
                if self._MAIL_USERNAME or self._MAIL_PASSWORD:
                    smtp.login(self._MAIL_USERNAME, self._MAIL_PASSWORD)

                if self._MAIL_USE_TLS:
                    smtp.starttls()

                if self._MAIL_DEBUG:
                    smtp.set_debuglevel(1)

                msg = MIMEText(body, 'plain', 'utf-8')
                msg['Subject'] = Header(subject, 'utf-8')
                msg['From'] = self._MAIL_DEFAULT_SENDER
                msg['To'] = to

                result = smtp.send_message(msg)
        except smtplib.SMTPException as e:
            raise EmailError("Email send FAILED: {}".format(repr(e)))
        except Exception as e:
            raise EmailError("Email sending FAILED {}".format(repr(e)))



class EmailError(Exception):
    pass



if __name__ == "__main__":
    email = Email(
        MAIL_SERVER='localhost:25',
        MAIL_DEFAULT_SENDER='noreply@example.org',
        MAIL_DEBUG=False,
    )
    email.send(
        subject="Test",
        to='hello@mail.com',
        body="Hello World"
    )
