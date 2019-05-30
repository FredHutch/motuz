# 4xx Codes

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


# 5xx Codes


class HTTP_500_INTERNAL_SERVER_ERROR(Exception):
    code = 500

class HTTP_501_NOT_IMPLEMENTED(Exception):
    code = 501

class HTTP_502_BAD_GATEWAY(Exception):
    code = 502

class HTTP_503_SERVICE_UNAVAILABLE(Exception):
    code = 503

class HTTP_504_GATEWAY_TIMEOUT(Exception):
    code = 504

class HTTP_505_HTTP_VERSION_NOT_SUPPORTED(Exception):
    code = 505

class HTTP_507_INSUFFICIENT_STORAGE(Exception):
    code = 507

class HTTP_511_NETWORK_AUTHENTICATION_REQUIRED(Exception):
    code = 511
