import faker from 'faker';

export function askQuestion(question: string): Promise<string> {
  var stdin = process.stdin, stdout = process.stdout;

  stdin.resume();
  stdout.write(question);

  return new Promise(res => {
    stdin.once('data', function(data) {
      res(data.toString().trim());
    });
  });
}

export function makeRandomSequence(length: number): string {
  let seq: string = '';
  for (let i = 0; i < length; i++) {
    seq += String(faker.random.number(9));
  }
  return seq;
}

export function createInsert<T extends Object>(table: string, data: T): string {
  const filteredNames: string[] = [];
  const filteredValues: (string | number)[] = [];
  for (let key in data) {
    if (typeof data[key] === 'string') {
      filteredNames.push(key.toString());
      const value = String(data[key]).replace(/'/g, `\\'`);
      filteredValues.push(`'${value}'`);
    } else if (typeof data[key] === 'number') {
      filteredNames.push(key.toString());
      filteredValues.push(Number(data[key]));
    }
  }

  return `INSERT INTO ${table}(${filteredNames.join(', ')}) VALUES (${filteredValues.join(', ')});\r\n`

  // const columns = Object.keys(data);
  // const values = Object.values(data).map(val => typeof val !== 'string' ? val: `'${val}'`);
  
  // return `INSERT INTO ${table}(${columns.join(', ')}) VALUES (${values.join(', ')});`
}

export interface InsertData<T> {
  id: number;
  data: T;
  insert: string;
}

export function createManyInsertData<T extends Object>(tableName: string, data: T[], startId = 0): InsertData<T>[] {
  const inserts : InsertData<T>[] = [];
  for (let i = 0; i < data.length; i++) {
    const insert = createInsert(tableName, data[i]);
    inserts.push({ id: i+startId, data: data[i], insert });
  }

  return inserts;
}