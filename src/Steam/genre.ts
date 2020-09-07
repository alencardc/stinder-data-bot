export interface Genre {
  name: string;
}

export function getGenresByList(list: string[]): Genre[] {
  const genres: Genre[] = [];
  list.forEach(name => {
    genres.push({ name });
  });

  return genres;
}


export interface GameGenre {
  game: string | number;
  genre: string | number;
}