import { Controller, Get, Query } from '@nestjs/common';
import { NiceService } from './nice.service';

@Controller('/nice')
export class NiceController {

  constructor(private niceService: NiceService) {}

  @Get('/meal')
  async findMeal() {
    return await this.niceService.findMeal();
  }

  @Get('/timetable')
  async findTimetable(
    @Query('areaCode') areaCode: string,
    @Query('schoolCode') schoolCode: string,
    @Query('grade') grade: number,
    @Query('classNm') classNm: number
  ) {
    return await this.niceService.findTimetable(areaCode, schoolCode, grade, classNm);
  }


}