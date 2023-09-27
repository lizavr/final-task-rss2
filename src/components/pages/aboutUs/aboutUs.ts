import './aboutUs.scss';
import { teamInfo, cooperationDescription } from './teamData';
import { createElement } from '../../../utils/utils';
import { teamData } from '../../../types/types';

export class AboutUs {
  public wrapper: HTMLElement;

  constructor() {
    this.wrapper = createElement('div', ['about-us_page'], { id: 'about-us' });

    this.wrapper.append(this.createAboutUsContent());
  }

  private createAboutUsContent(): HTMLElement {
    const contentWrapper = createElement('div', ['about-us_content', 'width-content']);

    const teamContent = createElement('div', ['team_content']);

    teamContent.append(this.createImgTeam(), this.createDescriptionTeam());

    contentWrapper.append(teamContent, this.createPersonContent(), this.createCoperationContent());

    return contentWrapper;
  }

  private createImgTeam(): HTMLElement {
    const imgWrapper = createElement('div', ['about-us_img-wrap']);

    const abouUs_img = createElement('div', ['team-img', 'about-us_img']);

    const aboutUs_text = createElement('div', ['about-us_text'], {}, 'Totally Spies');

    imgWrapper.append(abouUs_img, aboutUs_text);
    return imgWrapper;
  }

  private createDescriptionTeam(): HTMLElement {
    const descriptionWrapper = createElement(
      'div',
      ['about-us_description-wrap'],
      {},
      `Hello!\n \n We are the "TotallySpies" team, named after our childhood idols - superheroines. \n` +
        '\n' +
        'In the world of programming, we also consider ourselves as superheroes, \n' +
        'transforming web dreams into reality with the magic of JavaScript!'
    );

    return descriptionWrapper;
  }

  private createPersonContent(): HTMLElement {
    const personContenWrapper = createElement('div', ['person_content_wrapper']);

    teamInfo.forEach((data, index) => {
      const personContent = createElement('div', ['person-content']);

      personContent.append(this.createPersonImg(data, index), this.createPersonDescription(data));

      personContenWrapper.append(personContent);
    });

    return personContenWrapper;
  }

  private createPersonImg(data: teamData, index: number): HTMLElement {
    const personImgWrap = createElement('div', ['person-content_img']);

    const imgWrapper = createElement('div', ['about-us_img-wrap']);

    const personImg = createElement('div', [`person-${index + 1}_img`, 'about-us_img']);

    const personName = createElement('div', ['about-us_text'], {}, `${data.name}`);

    imgWrapper.append(personImg, personName);

    personImgWrap.append(imgWrapper);

    return personImgWrap;
  }

  private createPersonDescription(data: teamData): HTMLElement {
    const personalData = createElement('div', ['personal-data']);

    const roleWrapper = createElement('div', ['personal_description-wrapper']);
    const roleTitle = createElement('div', ['personal_description-title'], {}, 'Role:');
    const roleText = createElement('div', [], {}, `${data.role}`);
    roleWrapper.append(roleTitle, roleText);

    const gitHubWrapper = createElement('div', ['personal_description-wrapper']);
    const gitHubTitle = createElement('div', ['personal_description-title'], {}, 'GitHub:');
    const gitHubText = createElement('a', [], { href: `${data.gitHubLink}` }, `${data.gitHubName}`);
    gitHubWrapper.append(gitHubTitle, gitHubText);

    const locationWrapper = createElement('div', ['personal_description-wrapper']);
    const locationTitle = createElement('div', ['personal_description-title'], {}, 'Location:');
    const locationText = createElement('div', [], {}, `${data.location}`);
    locationWrapper.append(locationTitle, locationText);

    const contributionWrapper = createElement('div', ['personal_description-wrapper']);
    const contributionTitle = createElement('div', ['personal_description-title'], {}, 'Contribution:');
    const contributionText = createElement('div', [], {}, `${data.contribution}`);
    contributionWrapper.append(contributionTitle, contributionText);

    const learningWrapper = createElement('div', ['personal_description-wrapper']);
    const learningTitle = createElement('div', ['personal_description-title'], {}, 'Learning:');
    const learningText = createElement('div', [], {}, `${data.learning}`);
    learningWrapper.append(learningTitle, learningText);

    personalData.append(roleWrapper, gitHubWrapper, locationWrapper, learningWrapper, contributionWrapper);

    return personalData;
  }

  private createCoperationContent(): HTMLElement {
    const cooperationContent = createElement('div', ['cooperation-wrapper']);

    cooperationDescription.forEach((data) => {
      const cooperationTitle = createElement('div', ['personal_description-title'], {}, `${data[0]}`);
      const cooperationText = createElement('div', [], {}, `${data[1]}`);
      cooperationContent.append(cooperationTitle, cooperationText);
    });

    const logo = createElement('a', ['school-logo'], { href: 'https://rs.school/js/' });

    cooperationContent.append(logo);
    return cooperationContent;
  }
}
