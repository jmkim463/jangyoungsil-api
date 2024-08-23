import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {

  @Get('/ok')
  async ok() {
    return 'ok';
  }
}
