import { Component, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import { delay, getItem, setItem, Status } from 'src/app/general';
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
  objReset = {};
  objx: WeighStation = {
    id: 0,
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
    data: null,
  };
  impurities: any = [];
  keyUnitCurrent = 'unit';
  keyUnitCurrentTi = 'unitTi';
  keyTage = 'tage';
  keyTageKg = 'tageKg';
  keyPrice = 'price';

  radioGroup = ['Xuất Hàng', 'Nhập Hàng', 'Dich Vụ'];
  selectedRadio = '';
  defaultObj: any;
  obj = {
    type: 'text',
    value: '0',
    lable: 'TL Cân lần 1:',
    require: true,
    id: 1,
  };
  obj1 = {
    type: 'text',
    value: '0',
    lable: 'TL Cân lần 2:',
    require: false,
    id: 2,
  };
  form: any = null;
  panelOpenState = false;
  weight: any = '';
  ports = [];
  weighStations: any[] = [];
  connect = true;
  cargoVolume = 0;
  keyWeight = 0;
  // @ViewChild('div1') div1: ElementRef | undefined;
  defaultY = {
    tage: '0%',
    tageKg: 0,
    price: 0,
    unit: 'VND',
    unitTi: 'USD',
  };
  constructor(
    private socketService: SocketService,
    private socket: Socket,
    private services: ApiService,
    private dataService: DataService,
    private fb: FormBuilder
  ) {}
  async ngOnInit(): Promise<void> {
    if (getItem(this.keyPrice)) this.defaultY.price = getItem(this.keyPrice);
    if (getItem(this.keyTage)) this.defaultY.tage = getItem(this.keyTage);
    if (getItem(this.keyTageKg)) this.defaultY.tageKg = getItem(this.keyTageKg);
    if (getItem(this.keyUnitCurrent)) this.defaultY.unit = getItem(this.keyUnitCurrent);
    if (getItem(this.keyUnitCurrentTi)) this.defaultY.unitTi = getItem(this.keyUnitCurrentTi);
    this.objReset = this.objx;
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
      weight1: [this.objx.weight1, Validators.required],
      weight2: [this.objx.weight2],
      cargoVolume: this.objx.cargoVolume,
      carNumber: [this.objx.carNumber, [Validators.required]],
      price: this.objx.price,
      tareKg: this.objx.tareKg,
      tare: this.objx.tare || '0%',
      unit: this.objx.unit,
      ieGoods: [this.objx.ieGoods, [Validators.required]],
      customerName: [this.objx.customerName, [Validators.required]],
      productName: [this.objx.productName, [Validators.required]],
      type: this.objx.type,
      isActive: this.objx.isActive,
      id: this.objx.id || 0,
      customerId: '',
    }) as FormGroup;
    //this.form.controls['tage'].setValue(getItem(this.keyTage))
  }
  outputValue(event: any) {
    // console.log(event);
    switch (event.key) {
      case 1:
        {
          this.form.controls['weight1'].setValue(event.value);
        }
        break;

      default:
        this.form.controls['weight2'].setValue(event.value);
        break;
    }
    //  console.log(this.form.value);
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
  async ngSubmit() {
    const value = this.form.value;
    // console.log(value);
    if (value.id == 0) {
      this.services.create1(value).then((e: any) => console.log(e));
    } else {
      this.services.update1(value);
    }
    this.form.patchValue(this.objReset);
  }
  selectionChangeTapChat(event: any) {
    setItem(this.keyTage, event.value);
  }
  keypressDonGia(event: any) {
    setItem(this.keyPrice,event.target.value)
  }
  keyUptageKg(event:any){

    setItem(this.keyTageKg,event.target.value)
  }
  selectionChangeUnit(event: any) {
    setItem(this.keyUnitCurrent, event.value);
  }
  selectionChangeUnitTi(event: any) {
    setItem(this.keyUnitCurrentTi, event.value);
  }
  onChangeRadio(event: any) {}
  async savePrint() {
    await this.ngSubmit();
  }

  async onDelete() {
    this.services.destroy1(this.objx.id);
  }
  btCanXeClick() {
    this.connect = this.connect == true ? false : true;
  }
  cal() {
    switch (this.keyWeight) {
      case 0:
        {
          this.obj.value = this.weight;
          this.form.controls['weight1'].setValue(this.weight);
        }
        break;
      case 1:
        {
          this.obj1.value = this.weight;
          this.form.controls['weight2'].setValue(this.weight);
        }
        break;
      case 2:
        {
        }
        break;
      default:
        {
          this.obj.value = this.weight;
          this.form.controls['weight1'].setValue(this.weight);
        }
        break;
    }
    this.cargoVolume = Math.abs(
      parseInt(this.form.controls['weight1'].value) -
        parseInt(this.form.controls['weight2'].value)
    );
    this.form.controls['cargoVolume'].setValue(this.cargoVolume);
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
    this.connect = true;
    if (this.objx.weight1 != 0 && this.objx.weight2 == 0) {
      this.keyWeight = 1;
    }
    if (this.objx.weight1 != 0 && this.objx.weight2 != 0) {
      this.keyWeight = 2;
    }
  }
  //------------------

  async receiveMessage(): Promise<string> {
    return new Promise((res, rej) => {
      this.socket.on('message', async (response: any) => {
        let matches = response.data.match(/(\d+)/);
        if (this.connect) this.weight = matches[0];
        this.cal();
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
