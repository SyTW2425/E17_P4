import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesRecordComponent } from './sales-record.component';
import { SalesRecordService } from '../../services/sales-record.service';
import { SalesRecord } from '../../models/salesRecord.model';

describe('SalesRecordComponent', () => {
  let component: SalesRecordComponent;
  let fixture: ComponentFixture<SalesRecordComponent>;
  let salesRecordService: SalesRecordService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesRecordComponent],
      providers: [SalesRecordService]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesRecordComponent);
    component = fixture.componentInstance;
    salesRecordService = TestBed.inject(SalesRecordService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sales records on initialization', () => {
    const testSalesRecords: SalesRecord[] = [
      { id: 1, productId: 101, customerId: 201, saleDate: new Date(), quantity: 5, totalAmount: 500 }
    ];
    spyOn(salesRecordService, 'getAllSalesRecord').and.returnValue(testSalesRecords);

    component.ngOnInit();

    expect(component.salesRecords).toEqual(testSalesRecords);
  });

  it('should add a sales record and reset form', () => {
    const newSalesRecord: SalesRecord = { id: 2, productId: 102, customerId: 202, saleDate: new Date(), quantity: 3, totalAmount: 300 };
    component.newSalesRecord = newSalesRecord;

    spyOn(salesRecordService, 'addSalesRecord').and.callThrough();
    component.addSalesRecord();

    expect(salesRecordService.addSalesRecord).toHaveBeenCalledWith(newSalesRecord);
    expect(component.salesRecords).toContain(newSalesRecord);
    expect(component.newSalesRecord.quantity).toBe(0); // Verificando que el formulario se haya reseteado
  });

  it('should delete a sales record by ID', () => {
    const salesRecordId = 1;
    spyOn(salesRecordService, 'deleteSalesRecord').and.callThrough();

    component.deleteSalesRecord(salesRecordId);

    expect(salesRecordService.deleteSalesRecord).toHaveBeenCalledWith(salesRecordId);
  });
});
