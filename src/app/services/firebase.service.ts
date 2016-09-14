import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
declare let firebase: any;

@Injectable()
export class FirebaseService {


  constructor() { }

  getAbout() {
    firebase.database().ref('/').on('child_added', (snapshot) => {
      console.log(snapshot.val());
    })
  }

}
