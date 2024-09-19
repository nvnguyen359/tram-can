import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { StatusComponent } from '../status/status.component';
import { BaseApiUrl, Status, groupItem } from 'src/app/general';
import { ApiService } from 'src/app/services/api.service';
import { SelectionModel } from '@angular/cdk/collections';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { GroupItems } from './groupItems';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-expansion-table',
  standalone: true,
  // declarations:[FormatValuePipe,ColumnOrdersPipe],
  templateUrl: './expansion-table.component.html',
  styleUrls: ['./expansion-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatTabsModule,
    AutocompleteComponent,
    NgFor,
    MatButtonModule,
    NgIf,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatRippleModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule,
    MatAutocompleteModule,
    StatusComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ExpansionTableComponent {
  @Input() options: any = {
    url: '',
    displayedColumns: [],
    pageSize: 5,
    isShowBt:false
  };
  @Output() eventDelete = new EventEmitter();
  @Output() eventUpsert = new EventEmitter();
  displayedColumns: string[] = [];
  columnsChild: any[] = [];
  columnsToDisplayWithExpand: any[] = [...this.displayedColumns, 'expand'];
  selection = new SelectionModel<any>(true, []);
  array: any;
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  pageSize = this.options.pageSize;
  pageEvent?: PageEvent;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  fieldFilter: any;
  disabled = 'disabled';
  customers: any = [];
  products: any = [];
  expandedElement: any | null;
  details: any[] = [];
  dataResult: any;
  url: any;
  constructor(
    private service: ApiService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dataService: DataService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
    this.url = router.url.replace('/', '');
  }
  ngOnInit() {
    if (this.options.displayedColumns) {
      this.displayedColumns = this.options.displayedColumns;
    }
    this.getData();
    this.dataService.currentMessage.subscribe((result: any) => {
      if (result.status == Status.Refesh) {
        this.getData();
      }
      if (result.status == Status.Search) {
        this.createTable(this.dataResult, result.value);
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngDisabled() {
    return this.selection.selected.length < 1 ? 'disabled' : '';
  }
  createTable(data: any, name = '') {
    const oldData = data;
    this.selection.clear();
    const pageIndex = this.pageEvent?.pageIndex || 0;
    const pageSize = this.pageEvent?.pageSize || this.pageSize;
    const filter =
      name == ''
        ? oldData.items
        : data.items.filter((x: any) =>
            `${x.name}`
              .toLowerCase()
              .removeAccents()
              .includes(name.toLowerCase().removeAccents())
          );
    this.details = filter;
    if (this.options.multi) {
      if (data.count > 0) {
        const groupItems = new GroupItems(filter);
        const x = groupItems.groupItems;
        this.details = x?.items || [];
        this.displayedColumns = x?.columns;
        this.columnsChild = [...this.options.displayedColumns];
      }
    } else {
      this.columnsChild = [...this.options.displayedColumns];
    }
    const items = Array.from(this.details).map((x: any, index: any) => {
      x.no = index + 1 + pageIndex * pageSize;
      return x;
    });
    this.resultsLength = data.count;
    this.dataSource.data = items;
    this.changeDetectorRefs.detectChanges();
  }
  getData() {
    this.selection.clear();
    const pageIndex = this.pageEvent?.pageIndex || 0;
    const pageSize = this.pageEvent?.pageSize || this.pageSize;
    if (!this.options.url) {
      this.options.url = this.router.url.replace('/', '').trim();
    }
    this.service
      .get(this.options.url, { page: pageIndex, pageSize })
      .then((data: any) => {
        if (data.count < 1) {
          this.dataSource.data = [];
          this.changeDetectorRefs.detectChanges();
          return;
        }
        this.dataResult = data;
        this.details = data.items;
        if (this.options.multi) {
          const groupItems = new GroupItems(data.items);
          const x = groupItems.groupItems;
          this.displayedColumns = x?.columns;
          // this.options.displayedColumns.pop();

          this.columnsChild = [...this.options.displayedColumns];
          this.columnsToDisplayWithExpand = [
            ...this.displayedColumns,
            'expand',
          ];
          this.details = x.items;
        } else {
          this.columnsChild = [...this.options.displayedColumns];
        }
        const items = Array.from(this.details).map((x: any, index: any) => {
          x.no = index + 1 + pageIndex * pageSize;
          return x;
        });

        this.resultsLength = data.count;
        this.dataSource.data = items;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.changeDetectorRefs.detectChanges();
      });
  }
  showImport() {
    return this.options?.multi;
  }
  getServerData(event: PageEvent) {
    this.pageEvent = event;
    this.getData();
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    this.disabled = this.selection.selected.length > 0 ? 'submit' : 'disabled';
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  async onbulkDelete() {
    if (this.selection.selected.length < 1) return;
    const data = !this.options.multi
      ? this.selection.selected
      : this.selection.selected.map((x: any) => x.details).flat();
    const ids = (data as any[]).map((x: any) => x.id);
    const result = await this.service.bulkDelete(this.options.url, ids, true);

    if (result) {
      this.getData();
    }
  }
  onUpdates() {
    if (this.selection.selected.length < 1) return;
    let result: any;
    if (this.options.multi) {
      result = Array.from(this.selection.selected as any[])
        .map((x: any) => {
          return x.details;
        })
        .flat();
    } else {
      result = this.selection.selected;
    }
    let result1 = result.map((x: any) => {
      delete x.no;
      delete x[groupItem.sumImport];
      delete x[groupItem.sumSale];
      return x;
    });
    // console.log(result1);
    this.eventUpsert.emit(result1);
  }
  onRowClick(item: any,event:any,index:any) {
    this.eventUpsert.emit(item);
    const rows= document.querySelectorAll('.mat-mdc-row');
    rows.forEach((e:any)=>e.classList.remove('active'));
    (event.target as HTMLElement).closest('.mat-mdc-row')?.classList.add('active')
    event.preventDefault();
    //event.stopPropagation();
  }
  onCreate() {}
  //******************************************** */
  columnOrders(key: any) {
    const columnsToDisplay = [
      { key: 'no', value: '#' },
      { key: 'name', value: 'Tên' },
      { key: 'status', value: 'Trạng Thái' },
      { key: 'wage', value: 'Tiền Công' },
      { key: 'discount', value: 'Chiết Khấu' },
      { key: 'shippingFee', value: 'Phí Vận Chyển' },
      { key: 'quantity', value: 'SL' },
      { key: 'intoMney', value: 'Thành Tiền' },
      { key: 'pay', value: 'Thanh Toán' },
      { key: 'createdAt', value: 'Ngày' },
      { key: 'updatedAt', value: 'Ngày' },
      { key: 'customerName', value: 'Khách Hàng' },
      { key: 'price', value: 'Gía Bán' },
      { key: 'importPrice', value: 'Gía Nhập' },
      { key: 'unit', value: 'Đơn Vị' },
      { key: 'no', value: '#' },
      { key: 'address', value: 'Địa Chỉ' },
      { key: 'phone', value: 'Phone' },
      { key: 'email', value: 'Email' },
      { key: 'note', value: 'Ghi Chú' },
      { key: 'money', value: 'Tiền' },
      { key: groupItem.ISumQuantity, value: 'Số Lượng' },
      { key: groupItem.ISumSales, value: 'Tổng Doanh Thu' },
      { key: groupItem.IsumImport, value: 'Tổng Nhập' },
      { key: groupItem.ISumExpense, value: 'Tổng Chi' },
      { key: groupItem.sumSale, value: 'Doanh Thu' },
      { key: groupItem.sumImport, value: 'Tiền Nhập' },
      { key: 'kh_ncc', value: 'Khách Hàng-NCC' },
      { key: 'loanDate', value: 'Ngày Tạo' },
      { key: 'payDate', value: 'Ngày T.Toán' },
      { key: 'sumOuput', value: 'Tổng Xuất' },
      { key: 'inventory', value: 'Tồn Kho' },
      { key: 'valueImport', value: 'Tiền Nhập' },
      { key: 'valueOut', value: 'Doanh Thu' },
      { key: 'profit', value: 'Lợi Nhuận' },
      { key: 'weight1', value: 'Cân Lần 1' },
      { key: 'weight2', value: 'Cân Lần 2' },
      { key: 'cargoVolume', value: 'KL Hàng' },
      { key: 'impurities', value: 'Tạp Chất(%)' },
      { key: 'carNumber', value: 'Số Xe' },
      { key: 'type', value: 'Loại Hàng' },
      { key: 'ieGoods', value: 'Kiểu' },
      { key: 'productName', value: 'Tên Hàng' },
      { key: 'customertName', value: 'Khách Hàng' },
      { key: 'id', value: 'ID' },
    ];
    const name = columnsToDisplay.find((x: any) => x.key == key)?.value;
    return name;
  }
  formatValue(value: any, column = '') {
    let result = value;
    if (value == undefined) return value;

    if (column == 'phone') {
      return `<a href="tel:${value}">${value}</a>`;
    } else {
      if (this.isNumeric(value)) {
        result = parseInt(value).toLocaleString('vi');
      } else {
        result = value;
        if (
          `${column}`.includes('At') &&
          value.includes('T') &&
          value.includes('Z') &&
          value.includes('-')
        ) {
          result = new Date(value).toLocaleDateString('vi');
        }
      }
    }
    return `${result}`;
  }
  isNumeric(str: any) {
    return /^-?\d+$/.test(str);
  }
  isValidDate(d: any) {
    return d instanceof Date;
  }
  textAligh(value: any) {
    const t = this.isNumeric(value) ? 'text-right' : 'text-left';
    return t;
  }
  thTextAligh(value: any) {
    return `${value}`.includes('price') || `${value}`.includes('Price')
      ? 'text-right'
      : 'text-left';
  }

  async onAddNewOrder(ob: any) {
    // this.router.navigate([`${BaseApiUrl.Orders}`, ob]);
  }
}
