export class UserFacingError extends Error {
	constructor(
		message: string,
		public userMessage?: string
	) {
		super(message);
		this.name = 'UserFacingError';
	}
}
