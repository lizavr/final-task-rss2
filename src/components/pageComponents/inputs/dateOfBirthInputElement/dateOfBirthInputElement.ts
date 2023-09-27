import { PubSub } from '../../../../services/pubSub';
import BaseInputElement from '../baseInputElement/baseInputElement';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import './dateOfBirthInputElement.scss';

export default class DateOfBirthInputElement extends BaseInputElement {
  private pubSub: PubSub;

  constructor(placeholder = 'Date of birth') {
    super(placeholder, 'date', 'form-element_dateOfBirth');
    this.pubSub = PubSub.getInstance();
    this.pubSub.subscribe(PubSub.eventName.contentRendered, () => this.onContentRendered());
  }

  private onContentRendered() {
    flatpickr(this.getInputElement(), { enableTime: false });
  }

  protected validateValue(): string[] {
    const CHECKING_AGE = 13;
    const value = this.getValue();

    const msg: string[] = [];

    const dateCurrent = new Date();
    dateCurrent.setDate(dateCurrent.getDate() + 1);
    const dateBirth = new Date(value);
    dateBirth.setFullYear(dateBirth.getFullYear() + CHECKING_AGE);

    if (!value) {
      msg.push(`Please, add date of birth`);
    }

    if (dateCurrent.getTime() < dateBirth.getTime()) {
      msg.push(`You should be ${CHECKING_AGE} years old or older`);
    }
    return msg;
  }
}
