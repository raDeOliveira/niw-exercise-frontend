import {Component, OnInit, ViewChild} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FlexModule} from "@ngbracket/ngx-layout";
import {MatCardModule} from '@angular/material/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MonthlyPayment} from "../../entity/monthly-payment";
import {ApiService} from "../../service/api.service";
import {User} from "../../entity/user";
import {ModalComponent} from "../modal/modal.component";
import {MatDialog} from "@angular/material/dialog";
import {MatButton, MatFabButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {HelperDataService} from "../../service/helper-data.service";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {MatIcon} from "@angular/material/icon";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'}
]

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    MatInput,
    FlexModule,
    MatCardModule,
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    MatButton,
    NgIf,
    MatOption,
    MatSelect,
    MatIcon,
    MatIconButton,
    MatFabButton,
    MatMiniFabButton,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatTable,
    MatSort,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {

  selectedFactor = '';
  calculateForm: FormGroup;
  toPayEveryMonth: number = 0;
  showBtn = false;
  userData: User | any;
  receivedData: any;

  monthlyPayments: MonthlyPayment[] = [];
  internalMonths: MonthlyPayment[] = [
    {id: 1, name: '12'},
    {id: 2, name: '24'},
    {id: 3, name: '36'},
    {id: 4, name: '48'}
  ];

  externalMonths: MonthlyPayment[] = [
    {id: 1, name: '12'},
    {id: 2, name: '24'},
    {id: 3, name: '36'},
    {id: 4, name: '48'},
    {id: 5, name: '60'},
  ];

  constructor(private fb: FormBuilder, private apiService: ApiService, private dialog: MatDialog,
              private helperDataService: HelperDataService) {
    this.calculateForm = this.fb.group({
      vehiclePrice: ['', Validators.required],
      financingFactor: ['', [Validators.required, Validators.min(1)]],
      monthlyPayment: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onFactorChange(event: MatSelectChange) {
    this.selectedFactor = event.value;

    if (this.selectedFactor === 'INTERNAL') {
      this.monthlyPayments = this.internalMonths;
    } else if (this.selectedFactor === 'EXTERNAL') {
      this.monthlyPayments = this.externalMonths;
    }
    console.log(event.value);
    console.log(this.monthlyPayments)
  }

  onSubmit() {
    if (this.calculateForm.valid) {

      this.apiService.postCalculation(this.calculateForm.value).subscribe((response: any) => {
        this.toPayEveryMonth = response.toPayEveryMonth;
        this.helperDataService.changeData(response);
      });
      this.showBtn = true;

    } else {
      console.log('Form is invalid');
    }
  }

  openModal(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userData = {
          name: result.name,
          email: result.email,
          paymentDTO: this.receivedData
        }

        this.apiService.saveData(this.userData).subscribe((response: any) => {
          console.log("Response: ", response);
        });
      }
      window.location.reload();

    });
  }

  resetForm() {
    this.calculateForm.reset();
    this.showBtn = false;
    this.toPayEveryMonth = 0;
  }

  ngOnInit() {
    this.helperDataService.currentData.subscribe(data => {
      this.receivedData = data;
    });
  }
}
