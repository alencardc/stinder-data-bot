import fs from 'fs';
import puppeteer from 'puppeteer';

import { askQuestion } from '../utils';
import { Developer, getDeveloperByUrl } from './developer';
import { Game, getGameByUrl } from './game';
import { Achievement, getAchievementsByUrl } from './achievement';

export async function terminalAppGetDeveloper() {
  console.log("👨🏻‍💻 GET ALL GAME DATA FROM A DEVELOPER BY STEAM URL");
  console.log("The Steam URL should looks like: https://store.steampowered.com/publisher/rockstargames/");
  const steamUrl = await askQuestion("> Steam developer's page url: ");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const developer = await getDeveloperByUrl(steamUrl, page);

  const fileName = `${developer.name.toLocaleLowerCase().replace(/ /g, '-')}.json`;
  fs.writeFile(fileName, JSON.stringify(developer, null, '\t'), err => {
    if (err) {
      console.log(err);
    }
    console.log('Despite the possible errors, something may have worked!');
  });
}

export {
  Developer,
  getDeveloperByUrl,
  Game,
  getGameByUrl,
  Achievement,
  getAchievementsByUrl
};