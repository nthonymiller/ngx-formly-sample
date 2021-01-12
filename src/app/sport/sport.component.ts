import { Component, Input, SimpleChange, SimpleChanges } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { defer, of, concat } from "rxjs";
import { distinctUntilChanged, map, startWith, tap } from "rxjs/operators";

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
        label: "Sport",
        options: [{ id: "1", name: "Soccer" }, { id: "2", name: "Basketball" }],
        valueProp: "id",
        labelProp: "name"
      }
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
        onInit: field => {
          const teams = [
            { id: "1", name: "Bayern Munich", sportId: "1" },
            { id: "2", name: "Real Madrid", sportId: "1" },
            { id: "3", name: "Cleveland", sportId: "2" },
            { id: "4", name: "Miami", sportId: "2" }
          ];
          const sportControl = this.form.get("sport");

          console.log('Init teams', sportControl.value);

          const initValue$ = defer(() => {
            console.log('InitValue', sportControl.value)
            return of(sportControl.value)
          });

          const changes$ = sportControl.valueChanges
            .pipe(
              tap(x => console.log('Value Changes', x)),
              tap(() => field.formControl.setValue(null))
            );

          field.templateOptions.options = concat(initValue$, changes$)
            .pipe(
              tap(sportId => console.log('Filtering Sports', sportId)),
              map(sportId => teams.filter(team => team.sportId === sportId))
            );
        }
      }
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
        onInit: field => {
          const players = [
            { id: "1", name: "Bayern Munich (Player 1)", teamId: "1" },
            { id: "2", name: "Bayern Munich (Player 2)", teamId: "1" },
            { id: "3", name: "Real Madrid (Player 1)", teamId: "2" },
            { id: "4", name: "Real Madrid (Player 2)", teamId: "2" },
            { id: "5", name: "Cleveland (Player 1)", teamId: "3" },
            { id: "6", name: "Cleveland (Player 2)", teamId: "3" },
            { id: "7", name: "Miami (Player 1)", teamId: "4" },
            { id: "8", name: "Miami (Player 2)", teamId: "4" }
          ];
          const teamControl = this.form.get("team");
          field.templateOptions.options = teamControl.valueChanges.pipe(
            startWith(teamControl.value),
            map(teamId => players.filter(player => player.teamId === teamId)),
            tap(() => field.formControl.setValue(null))
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

  submit() {
    alert(JSON.stringify(this.model));
  }
}

/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
