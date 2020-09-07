import fs from 'fs';
import puppeteer from 'puppeteer';
import faker from 'faker';

import { InsertData, createManyInsertData, createInsert, getRandomNumbers } from './utils';
import { terminalAppGetDeveloper,  getDeveloperByUrl, Developer, Game, Achievement } from './Steam';
import { User, getFakeUser, getFakeMatch, Photo, getFakePhoto } from './Tinder';
import { UserGame, getFakeUserGame, UserAchievement, getFakeUserAchievement } from './Stinder';
import { Genre, getGenresByList, GameGenre } from './Steam/genre';

async function app() {

  const MAX_GAMES_PER_USER = 3;
  const START_USERS_ID = 1;
  const START_PHOTOS_ID = 1;
  const START_GAMES_ID = 1;
  const START_GENRES_ID = 1;
  const START_ACHIEVEMENTS_ID = 1;
  const DEVELOPER_ID = 1;
  //terminalAppGetDeveloper();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const developer = await getDeveloperByUrl('https://store.steampowered.com/developer/thebehemoth/#browse', page);

  const insertDeveloper: InsertData<Developer> = {
    id: DEVELOPER_ID,
    data: developer,
    insert: createInsert('Developer', developer)
  };
  insertDeveloper.data.games.forEach(game => game.developer = insertDeveloper.id);

  const insertGames: InsertData<Game>[] = createManyInsertData('Game', developer.games, START_GAMES_ID);
  const insertAchievements: InsertData<Achievement>[] = [];
  let startingId = START_ACHIEVEMENTS_ID;
  insertGames.map(game => {
    game.data.achievements.forEach(a => a.game = game.id);
    insertAchievements.push(...createManyInsertData('Achievement', game.data.achievements, startingId));
    startingId += game.data.achievements.length;
  });

  const genres: Genre[] = [];
  insertGames.forEach(game => {
    genres.push(...getGenresByList(game.data.tags));
  });
  const uniqueGenres: Genre[] = [];
  genres.forEach(genre => {
    if (!uniqueGenres.find(search => search.name === genre.name)) {
      uniqueGenres.push(genre);
    }
  }); 
  const insertGenres = createManyInsertData('Genre', uniqueGenres, START_GENRES_ID);

  const insertGameGenres: InsertData<GameGenre>[] = [];
  insertGames.forEach(game => {
    const containGenres = insertGenres.filter(genre => game.data.tags.includes(genre.data.name));
    const gameGenres: GameGenre[] = containGenres.map(genre => ({ game: game.id, genre: genre.id }) );
    insertGameGenres.push(...createManyInsertData('GameGenre', gameGenres));
  });


  let stream = fs.createWriteStream('steam.sql', { flags: 'a' });
  stream.write(insertDeveloper.insert);
  insertGames.forEach(game => stream.write(game.insert));
  insertGenres.forEach(genre => stream.write(genre.insert));
  insertGameGenres.forEach(gameGenre => stream.write(gameGenre.insert));
  insertAchievements.forEach(achievement => stream.write(achievement.insert));
  stream.end();




  /* FAKE USERS */
  const users: User[] = [];
  for (let i = 0; i < 15; i++) {
    users.push(getFakeUser());
  }
  const insertUsers: InsertData<User>[] = createManyInsertData('AppUser', users, START_USERS_ID);
  //console.log(insertUsers);

  stream = fs.createWriteStream('users.sql', { flags: 'a' });
  insertUsers.forEach(user => stream.write(user.insert));
  stream.end();

  /* USER PHOTOS */
  const photos: Photo[] = [];
  insertUsers.forEach(user => {
    const count = faker.random.number({ min: 1, max: 3 });
    for (let i = 0; i < count; i++) {
      photos.push(getFakePhoto(user.id, user.data.gender, true));
    }
  });
  const insertPhotos: InsertData<Photo>[] = createManyInsertData('Photo', photos, START_PHOTOS_ID);
  //console.log(insertUsers);

  stream = fs.createWriteStream('photos.sql', { flags: 'a' });
  insertPhotos.forEach(photo => stream.write(photo.insert));
  stream.end();

  /* USER GAMES */ 
  const userGames: UserGame[] = [];
  insertUsers.forEach(user => {
    const gameCount = faker.random.number(MAX_GAMES_PER_USER);
    const gamesIds = getRandomNumbers(gameCount, START_GAMES_ID, START_GAMES_ID + insertGames.length - 1);
    console.log(gameCount, gamesIds);
    for (let i = 0; i < gamesIds.length; i++) {
      userGames.push(getFakeUserGame(user.id, gamesIds[i]));
    }
  });
  const insertUsersGames: InsertData<UserGame>[] = createManyInsertData('UserGame', userGames);

  stream = fs.createWriteStream('usersGames.sql', { flags: 'a' });
  insertUsersGames.forEach(user => stream.write(user.insert));
  stream.end();

  /* USER ACHIEVEMENTS */ 
  const userAchievements: UserAchievement[] = [];
  insertUsersGames.forEach(userGame => {
    const achievements = insertAchievements.filter(a => a.data.game === userGame.data.game);
    if (achievements && userGame.data.hoursPlayed > 0) {
      const achievementCount = faker.random.number(achievements.length % 8);

      for (let i = 0; i < achievementCount; i++) {
        userAchievements.push(getFakeUserAchievement(userGame.data.userid, achievements[i].id));
      }
    }
  });
  const insertUsersAchievements: InsertData<UserAchievement>[] = createManyInsertData('UserAchievement', userAchievements);

  stream = fs.createWriteStream('usersAchievements.sql', { flags: 'a' });
  insertUsersAchievements.forEach(user => stream.write(user.insert));
  stream.end();
  console.log("End.");


  // insertUsers.forEach(user => {
  //   const myGames = insertUsersGames.filter(games => games.data.userid === user.id);
  //   const coolPeople = insertUsersGames.filter(person => myGames.includes(person.data.game) && person.data.userid !== user.id);
  //   const coolPeople = insertUsersGames.map(person => {
  //     const ownSameGames = myGames.filter(game => );
  //   })
  // });
}

app();
