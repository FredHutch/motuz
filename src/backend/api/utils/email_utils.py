from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from smtplib import SMTP

class Email:
    def __init__(self, *,
        MAIL_SERVER,
        MAIL_USERNAME=None,
        MAIL_PASSWORD=None,
        MAIL_DEFAULT_SENDER=None,
        MAIL_USE_TLS=False,
        MAIL_USE_SSL=False,
        MAIL_DEBUG=False,
    ):
        self._MAIL_SERVER = MAIL_SERVER
        self._MAIL_USERNAME = MAIL_USERNAME
        self._MAIL_PASSWORD = MAIL_PASSWORD
        self._MAIL_DEFAULT_SENDER = MAIL_DEFAULT_SENDER
        self._MAIL_USE_TLS = MAIL_USE_TLS
        self._MAIL_USE_SSL = MAIL_USE_SSL
        self._MAIL_DEBUG = MAIL_DEBUG


    def send(self, *, to, subject, body):
        with SMTP(self._MAIL_SERVER) as smtp:
            if self._MAIL_USERNAME and self._MAIL_PASSWORD:
                smtp.login(self._MAIL_USERNAME, self._MAIL_PASSWORD)

            msg = MIMEMultipart()

            # setup the parameters of the message
            msg['From'] = self._MAIL_DEFAULT_SENDER
            msg['To'] = to
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            result = smtp.send_message(msg)


if __name__ == "__main__":
    email = Email(
        MAIL_SERVER='localhost:222',
        MAIL_DEFAULT_SENDER='noreply@example.org',
    )
    email.send(
        subject="Test",
        to='noreply@example.com',
        body="Hello World"
    )
