export interface IVatRate {
  object: string;
  rate: number;
  class: string;
  description: string;
  types: boolean;
}

export interface IVatResponse {
  object: string;
  country_code: string;
  country_name: string;
  eu: boolean;
  standard: IVatRate;
  other: IVatRate[];
}

export class VatResponse {
  constructor(data: IVatResponse) {
    this.country = data.country_name;
    this.rate = data.standard.rate;
    this.description = data.standard.description;
  }

  country: string;
  rate: number;
  description: string;
}
