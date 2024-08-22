import axios from 'axios';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { BasicLogger } from '../logger/basic.logger';

axios.defaults.withCredentials = true;

export default class RestApi {

  static logger = new BasicLogger();

  static async get(url = '/', params: string[] = null): Promise<{ data: any; res: any }> {
    try {
      let apiUrl = url;

      if(params) {
        apiUrl += '?' + Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');
      }

      this.logger.log(`>> Request URL   : ${apiUrl}`);
      this.logger.log(`>> Request PARAMETER   : ${params}`);

      const res = await axios.get(apiUrl);

      console.log('<< Response Data ', res.data);

      return { data: res.data, res: res};
    } catch (error: any) {
      this.logger.error('<< Rest API ERROR ', error);
      throw error;
    }
  }
}