# Ngx Vetta

`Ngx Vetta` é uma bibloteca de componentes, diretivas e utilitários frequetemente usados nos projetos Angular desenvolvidos pela [Vetta](https://www.linkedin.com/company/vettadigital/).

## Como instalar

```
npm install --save ngx-vetta
```

## Guia rápido

Importe a(s) funcionalidade(s) desejada(s) no seu módulo.

```ts
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgxVettaModule,
  VetValidationLabelModule,
  VetOnlyNumberModule,
  VetDecimalNumberModule,
  VetMaxLengthModule,
} from 'ngx-vetta';

@NgModule({
  (...)
  imports: [
    FormsModule, ReactiveFormsModule,
    NgxVettaModule,
    VetValidationLabelModule,
    VetOnlyNumberModule,
    VetDecimalNumberModule,
    VetMaxLengthModule,
    VetUppercaseModule,
  ],
  (...)
})
```

## Diretivas de atributos

### Diretiva `vetValidationLabel`

A diretiva `vetValidationLabel` exibe uma mensagem de erro quando o estado controle é inválido. A mensagem depende do tipo de validação que foi aplicado na definição do controle.

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export class MyComponent {
  form: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.form = new FormGroup({
      myControl: new FormControl('', [Validators.required])
    });
  }
}
```

```html
<input type="text" formControlName="myControl" vetValidationLabel />
```

#### noWhiteSpace (boolean)

Você pode especificar se a diretiva deve validar casos onde o valor do campo não possa ser uma string vazia passando a atributo `noWhiteSpace` como `true`.

```html
<input type="text" formControlName="myControl" vetValidationLabel [noWhiteSpace]="true" />
```

### Diretiva `vetDecimalNumber`

A diretiva `vetDecimalNumber` permite a entrada de apenas valores númericos decimais (positivos e negativos).

```html
<input type="text" formControlName="myControl" vetDecimalNumber />
```

#### decimalNumberOptions (object)

A diretiva aceita a passagem de um objeto de configuração do tipo `DecimalNumberOptions`.

#### Opções de configuração

| Opção              | Tipo      | Descrição                                                                                                                                               |
| ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maxIntegers`      | `number`  | Define o quantidade máxima de números permitidos para a parte inteira. O padrão é ilimitado, caso não exista limitador de caracteres aplicado ao campo. |
| `maxDecimals`      | `number`  | Define o quantidade máxima de números permitidos para a parte decimal. O padrão é duas casas.                                                           |
| `decimalSeparator` | `string`  | Define o separador decimal, podendo ser ponto (.) ou vírgula (,). O padrão é ponto.                                                                     |
| `allowNegative`    | `boolean` | Se `true`, permite a inserção de números negativos. O padrão é `false`.                                                                                 |
| `enableMask`       | `boolean` | Se `true`, aplica máscara automaticamente no momento de perda de foco do campo (blur event). O padrão é `false`.                                        |

#### Exemplo de uso

```ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DecimalNumberOptions } from 'ngx-vetta';

export class MyComponent {
  form: FormGroup;

  options: DecimalNumberOptions = {
    maxIntegers: 2,
    maxDecimals: 2,
    decimalSeparator: ',',
    allowNegative: true,
    enableMask: true
  };

  constructor() {}

  ngOnInit(): void {
    this.form = new FormGroup({
      myControl: new FormControl('', [Validators.required])
    });
  }
}
```

```html
<input
  type="text"
  formControlName="myControl"
  vetDecimalNumber
  decimalNumberOptions]="options" />
```

### Diretiva `vetOnlyNumber`

A diretiva `vetOnlyNumber` permite a entrada de apenas valores númericos inteiros (positivos e negativos).

```html
<input type="text" formControlName="myControl" vetOnlyNumber />
```

#### allowNegative (boolean)

Para permitir o uso de números negativos, defina o atributo `allowNegative` como `true`.

```html
<input type="text" formControlName="myControl" vetOnlyNumber [allowNegative]="true" />
```

### Diretiva `vetMaxLength`

A diretiva `vetMaxLength` define a quantidade máxima de caracteres permitidos para o controle especificado.

```html
<input type="text" formControlName="myControl" vetMaxLength="10" />
```

### Diretiva `vetUppercase`

A diretiva `vetUppercase` converte qualquer letra do alfabeto, acentuados ou não, para sua representação em maiúsculas.

```html
<input type="text" formControlName="myControl" vetUppercase />
```
