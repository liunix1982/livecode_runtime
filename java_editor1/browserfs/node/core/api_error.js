"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (ErrorCode) {
    ErrorCode[ErrorCode["EPERM"] = 0] = "EPERM";
    ErrorCode[ErrorCode["ENOENT"] = 1] = "ENOENT";
    ErrorCode[ErrorCode["EIO"] = 2] = "EIO";
    ErrorCode[ErrorCode["EBADF"] = 3] = "EBADF";
    ErrorCode[ErrorCode["EACCES"] = 4] = "EACCES";
    ErrorCode[ErrorCode["EBUSY"] = 5] = "EBUSY";
    ErrorCode[ErrorCode["EEXIST"] = 6] = "EEXIST";
    ErrorCode[ErrorCode["ENOTDIR"] = 7] = "ENOTDIR";
    ErrorCode[ErrorCode["EISDIR"] = 8] = "EISDIR";
    ErrorCode[ErrorCode["EINVAL"] = 9] = "EINVAL";
    ErrorCode[ErrorCode["EFBIG"] = 10] = "EFBIG";
    ErrorCode[ErrorCode["ENOSPC"] = 11] = "ENOSPC";
    ErrorCode[ErrorCode["EROFS"] = 12] = "EROFS";
    ErrorCode[ErrorCode["ENOTEMPTY"] = 13] = "ENOTEMPTY";
    ErrorCode[ErrorCode["ENOTSUP"] = 14] = "ENOTSUP";
})(exports.ErrorCode || (exports.ErrorCode = {}));
var ErrorCode = exports.ErrorCode;
var ErrorStrings = {};
ErrorStrings[ErrorCode.EPERM] = 'Operation not permitted.';
ErrorStrings[ErrorCode.ENOENT] = 'No such file or directory.';
ErrorStrings[ErrorCode.EIO] = 'Input/output error.';
ErrorStrings[ErrorCode.EBADF] = 'Bad file descriptor.';
ErrorStrings[ErrorCode.EACCES] = 'Permission denied.';
ErrorStrings[ErrorCode.EBUSY] = 'Resource busy or locked.';
ErrorStrings[ErrorCode.EEXIST] = 'File exists.';
ErrorStrings[ErrorCode.ENOTDIR] = 'File is not a directory.';
ErrorStrings[ErrorCode.EISDIR] = 'File is a directory.';
ErrorStrings[ErrorCode.EINVAL] = 'Invalid argument.';
ErrorStrings[ErrorCode.EFBIG] = 'File is too big.';
ErrorStrings[ErrorCode.ENOSPC] = 'No space left on disk.';
ErrorStrings[ErrorCode.EROFS] = 'Cannot modify a read-only file system.';
ErrorStrings[ErrorCode.ENOTEMPTY] = 'Directory is not empty.';
ErrorStrings[ErrorCode.ENOTSUP] = 'Operation is not supported.';
var ApiError = (function (_super) {
    __extends(ApiError, _super);
    function ApiError(type, message, path) {
        if (message === void 0) { message = ErrorStrings[type]; }
        if (path === void 0) { path = null; }
        _super.call(this, message);
        this.syscall = "";
        this.errno = type;
        this.code = ErrorCode[type];
        this.path = path;
        this.stack = (new Error()).stack;
        this.message = "Error: " + this.code + ": " + message + (this.path ? ", '" + this.path + "'" : '');
    }
    ApiError.prototype.toString = function () {
        return this.message;
    };
    ApiError.prototype.toJSON = function () {
        return {
            errno: this.errno,
            code: this.code,
            path: this.path,
            stack: this.stack,
            message: this.message
        };
    };
    ApiError.fromJSON = function (json) {
        var err = new ApiError(0);
        err.errno = json.errno;
        err.code = json.code;
        err.path = json.path;
        err.stack = json.stack;
        err.message = json.message;
        return err;
    };
    ApiError.prototype.writeToBuffer = function (buffer, i) {
        if (buffer === void 0) { buffer = new Buffer(this.bufferSize()); }
        if (i === void 0) { i = 0; }
        var bytesWritten = buffer.write(JSON.stringify(this.toJSON()), i + 4);
        buffer.writeUInt32LE(bytesWritten, i);
        return buffer;
    };
    ApiError.fromBuffer = function (buffer, i) {
        if (i === void 0) { i = 0; }
        return ApiError.fromJSON(JSON.parse(buffer.toString('utf8', i + 4, i + 4 + buffer.readUInt32LE(i))));
    };
    ApiError.prototype.bufferSize = function () {
        return 4 + Buffer.byteLength(JSON.stringify(this.toJSON()));
    };
    ApiError.FileError = function (code, p) {
        return new ApiError(code, ErrorStrings[code], p);
    };
    ApiError.ENOENT = function (path) {
        return this.FileError(ErrorCode.ENOENT, path);
    };
    ApiError.EEXIST = function (path) {
        return this.FileError(ErrorCode.EEXIST, path);
    };
    ApiError.EISDIR = function (path) {
        return this.FileError(ErrorCode.EISDIR, path);
    };
    ApiError.ENOTDIR = function (path) {
        return this.FileError(ErrorCode.ENOTDIR, path);
    };
    ApiError.EPERM = function (path) {
        return this.FileError(ErrorCode.EPERM, path);
    };
    ApiError.ENOTEMPTY = function (path) {
        return this.FileError(ErrorCode.ENOTEMPTY, path);
    };
    return ApiError;
}(Error));
exports.ApiError = ApiError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpX2Vycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvcmUvYXBpX2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUtBLFdBQVksU0FBUztJQUNuQiwyQ0FBSyxDQUFBO0lBQUUsNkNBQU0sQ0FBQTtJQUFFLHVDQUFHLENBQUE7SUFBRSwyQ0FBSyxDQUFBO0lBQUUsNkNBQU0sQ0FBQTtJQUFFLDJDQUFLLENBQUE7SUFBRSw2Q0FBTSxDQUFBO0lBQUUsK0NBQU8sQ0FBQTtJQUFFLDZDQUFNLENBQUE7SUFBRSw2Q0FBTSxDQUFBO0lBQ3pFLDRDQUFLLENBQUE7SUFBRSw4Q0FBTSxDQUFBO0lBQUUsNENBQUssQ0FBQTtJQUFFLG9EQUFTLENBQUE7SUFBRSxnREFBTyxDQUFBO0FBQzFDLENBQUMsRUFIVyxpQkFBUyxLQUFULGlCQUFTLFFBR3BCO0FBSEQsSUFBWSxTQUFTLEdBQVQsaUJBR1gsQ0FBQTtBQUlELElBQUksWUFBWSxHQUE2QixFQUFFLENBQUM7QUFDaEQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRywwQkFBMEIsQ0FBQztBQUMzRCxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLDRCQUE0QixDQUFDO0FBQzlELFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcscUJBQXFCLENBQUM7QUFDcEQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxzQkFBc0IsQ0FBQztBQUN2RCxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLG9CQUFvQixDQUFDO0FBQ3RELFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsMEJBQTBCLENBQUM7QUFDM0QsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxjQUFjLENBQUM7QUFDaEQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRywwQkFBMEIs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LFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFYSxjQUFLLEdBQW5CLFVBQW9CLElBQVk7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRWEsa0JBQVMsR0FBdkIsVUFBd0IsSUFBWTtRQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFDSCxlQUFDO0FBQUQsQ0FBQyxBQXhHRCxDQUE4QixLQUFLLEdBd0dsQztBQXhHWSxnQkFBUSxXQXdHcEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3RhbmRhcmQgbGliYyBlcnJvciBjb2Rlcy4gQWRkIG1vcmUgdG8gdGhpcyBlbnVtIGFuZCBFcnJvclN0cmluZ3MgYXMgdGhleSBhcmVcbiAqIG5lZWRlZC5cbiAqIEB1cmwgaHR0cDovL3d3dy5nbnUub3JnL3NvZnR3YXJlL2xpYmMvbWFudWFsL2h0bWxfbm9kZS9FcnJvci1Db2Rlcy5odG1sXG4gKi9cbmV4cG9ydCBlbnVtIEVycm9yQ29kZSB7XG4gIEVQRVJNLCBFTk9FTlQsIEVJTywgRUJBREYsIEVBQ0NFUywgRUJVU1ksIEVFWElTVCwgRU5PVERJUiwgRUlTRElSLCBFSU5WQUwsXG4gIEVGQklHLCBFTk9TUEMsIEVST0ZTLCBFTk9URU1QVFksIEVOT1RTVVBcbn1cbi8qKlxuICogU3RyaW5ncyBhc3NvY2lhdGVkIHdpdGggZWFjaCBlcnJvciBjb2RlLlxuICovXG52YXIgRXJyb3JTdHJpbmdzOiB7W2NvZGU6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbkVycm9yU3RyaW5nc1tFcnJvckNvZGUuRVBFUk1dID0gJ09wZXJhdGlvbiBub3QgcGVybWl0dGVkLic7XG5FcnJvclN0cmluZ3NbRXJyb3JDb2RlLkVOT0VOVF0gPSAnTm8gc3VjaCBmaWxlIG9yIGRpcmVjdG9yeS4nO1xuRXJyb3JTdHJpbmdzW0Vycm9yQ29kZS5FSU9dID0gJ0lucHV0L291dHB1dCBlcnJvci4nO1xuRXJyb3JTdHJpbmdzW0Vycm9yQ29kZS5FQkFERl0gPSAnQmFkIGZpbGUgZGVzY3JpcHRvci4nO1xuRXJyb3JTdHJpbmdzW0Vycm9yQ29kZS5FQUNDRVNdID0gJ1Blcm1pc3Npb24gZGVuaWVkLic7XG5FcnJvclN0cmluZ3NbRXJyb3JDb2RlLkVCVVNZXSA9ICdSZXNvdXJjZSBidXN5IG9yIGxvY2tlZC4nO1xuRXJyb3JTdHJpbmdzW0Vycm9yQ29kZS5FRVhJU1RdID0gJ0ZpbGUgZXhpc3RzLic7XG5FcnJvclN0cmluZ3NbRXJyb3JDb2RlLkVOT1RESVJdID0gJ0ZpbGUgaXMgbm90IGEgZGlyZWN0b3J5Lic7XG5FcnJvclN0cmluZ3NbRXJyb3JDb2RlLkVJU0RJUl0gPSAnRmlsZSBpcyBhIGRpcmVjdG9yeS4nO1xuRXJyb3JTdHJpbmdzW0Vycm9yQ29kZS5FSU5WQUxdID0gJ0ludmFsaWQgYXJndW1lbnQuJztcbkVycm9yU3RyaW5nc1tFcnJvckNvZGUuRUZCSUddID0gJ0ZpbGUgaXMgdG9vIGJpZy4nO1xuRXJyb3JTdHJpbmdzW0Vycm9yQ29kZS5FTk9TUENdID0gJ05vIHNwYWNlIGxlZnQgb24gZGlzay4nO1xuRXJyb3JTdHJpbmdzW0Vycm9yQ29kZS5FUk9GU10gPSAnQ2Fubm90IG1vZGlmeSBhIHJlYWQtb25seSBmaWxlIHN5c3RlbS4nO1xuRXJyb3JTdHJpbmdzW0Vycm9yQ29kZS5FTk9URU1QVFldID0gJ0RpcmVjdG9yeSBpcyBub3QgZW1wdHkuJztcbkVycm9yU3RyaW5nc1tFcnJvckNvZGUuRU5PVFNVUF0gPSAnT3BlcmF0aW9uIGlzIG5vdCBzdXBwb3J0ZWQuJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQnJvd3NlckZTIGVycm9yLiBQYXNzZWQgYmFjayB0byBhcHBsaWNhdGlvbnMgYWZ0ZXIgYSBmYWlsZWRcbiAqIGNhbGwgdG8gdGhlIEJyb3dzZXJGUyBBUEkuXG4gKiBlcnJubz86IG51bWJlcjtcbiAgICAgICAgY29kZT86IHN0cmluZztcbiAgICAgICAgcGF0aD86IHN0cmluZztcbiAgICAgICAgc3lzY2FsbD86IHN0cmluZztcbiAgICAgICAgc3RhY2s/OiBzdHJpbmc7XG4gKi9cbmV4cG9ydCBjbGFzcyBBcGlFcnJvciBleHRlbmRzIEVycm9yIGltcGxlbWVudHMgTm9kZUpTLkVycm5vRXhjZXB0aW9uIHtcbiAgcHVibGljIGVycm5vOiBFcnJvckNvZGU7XG4gIHB1YmxpYyBjb2RlOiBzdHJpbmc7XG4gIHB1YmxpYyBwYXRoOiBzdHJpbmc7XG4gIC8vIFVuc3VwcG9ydGVkLlxuICBwdWJsaWMgc3lzY2FsbDogc3RyaW5nID0gXCJcIjtcbiAgcHVibGljIHN0YWNrOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgYSBCcm93c2VyRlMgZXJyb3IuIFBhc3NlZCBiYWNrIHRvIGFwcGxpY2F0aW9ucyBhZnRlciBhIGZhaWxlZFxuICAgKiBjYWxsIHRvIHRoZSBCcm93c2VyRlMgQVBJLlxuICAgKlxuICAgKiBFcnJvciBjb2RlcyBtaXJyb3IgdGhvc2UgcmV0dXJuZWQgYnkgcmVndWxhciBVbml4IGZpbGUgb3BlcmF0aW9ucywgd2hpY2ggaXNcbiAgICogd2hhdCBOb2RlIHJldHVybnMuXG4gICAqIEBjb25zdHJ1Y3RvciBBcGlFcnJvclxuICAgKiBAcGFyYW0gdHlwZSBUaGUgdHlwZSBvZiB0aGUgZXJyb3IuXG4gICAqIEBwYXJhbSBbbWVzc2FnZV0gQSBkZXNjcmlwdGl2ZSBlcnJvciBtZXNzYWdlLlxuICAgKi9cbiAgY29uc3RydWN0b3IodHlwZTogRXJyb3JDb2RlLCBtZXNzYWdlOiBzdHJpbmcgPSBFcnJvclN0cmluZ3NbdHlwZV0sIHBhdGg6IHN0cmluZyA9IG51bGwpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLmVycm5vID0gdHlwZTtcbiAgICB0aGlzLmNvZGUgPSBFcnJvckNvZGVbdHlwZV07XG4gICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB0aGlzLnN0YWNrID0gKDxhbnk+bmV3IEVycm9yKCkpLnN0YWNrO1xuICAgIHRoaXMubWVzc2FnZSA9IGBFcnJvcjogJHt0aGlzLmNvZGV9OiAke21lc3NhZ2V9JHt0aGlzLnBhdGggPyBgLCAnJHt0aGlzLnBhdGh9J2AgOiAnJ31gO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4gQSBmcmllbmRseSBlcnJvciBtZXNzYWdlLlxuICAgKi9cbiAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubWVzc2FnZTtcbiAgfVxuXG4gIHB1YmxpYyB0b0pTT04oKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJybm86IHRoaXMuZXJybm8sXG4gICAgICBjb2RlOiB0aGlzLmNvZGUsXG4gICAgICBwYXRoOiB0aGlzLnBhdGgsXG4gICAgICBzdGFjazogdGhpcy5zdGFjayxcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZVxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZyb21KU09OKGpzb246IGFueSk6IEFwaUVycm9yIHtcbiAgICB2YXIgZXJyID0gbmV3IEFwaUVycm9yKDApO1xuICAgIGVyci5lcnJubyA9IGpzb24uZXJybm87XG4gICAgZXJyLmNvZGUgPSBqc29uLmNvZGU7XG4gICAgZXJyLnBhdGggPSBqc29uLnBhdGg7XG4gICAgZXJyLnN0YWNrID0ganNvbi5zdGFjaztcbiAgICBlcnIubWVzc2FnZSA9IGpzb24ubWVzc2FnZTtcbiAgICByZXR1cm4gZXJyO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlcyB0aGUgQVBJIGVycm9yIGludG8gYSBidWZmZXIuXG4gICAqL1xuICBwdWJsaWMgd3JpdGVUb0J1ZmZlcihidWZmZXI6IEJ1ZmZlciA9IG5ldyBCdWZmZXIodGhpcy5idWZmZXJTaXplKCkpLCBpOiBudW1iZXIgPSAwKTogQnVmZmVyIHtcbiAgICB2YXIgYnl0ZXNXcml0dGVuID0gYnVmZmVyLndyaXRlKEpTT04uc3RyaW5naWZ5KHRoaXMudG9KU09OKCkpLCBpICsgNCk7XG4gICAgYnVmZmVyLndyaXRlVUludDMyTEUoYnl0ZXNXcml0dGVuLCBpKTtcbiAgICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gQXBpRXJyb3Igb2JqZWN0IGZyb20gYSBidWZmZXIuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21CdWZmZXIoYnVmZmVyOiBCdWZmZXIsIGk6IG51bWJlciA9IDApOiBBcGlFcnJvciB7XG4gICAgcmV0dXJuIEFwaUVycm9yLmZyb21KU09OKEpTT04ucGFyc2UoYnVmZmVyLnRvU3RyaW5nKCd1dGY4JywgaSArIDQsIGkgKyA0ICsgYnVmZmVyLnJlYWRVSW50MzJMRShpKSkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc2l6ZSBvZiB0aGUgQVBJIGVycm9yIGluIGJ1ZmZlci1mb3JtIGluIGJ5dGVzLlxuICAgKi9cbiAgcHVibGljIGJ1ZmZlclNpemUoKTogbnVtYmVyIHtcbiAgICAvLyA0IGJ5dGVzIGZvciBzdHJpbmcgbGVuZ3RoLlxuICAgIHJldHVybiA0ICsgQnVmZmVyLmJ5dGVMZW5ndGgoSlNPTi5zdHJpbmdpZnkodGhpcy50b0pTT04oKSkpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBGaWxlRXJyb3IoY29kZTogRXJyb3JDb2RlLCBwOiBzdHJpbmcpOiBBcGlFcnJvciB7XG4gICAgcmV0dXJuIG5ldyBBcGlFcnJvcihjb2RlLCBFcnJvclN0cmluZ3NbY29kZV0sIHApO1xuICB9XG4gIHB1YmxpYyBzdGF0aWMgRU5PRU5UKHBhdGg6IHN0cmluZyk6IEFwaUVycm9yIHtcbiAgICByZXR1cm4gdGhpcy5GaWxlRXJyb3IoRXJyb3JDb2RlLkVOT0VOVCwgcGF0aCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIEVFWElTVChwYXRoOiBzdHJpbmcpOiBBcGlFcnJvciB7XG4gICAgcmV0dXJuIHRoaXMuRmlsZUVycm9yKEVycm9yQ29kZS5FRVhJU1QsIHBhdGgpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBFSVNESVIocGF0aDogc3RyaW5nKTogQXBpRXJyb3Ige1xuICAgIHJldHVybiB0aGlzLkZpbGVFcnJvcihFcnJvckNvZGUuRUlTRElSLCBwYXRoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgRU5PVERJUihwYXRoOiBzdHJpbmcpOiBBcGlFcnJvciB7XG4gICAgcmV0dXJuIHRoaXMuRmlsZUVycm9yKEVycm9yQ29kZS5FTk9URElSLCBwYXRoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgRVBFUk0ocGF0aDogc3RyaW5nKTogQXBpRXJyb3Ige1xuICAgIHJldHVybiB0aGlzLkZpbGVFcnJvcihFcnJvckNvZGUuRVBFUk0sIHBhdGgpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBFTk9URU1QVFkocGF0aDogc3RyaW5nKTogQXBpRXJyb3Ige1xuICAgIHJldHVybiB0aGlzLkZpbGVFcnJvcihFcnJvckNvZGUuRU5PVEVNUFRZLCBwYXRoKTtcbiAgfVxufVxuIl19