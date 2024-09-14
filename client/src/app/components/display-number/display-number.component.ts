import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImportsModule } from 'src/app/imports';

@Component({
  selector: 'app-display-number',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './display-number.component.html',
  styleUrl: './display-number.component.scss',
})
export class DisplayNumberComponent {
  @Input() inputObj = {
    label: 'Bàn Cân',
    value: 0,
    time: '',
    take: 0,
    modelDefault: '0%',
  };
  tapchats: any = [];
  modelDefault = '5%';
  @Output() eventOutput = new EventEmitter();
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getTapchats();
  }
  getTapchats() {
    for (let i = 0; i < 51; i++) {
      this.tapchats.push(`${i}%`);
    }
  }
  onChange(event: any) {
    this.inputObj.modelDefault = event.target.value;
    this.eventOutput.emit(this.inputObj.modelDefault);
  }
}
