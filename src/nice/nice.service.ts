import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'rxjs';
import RestApi from '../common/util/rest-api.util';
import { BasicLogger } from '../common/logger/basic.logger';

@Injectable()
export class NiceService {

  private logger = new BasicLogger();

  constructor(private configService: ConfigService) {}

  async findSchool(keyword: string) {
    const url = this.configService.get<string>("NICE_API_URL") + '/schoolInfo';
    const param = [];

    param['KEY'] = this.configService.get<string>("NICE_API_KEY"); // 인증키
    param['Type'] = 'json'; // 호출 문서 형식
    param['pIndex'] = '1'; // 페이지 위치
    param['pSize'] = '100'; // 페이지 당 신청 숫자
    param['SCHUL_NM'] = keyword;

    const { data } = await RestApi.get(url, param);
    const result = data.schoolInfo[1].row;

    return result;
  }

  async findMeal(areaCode: string, schoolCode: string, date: string) {
    const url = this.configService.get<string>("NICE_API_URL") + '/mealServiceDietInfo';
    const param = [];
    param['KEY'] = this.configService.get<string>("NICE_API_KEY"); // 인증키
    param['Type'] = 'json'; // 호출 문서 형식
    param['pIndex'] = '1'; // 페이지 위치
    param['pSize'] = '100'; // 페이지 당 신청 숫자
    param['ATPT_OFCDC_SC_CODE'] = areaCode; // 지역 코드
    param['SD_SCHUL_CODE'] = schoolCode; // 학교 코드
    param['MLSV_YMD'] = date; // 급식일자 ( YYYYMMDD )

    const { data } = await RestApi.get(url, param);
    const result = [];

    if (!data.mealServiceDietInfo) {
      return result;
    }

    const meal = data.mealServiceDietInfo[1].row;

    meal.forEach((item, idx) => {
      result.push({
        scheduleIndex: item.MMEAL_SC_CODE, // 식사 시간 코드 (1, 2, 3)
        scheduleNm: item.MMEAL_SC_NM, // 식사 시간 이름 ( 조식, 중식, 석식 )
        dishNm: item.DDISH_NM.replaceAll('<br/>', '\n'), // 식사 내용
        calorie: item.CAL_INFO, // 칼로리 정보
        nutrient: item.NTR_INFO // 영양 정보
      });
    });

    return result;
  }


  /**
   * 이번주 시간표를 가져온다.
   *
   * @param areaCode 지역 코드
   * @param schoolCode 학교 코드
   * @param grade 학년
   * @param classNm 반
   */
  async findTimetable(areaCode: string, schoolCode: string, grade: number, classNm: number) {
    this.logger.log('find Timetable areaCode : ', areaCode, ' schoolCode : ', schoolCode, ' grade : ', grade, ' classNm : ', classNm);

    const result = Array(5);
    for (let i = 0; i < 5; i++) {
      result[i] = Array(7).fill('공강');
    }

    const url = this.configService.get<string>("NICE_API_URL") + '/hisTimetable';
    const param = [];

    param['KEY'] = this.configService.get<string>("NICE_API_KEY"); // 인증키
    param['Type'] = 'json'; // 호출 문서 형식
    param['pIndex'] = '1'; // 페이지 위치
    param['pSize'] = '100'; // 페이지 당 신청 숫자
    param['ATPT_OFCDC_SC_CODE'] = areaCode; // 지역 코드
    param['SD_SCHUL_CODE'] = schoolCode; // 학교 코드
    param['GRADE'] = grade; // 학년
    param['CLASS_NM'] = classNm; // 학급

    const today = new Date();
    const day = today.getDay();

    const start = new Date(today);
    start.setDate(today.getDate() - (day - 1));

    for (let i = 0; i < 5; i++) {
      const curDate = new Date(start);
      curDate.setDate(start.getDate() + i);

      param['ALL_TI_YMD'] = this.formatDate(curDate); // 요일

      const { data } = await RestApi.get(url, param);
      const timetable = data.hisTimetable[1].row;

      timetable.map((item, idx) => {
        const perio = item.PERIO; // 교시
        const itrtcntnt = item.ITRT_CNTNT; // 수업 내용

        result[i][perio - 1] = itrtcntnt;
      });
    }

    this.logger.log('SUCCESS find timetable data', result);

    return result;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear(); // 연도 (YYYY)
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 월 (MM) - 0부터 시작하므로 +1 필요, 두 자리 형식으로 변환
    const day = ('0' + date.getDate()).slice(-2); // 일 (DD) - 두 자리 형식으로 변환

    return year + month + day;
  }

}