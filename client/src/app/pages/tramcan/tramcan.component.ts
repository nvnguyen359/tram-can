import { Component } from '@angular/core';
import { callback } from 'chart.js/dist/helpers/helpers.core';
import { Socket } from 'ngx-socket-io';
import { BaseApiUrl, delay, Status } from 'src/app/general';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { SocketService } from 'src/app/services/socket.service';
import {
  FormBuilder,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
@Component({
  selector: 'app-tramcan',
  templateUrl: './tramcan.component.html',
  styleUrl: './tramcan.component.scss',
})
export class TramcanComponent {
  weight: any = '0';
  t = new Date();

  time = '';
  date = '';
  nhanvien = 'Nguyễn Văn An';
  isconnect = false;
  ports: any = [];
  random: any;
  disabled = true;
  btcanxe = false;
  obj = {
    weight1: '0',
    weight2: '0',
    cargoVolume: '0',
    carNumber: '',
    price: 0,
    impuritiesKg: 0,
    impurities: '0%',
    unit: 'VND',
    ieGoods: '',
    customerName: '',
    productName: '',
    type: '',
    time1: '',
    time2: '',
    isActive: true,
  };
  connectImg = 'off';
  apiUrl = BaseApiUrl.TramCan;
  form: any = null;
  colorNum: string = 'blue';
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
      'impurities',
      'price',
      'type',
      'ieGoods',
      'createdAt',
      'updatedAt',
    ],
    pageSize: 100,
    isShowBt: false,
  };
  constructor(
    private socketService: SocketService,
    private socket: Socket,
    private services: ApiService,
    private dataService: DataService,
    private fb: FormBuilder
  ) {}
  async ngOnInit(): Promise<void> {
    // console.log(this.apiUrl);
    this.initForm();
    await this.getComs();
    const serial = localStorage.getItem('connect');
    console.log('serial', serial);
    if (serial) {
      await this.onChange(JSON.parse(serial));
    } else {
      const array = this.ports;
    }
    this.isconnect = localStorage.getItem('connect') != null;

    setInterval(() => {
      this.t = new Date();
      this.time = this.t.toLocaleTimeString();
      this.date = this.t.toLocaleDateString('vi');
      this.random = Math.random();
      if (parseInt(this.obj.weight2) == 0) {
        this.obj.time1 = this.time;
      }
    }, 1000);
    this.receiveMessage();
  }
  initForm() {
    this.form = this.fb.group({
      weight1: ['0', [Validators.required, Validators.minLength(16)]],
      weight2: ['0', [Validators.required, Validators.minLength(16)]],
      cargoVolume: '0',
      carNumber: '',
      price: 0,
      impuritiesKg: 0,
      impurities: '0%',
      unit: 'VND',
      ieGoods: '',
      customerName: '',
      productName: '',
      type: '',
      time1: '',
      time2: '',
      isActive: true,
      id: 0,
      customerId: '',
    });
  }
  async receiveMessage(): Promise<string> {
    return new Promise((res, rej) => {
      this.socket.on('message', (response: any) => {
        // console.log(response)
        if (this.btcanxe) return;
        const reg = /^\d+$/;
        if (response.data == '0') {
        }

        if (response) {
          this.isconnect = false;
        }
        if (reg.test(response.data)) {
          this.weight = parseInt(response.data);
          if (this.weight > 0) {
            // if (parseInt(this.obj.weight2) == 0) this.obj.weight1 = this.weight;
            if (this.obj.carNumber != '' && parseInt(this.obj.weight1) > 0)
              this.disabled = false;
            res(`${this.weight}`);
          }
        }
      });
    });
  }

  async getComs() {
    this.ports = await this.services.get('ports');
  }
  async onChange(value: any) {
    await this.socketService.sendMessage(
      { port: value.path || value.port, baudRate: value.baudRate || 9600 },
      'changePort'
    );
  }
  outputTramCan(event: any) {
    console.log(event);
  }
  save(isActive = true) {
    if (!isActive) this.obj.isActive = isActive;
    this.services.create(this.apiUrl, this.obj).then((e: any) => {
      console.log(e);
      this.dataService.sendMessage({ status: Status.Refesh });
    });
  }
  savePrint() {}
  count = 0;
  async btCanXeClick() {
    this.count++;
    this.btcanxe = this.count % 2 == 0;
    this.colorNum = this.count % 2 == 0 ? 'white!important' : 'blue!important';
    console.log(this.btcanxe);
  }
  async onClickOnOff() {
    this.connectImg = this.connectImg == 'on' ? 'off' : 'on';
    if (this.connectImg == 'off') {
      await this.socketService.sendData('data', { data: 'close' });
    } else {
      await this.socketService.sendMessage(
        { port: 'COM2', baudRate: 9600 },
        'changePort'
      );
    }
  }
  eventUpsertTable(event: any) {
    delete event?.no;
    this.dataService.sendMessage({ status: Status.Upsert, data: event });
    this.disabled = false;
    this.obj.weight1 = event.weight1;
    this.obj.weight2 = event.weight2;
    this.obj = event;
  }
}
