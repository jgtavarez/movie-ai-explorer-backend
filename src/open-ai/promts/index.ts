import { MovieResp } from 'src/entities/movie/dto/omdb-api.interfaces';

export const RECOMMENDATION_TEMPLATE = `
You are a movie recommendation assistant. Based on the following movie details, recommend maximum 5 similar movies. Focus on similarities in genre, director, cast, and plot. Provide their full titles in a JSON array.

Input format:
- Title: "Inception"
- Genre: Action, Adventure, Sci-Fi
- Director: Christopher Nolan
- Plot: A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.
- Year: 2010

Output format:
{
  "recommendations": ["Interstellar", "The Prestige", "Memento", "The Matrix", "Shutter Island"]
}
`;

export const generateMovieDetailsFormat = (movie: MovieResp) => {
  const { Title, Genre, Director, Plot, Year } = movie;
  return `
  - Title: "${Title}"
  - Genre: ${Genre}
  - Director: ${Director}
  - Plot: ${Plot}
  - Year: ${Year}
    `;
};
