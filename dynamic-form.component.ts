import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControlOptions, FormGroup, ReactiveFormsModule, ValidatorFn} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Observable} from "rxjs";
import {Model} from "../../interfaces";

export interface DynamicFormField {
  label: string;
  icon?: string;
  placeholder?: string;
  validations?: ValidatorFn | ValidatorFn[] | FormControlOptions;
  value?: string | { [key: string]: [value: string] }[] | Observable<any>;
  type?: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'number' | 'date';
}

export interface DynamicFormModel {
  [field: string]: DynamicFormField;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.css'
})
export class DynamicFormComponent implements OnInit {
  @Input('with-model') model!: DynamicFormModel;
  @Input('with-submit-button-text') submitButtonText: string = 'Enrégistrer';
  @Input('with-loader') isLoading: boolean | null = false;
  @Input('with-header') header?: string;
  @Input('with-description') description?: string;
  @Output('on-submit') submit: any = new EventEmitter<Model>();

  private fb: FormBuilder = inject(FormBuilder);

  public form: FormGroup = this.fb.group({});
  public modelKeys: string[] = [];

  ngOnInit(): void {
    // Obtenir les clés du modèle
    this.modelKeys = Object.keys(this.model);

    // Ajouter les contrôles pour chaque clé
    this.modelKeys.forEach(key => {
      this.form.addControl(
        key, this.fb.control(this.model[key].value || '', this.model[key].validations || [])
      );
    });
  }

  getFieldType(key: string): "text" | "email" | "password" | "select" | "textarea" | "number" | "date" | undefined {
    return this.model[key].type;
  }

  getPlaceholder(key: string): string | undefined {
    return this.model[key].placeholder;
  }

  getIcon(key: string): string | undefined {
    return this.model[key].icon;
  }

  getLabel(key: string): string | undefined {
    return this.model[key].label;
  }

  getValue(key: string): string | { [p: string]: [value: string] }[] | Observable<any> | undefined {
    return this.model[key].value;
  }

  onSubmit(event: any): void {
    event.preventDefault();  // Prevent default form submission
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    }
  }
}
