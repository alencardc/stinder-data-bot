import { Page } from 'puppeteer';

export interface Achievement {
  name: string;
  description: string;
  thumbnailUrl: string;
}

export async function getAchievementsByUrl(url: string, page: Page): Promise<Achievement[]> {
  await page.goto(url);

  const achievements: Achievement[] = await page.$$eval('.achieveRow ', divs => divs.map(div => {
    return { 
      name: div.getElementsByTagName('h3')[0].innerText,
      description: div.getElementsByTagName('h5')[0].innerText,
      thumbnailUrl: div.getElementsByTagName('img')[0].getAttribute('src') as string,
    }
  }));

  return achievements;
}
