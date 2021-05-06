import {Component} from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';

/**
 * @title Tab group animations
 */
@Component({
  selector: 'tab-group-tarea',
  templateUrl: 'tab-group-tarea.html',
  styleUrls: ['tab-group-tarea.scss'],
})
export class TabGroupTareaComponent implements OnInit{
  ngOnInit(): void {
  }
  @Input() activar : boolean;  
  @Input() consulta : boolean; 
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */