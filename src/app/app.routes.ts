// import { Routes, RouterModule } from '@angular/router';
// import { Home } from './home';
// import { About } from './about';
// import { NoContent } from './no-content';

// import { DataResolver } from './app.resolver';


// export const ROUTES: Routes = [
//   { path: '',      component: Home },
//   { path: 'home',  component: Home },
//   { path: 'about', component: About },
//   {
//     path: 'detail', loadChildren: () => System.import('./+detail')
//   },
//   { path: '**',    component: NoContent },
// ];


import {Routes, RouterModule} from "@angular/router";
import {SearchComponent} from "./components/search/search.component";
import {AboutComponent} from "./components/about/about.component";
import {ArtistComponent} from "./components/artist/artist.component";
import {AlbumComponent} from "./components/album/album.component";
import {TrackComponent} from "./components/track/track.component";

export const ROUTES: Routes = [
    {path: '', component: SearchComponent},
    {path: 'about', component: AboutComponent},
    {path: 'artist/:id', component: ArtistComponent},
    {path: 'album/:id', component: AlbumComponent},
    {path: 'top-tracks/:id', component: TrackComponent}
];