import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonListComponent } from './pokemon-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [ PokemonListComponent ],
      providers: [BsModalService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve injetar ActivatedRoute corretamente', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    expect(activatedRoute).toBeTruthy();
  });

  it('deve carregar a lista de pokémons', () => {
    spyOn(component['pokemonService'], 'getPokemons').and.returnValue(of([{ nome: 'Pikachu' , url: 'https://pokeapi.co/api/v2/pokemon/25'}, { nome: 'Squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7'}]));
    component.ngOnInit();
    expect(component.pokemons.length).toBe(2);
  });
});
