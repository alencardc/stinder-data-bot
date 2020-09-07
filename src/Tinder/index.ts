import faker from 'faker';
import { geradorNomeFeminino, geradorNomeMasculino } from 'gerador-nome';
import { format, formatISO9075 } from 'date-fns';

import { makeRandomSequence } from '../utils';

export interface User {
  email: string;
  password: string;
  name: string;
  birthdate: string;
  description: string;
  gender: 'f' | 'm';
}

export function getFakeUser(): User {
  faker.locale ='pt_BR';

  const date = faker.date.past(65, new Date('2001-03-09'));
  const gender = faker.random.boolean() ? 'f' : 'm';
  const firstName = gender === 'm' ? geradorNomeMasculino() : geradorNomeFeminino();
  const lastName = faker.name.lastName();

  return { 
    email: faker.internet.email(firstName, lastName).toLocaleLowerCase(),
    password: faker.internet.password(16),
    name: `${firstName} ${lastName}`,
    birthdate: format(date, 'yyyy-M-d'),
    description: faker.lorem.paragraph(3),
    gender,
  }
}

export interface GoldUser {
  cpf: string;
  expiresAt: string;
  street: string;
  number: number;
  city: string;
  uf: string;
  cep: string;
}

export function getFakeGoldUser() {
  return {
    cpf: makeRandomSequence(11),
    expiresAt: format(faker.date.past(1), 'yyyy-M-d'),
    street: faker.address.streetName(),
    number: faker.random.number(32000),
    city: faker.address.city(1),
    uf: faker.address.stateAbbr(),
    cep: makeRandomSequence(8),
  }
}

export interface CreditCard {
  name: string;
  number: string;
  securityCode: string;
  expiresAt: string;
}

export function getFakeCreditCard(name?: string): CreditCard {
  const date = faker.date.future(10);

  return {
    name: name ? name : faker.name.findName().toLocaleUpperCase(),
    number: makeRandomSequence(16),
    securityCode: makeRandomSequence(3),
    expiresAt: format(date, 'yyyy-M-d'),
  }
}

export interface Photo {
  userid: string | number;
  url: string;
  isValid: boolean;
}

export function getFakePhoto(userid: string | number, gender: 'f' | 'm', isValid?: boolean) {
  const random = faker.random.number(99);
  const genderName = gender === 'f' ? 'women' : 'men';

  return {
    userid,
    url: `https://randomuser.me/api/portraits/${genderName}/${random}.jpg`,
    isValid: !!isValid,
  }
}

export interface Match {
  userOne: number;
  userTwo: number;
  isValid: boolean;
  createdAt: string;
}

export function getFakeMatch(userOne: number, userTwo: number): Match {
  return {
    userOne,
    userTwo,
    isValid: true,
    createdAt: formatISO9075(faker.date.past(1)),
  }
}

export interface Message {
  match: number;
  sender: number;
  text: string;
  createdAt: string;
}

export function createFakeMessage(match: number, sender: number): Message {
  return {
    match,
    sender,
    text: faker.lorem.sentences(faker.random.number(3)),
    createdAt: formatISO9075(faker.date.past(1)),
  }
}


