import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  form: FormGroup;
  constructor() {}
  ngOnInit(): void {
    this.form = new FormGroup({
      test: new FormControl('', [Validators.required]),
    });
  }
}
