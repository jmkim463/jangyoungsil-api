import { Controller, Get, Query } from '@nestjs/common';
import { TimetableService } from './timetable.service';

@Controller('/timetable')
export class TimetableController {

  constructor(private timetableService: TimetableService) {}

  @Get()
  async findTimetableData(
    @Query('areaCode') areaCode: string,
    @Query('schoolCode') schoolCode: string,
    @Query('grade') grade: number,
    @Query('classNm') classNm: number
  ) {
    return await this.timetableService.findTimetableData(areaCode, schoolCode, grade, classNm);
  }


}