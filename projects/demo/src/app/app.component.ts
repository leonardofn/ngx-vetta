import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DecimalNumberOptions, deepClone } from 'ngx-vetta';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Ngx Vetta';
  form: FormGroup;
  options: DecimalNumberOptions = {
    maxIntegers: 3,
    maxDecimals: 2,
    decimalSeparator: ',',
    allowNegative: true,
    enableMask: true
  };

  constructor() {}

  ngOnInit(): void {
    this.form = new FormGroup({
      vetValidationLabel: new FormControl('', [Validators.required]),
      vetDecimalNumber: new FormControl('', [Validators.required]),
      vetMaxLength: new FormControl('', [Validators.required]),
      vetOnlyNumber: new FormControl('', [Validators.required])
    });

    const data = [
      {
        nrPeriodo: 1,
        vmEscopo_1: 283.1404,
        vmEscopo_2: 20.0506,
        vmEscopo_3: {
          nrPeriodo: 1,
          vmEscopo_1: 283.1404,
          vmEscopo_2: 20.0506,
          vmEscopo_3: 64.1797
        }
      },
      {
        nrPeriodo: 2,
        vmEscopo_1: 250.0205,
        vmEscopo_2: 9.0308,
        vmEscopo_3: {
          nrPeriodo: 1,
          vmEscopo_1: 283.1404,
          vmEscopo_2: 20.0506,
          vmEscopo_3: 64.1797
        }
      },
      {
        nrPeriodo: 3,
        vmEscopo_1: 256.0068,
        vmEscopo_2: 39.7724,
        vmEscopo_3: {
          nrPeriodo: 1,
          vmEscopo_1: 283.1404,
          vmEscopo_2: 20.0506,
          vmEscopo_3: 64.1797
        }
      }
    ];

    const dataClone = deepClone(data);

    data[0].vmEscopo_3.nrPeriodo = 99;

    console.log('Original', data);
    console.log('Clone', dataClone);
  }
}
