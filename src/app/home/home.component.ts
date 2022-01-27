import {Component, OnInit} from '@angular/core';
import {ElectronService} from "../core/services";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public title = 'Rito destroyer :]';
  private _remote = new ElectronService().shell; // To open the default browser window for links instead of making a new electron window

  constructor() {
  }

  async ngOnInit() {
  }

  public twitch() {
    this._remote.openExternal('https://twitch.tv/boguu8');
  }
}
