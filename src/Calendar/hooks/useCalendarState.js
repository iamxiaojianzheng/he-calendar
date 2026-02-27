import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import { SolarDay } from 'tyme4ts';
import { useStorage } from './useStorage';
import { useFestivals } from './useFestivals';

export function useCalendarState() {
  const { getItem, setItem } = useStorage();
  const { 
    showSolarFestivals, 
    showLunarFestivals, 
    showInternationalFestivals, 
    showSolarTerms, 
    getInternationalFestival 
  } = useFestivals();

  const currentMonth = ref(dayjs());
  const selectedDate = ref(dayjs());
  const weekStartDay = ref(0);
  const yearPickerOffset = ref(0);

  const calendarDays = computed(() => {
    const startOfMonth = currentMonth.value.startOf('month');
    const firstDayOfWeek = startOfMonth.day();
    const daysToSubtract = (firstDayOfWeek - weekStartDay.value + 7) % 7;
    const start = startOfMonth.subtract(daysToSubtract, 'day');
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = start.add(i, 'day');
      const solarDay = SolarDay.fromYmd(date.year(), date.month() + 1, date.date());
      const lunarDay = solarDay.getLunarDay();
      const legalHoliday = solarDay.getLegalHoliday();
      
      const solarFestival = showSolarFestivals.value ? solarDay.getFestival() : null;
      const lunarFestival = showLunarFestivals.value ? lunarDay.getFestival() : null;
      const internationalFestival = showInternationalFestivals.value ? getInternationalFestival(date.year(), date.month() + 1, date.date()) : null;
      
      const termDay = solarDay.getTermDay();
      const isTermDay = termDay.getDayIndex() === 0;
      const solarTermName = isTermDay ? termDay.getSolarTerm().getName() : '';
      
      const allFestivalsForDetail = [];
      if (lunarFestival) allFestivalsForDetail.push({ name: lunarFestival.getName(), type: 'lunar' });
      if (solarFestival) allFestivalsForDetail.push({ name: solarFestival.getName(), type: 'solar' });
      if (solarTermName) allFestivalsForDetail.push({ name: solarTermName, type: 'term' });
      if (internationalFestival) allFestivalsForDetail.push({ name: internationalFestival, type: 'international' });
      
      let displayFestival = '';
      if (showLunarFestivals.value && lunarFestival) {
        displayFestival = lunarFestival.getName();
      } else if (showSolarFestivals.value && solarFestival) {
        displayFestival = solarFestival.getName();
      } else if (showSolarTerms.value && solarTermName) {
        displayFestival = solarTermName;
      } else if (showInternationalFestivals.value && internationalFestival) {
        displayFestival = internationalFestival;
      }
      
      const lunarMonth = lunarDay.getLunarMonth();
      const lunarDayName = lunarDay.getName();
      const lunarMonthName = lunarMonth.getName();
      const lunarText = lunarDayName === '初一' ? lunarMonthName : lunarDayName;
      
      days.push({
        date,
        solarDay,
        lunarDay,
        isCurrentMonth: date.month() === currentMonth.value.month(),
        isToday: date.isSame(dayjs(), 'day'),
        isSelected: date.isSame(selectedDate.value, 'day'),
        lunarText: lunarText,
        displayFestival: displayFestival,
        allFestivals: allFestivalsForDetail,
        holiday: legalHoliday ? { name: legalHoliday.getName(), isWork: legalHoliday.isWork() } : null,
      });
    }
    return days;
  });

  const baseWeekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekDays = computed(() => {
    const days = [...baseWeekDays];
    if (weekStartDay.value === 1) {
      const sun = days.shift();
      days.push(sun);
    }
    return days;
  });

  const dayDifference = computed(() => {
    const today = dayjs().startOf('day');
    const selected = selectedDate.value.startOf('day');
    const diff = selected.diff(today, 'day');
    if (diff === 0) return '';
    return diff > 0 ? `${diff}天后` : `${Math.abs(diff)}天前`;
  });

  const nextMonth = () => currentMonth.value = currentMonth.value.add(1, 'month');
  const prevMonth = () => currentMonth.value = currentMonth.value.subtract(1, 'month');
  
  const setWeekStartDay = async (day) => {
    weekStartDay.value = day;
    await setItem('calendar-week-start', day.toString());
  };

  onMounted(async () => {
    weekStartDay.value = parseInt(await getItem('calendar-week-start', '0'));
  });

  return {
    currentMonth,
    selectedDate,
    weekStartDay,
    calendarDays,
    weekDays,
    dayDifference,
    yearPickerOffset,
    nextMonth,
    prevMonth,
    setWeekStartDay
  };
}
