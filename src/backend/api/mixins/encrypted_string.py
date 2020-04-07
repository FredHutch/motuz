from sqlalchemy_utils import EncryptedType
from sqlalchemy_utils.types.encrypted.encrypted_type import AesGcmEngine

def EncryptedString(db):
    SensitiveColumn = db.String
    try:
        encryption_key = db.app.config.get('MOTUZ_DATABASE_ENCRYPTION_KEY')
        if encryption_key:
            SensitiveColumn = EncryptedType(db.String, encryption_key, AesGcmEngine)
    except ValueError as e:
        logging.exception(e)

    return SensitiveColumn
