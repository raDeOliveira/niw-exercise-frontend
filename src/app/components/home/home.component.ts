import {Component, OnInit} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FlexModule} from "@ngbracket/ngx-layout";
import {MatCardModule} from '@angular/material/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {KeyValuePipe, NgForOf, NgIf} from "@angular/common";
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
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

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
    MatRowDef,
    KeyValuePipe
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
  }

  onSubmit() {
    if (this.calculateForm.valid) {

      if (this.calculateForm.value.vehiclePrice < 0 || this.calculateForm.value.vehiclePrice == 0) {
        // this could be done with other way like a Snack message
        alert("Vehicle price must be greater than 0");
        return;
      }

      this.apiService.postCalculation(this.calculateForm.value).subscribe((response: any) => {
        this.toPayEveryMonth = response.toPayEveryMonth;
        this.helperDataService.changeData(response);
      });
      this.showBtn = true;
    } else {
      alert("Please fill all the fields");
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

        if (this.receivedData == null) {
          alert("Please calculate the monthly payment first");
          return;
        }

        this.apiService.saveData(this.userData).subscribe((response: any) => {
          console.log("Response: ", response);
        });
        alert("Data exported into 'data.csv' on server side");
        window.location.reload();
      }
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
