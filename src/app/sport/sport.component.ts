import { Component, Input, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

export interface Model {
  readonly player: string;
  readonly sport: string;
  readonly team: string;
}

@Component({
  selector: "app-sport",
  templateUrl: "./sport.component.html"
})
export class SportComponent {

  @Input() model: Model;

  form = new FormGroup({});

  fields: FormlyFieldConfig[] = [
    {
      key: "sport",
      type: "select",
      templateOptions: {
        label: 'Sport',
        options: this.getSports$(),
        valueProp: 'id',
        labelProp: 'name',
      },
    },
    {
      key: "team",
      type: "select",
      templateOptions: {
        label: "Team",
        options: [],
        valueProp: "id",
        labelProp: "name"
      },
      hooks: {
        onInit: (field) => {
          const sportControl = this.form.get('sport');
          const changes$ = sportControl.valueChanges;
          field.templateOptions.options = changes$.pipe(
            switchMap((sportId) => this.getTeams$(sportId))
          );
        },
      },
    },
    {
      key: "player",
      type: "select",
      templateOptions: {
        label: "Player",
        options: [],
        valueProp: "id",
        labelProp: "name"
      },
      hooks: {
        onInit: (field) => {
          const teamControl = this.form.get('team');
          field.templateOptions.options = teamControl.valueChanges.pipe(
            switchMap((teamId) => this.getPlayers$(teamId))
          );
        }
      }
    }
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes.model != null) {
      console.log('Model has changed', changes.model.currentValue);
    }
  }

  getSports$() {
    return of([
      { id: '1', name: 'Soccer' },
      { id: '2', name: 'Basketball' },
    ]);
  }

  getTeams$(sportId) {
    return of([
      { id: '1', name: 'Bayern Munich', sportId: '1' },
      { id: '2', name: 'Real Madrid', sportId: '1' },
      { id: '3', name: 'Cleveland', sportId: '2' },
      { id: '4', name: 'Miami', sportId: '2' },
    ]).pipe(map((teams) => teams.filter((team) => team.sportId === sportId)));
  }

  getPlayers$(teamId) {
    return of([
      { id: '1', name: 'Bayern Munich (Player 1)', teamId: '1' },
      { id: '2', name: 'Bayern Munich (Player 2)', teamId: '1' },
      { id: '3', name: 'Real Madrid (Player 1)', teamId: '2' },
      { id: '4', name: 'Real Madrid (Player 2)', teamId: '2' },
      { id: '5', name: 'Cleveland (Player 1)', teamId: '3' },
      { id: '6', name: 'Cleveland (Player 2)', teamId: '3' },
      { id: '7', name: 'Miami (Player 1)', teamId: '4' },
      { id: '8', name: 'Miami (Player 2)', teamId: '4' },
    ]).pipe(map((teams) => teams.filter((team) => team.teamId === teamId)));
  }

  submit() {
    alert(JSON.stringify(this.model));
  }
}

/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
