import { Component, OnInit } from '@angular/core';
import { SpotifyService } from "../../services/spotify.service";
import { Artist } from '../../model/artist';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';


@Component({
  moduleId: module.id,
  selector: 'search',
  templateUrl: 'search.component.html'
})
export class SearchComponent implements OnInit{
  searchStr: string;
  searchRes: Artist[];
  _search: FirebaseObjectObservable<any[]>;

  constructor(
    private _spotifyService: SpotifyService,
    private _af: AngularFire
  ) {}

  searchMusic() {
    this._spotifyService.searchMusic(this.searchStr)
      .subscribe(res => {
        this.searchRes = res.artists.items;
      })
  }

  ngOnInit() {
    this._search = this._af.database.object('/search');
  }

}
