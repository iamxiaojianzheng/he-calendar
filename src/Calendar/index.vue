<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import dayjs from 'dayjs';
import CalendarHeader from './components/CalendarHeader.vue';
import CalendarGrid from './components/CalendarGrid.vue';
import CalendarAlmanac from './components/CalendarAlmanac.vue';

import { useTheme, themes } from './hooks/useTheme';
import { useFestivals } from './hooks/useFestivals';
import { useCalendarState } from './hooks/useCalendarState';
import { useAlmanac } from './hooks/useAlmanac';

const props = defineProps(['enterAction']);

// UI 控制状态
const showYearPicker = ref(false);
const showMonthPicker = ref(false);
const showThemePicker = ref(false);
const showSettings = ref(false);

// 提取的 Hooks
const {
  currentTheme, colorMode, previewTheme, isDarkMode, 
  activeThemeConfig, dynamicThemeName, switchTheme, switchColorMode, applyTheme,
  openExternalLink
} = useTheme();

const {
  showSolarFestivals, showLunarFestivals, showInternationalFestivals, showSolarTerms,
  showFestivalPanel, selectedFestivalCount, getInternationalFestival,
  toggleSolarFestivals, toggleLunarFestivals, toggleInternationalFestivals, toggleSolarTerms
} = useFestivals();

const {
  currentMonth, selectedDate, weekStartDay, calendarDays, weekDays, 
  dayDifference, yearPickerOffset, nextMonth, prevMonth, setWeekStartDay
} = useCalendarState();

const { almanacInfo } = useAlmanac(selectedDate);

// 年份与月份列表计算（这部分涉及 UI 控制，保留在此处更合适，或可抽出）
const years = computed(() => {
  const currentYear = currentMonth.value.year();
  const start = currentYear - 100 + yearPickerOffset.value; // 前100年
  const result = [];
  for (let i = 0; i < 12; i++) { // 一次显示12个年份（3x4网格）
    const year = start + i;
    if (year >= currentYear - 100 && year <= currentYear + 20) {
      result.push(year);
    }
  }
  return result;
});

const months = [
  { value: 0, label: '一月' }, { value: 1, label: '二月' }, { value: 2, label: '三月' },
  { value: 3, label: '四月' }, { value: 4, label: '五月' }, { value: 5, label: '六月' },
  { value: 6, label: '七月' }, { value: 7, label: '八月' }, { value: 8, label: '九月' },
  { value: 9, label: '十月' }, { value: 10, label: '十一月' }, { value: 11, label: '十二月' },
];

const selectedDayFestivals = computed(() => {
  const day = calendarDays.value.find(d => d.isSelected);
  return day ? day.allFestivals : [];
});

// 事件处理
const selectYear = (year) => {
  currentMonth.value = currentMonth.value.year(year);
  showYearPicker.value = false;
};

const selectMonth = (monthValue) => {
  currentMonth.value = currentMonth.value.month(monthValue);
  showMonthPicker.value = false;
};

const toggleYearPicker = () => {
  showYearPicker.value = !showYearPicker.value;
  showMonthPicker.value = false;
  
  if (showYearPicker.value) {
    const currentYear = currentMonth.value.year();
    const baseYear = currentYear - 100;
    const totalOffset = currentYear - baseYear;
    yearPickerOffset.value = Math.max(0, totalOffset - 5);
  }
};

const toggleMonthPicker = () => {
  showMonthPicker.value = !showMonthPicker.value;
  showYearPicker.value = false;
};

const toggleSettingsInfo = () => {
  showSettings.value = !showSettings.value;
  if (showSettings.value) {
    showYearPicker.value = false;
    showMonthPicker.value = false;
    showThemePicker.value = false;
  }
};

const toggleThemeSelector = () => {
  showThemePicker.value = !showThemePicker.value;
  if (showThemePicker.value) {
    showYearPicker.value = false;
    showMonthPicker.value = false;
    showSettings.value = false;
  }
};

const togglePanel = () => {
  showFestivalPanel.value = !showFestivalPanel.value;
};

const handleSwitchTheme = (id) => {
  switchTheme(id);
  showThemePicker.value = false;
};

const closePickers = () => {
  showYearPicker.value = false;
  showMonthPicker.value = false;
  showSettings.value = false;
  showThemePicker.value = false;
  previewTheme.value = null;
  yearPickerOffset.value = 0;
};

let lastScrollTime = 0;
const handleScroll = (e) => {
  const now = Date.now();
  if (now - lastScrollTime < 300) return;
  
  if (Math.abs(e.deltaY) < 10) return;
  
  if (showYearPicker.value) {
    const direction = e.deltaY > 0 ? 1 : -1;
    const newOffset = yearPickerOffset.value + direction * 6;
    const minOffset = 0;
    const maxOffset = 121 - 12;
    
    if (newOffset >= minOffset && newOffset <= maxOffset) {
      yearPickerOffset.value = newOffset;
    }
    lastScrollTime = now;
    return;
  }
  
  if (showMonthPicker.value) return;
  
  if (e.deltaY > 0) {
    nextMonth();
  } else {
    prevMonth();
  }
  lastScrollTime = now;
};

const handleGlobalClick = (e) => {
  const isClickInsideTheme = e.target.closest('.theme-picker');
  const isClickInsideSettings = e.target.closest('.settings-wrapper');
  const isClickInsideYearPicker = e.target.closest('.year-month');
  
  if (!isClickInsideTheme && !isClickInsideSettings && !isClickInsideYearPicker) {
    closePickers();
  }
};

const handleSelectDate = (day) => {
  selectedDate.value = day.date;
};

const handleOpenBaike = (festivalName) => {
  const url = `https://baike.baidu.com/item/${encodeURIComponent(festivalName)}`;
  openExternalLink(url);
};

onMounted(() => {
  window.addEventListener('click', handleGlobalClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick);
});

// 为了监听 theme 预览，补充事件
const handlePreviewTheme = (themeId) => {
  previewTheme.value = themeId;
};

const goToday = () => {
  currentMonth.value = dayjs();
  selectedDate.value = dayjs();
};
</script>

<template>
  <div class="calendar-container" :class="['theme-' + currentTheme, isDarkMode ? 'dark-mode' : 'light-mode']" :data-mode="isDarkMode ? 'dark' : 'light'" @wheel.prevent="handleScroll">
    <!-- Header Component -->
    <CalendarHeader 
      :currentMonth="currentMonth"
      :dayDifference="dayDifference"
      :showYearPicker="showYearPicker"
      :showMonthPicker="showMonthPicker"
      :years="years"
      :months="months"
      :showThemePicker="showThemePicker"
      :colorMode="colorMode"
      :themes="themes"
      :currentTheme="currentTheme"
      :dynamicThemeName="dynamicThemeName"
      :showSettings="showSettings"
      :weekStartDay="weekStartDay"
      :showFestivalPanel="showFestivalPanel"
      :selectedFestivalCount="selectedFestivalCount"
      :showLunarFestivals="showLunarFestivals"
      :showSolarFestivals="showSolarFestivals"
      :showSolarTerms="showSolarTerms"
      :showInternationalFestivals="showInternationalFestivals"
      @open-link="openExternalLink"
      
      @toggle-year-picker="toggleYearPicker"
      @toggle-month-picker="toggleMonthPicker"
      @select-year="selectYear"
      @select-month="selectMonth"
      @prev-month="prevMonth"
      @next-month="nextMonth"
      @go-today="goToday"
      
      @toggle-theme-picker="toggleThemeSelector"
      @switch-color-mode="switchColorMode"
      @switch-theme="handleSwitchTheme"
      @preview-theme="handlePreviewTheme"
      
      @toggle-settings="toggleSettingsInfo"
      @set-week-start-day="setWeekStartDay"
      @toggle-festival-panel="togglePanel"
      @toggle-lunar-festivals="toggleLunarFestivals"
      @toggle-solar-festivals="toggleSolarFestivals"
      @toggle-solar-terms="toggleSolarTerms"
      @toggle-international-festivals="toggleInternationalFestivals"
    />

    <div class="main-content">
      <!-- Grid Component (Left) -->
      <CalendarGrid 
        :weekDays="weekDays"
        :calendarDays="calendarDays"
        @select-date="handleSelectDate"
      />

      <!-- Almanac Component (Right) -->
      <CalendarAlmanac 
        :selectedDate="selectedDate"
        :almanacInfo="almanacInfo"
        :selectedDayFestivals="selectedDayFestivals"
        @open-baike="handleOpenBaike"
      />
    </div>
  </div>
</template>

<style scoped>
.calendar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  overflow: hidden;
  user-select: none;
  --rest-color: #ef4444;
  --work-color: #6b7280;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
