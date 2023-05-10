import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PokemonService } from 'src/app/core/services/pokemon.service';
import { Comment } from 'src/app/core/models/comments.model';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {

  @ViewChild('modalDetails') modalDetails!: TemplateRef<any>;
  @ViewChild('modalComments') modalComments!: TemplateRef<any>;

  search: FormControl = new FormControl('', Validators.required);
  formComments!: FormGroup;
  
  private onDestroy$ = new Subject<any>();


  pokemons: any[] = [];
  pokemonFilter: any[] = [];
  comments: Comment[] = [];
  comment: string = '';
  pokemonName!: string;

  params: any;
  pokemonDetails: any;

  listCommentsOnStorage: any = [];

  modalRef?: BsModalRef;

  constructor(
    private pokemonService: PokemonService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
  ) {
    this.watchRoutes();
  }

  ngOnInit(): void {
    this.createForm();
    this.getAll();
    this.getPokemonFilter();
  }

  ngDestroy(): void {  
    this.onDestroy$.unsubscribe();

  }

  createForm() {
    this.formComments = this.fb.group({
      name: ['', Validators.required],
      comment: ['', Validators.required]
    })

  }

  watchRoutes() {
    this.router.events.pipe(takeUntil(this.onDestroy$)).subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.getParams();
      }
    })
  }

  backRoute() {
    this.router.navigate(['/list-pokemon']);
    this.modalRef?.hide();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getParams() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.onDestroy$)).subscribe(queryString => {
      this.params = queryString;
    });

    if (this.params.pokemonName) {
      this.pokemonService.getPokemonByName(this.params.pokemonName)
      .pipe(takeUntil(this.onDestroy$)).subscribe(res => {
        this.pokemonDetails = res;
        this.openModal(this.modalDetails);
      })
    }
  }

  // retorna lista dos Pokémons
  getAll(offset?: number, limit?: number) {
    this.pokemonService.getPokemons(offset,limit).pipe(takeUntil(this.onDestroy$)).subscribe((res: any) => {
      let comentsOnStorage: any = localStorage.getItem('listCommentsOnStorage');
      this.listCommentsOnStorage = JSON.parse(comentsOnStorage) ? JSON.parse(comentsOnStorage) : [];
      res.results.forEach((pokemon: any) => {
        pokemon.comment = null,
        pokemon['favorits'] = false;
       
        // se Existir comentario
        if (this.listCommentsOnStorage) {
          this.listCommentsOnStorage.forEach((pokemonStorage: any) => {
            if (pokemonStorage.name == pokemon.name) {
              pokemon.comment = pokemonStorage.comment;
              pokemon.favorits = pokemonStorage.favorits;
            }
          });
        }
      });
      this.pokemons = res.results;
      this.pokemonFilter = this.pokemons;
    });
  }

  // retorna o Pokémon que foi pesquisado
  getPokemonFilter() {
    this.pokemonFilter = this.pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(this.search.value.toLowerCase()))
  }


  addParams(pokemon: { name: string, url: string }) {
    this.router.navigate(([]), {
      queryParams: {
        pokemonName: pokemon.name
      },
      queryParamsHandling: 'merge',
    });
  }

  openModalComments(pokemon: any) {
    if (pokemon.comment) {
      alert('Esse pokemon ja possui um comentario anexado');
      return;
    }

    this.formComments.get('name')?.setValue(pokemon.name);
    this.openModal(this.modalComments);
  }

  addComments() {
    if (!this.listCommentsOnStorage.some((e: any) => e.name == this.formComments.get('name')?.value)) {
      this.listCommentsOnStorage.push(this.formComments.value);

    } else {
      this.listCommentsOnStorage.forEach((pokemonComment: any) => {
        if (this.formComments.get('name')?.value == pokemonComment.name) {
          pokemonComment.comment = this.formComments.get('comment')?.value
        }
      });
    }

    this.pokemons.forEach((p: any) => {
      if (p.name == this.formComments.get('name')?.value) {
        p.comment = this.formComments.get('comment')?.value
      }
    })

    localStorage.setItem('listCommentsOnStorage', JSON.stringify(this.listCommentsOnStorage));

    this.formComments.reset();
    this.modalRef?.hide();
  }

  removeComment(pokemon: any) {
    if (!pokemon.comment) {
      alert('Esse pokemon não possui comentario');
      return;
    }

    this.pokemons.forEach((p: any) => {
      if (p.name == pokemon.name) {
        p.comment = null;
      }
    })

    let i = 0;
    for (let pl of this.listCommentsOnStorage) {
      if (pl.name == pokemon.name) {
        this.listCommentsOnStorage.splice(i, 1);
        localStorage.setItem('listCommentsOnStorage', JSON.stringify(this.listCommentsOnStorage));
      }

      i++;
    }
  }

  favoritar(item: any){
    item.favorits  =  item.favorits != true ;
    localStorage.setItem('listCommentsOnStorage', JSON.stringify(this.pokemons));
  }

  pageChanged(event: any){
    this.getAll(event.page, event.itemsPerPage);
  }

}
