import './style.scss';
import 'toastify-js/src/toastify.css';
import { App } from './components/app/app';

const app = new App();

document.body.append(app.wrapper);
