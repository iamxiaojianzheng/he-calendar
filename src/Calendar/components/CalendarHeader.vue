<script setup>
import { 
  ChevronLeft, ChevronRight, Palette, Settings, Github, 
  ExternalLink, User, Sun, Moon, Monitor 
} from 'lucide-vue-next';
import { projectConfig } from '../../config';
import dayjs from 'dayjs';

const props = defineProps({
  currentMonth: Object,
  dayDifference: String,
  showYearPicker: Boolean,
  showMonthPicker: Boolean,
  years: Array,
  months: Array,
  
  // Theme props
  showThemePicker: Boolean,
  colorMode: String,
  themes: Array,
  currentTheme: String,
  dynamicThemeName: String,
  
  // Settings props
  showSettings: Boolean,
  weekStartDay: Number,
  showFestivalPanel: Boolean,
  selectedFestivalCount: Number,
  showLunarFestivals: Boolean,
  showSolarFestivals: Boolean,
  showSolarTerms: Boolean,
  showInternationalFestivals: Boolean
});

const emit = defineEmits([
  // Calendar actions
  'toggle-year-picker', 'toggle-month-picker',
  'select-year', 'select-month',
  'prev-month', 'next-month', 'go-today',
  
  // Theme actions
  'toggle-theme-picker', 'switch-color-mode', 'switch-theme', 'preview-theme',
  
  // Settings actions
  'toggle-settings', 'set-week-start-day', 'toggle-festival-panel',
  'toggle-lunar-festivals', 'toggle-solar-festivals',
  'toggle-solar-terms', 'toggle-international-festivals',

  // Link actions
  'open-link'
]);
</script>

<template>
  <header class="calendar-header">
    <div class="current-info" @click.stop>
      <span class="year-month" @click="$emit('toggle-year-picker')" :class="{ active: showYearPicker }">
        {{ currentMonth.format('YYYY年') }}
      </span>
      <span class="year-month" @click="$emit('toggle-month-picker')" :class="{ active: showMonthPicker }">
        {{ currentMonth.format('MM月') }}
      </span>
      <span v-if="dayDifference" class="day-diff">{{ dayDifference }}</span>
      
      <!-- Year Picker Dropdown -->
      <div v-if="showYearPicker" class="picker-dropdown year-picker" @click.stop>
        <div 
          v-for="year in years" 
          :key="year" 
          class="picker-item"
          :class="{ active: year === currentMonth.year() }"
          @click="$emit('select-year', year)"
        >
          {{ year }}年
        </div>
      </div>
      
      <!-- Month Picker Dropdown -->
      <div v-if="showMonthPicker" class="picker-dropdown month-picker" @click.stop>
        <div 
          v-for="month in months" 
          :key="month.value" 
          class="picker-item"
          :class="{ active: month.value === currentMonth.month() }"
          @click="$emit('select-month', month.value)"
        >
          {{ month.label }}
        </div>
      </div>
    </div>
    
    <div class="actions">
      <button @click="$emit('prev-month')" class="icon-btn"><ChevronLeft :size="20" /></button>
      <button @click="$emit('go-today')" class="text-btn">今天</button>
      <button @click="$emit('next-month')" class="icon-btn"><ChevronRight :size="20" /></button>
      
      <div class="theme-picker">
        <button @click.stop="$emit('toggle-theme-picker')" class="icon-btn theme-trigger" :class="{ active: showThemePicker }">
          <Palette :size="20" class="theme-icon" />
        </button>
        <div v-if="showThemePicker" class="theme-options shadow-lg" @click.stop>
          <div class="color-mode-switch">
            <button class="mode-btn" :class="{ active: colorMode === 'light' }" @click="$emit('switch-color-mode', 'light')" title="日间模式"><Sun :size="16" /></button>
            <button class="mode-btn" :class="{ active: colorMode === 'dark' }" @click="$emit('switch-color-mode', 'dark')" title="夜间模式"><Moon :size="16" /></button>
            <button class="mode-btn" :class="{ active: colorMode === 'auto' }" @click="$emit('switch-color-mode', 'auto')" title="跟随系统"><Monitor :size="16" /></button>
          </div>
          <div class="settings-separator"></div>
          <div 
            v-for="t in themes" 
            :key="t.id" 
            class="theme-option-item"
            @click="$emit('switch-theme', t.id)"
            @mouseenter="$emit('preview-theme', t.id)"
            @mouseleave="$emit('preview-theme', null)"
          >
            <div :style="{ background: t.color }" class="theme-dot" :class="{ active: currentTheme === t.id }"></div>
            <span class="theme-name">{{ t.id === 'auto' ? dynamicThemeName : t.name }}</span>
          </div>
        </div>
      </div>

      <div class="settings-wrapper">
        <button @click.stop="$emit('toggle-settings')" class="icon-btn" :class="{ active: showSettings }">
          <Settings :size="20" />
        </button>
        
        <div v-if="showSettings" class="settings-panel shadow-lg" @click.stop>
          <div class="settings-section">
            <div class="section-title">周起始日</div>
            <div class="setting-options">
              <button class="option-btn" :class="{ active: weekStartDay === 0 }" @click="$emit('set-week-start-day', 0)">周日</button>
              <button class="option-btn" :class="{ active: weekStartDay === 1 }" @click="$emit('set-week-start-day', 1)">周一</button>
            </div>
          </div>
          
          <div class="settings-separator"></div>
          
          <div class="settings-section">
            <div class="section-title festival-header" @click="$emit('toggle-festival-panel')">
              <span>节日显示</span>
              <span class="festival-count">{{ selectedFestivalCount }}/4</span>
              <span class="expand-icon">{{ showFestivalPanel ? '▲' : '▼' }}</span>
            </div>
            <div v-if="showFestivalPanel" class="festival-tags">
              <span class="festival-tag" :class="{ active: showLunarFestivals }" @click="$emit('toggle-lunar-festivals')">农历</span>
              <span class="festival-tag" :class="{ active: showSolarFestivals }" @click="$emit('toggle-solar-festivals')">公历</span>
              <span class="festival-tag" :class="{ active: showSolarTerms }" @click="$emit('toggle-solar-terms')">节气</span>
              <span class="festival-tag" :class="{ active: showInternationalFestivals }" @click="$emit('toggle-international-festivals')">国际</span>
            </div>
          </div>
          
          <div class="settings-separator"></div>
          
          <div class="settings-section">
            <div class="section-title">
              关于{{ projectConfig.name }}
              <span class="version-badge">v{{ projectConfig.version }}</span>
            </div>
            <div class="about-info">
              <div class="about-item link-item" @click="$emit('open-link', projectConfig.github)">
                <Github :size="14" class="about-icon" />
                <span class="link-text">GitHub 源码</span>
              </div>
              <div class="about-item link-item" @click="$emit('open-link', projectConfig.website)">
                <ExternalLink :size="14" class="about-icon" />
                <span class="link-text">网页版地址</span>
              </div>
              <div class="about-item">
                <User :size="14" class="about-icon" />
                <span>作者: {{ projectConfig.author }}</span>
              </div>
            </div>
          </div>
          
          <div class="settings-footer">
            <div class="slogan">{{ projectConfig.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.year-month {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  margin-right: 4px;
}

.year-month:hover {
  background-color: var(--hover-bg);
}

.year-month.active {
  background-color: var(--primary-color);
  color: #ffffff;
}

.day-diff {
  font-size: 0.85rem;
  color: var(--accent-color);
  margin-left: 8px;
  padding: 2px 8px;
  background-color: var(--hover-bg);
  border-radius: 4px;
}

.current-info {
  position: relative;
  display: flex;
  align-items: center;
}

.picker-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--panel-bg);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 200;
  min-width: 120px;
  border: 1px solid var(--border-color);
}

.year-picker {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 8px;
  overflow: hidden;
}

.month-picker {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 8px;
}

.picker-item {
  padding: 8px 12px;
  text-align: center;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 0.9rem;
  color: var(--text-color);
}

.picker-item:hover {
  background-color: var(--hover-bg);
}

.picker-item.active {
  background-color: var(--primary-color);
  color: #ffffff;
  font-weight: 600;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn, .text-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  color: var(--primary-color);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover, .text-btn:hover, .icon-btn.active {
  background-color: var(--hover-bg);
  border-color: var(--primary-color);
}

.icon-btn.active {
  color: var(--primary-color);
}

.theme-picker, .settings-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.theme-options, .settings-panel {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: var(--panel-bg);
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 100;
  border: 1px solid var(--border-color);
}

.theme-options {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 140px;
}

.settings-panel {
  width: 200px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 300;
}

.color-mode-switch {
  display: flex;
  gap: 4px;
  padding: 2px;
  background: var(--hover-bg);
  border-radius: 8px;
  margin-bottom: 4px;
}

.mode-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  color: var(--secondary-text);
  transition: all 0.2s;
}

.mode-btn:hover {
  background: rgba(255,255,255,0.1);
}

.mode-btn.active {
  background: var(--panel-bg);
  color: var(--primary-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.theme-option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.theme-option-item:hover {
  background-color: var(--hover-bg);
}

.theme-name {
  font-size: 0.85rem;
  color: var(--text-color);
}

.theme-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--dot-bg, #ccc);
  flex-shrink: 0;
}

.theme-dot:hover {
  transform: scale(1.15);
}

.theme-dot.active {
  border: 2px solid white;
  box-shadow: 0 0 0 2px var(--saved-primary-color);
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.version-badge {
  font-size: 0.65rem;
  font-weight: 500;
  padding: 1px 6px;
  background: var(--bg-color);
  border: 1px solid var(--accent-color);
  border-radius: 4px;
  color: var(--accent-color);
  letter-spacing: 0;
}

.setting-options {
  display: flex;
  background: var(--hover-bg);
  padding: 3px;
  border-radius: 8px;
}

.option-btn {
  flex: 1;
  border: none;
  background: none;
  padding: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 6px;
  color: var(--secondary-text);
  transition: all 0.2s;
}

.option-btn.active {
  background: var(--panel-bg);
  color: var(--primary-color);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.settings-separator {
  height: 1px;
  background: var(--border-color);
  margin: 4px 0;
}

.festival-header {
  cursor: pointer;
  user-select: none;
}

.festival-count {
  font-size: 0.7rem;
  padding: 1px 6px;
  background: var(--hover-bg);
  border-radius: 10px;
  color: var(--accent-color);
  margin-left: auto;
}

.expand-icon {
  font-size: 0.6rem;
  color: var(--secondary-text);
  margin-left: 6px;
}

.festival-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.festival-tag {
  padding: 4px 10px;
  font-size: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--hover-bg);
  color: var(--secondary-text);
  border: 1px solid transparent;
}

.festival-tag:hover {
  border-color: var(--primary-color);
}

.festival-tag.active {
  background: var(--primary-color);
  color: #ffffff;
}

.about-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.about-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.8;
}

.about-icon {
  color: var(--accent-color);
  opacity: 0.8;
}

.about-item.link-item {
  cursor: pointer;
  transition: opacity 0.2s;
}

.about-item.link-item:hover {
  opacity: 0.8;
}

.about-item.link-item:hover .link-text {
  color: var(--primary-color);
  text-decoration: underline;
}

.link-text {
  transition: color 0.2s;
}

.settings-footer {
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px dashed var(--bg-color);
  text-align: center;
}

.slogan {
  font-size: 0.75rem;
  color: var(--accent-color);
  font-style: italic;
  opacity: 0.8;
  position: relative;
  display: inline-block;
}

.slogan::before, .slogan::after {
  content: '"';
  font-family: serif;
  opacity: 0.5;
  font-size: 1.2rem;
  line-height: 1;
  vertical-align: middle;
  color: var(--primary-color);
}

.slogan::before { margin-right: 2px; }
.slogan::after { margin-left: 2px; }
</style>
