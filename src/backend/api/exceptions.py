class HTTP_400_BAD_REQUEST(Exception):
    code = 400

class HTTP_401_UNAUTHORIZED(Exception):
    code = 401

class HTTP_402_PAYMENT_REQUIRED(Exception):
    code = 402

class HTTP_403_FORBIDDEN(Exception):
    code = 403

class HTTP_404_NOT_FOUND(Exception):
    code = 404

class HTTP_405_METHOD_NOT_ALLOWED(Exception):
    code = 405
