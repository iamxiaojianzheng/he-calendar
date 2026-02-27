<script setup>
import CalendarDay from './CalendarDay.vue';

defineProps({
  weekDays: {
    type: Array,
    required: true
  },
  calendarDays: {
    type: Array,
    required: true
  }
});

defineEmits(['select-date']);
</script>

<template>
  <div class="calendar-grid-wrapper">
    <div class="week-header">
      <div v-for="w in weekDays" :key="w" class="week-day">{{ w }}</div>
    </div>
    <div class="grid">
      <CalendarDay 
        v-for="day in calendarDays" 
        :key="day.date.toString()" 
        :day="day"
        @select="$emit('select-date', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.calendar-grid-wrapper {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--primary-color);
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  flex: 1;
  gap: 4px;
}
</style>
