import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ImportsModule } from 'src/app/imports';
import { DisplayNumberComponent } from '../display-number/display-number.component';
import { AdAutocompleteComponent } from '../ad-autocomplete/ad-autocomplete.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-upsert-balance',
  standalone: true,
  imports: [ImportsModule, DisplayNumberComponent,AdAutocompleteComponent],
  templateUrl: './upsert-balance.component.html',
  styleUrl: './upsert-balance.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UpsertBalanceComponent {
  weight = 0;
  cargoVolume = 0;
  objTare = {
    label: 'Bàn Cân',
    value: 0,
    take: 2,
    time: '',
    modelDefault:'0%'
  };
  form:any;
  mo='okkkkkkkk'
  constructor(private fb:FormBuilder){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.init()
  }
  init(){
    this.form=this.fb.group({
      name:['',Validators.required],
      namex:'ha ha'
    })
  }
  ngSubmit(){
    console.log(this.form.value,this.mo)
  }
  onSelectionx(event:any){}
}
