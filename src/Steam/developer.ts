import { Page } from 'puppeteer';

import { Game, getGameByUrl } from './game';

export interface Developer {
  name: string;
  thumbnailUrl: string;
  games: Game[];
}

export async function getDeveloperByUrl(url: string, page: Page): Promise<Developer> {
  await page.goto(url);

  const developerAvatar = await page.$eval('img.curator_avatar', img => img.getAttribute('src'));
  const developerName = await page.$eval('.curator_name a', el => el.innerHTML);

  const gameLinks = await page.$$eval('.recommendation a.recommendation_link', as => as.map(a => a.getAttribute('href')));

  const games: Game[] = [];
  for (let i = 0; i < gameLinks.length; i++) {
    try {
      if (gameLinks[i]) {
        const game = await getGameByUrl(gameLinks[i] as string, page);
        if (game) {
          games.push(game);
        }  
      }
    } catch (err) {
      console.log("--> Error at", gameLinks[i]);
    }
  }

  return {
    name: developerName,
    thumbnailUrl: developerAvatar as string,
    games,
  }
}