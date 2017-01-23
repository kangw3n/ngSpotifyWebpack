import {Component, NgZone, ChangeDetectorRef, ViewChild, ElementRef, OnInit} from "@angular/core";
import {SpotifyService} from "../../services/spotify.service";
import {Artist} from "../../model/artist";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/throttleTime";
import "rxjs/add/observable/fromEvent";
import {AngularFire, FirebaseObjectObservable} from "angularfire2";


@Component({
  moduleId: module.id,
  selector: 'search',
  templateUrl: 'search.component.html'
})
export class SearchComponent implements OnInit {
  searchStr: string = '';
  searchRes: Artist[];
  _search: FirebaseObjectObservable<any[]>;
  errorMsg: string;
  queryType: string = 'track';
  types: Array<string> = ['track', 'album', 'artist'];

  @ViewChild('input') inputElRef: ElementRef;

  constructor(private _spotifyService: SpotifyService,
              private _af: AngularFire,
              private ngzone: NgZone,
              private cdref: ChangeDetectorRef) {
  }

  onChange(val: string) {
    this.searchRes = [];
    this.queryType = val;
    this.searchMusic();
  }

  searchMusic() {
    this.searchRes = [];
    this._spotifyService.searchMusic(this.searchStr, this.queryType)
      .subscribe(
        res => {
          console.log(res);
          this.searchRes = res[this.queryType + 's'].items;
          if (!this.searchRes.length) this.errorMsg = 'No results Found!';
          this.cdref.detectChanges();

        },
        err => {
          console.warn(err);
          this.errorMsg = err.message || 'Server Error';
          this.searchRes = [];
          this.cdref.detectChanges();
        }
      )
  }

  ngAfterViewInit() {
    this.ngzone.runOutsideAngular(() => {
      Observable.fromEvent(this.inputElRef.nativeElement, 'keyup')
      //create RxJS Observables from the events, outside of Angular's "zone", change detection is not called each time an event fires
        .debounceTime(1000)
        .subscribe(keyboardEvent => {
          this.searchStr = keyboardEvent.target.value;
          this.searchMusic();
        });
    })
  }


  ngOnInit() {
    this._search = this._af.database.object('/search');
  }

}
