import {
  ChangeDetectionStrategy,
  Component,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-weigh-station',
  templateUrl: './weigh-station.component.html',
  styleUrl: './weigh-station.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeighStationComponent {
  optionCustomer = {
    name: 'customerName',
    showtext: 'customerName',
    label: 'Tên Khách hàng',
    placeholder: 'Tìm Khách Hàng',
    banks: '',
    url: 'weighStation',
    showButton:false
  };
  optionCarNumber = {
    name: 'carNumber',
    showtext: 'carNumber',
    label: 'Biển Số Xe',
    placeholder: 'Tìm Kiếm',
    banks: '',
    url: 'weighStation',
    showButton:false
  };
  optionWeighProductName = {
    name: 'productName',
    showtext: 'productName',
    label: 'Tên Hàng',
    placeholder: 'Tìm Kiếm',
    banks: '',
    url: 'weighStation',
    showButton:false
  };
  optionWeighType = {
    name: 'type',
    showtext: 'type',
    label: 'Loại Hàng',
    placeholder: 'Tìm Kiếm',
    banks: '',
    url: 'weighStation',
    showButton:false
  };

  objx: any = {
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
    showButton:false
  };
  impurities: any = [];
  keyUnitCurrent = 'unit';
  keyTapchat = 'tapchat';
  keyDongia = 'dongia';
  disabled=false;
  radioGroup = ['Xuất Hàng', 'Nhập Hàng', 'Dich Vụ'];
  selectedRadio = '';
  defaultObj: any;
  obj = { type: 'text', value: '', lable: 'TL Cân lần 1:', require: true };
  obj1 = { type: 'text', value: '', lable: 'TL Cân lần 2:', require: true };
  form: any=null;
  constructor(
    private socketService: SocketService,
    private socket: Socket,
    private services: ApiService,
    private dataService: DataService,
    private fb: FormBuilder
  ) {}
  async ngOnInit(): Promise<void> {
    this.initForm()
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createImpurities();
  }
  initForm() {
    this.form = this.fb.group({
      weight1: ['0', [Validators.required, Validators.minLength(16)]],
      weight2: ['0', [Validators.required, Validators.minLength(16)]],
      cargoVolume: '0',
      carNumber: '',
      price: 0,
      tareKg: 0,
      tare: '0%',
      unit: 'VND',
      ieGoods: '',
      customerName: '',
      productName: '',
      type: '',
      isActive: true,
      id: 0,
      customerId: '',
    });
  }
  outputValue(event: any) {
    console.log(event);
  }
  createImpurities() {
    for (let i = 0; i < 51; i++) {
      this.impurities.push(i + '%');
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }
  selectionChangeTapChat(event:any){

  }
  keypressDonGia(event:any){}
  selectionChangeUnit(event:any){}
  onChangeRadio(event:any){}
  savePrint(){}
  save(isActive = true){}
  btCanXeClick(){}
}
