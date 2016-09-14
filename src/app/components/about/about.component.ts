import { Component , OnInit} from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';

@Component({
  moduleId: module.id,
  selector: 'about',
  templateUrl: 'about.component.html'
})
export class AboutComponent implements OnInit{
  _about: FirebaseObjectObservable<any[]>;
  _aboutList: FirebaseListObservable<any[]>;

  constructor(private _af: AngularFire) {
    this._about = _af.database.object('/about');
    this._aboutList = _af.database.list('/about/lists');
  }

  ngOnInit() { }
}
