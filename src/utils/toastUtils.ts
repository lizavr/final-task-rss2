import Toastify from 'toastify-js';

const TOAST_DURATION = 5000;

export function showSuccessfulToast(msg: string): void {
  Toastify({
    text: msg,
    duration: TOAST_DURATION,
    gravity: 'top',
    position: 'center',
    stopOnFocus: true,
    style: {
      background: 'green',
    },
  }).showToast();
}

export function showErrorToast(msg: string): void {
  Toastify({
    text: msg,
    duration: TOAST_DURATION,
    gravity: 'top',
    position: 'center',
    stopOnFocus: true,
    style: {
      background: 'red',
    },
  }).showToast();
}

export function showInfoToast(msg: string): void {
  Toastify({
    text: msg,
    duration: TOAST_DURATION,
    gravity: 'top',
    position: 'center',
    stopOnFocus: true,
    style: {
      background: 'orange',
    },
  }).showToast();
}
