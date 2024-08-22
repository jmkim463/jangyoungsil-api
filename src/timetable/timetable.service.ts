import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'rxjs';
import RestApi from '../common/util/rest-api.util';
import { BasicLogger } from '../common/logger/basic.logger';

@Injectable()
export class TimetableService {

  private logger = new BasicLogger();

  constructor(private configService: ConfigService) {}

  /**
   * 이번주 시간표를 가져온다.
   *
   * @param areaCode 지역 코드
   * @param schoolCode 학교 코드
   * @param grade 학년
   * @param classNm 반
   */
  async findTimetableData(areaCode: string, schoolCode: string, grade: number, classNm: number) {
    const result = Array(5);
    for (let i = 0; i < 5; i++) {
      result[i] = Array(7).fill('공강');
    }

    const url = this.configService.get<string>("API_URL_TIMETABLE");
    const param = [];

    param['KEY'] = this.configService.get<string>("API_KEY_TIMETABLE"); // 인증키
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

      const year = curDate.getFullYear(); // 연도 (YYYY)
      const month = ('0' + (curDate.getMonth() + 1)).slice(-2); // 월 (MM) - 0부터 시작하므로 +1 필요, 두 자리 형식으로 변환
      const date = ('0' + curDate.getDate()).slice(-2); // 일 (DD) - 두 자리 형식으로 변환

      param['ALL_TI_YMD'] = year + month + date; // 요일

      const { data } = await RestApi.get(url, param);
      const timetable = data.hisTimetable[1].row;

      timetable.map((item, idx) => {
        const perio = item.PERIO; // 교시
        const itrtcntnt = item.ITRT_CNTNT; // 수업 내용

        result[i][perio - 1] = itrtcntnt;
      });
    }

    this.logger.log('Request Timetable data areaCode : ', areaCode, ' schoolCode : ', schoolCode, ' grade : ', grade, ' classNm : ', classNm, ' result Data : ', result);

    return result;
  }

}