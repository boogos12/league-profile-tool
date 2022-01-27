import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import { Observable } from 'rxjs';
import {DialogComponent} from "../core/dialog/dialog.component";
import {LCUConnectionService} from "../core/services/lcuconnection/lcuconnection.service";
import { VersionService } from '../core/services/version/version.service';
import { Mission } from './mission';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent implements OnInit{
  public data = null;
  public currentVersion = 0;

  constructor(public dialog: MatDialog, private lcuConnectionService: LCUConnectionService, private version: VersionService) {
  }

  async ngOnInit() {
    this.version.apiVersion().subscribe(v => {
      this.currentVersion = v[0];
    })
  }

  public getData() {
    this.data = [];
    this.lcuConnectionService.requestCustomAPI({}, 'GET', '/lol-missions/v1/missions').then(response => {
      if (typeof response !== 'string') {
        this.dialog.open(DialogComponent, {
          data: {body: response}
        });
      } else {
        const missions = JSON.parse(response);
        const epochToday = (new Date).getTime();
        for (let i = 0; i < missions.length; i++) {
          for (let j = 0; j < missions[i].objectives.length; j++){
            const currentProgress = missions[i].objectives[j].progress.currentProgress;
            const totalProgressCount = missions[i].objectives[j].progress.totalCount;
            if (missions[i].isNew == true || (missions[i].endTime >= epochToday && currentProgress < totalProgressCount )){
              const mission = {
                description: missions[i].description,
                objective: missions[i].objectives[j].description,
                currentProgress: currentProgress,
                totalProgressCount: totalProgressCount
              }
              if (mission.objective.length > 0){
                this.data.push(mission);
              }
            }
          }
        }
      }
    });
  }
}
