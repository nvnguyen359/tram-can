import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, RequiredValidator, Validators } from '@angular/forms';
import { InfoStore } from 'src/app/Models/inforStore';
import { BaseApiUrl, IdsContant } from 'src/app/general';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent {
  url = BaseApiUrl.CaiDat;
  banks: any[] = [];
  formBank: any;
  optionsBanhks = {
    name: 'name',
    showtext: 'name',
    label: 'Ngân Hàng',
    placeholder: 'Danh Sách Ngân Hàng',
    banks: true,
  };
  binBank: any = '';
  initBank = {
    accountNumber: '0041000171668',
    shortName: 'Vietcombank',
    accountName: 'DO VAN HIEU',
    bin: '',
  };
  initStore = {
    name: 'MÁY PIN HIỆU NGÂN',
    phone: '<b>0988.114.714</b> - <b>0842.399.889</b>',
    address: 'TDP Hữu Lộc, P.Trúc Lâm, Nghi Sơn, Thanh Hóa',
    infoPlus: ' Chuyên: máy pin - cung cấp linh kiện ngành pin',
  };
  qrViet = {
    Client_ID: 'c3503c91-f295-4574-ab2a-206e7f58a334',
    API_Key: '10a474b4-fc88-45ae-9bcd-18316d1ffe23',
  };
  settingData: any;
  constructor(private service: ApiService, private fb: FormBuilder) {
    this.initFormBank();
    service.findAll({ name: 'setting' }).then((data: any) => {
      if (data.count == 0) return;
      this.settingData = data;
    });
  }
  async ngOnInit() {}
  async searchBank() {
    this.banks = ((await this.service.getBanks()) as any)?.data;
    this.initFormBank(this.settingData);
    console.log(this.formBank.controls['accountNumber']);
    this.formBank.controls['banks'].patchValue(this.initBank.accountNumber);
    this.formBank.controls['banks'].patchValue({
      accountNumber: this.initBank.accountNumber,
    });
    const find = this.banks.find(
      (x: any) => x.shortName == this.initBank.shortName
    );
    this.initBank.bin = find.bin;
    this.formBank.controls['banks'].patchValue(this.initBank);
    this.formBank.controls['banks'].patchValue({
      accountName: this.initBank.accountName,
    });
    this.formBank.controls['banks'].patchValue({
      accountName: this.initBank.accountName,
    });
    this.formBank.controls['store'].patchValue(this.initStore);
  }
  initFormBank(obj: any = null) {
    const obj1 = obj?.jsonData
      ? (JSON.parse(obj?.jsonData) as InfoStore)
      : null;
    this.formBank = this.fb.group({
      id: obj?.id || '',
      serialPort: this.fb.group({
        port: obj1?.ghn?.token || '',
        baudRate: obj1?.ghn?.Client_id || '',
      }),
      store: this.fb.group({
        name: obj1?.store?.name || '',
        phone: obj1?.store?.phone || '',
        address: obj1?.store?.address || '',
        infoPlus: obj1?.store?.infoPlus || '',
      }),
    });
  }
  onSelectBank(event: any) {
    this.binBank = event.bin;
    this.formBank.controls['banks'].patchValue({
      bin: event.bin,
    });
  }
  async onSubmitBank(event: any = null) {
    const value = event.target.value;
    if (value.length >= 10 && value.length <= 19) {
      const formValue = this.formBank.value;
      const result = (await this.service.lookupBank(formValue.banks)) as any;
      if (result.code == '00') {
        this.formBank.controls['banks'].patchValue({
          accountName: result.data.accountName,
        });
      } else {
        this.formBank.controls['banks'].patchValue({
          accountName: this.initBank.accountName,
        });
      }
    }
  }
  onFocus() {
    const formValue = this.formBank.value;
    console.log(formValue);
  }
  async onSubmit() {
    const formValue = this.formBank.value;
    const id = formValue.id;
    console.log('id', id);
    delete formValue.id;
    const obj = {
      name: 'name',
      jsonData: JSON.stringify(formValue),
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = !id
      ? await this.service.create(this.url, obj)
      : await this.service.update(this.url, obj);
    if (result) {
      this.service
        .getId(this.url, IdsContant.idSetting)
        .then((data: any) => (this.settingData = data));
      this.initFormBank(this.settingData);
    }
  }
}
