export const rick = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)' },
  location: { name: 'Citadel of Ricks' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1', 'https://rickandmortyapi.com/api/episode/2'],
}

export const morty = { ...rick, id: 2, name: 'Morty Smith', status: 'Dead' }

export const pilot = { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01' }
export const lawnmower = { id: 2, name: 'Lawnmower Dog', air_date: 'December 9, 2013', episode: 'S01E02' }

export function jsonResponse(body, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }))
}
