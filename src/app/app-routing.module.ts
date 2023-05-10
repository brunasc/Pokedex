import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'list-pokemon', loadChildren: () => import('./modules/pokemon/pokemon.module').then(m => m.PokemonModule) },
  { path: '**', redirectTo: 'list-pokemon', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
