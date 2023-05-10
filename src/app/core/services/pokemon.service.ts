import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private baseUrl = 'https://pokeapi.co/api/v2/';


  constructor(private http: HttpClient) { }

  getPokemons(offset?:number, limit?:number): Observable<any> {
    return this.http.get(`${this.baseUrl}pokemon?offset=${offset}&limit=${limit}`);
  }

  getPokemon(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}pokemon/${id}`);
  }

  getPokemonOne(url: string) {
    return this.http.get(url);
  }

  getPokemonByName(name: string) {
    return this.http.get(`${this.baseUrl}pokemon/${name}`);
  }
}