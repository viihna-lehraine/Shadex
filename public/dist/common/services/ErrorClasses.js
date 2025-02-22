// File: common/services/ErrorClasses.ts
class UserFacingError extends Error {
    userMessage;
    constructor(message, userMessage) {
        super(message);
        this.userMessage = userMessage;
        this.name = 'UserFacingError';
    }
}

export { UserFacingError };
//# sourceMappingURL=ErrorClasses.js.map
