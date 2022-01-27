import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../core/dialog/dialog.component";
import {LCUConnectionService} from "../core/services/lcuconnection/lcuconnection.service";
import { VersionService } from '../core/services/version/version.service';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})

export class MissionsComponent implements OnInit {
  public data = null;
  public currentVersion = 0;

  constructor(
    public dialog: MatDialog, 
    private lcuConnectionService: LCUConnectionService, 
    private version: VersionService
    ) {
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
          var objectives = [];
          for (let j = 0; j < missions[i].objectives.length; j++){
            const objective = missions[i].objectives[j];
            if (this.filterOutMissions(missions[i], objective, epochToday)){
              const objective = {
                description: this.changeStyleOfLinks(missions[i].objectives[j].description),
                currentProgress: missions[i].objectives[j].progress.currentProgress,
                totalProgressCount: missions[i].objectives[j].progress.totalCount
              } 
              if (objective.description.length > 0){
                objectives.push(objective);
              }
            }
          }
          const mission = {
            description: missions[i].description,
            objectives: objectives
          }
          if (mission.objectives.length > 0){
            this.data.push(mission);
          }
        }
      }
    });
  }

  private filterOutMissions(mission: any, objective: any, epochToday: number) : boolean{
    const currentProgress = objective.progress.currentProgress;
    const totalProgressCount = objective.progress.totalCount;
    return mission.isNew == true || (mission.endTime >= epochToday && currentProgress < totalProgressCount) && objective.status != 'DUMMY';
  }

  private changeStyleOfLinks(input: any) : any{
    return input.replace('<a href', '<a style="color:white;" href');
  }
}
