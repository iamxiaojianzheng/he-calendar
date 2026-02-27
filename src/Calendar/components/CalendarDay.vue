<script setup>
defineProps({
  day: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);
</script>

<template>
  <div 
    class="day-cell"
    :class="{ 
      'other-month': !day.isCurrentMonth, 
      'today': day.isToday,
      'selected': day.isSelected,
      'weekend': day.date.day() === 0 || day.date.day() === 6
    }"
    @click="$emit('select', day)"
  >
    <div class="solar-day">{{ day.date.date() }}</div>
    <div class="lunar-day" :class="{ 'festival': day.displayFestival }">
      {{ day.displayFestival || day.lunarText }}
    </div>
    <div v-if="day.holiday" class="holiday-tag" :class="day.holiday.isWork ? 'work' : 'rest'">
      {{ day.holiday.isWork ? '班' : '休' }}
    </div>
  </div>
</template>

<style scoped>
.day-cell {
  background-color: var(--cell-bg);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.day-cell:hover {
  background-color: var(--hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.day-cell.selected {
  border-color: var(--primary-color);
  background-color: var(--hover-bg);
}

.day-cell.today {
  background-color: var(--primary-color);
  box-shadow: 0 4px 12px var(--primary-color);
  z-index: 1;
}

.day-cell.today .solar-day,
.day-cell.today .lunar-day {
  color: #ffffff !important;
}

.day-cell.other-month {
  opacity: 0.3;
}

.solar-day {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 2px;
}

.day-cell.weekend .solar-day {
  color: #ef4444; /* var(--rest-color) */
}

.lunar-day {
  font-size: 0.75rem;
  color: var(--secondary-text);
}

.lunar-day.festival {
  color: var(--accent-color);
  font-weight: 500;
}

.holiday-tag {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 0.65rem;
  padding: 1px 3px;
  border-radius: 3px;
  line-height: 1;
}

.holiday-tag.rest {
  background-color: #ef4444;
  color: white;
}

.holiday-tag.work {
  background-color: #6b7280;
  color: white;
}
</style>
