import { AsyncPipe, CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, startWith, map } from 'rxjs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from 'src/app/services/api.service';
import { AutocompleteComponent } from 'src/app/Components/autocomplete/autocomplete.component';
import { getItem, setItem, Status } from 'src/app/general';
import { ResponseTramCan } from 'src/app/Models/ResponseTramCan';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-upsert-tram-can',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    AutocompleteComponent,
  ],
  templateUrl: './upsert-tram-can.component.html',
  styleUrl: './upsert-tram-can.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UpsertTramCanComponent {
  keyUnitCurrent = 'unit';
  keyTapchat = 'tapchat';
  keyDongia = 'dongia';

  radioGroup = ['Xuất Hàng', 'Nhập Hàng', 'Dich Vụ'];

  tapchatModel = 0;
  dongiaModel = 0;
  selectedRadio = '';
  valueIEgoods = '';
  filteredOptionsCustomer: Observable<string[]> | undefined;
  customers = [];
  weighStations: any;
  impurities: any = [];
  optionCustomer = {
    name: 'customerName',
    showtext: 'customerName',
    label: 'Tên Khách hàng',
    placeholder: 'Tìm Khách Hàng',
    banks: '',
    url: 'weighStation',
  };
  optionCarNumber = {
    name: 'carNumber',
    showtext: 'carNumber',
    label: 'Biển Số Xe',
    placeholder: 'Tìm Kiếm',
    banks: '',
    url: 'weighStation',
  };
  optionWeighProductName = {
    name: 'productName',
    showtext: 'productName',
    label: 'Tên Hàng',
    placeholder: 'Tìm Kiếm',
    banks: '',
    url: 'weighStation',
  };
  optionWeighType = {
    name: 'type',
    showtext: 'type',
    label: 'Loại Hàng',
    placeholder: 'Tìm Kiếm',
    banks: '',
    url: 'weighStation',
  };
  @Output() outputTramCan = new EventEmitter(true);

  @Input() obj: any = {
    weight1: '',
    weight2: '',
    cargoVolume: '',
    carNumber: '',
    price: 0,
    impuritiesKg: 0,
    impurities: '0%',
    unit: 'VND',
    ieGoods: '',
    customerName: '',
    productName: '',
    type: '',
  };
  defaultObj: any;
  constructor(private service: ApiService, private dataService: DataService) {}
  async ngOnInit() {
    await this.getWeighStation();
    if (getItem(this.keyUnitCurrent)) {
      this.obj.unit = getItem(this.keyUnitCurrent);
    }
    if (getItem(this.keyTapchat)) {
      this.obj.impurities = getItem(this.keyTapchat);
    }
    if (getItem(this.keyDongia)) {
      this.obj.price = getItem(this.keyDongia);
    }
    await this.getCustomer();

    for (let index = 1; index < 51; index++) {
      this.impurities.push(`${index}%`);
    }
    this.dataService.currentMessage.subscribe(async (x: any) => {
      if (x.status == Status.Refesh) {
        await this.getWeighStation();
      }
      if (x.status == Status.Upsert) {
        this.defaultObj = x.data;
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // console.log(this.random)
    // console.log(this.obj)
    //console.log(changes['obj'].currentValue)
    this.selectedRadio = changes['obj'].currentValue.ieGoods;
  }
  private async getCustomer() {
    this.customers = ((await this.service.get('customer')) as any).items;
  }
  private async getWeighStation() {
    const data = (await this.service.get('weighStation')) as ResponseTramCan;
    this.weighStations = data.items;
    // console.log(this.weighStations)
  }
  getWeighStations() {
    this.service.get('weighStation').then((data: ResponseTramCan) => {
      this.weighStations = data.items;
    });
  }
  async selectionChangeUnit(event: any) {
    if (!event) return;
    setItem(this.keyUnitCurrent, event.value);
    this.obj.unit = event.value;
    this.onOutputEmit();
  }
  selectionChangeTapChat(event: any) {
    if (!event) return;
    setItem(this.keyTapchat, event.value);
    this.obj.impurities = event.value;
    this.onOutputEmit();
  }
  keypressDonGia(event: any) {
    setItem(this.keyDongia, this.obj.price);
    this.onOutputEmit();
  }
  onChangeRadio(event: any) {
    this.obj.ieGoods = event.value;
    this.onOutputEmit();
  }
  selectCusomer(event: any) {
    // console.log(event);
    this.obj.customerName = event;
    this.onOutputEmit();
  }
  selectCarName(event: any) {
    this.obj.carNumber = event;
    this.onOutputEmit();
  }
  selectCarNameTed(event: any) {
    this.obj.carNumber = event.carNumber;
    this.onOutputEmit();
  }
  selectProductName(event: any) {
    this.obj.productName = event;
    this.onOutputEmit();
  }
  selectType(event: any) {
    this.obj.type = event;
    this.onOutputEmit();
  }
  onOutputEmit() {
    this.outputTramCan.emit(this.obj);
  }
}
