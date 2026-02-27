import { ref, computed, onMounted } from 'vue';
import { useStorage } from './useStorage';

// 国际节日数据
export const internationalFestivals = {
  '2-14': '情人节',
  '4-1': '愚人节',
  '10-31': '万圣节',
  '11-11': '光棍节',
  '12-24': '平安夜',
  '12-25': '圣诞节',
};

export function useFestivals() {
  const { getItem, setItem } = useStorage();

  const showSolarFestivals = ref(true);
  const showLunarFestivals = ref(true);
  const showInternationalFestivals = ref(true);
  const showSolarTerms = ref(true);
  const showFestivalPanel = ref(false);

  const getDynamicInternationalFestival = (year, month, day) => {
    if (month === 5) {
      const firstDay = new Date(year, 4, 1).getDay();
      const motherDay = firstDay === 0 ? 8 : (14 - firstDay + 1);
      if (day === motherDay) return '母亲节';
    }
    if (month === 6) {
      const firstDay = new Date(year, 5, 1).getDay();
      const fatherDay = firstDay === 0 ? 15 : (21 - firstDay + 1);
      if (day === fatherDay) return '父亲节';
    }
    if (month === 11) {
      const firstDay = new Date(year, 10, 1).getDay();
      const thanksDay = firstDay <= 4 ? (22 + (4 - firstDay)) : (29 - firstDay + 4);
      if (day === thanksDay) return '感恩节';
    }
    return null;
  };

  const getInternationalFestival = (year, month, day) => {
    const key = `${month}-${day}`;
    if (internationalFestivals[key]) return internationalFestivals[key];
    return getDynamicInternationalFestival(year, month, day);
  };

  const selectedFestivalCount = computed(() => {
    let count = 0;
    if (showSolarFestivals.value) count++;
    if (showLunarFestivals.value) count++;
    if (showInternationalFestivals.value) count++;
    if (showSolarTerms.value) count++;
    return count;
  });

  const toggleSolarFestivals = async () => {
    showSolarFestivals.value = !showSolarFestivals.value;
    await setItem('calendar-show-solar-festivals', showSolarFestivals.value.toString());
  };

  const toggleLunarFestivals = async () => {
    showLunarFestivals.value = !showLunarFestivals.value;
    await setItem('calendar-show-lunar-festivals', showLunarFestivals.value.toString());
  };

  const toggleInternationalFestivals = async () => {
    showInternationalFestivals.value = !showInternationalFestivals.value;
    await setItem('calendar-show-international-festivals', showInternationalFestivals.value.toString());
  };

  const toggleSolarTerms = async () => {
    showSolarTerms.value = !showSolarTerms.value;
    await setItem('calendar-show-solar-terms', showSolarTerms.value.toString());
  };

  onMounted(async () => {
    showSolarFestivals.value = (await getItem('calendar-show-solar-festivals', 'true')) === 'true';
    showLunarFestivals.value = (await getItem('calendar-show-lunar-festivals', 'true')) === 'true';
    showInternationalFestivals.value = (await getItem('calendar-show-international-festivals', 'true')) === 'true';
    showSolarTerms.value = (await getItem('calendar-show-solar-terms', 'true')) === 'true';
  });

  return {
    showSolarFestivals,
    showLunarFestivals,
    showInternationalFestivals,
    showSolarTerms,
    showFestivalPanel,
    selectedFestivalCount,
    getInternationalFestival,
    toggleSolarFestivals,
    toggleLunarFestivals,
    toggleInternationalFestivals,
    toggleSolarTerms
  };
}
