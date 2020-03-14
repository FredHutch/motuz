from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header
import logging
import smtplib
import os

class Email:
    def __init__(self,
        MAIL_SERVER,
        MAIL_USER=None,
        MAIL_PASSWORD=None,
        MAIL_DEFAULT_SENDER=None,
        MAIL_REQUIRE_SSL=False,
        MAIL_DEBUG=False,
    ):
        self._MAIL_SERVER = MAIL_SERVER
        self._MAIL_USERNAME = MAIL_USER
        self._MAIL_PASSWORD = MAIL_PASSWORD
        self._MAIL_DEFAULT_SENDER = MAIL_DEFAULT_SENDER
        self._MAIL_REQUIRE_SSL = MAIL_REQUIRE_SSL
        self._MAIL_DEBUG = MAIL_DEBUG


    def send(self, to, subject, body):
        try:
            if self._MAIL_REQUIRE_SSL:
                Connection = smtplib.SMTP_SSL
            else:
                Connection = smtplib.SMTP

            with Connection(self._MAIL_SERVER) as smtp:
                smtp.ehlo()
                if self._MAIL_USERNAME or self._MAIL_PASSWORD:
                    smtp.login(self._MAIL_USERNAME, self._MAIL_PASSWORD)

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


    @staticmethod
    def send_notification(to, subject):
        try:
            if to is None:
                return

            MOTUZ_SMTP_SERVER = os.environ.get('MOTUZ_SMTP_SERVER')
            if MOTUZ_SMTP_SERVER is None:
                logging.error("env variable MOTUZ_SMTP_SERVER not set")
                return

            body = subject

            use_tls = False
            MOTUZ_SMTP_REQUIRE_SSL = os.environ.get('MOTUZ_SMTP_REQUIRE_SSL')
            if not MOTUZ_SMTP_REQUIRE_SSL:
                use_tls = MOTUZ_SMTP_SERVER.split(':')[-1] in ('465')
            else:
                use_tls = str(MOTUZ_SMTP_REQUIRE_SSL).lower() in ('true', 't')

            email = Email(
                MAIL_SERVER=MOTUZ_SMTP_SERVER,
                MAIL_USER=os.environ.get('MOTUZ_SMTP_USER'),
                MAIL_PASSWORD=os.environ.get('MOTUZ_SMTP_PASSWORD'),
                MAIL_REQUIRE_SSL=use_tls,
                MAIL_DEFAULT_SENDER='noreply@fredhutch.org',
            )
            email.send(to, subject, body)
            logging.info("Sent notification email to {}".format(to))
        except Exception as e:
            logging.exception(e)



class EmailError(Exception):
    pass



if __name__ == "__main__":
    if os.environ.get('MOTUZ_SMTP_SERVER') is not None:
        Email.send_notification('example@email.com', 'Copy Job with ID {{task_id}} completed!')
    else:
        email = Email(
            MAIL_SERVER='smtp.gmail.com:465',
            MAIL_DEFAULT_SENDER='example@gmail.com',
            MAIL_USER='example@gmail.com',
            MAIL_PASSWORD='123',
            MAIL_DEBUG=True,
        )
        email.send(
            subject="Test",
            to='example@email.com',
            body="Hello World"
        )
