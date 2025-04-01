"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    // Authentication Errors (1xxx)
    ErrorCode["UNAUTHORIZED"] = "ERR_1001";
    ErrorCode["INVALID_CREDENTIALS"] = "ERR_1002";
    ErrorCode["TOKEN_EXPIRED"] = "ERR_1003";
    ErrorCode["INVALID_TOKEN"] = "ERR_1004";
    ErrorCode["AUTHENTICATION_REQUIRED"] = "ERR_1005";
    // Authorization Errors (2xxx)
    ErrorCode["FORBIDDEN"] = "ERR_2001";
    ErrorCode["INSUFFICIENT_PERMISSIONS"] = "ERR_2002";
    ErrorCode["ROLE_RESTRICTED"] = "ERR_2003";
    // Validation Errors (3xxx)
    ErrorCode["INVALID_INPUT"] = "ERR_3001";
    ErrorCode["MISSING_REQUIRED_FIELD"] = "ERR_3002";
    ErrorCode["INVALID_EMAIL"] = "ERR_3003";
    ErrorCode["INVALID_PASSWORD"] = "ERR_3004";
    ErrorCode["INVALID_REQUEST"] = "ERR_3005";
    ErrorCode["VALIDATION_ERROR"] = "ERR_3006";
    ErrorCode["INVALID_FORMAT"] = "ERR_3007";
    ErrorCode["EXCEEDED_LIMIT"] = "ERR_3008";
    ErrorCode["UNSUPPORTED_TYPE"] = "ERR_3009";
    ErrorCode["VALUE_OUT_OF_RANGE"] = "ERR_3010";
    // Resource Errors (4xxx)
    ErrorCode["NOT_FOUND"] = "ERR_4001";
    ErrorCode["ALREADY_EXISTS"] = "ERR_4002";
    ErrorCode["CONFLICT"] = "ERR_4003";
    ErrorCode["RESOURCE_LOCKED"] = "ERR_4004";
    ErrorCode["RESOURCE_EXHAUSTED"] = "ERR_4005";
    ErrorCode["DEPENDENCY_NOT_FOUND"] = "ERR_4006";
    // Database Errors (5xxx)
    ErrorCode["DB_ERROR"] = "ERR_5001";
    ErrorCode["DB_CONNECTION_ERROR"] = "ERR_5002";
    ErrorCode["DB_QUERY_ERROR"] = "ERR_5003";
    ErrorCode["DB_TRANSACTION_ERROR"] = "ERR_5004";
    ErrorCode["DATA_INTEGRITY_VIOLATION"] = "ERR_5005";
    // Server Errors (6xxx)
    ErrorCode["INTERNAL_SERVER_ERROR"] = "ERR_6001";
    ErrorCode["SERVICE_UNAVAILABLE"] = "ERR_6002";
    ErrorCode["EXTERNAL_SERVICE_ERROR"] = "ERR_6003";
    ErrorCode["SERVER_TIMEOUT"] = "ERR_6004";
    ErrorCode["SERVER_OVERLOAD"] = "ERR_6005";
    // File System Errors (7xxx)
    ErrorCode["FILE_NOT_FOUND"] = "ERR_7001";
    ErrorCode["FILE_READ_ERROR"] = "ERR_7002";
    ErrorCode["FILE_WRITE_ERROR"] = "ERR_7003";
    ErrorCode["FILE_UPLOAD_ERROR"] = "ERR_7004";
    ErrorCode["UNSUPPORTED_FILE_TYPE"] = "ERR_7005";
    // Network Errors (8xxx)
    ErrorCode["NETWORK_ERROR"] = "ERR_8001";
    ErrorCode["CONNECTION_TIMEOUT"] = "ERR_8002";
    ErrorCode["DNS_ERROR"] = "ERR_8003";
    ErrorCode["PROTOCOL_ERROR"] = "ERR_8004";
    // Cache Errors (9xxx)
    ErrorCode["CACHE_ERROR"] = "ERR_9001";
    ErrorCode["CACHE_MISS"] = "ERR_9002";
    ErrorCode["CACHE_EXPIRED"] = "ERR_9003";
    // Configuration Errors (10xxx)
    ErrorCode["CONFIGURATION_ERROR"] = "ERR_10001";
    ErrorCode["MISSING_CONFIGURATION"] = "ERR_10002";
    ErrorCode["INVALID_CONFIGURATION"] = "ERR_10003";
    // Security Errors (11xxx)
    ErrorCode["SECURITY_VIOLATION"] = "ERR_11001";
    ErrorCode["CSRF_TOKEN_MISSING"] = "ERR_11002";
    ErrorCode["CSRF_TOKEN_INVALID"] = "ERR_11003";
    // Payment Errors (12xxx)
    ErrorCode["PAYMENT_REQUIRED"] = "ERR_12001";
    ErrorCode["PAYMENT_FAILED"] = "ERR_12002";
    ErrorCode["INSUFFICIENT_FUNDS"] = "ERR_12003";
    ErrorCode["PAYMENT_GATEWAY_ERROR"] = "ERR_12004";
    // API Errors (13xxx)
    ErrorCode["API_RATE_LIMIT_EXCEEDED"] = "ERR_13001";
    ErrorCode["UNSUPPORTED_API_VERSION"] = "ERR_13002";
    ErrorCode["DEPRECATED_API"] = "ERR_13003";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
