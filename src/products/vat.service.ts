import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VatResponse } from './models/vat.response';

@Injectable()
export class VatService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getVAT(countryCode: string): Promise<VatResponse> {
    const url =
      this.configService.get<string>('vat.url') +
      `?country_code=${countryCode}`;

    const auth = {
      username: 'user',
      password: this.configService.get<string>('vat.key'),
    };

    try {
      const { data } = await this.httpService.get(url, { auth }).toPromise();
      return new VatResponse(data.data);
    } catch (error) {
      console.log(error.response.data.error);
      throw new Error(JSON.stringify(error.response.data.error));
    }
  }

  calculateVAT(n: string, rate: number): string {
    const percentageOfN = (rate / 100) * Number(n);
    const result = percentageOfN + Number(n);
    return result.toFixed(2);
  }
}
