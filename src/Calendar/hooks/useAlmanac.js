import { computed } from 'vue';
import { SolarDay, PengZu, FetusDay } from 'tyme4ts';

export function useAlmanac(selectedDate) {
  const baseWeekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const almanacInfo = computed(() => {
    const date = selectedDate.value;
    const solarDay = SolarDay.fromYmd(date.year(), date.month() + 1, date.date());
    const lunarDay = solarDay.getLunarDay();
    const lunarMonth = lunarDay.getLunarMonth();
    const lunarYear = lunarMonth.getLunarYear();
    
    // 获取干支信息
    const yearSixtyCycle = lunarDay.getYearSixtyCycle();
    const monthSixtyCycle = lunarDay.getMonthSixtyCycle();
    const daySixtyCycle = lunarDay.getSixtyCycle();
    
    // 获取彭祖百忌
    const pengZu = PengZu.fromSixtyCycle(daySixtyCycle);
    const pengZuText = pengZu.getPengZuHeavenStem().getName() + ' ' + pengZu.getPengZuEarthBranch().getName();
    
    // 获取胎神方位
    const fetusDay = FetusDay.fromLunarDay(lunarDay);
    const fetusText = fetusDay.getName();
    
    // 获取冲煎信息
    const dayEarthBranch = daySixtyCycle.getEarthBranch();
    const chongEarthBranch = dayEarthBranch.getOpposite();
    const sha = dayEarthBranch.getOminous();
    
    // 获取宜忌
    const recommends = lunarDay.getRecommends();
    const avoids = lunarDay.getAvoids();
    
    // 获取上一个和下一个节气
    const termDay = solarDay.getTermDay();
    const currentTerm = termDay.getSolarTerm();
    const nextTerm = currentTerm.next(1);
    
    return {
      solarDate: date.format('YYYY年MM月DD日'),
      weekDay: '星期' + baseWeekDays[date.day()],
      lunarDate: `${yearSixtyCycle.getName()}(${lunarYear.getSixtyCycle().getEarthBranch().getZodiac().getName()})年 ${lunarMonth.getName()}${lunarDay.getName()}`,
      ganZhi: `${yearSixtyCycle.getName()}年 ${monthSixtyCycle.getName()}月 ${daySixtyCycle.getName()}日`,
      yi: recommends.map(t => t.getName()),
      ji: avoids.map(t => t.getName()),
      pengZu: pengZuText,
      wuXing: daySixtyCycle.getSound().getName(), // 五行纳音
      chong: `冲${chongEarthBranch.getZodiac().getName()}`,
      sha: sha.getName(),
      taiShen: fetusText, // 胎神方位
      jieQi: currentTerm.getName() + ' ' + nextTerm.getName(),
    };
  });

  return {
    almanacInfo
  };
}
