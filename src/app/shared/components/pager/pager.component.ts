import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
 
  @Input() public totalCount: number;
  @Input() public pageSize: number;
  @Output() public pageChanged = new EventEmitter<number>(); // emits page number

  
  constructor() {}

  ngOnInit(): void {
  }

  public onPagerChanged(event : any){
    this.pageChanged.emit(event.page);
  }

}
