import { Film } from '../interfaces/film';
import { PaginateResponse } from '../interfaces/paginateResponse';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, take} from 'rxjs/operators';

import { Character } from '../interfaces/character';

@Injectable({
  providedIn: 'root'
})

export class CharacterService {

  private characterUrl = 'https://swapi.dev/api/people';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  /**
  * Get characters by page number
  * @param page - page no of which data needs to pulled.
  */
  getCharacters(page: Number): Observable<PaginateResponse> {
    return this.http.get<Character[]>(`${this.characterUrl}/?page=${page}`)
      .pipe(
        map((characters: Character[]) => {
          let paginateResponse = this.paginateResults(characters); // format the response
          paginateResponse.results = paginateResponse.results.map(character => {
            if (character.species.length) { // if species are not empty call specifies API and retrieve all the names
              let requestSpecies = character.species.map(sp => this.http.get("https://" + sp.split("//")[1]));

              forkJoin(requestSpecies)
              .pipe(catchError(error => of(error)))
              .subscribe(species => {
                character.species = species.map(sp => sp['name']).join(); // only name is taken
                character.loadedSpecies = true;
              });

            } else
              character.species = "Unknown";

            return character;
          });
          return paginateResponse;
        }),
        catchError(this.handleError<PaginateResponse>('getCharacters',  this.onErrorData()))
      );
  }

  /**
  * Get all films of a character.
  * @param id - id of the character
  */
  getFilmsOfCharacter(id: Number): Observable<Film []> {
    return this.http.get<Film[]>(`${this.characterUrl}/${id}/`)
      .pipe(
        map(character => {
          console.log(character);
          return character['films'];
        }),
        // pull film data using the film URLs. As the order doesn't matter mergeMap is used.
        mergeMap(films => {
          console.log(films);
          let requestFilms = films.map(film => this.http.get<Film>("https://" + film.split("//")[1])) // use https for heroku
          return forkJoin(requestFilms).pipe(catchError(error => of(error)));
        }),
        take(1)
      );
  }

  /**
  * Format the response of people API.
  * @param data - API response data to be formatted
  */
  paginateResults(data): PaginateResponse {
    const results: Character[] = data['results'].map(d =>  {
      let urlSplit = d.url.split("/");
      return {
        id: urlSplit[urlSplit.length - 2],
        name: d.name,
        gender: d.gender,
        height: d.height,
        species: d.species,
        loadedSpecies: d.species.length == 0
      }
    });

    return {
      results,
      meta: {
        count: data.count,
        next: data.next,
        previous: data.previous
      }
    };
  }

  /**
   * In case there is an http error, don't break the app
   * and return an empty result
   */
   private onErrorData() {
    const emptyResult = {
      count: 0,
      results: [],
      next: null,
      previous: null
    };

    return this.paginateResults(emptyResult);
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }
}
