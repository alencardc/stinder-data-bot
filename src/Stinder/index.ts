import faker from 'faker';
import { format, formatISO9075, parseISO } from 'date-fns';

export interface UserGame {
  userid: number | string;
  game: number | string;
  lastPlayedDate: string;
  hoursPlayed: number;
}

export function getFakeUserGame(user: number | string, game: number | string): UserGame {
  faker.locale ='pt_BR';

  const date = faker.date.past(1, new Date());
  const hoursPlayed = faker.random.number((1 + faker.random.number(5) % 3)*1000);

  return { 
    userid: user,
    game,
    hoursPlayed,
    lastPlayedDate: formatISO9075(date),
  }
}

export interface UserAchievement {
  userid: string | number;
  achievement: string | number;
  createdAt: string;
}

export function getFakeUserAchievement(
  userid: number | string, 
  achievement: number | string, 
  refDate?: string
): UserAchievement {
  const date = refDate ? faker.date.past(1, parseISO(refDate) ): faker.date.past(1);

  return {
    userid,
    achievement, 
    createdAt: formatISO9075(date),
  }
}