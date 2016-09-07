import {Component, OnInit} from '@angular/core';
import {SpotifyService} from "../../services/spotify.service";
import {ActivatedRoute} from "@angular/router";
import {Artist} from "../../model/artist";


@Component({
  moduleId: module.id,
  selector: 'tracks',
  templateUrl: 'track.component.html'
})

export class TrackComponent implements OnInit {
  id: string;
  artist: Artist[];
  tracks: any[];

  constructor(private _spotifyService: SpotifyService,
              private _route: ActivatedRoute) {}


  ngOnInit() {
    this._route.params
      .map(params => params['id'])
      .subscribe((id) => {
        this._spotifyService.getTopTracks(id)
          .subscribe(track => {
            this.tracks = track.tracks;
          })

        this._spotifyService.getArtist(id)
          .subscribe(artist => {
            this.artist = artist;
          })

      })
  }

}
