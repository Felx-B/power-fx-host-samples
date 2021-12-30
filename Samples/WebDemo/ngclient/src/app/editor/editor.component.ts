import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

// import * as monaco from 'monaco-editor'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {


  value: string = 'const a = 1;';
  editorOptions = { language: 'typescript' };

  constructor() { }

  ngOnInit(): void {
  }



}
