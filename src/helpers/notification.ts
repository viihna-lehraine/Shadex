import { config } from '../config/constants';
import * as fnObjects from '../index/fn-objects';

function showToast(message: string): void {
	const toast = document.createElement('div');

	toast.className = 'toast-message';

	toast.textContent = message;

	document.body.appendChild(toast);

	setTimeout(() => {
		toast.classList.add('fade-out');
		toast.addEventListener('transitioned', () => toast.remove());
	}, config.toastTimeout || 3000);
}

export const notification: fnObjects.Notification = {
	showToast
};
