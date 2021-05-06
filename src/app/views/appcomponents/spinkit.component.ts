import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'demo-spinkit',
  templateUrl: 'spinkit.template.html'
})
export class SpinkitDemoComponent implements OnInit  {

  animations: string[];
  selectedAnimation: string;
  lockPanel: boolean;

  ngOnInit() {
    this.animations = [
      'chasing-dots',
      'circle',
      'cube-grid',
      'double-bounce',
      'fading-circle',
      'pulse',
      'rotating-plane',
      'three-bounce',
      'wandering-cubes',
      'wave',
      'word-press'
    ];
    this.selectedAnimation = this.animations[0];
    this.lockPanel = false;
  }

}
