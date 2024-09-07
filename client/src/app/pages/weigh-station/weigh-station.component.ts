import { Component, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { delay } from 'src/app/general';
import { ResponseTramCan } from 'src/app/Models/ResponseTramCan';
import { WeighStation } from 'src/app/Models/weighStation';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-weigh-station',
  templateUrl: './weigh-station.component.html',
  styleUrl: './weigh-station.component.scss',
  standalone: false,
})
export class WeighStationComponent {
  optionCustomer = {
    name: 'customerName',
    showtext: 'customerName',
    label: 'Tên Khách hàng',
    placeholder: 'Tìm Khách Hàng',
    banks: '',
    url: 'weighStation',
    showButton: false,
    default: '',
  };
  optionCarNumber = {
    name: 'carNumber',
    showtext: 'carNumber',
    label: 'Biển Số Xe',
    placeholder: 'Tìm kiếm số xe',
    banks: '',
    url: 'weighStation',
    showButton: false,
    default: '',
  };
  optionWeighProductName = {
    name: 'productName',
    showtext: 'productName',
    label: 'Tên Hàng',
    placeholder: 'Tìm kiếm tên hàng...',
    banks: '',
    url: 'weighStation',
    showButton: false,
    default: '',
  };
  optionWeighType = {
    name: 'type',
    showtext: 'type',
    label: 'Loại Hàng',
    placeholder: 'Tìm kiếm loại hàng...',
    banks: '',
    url: 'weighStation',
    showButton: false,
    default: '',
  };

  objx: WeighStation = {
    id: 4,
    carNumber: '',
    customerName: '',
    weight1: 0,
    weight2: 0,
    cargoVolume: 0,
    tare: '',
    customerId: '',
    type: '',
    note: null,
    userId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    ieGoods: '',
    tareKg: 0,
    price: 0,
    productName: '',
    unit: '',
  };
  optionsTable: any = {
    url: 'weighStation',
    displayedColumns: [
      'id',
      'customerName',
      'productName',
      'carNumber',
      'weight1',
      'weight2',
      'cargoVolume',
      'tage',
      'price',
      'type',
      'ieGoods',
      'updatedAt',
    ],
    pageSize: 100,
    isShowBt: false,
  };
  impurities: any = [];
  keyUnitCurrent = 'unit';
  keyTapchat = 'tapchat';
  keyDongia = 'dongia';
  disabled = false;
  radioGroup = ['Xuất Hàng', 'Nhập Hàng', 'Dich Vụ'];
  selectedRadio = '';
  defaultObj: any;
  obj = { type: 'text', value: '0', lable: 'TL Cân lần 1:', require: true };
  obj1 = { type: 'text', value: '0', lable: 'TL Cân lần 2:', require: false };
  form: any = null;
  panelOpenState = false;
  weight: any = '';
  ports = [];
  weighStations: any[] = [];
  connect = true;
  cargoVolume = 0;
  // @ViewChild('div1') div1: ElementRef | undefined;

  constructor(
    private socketService: SocketService,
    private socket: Socket,
    private services: ApiService,
    private dataService: DataService,
    private fb: FormBuilder
  ) {}
  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.getWeighStation();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createImpurities();
    await this.receiveMessage();
  }
  async ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
  initForm() {
    this.form = this.fb.group({
      weight1: [this.objx.weight1,Validators.required],
      weight2: [this.objx.weight1],
      cargoVolume: this.objx.cargoVolume,
      carNumber: [this.objx.carNumber, [Validators.required]],
      price: this.objx.price,
      tareKg: this.objx.tareKg,
      tare: this.objx.tare,
      unit: this.objx.unit,
      ieGoods: [this.objx.ieGoods, [Validators.required]],
      customerName: [this.objx.customerName, [Validators.required]],
      productName: [this.objx.productName, [Validators.required]],
      type: this.objx.type,
      isActive: this.objx.isActive,
      id: this.objx.id || 0,
      customerId: '',
    }) as FormGroup;
  }
  outputValue(event: any) {
    // console.log(event);
    console.log(this.form.value);
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
  ngSubmit() {
    const value = this.form.value;
    console.log(value);
    if (value.id == 0) {
      this.services.create1(value);
    } else {
      this.services.update1(value);
    }
  }
  selectionChangeTapChat(event: any) {}
  keypressDonGia(event: any) {}
  selectionChangeUnit(event: any) {}
  onChangeRadio(event: any) {}
  savePrint() {}
  save(isActive = true) {}
  btCanXeClick() {
    if (this.form.controls['id'].value == 0) {
      this.obj.value = this.weight;
      this.form.controls['weight1'].setValue(this.weight);
    }
    if (this.objx.weight1 == 0&&this.objx.weight2 == 0 && this.form.controls['id'].value != 0) {
      this.obj1.value = this.weight;
      this.form.controls['weight2'].setValue(this.weight);
    }
    this.cargoVolume = Math.abs(
      parseInt(this.form.controls['weight1'].value) - parseInt(this.form.controls['weight2'].value)
    );
    this.connect = this.connect ? false : true;
  }
  keyUpAutoComplate(event: any) {
    // console.log(event);
    this.form.controls[event.key].setValue(event.value);
  }
  onSelectedAuto(event: any) {}
  eventUpsertTable(event: WeighStation) {
    // console.log(event);
    this.objx = event;
    this.optionCarNumber.default = event.carNumber;
    this.optionCustomer.default = event.customerName;
    this.optionWeighProductName.default = event.productName;
    this.optionWeighType.default = event.type;
    this.obj.value = event.weight1.toString();
    this.obj1.value = event.weight2.toString();
    this.form.patchValue(event);
  }
  //------------------

  async receiveMessage(): Promise<string> {
    return new Promise((res, rej) => {
      this.socket.on('message', async (response: any) => {
        // const dt = response.data.replace(/^\D+/g, '');
        let matches = response.data.match(/(\d+)/);
        if (this.connect) this.weight = matches[0];
        this.btCanXeClick();
        res(matches);
      });
    });
  }

  async getComs() {
    this.ports = await this.services.get('ports');
  }
  private async getWeighStation() {
    const data = (await this.services.get('weighStation')) as ResponseTramCan;
    this.weighStations = data.items;
    // console.log(this.weighStations)
  }
}
