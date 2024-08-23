import { Controller, Get, Query } from '@nestjs/common';
import { NiceService } from './nice.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('NICE')
@Controller('/nice')
export class NiceController {

  constructor(private niceService: NiceService) {}

  @Get('/school')
  async findSchool(@Query('keyword') keyword: string) {
    return await this.niceService.findSchool(keyword);
  }

  @ApiQuery({
    name: 'areaCode',
    required: true,
    example: 'D10',
    description: '지역 코드'
  })
  @ApiQuery({
    name: 'schoolCode',
    required: true,
    example: '7240259',
    description: '학교 코드'
  })
  @ApiQuery({
    name: 'date',
    required: true,
    example: '20240823',
    description: '조회할 일자 형식 ( YYYYMMDD )'
  })
  @ApiOperation({ summary: '급식 정보를 조회하는 API' })
  @Get('/meal')
  async findMeal(
    @Query('areaCode') areaCode: string,
    @Query('schoolCode') schoolCode: string,
    @Query('date') date: string
  ) {
    return await this.niceService.findMeal(areaCode, schoolCode, date);
  }

  @ApiOperation({ summary: '시간표를 조회하는 API' })
  @ApiQuery({
    name: 'areaCode',
    required: true,
    example: 'D10',
    description: '지역 코드'
  })
  @ApiQuery({
    name: 'schoolCode',
    required: true,
    example: '7240259',
    description: '학교 코드'
  })
  @ApiQuery({
    name: 'grade',
    required: true,
    example: '1',
    description: '대상 학년'
  })
  @ApiQuery({
    name: 'classNm',
    required: true,
    example: '1',
    description: '대상 학반'
  })
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