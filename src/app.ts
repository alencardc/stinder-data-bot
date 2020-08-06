import fs from 'fs';
import puppeteer from 'puppeteer';

import { terminalAppGetDeveloper,  getDeveloperByUrl, Developer, Game } from './Steam/index';
import { User, getFakeUser, getFakeMatch } from './Tinder/index';
import { InsertData, createManyInsertData, createInsert } from './utils';

async function app() {
  //terminalAppGetDeveloper();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const developer = await getDeveloperByUrl('https://store.steampowered.com/publisher/rockstargames/', page);

  const insertDeveloper: InsertData<Developer> = {
    id: 1,
    data: developer,
    insert: createInsert('Developer', developer)
  };
  insertDeveloper.data.games.forEach(game => game.developer = insertDeveloper.id);

  const insertGames: InsertData<Game>[] = createManyInsertData('Game', developer.games);
  const insertAchievements = insertGames.map((game, id) => {
    game.data.achievements.forEach(a => a.game = id);
    return createManyInsertData('Achievement', game.data.achievements);
  });

  let stream = fs.createWriteStream('steam.sql', { flags: 'a' });
  stream.write(insertDeveloper.insert);
  insertGames.forEach(game => stream.write(game.insert));
  insertAchievements.forEach(game => game.forEach(achievement => stream.write(achievement.insert)));
  stream.end();

  /* FAKE USERS */
  const users: User[] = [];
  for (let i = 0; i < 50; i++) {
    users.push(getFakeUser());
  }
  const insertUsers: InsertData<User>[] = createManyInsertData('User', users);
  console.log(insertUsers);

  stream = fs.createWriteStream('users.sql', { flags: 'a' });
  insertUsers.forEach(user => stream.write(user.insert));
  stream.end();
}

app();
