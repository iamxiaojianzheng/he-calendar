<script setup>
defineProps({
  selectedDate: {
    type: Object,
    required: true
  },
  almanacInfo: {
    type: Object,
    required: true
  },
  selectedDayFestivals: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['open-baike']);

const handleOpenBaike = (festivalName) => {
  emit('open-baike', festivalName);
};
</script>

<template>
  <aside class="almanac-panel">
    <div class="almanac-header">
      <div class="big-day">{{ selectedDate.date() }}</div>
      <div class="detail-info">
        <div class="solar-full">{{ almanacInfo.solarDate }}</div>
        <div class="lunar-full">{{ almanacInfo.lunarDate }}</div>
      </div>
    </div>
    
    <!-- 节日显示区域 -->
    <div v-if="selectedDayFestivals.length > 0" class="festival-section">
      <div class="festival-list">
        <span 
          v-for="(festival, index) in selectedDayFestivals" 
          :key="index"
          class="festival-item"
          :class="'festival-' + festival.type"
          @click="handleOpenBaike(festival.name)"
          :title="'点击查看' + festival.name + '百科'"
        >
          {{ festival.name }}
        </span>
      </div>
    </div>
    
    <div class="almanac-body">
      <div class="yi-ji">
        <div class="item yi">
          <span class="label">宜</span>
          <div class="content">{{ almanacInfo.yi.join(' ') }}</div>
        </div>
        <div class="item ji">
          <span class="label">忌</span>
          <div class="content">{{ almanacInfo.ji.join(' ') }}</div>
        </div>
      </div>
      
      <div class="other-details">
        <div class="detail-row"><span class="label">干支</span> {{ almanacInfo.ganZhi }}</div>
        <div class="detail-row"><span class="label">五行</span> {{ almanacInfo.wuXing }}</div>
        <div class="detail-row"><span class="label">冲煞</span> {{ almanacInfo.chong }} (煞{{ almanacInfo.sha }})</div>
        <div class="detail-row"><span class="label">彭祖</span> {{ almanacInfo.pengZu }}</div>
        <div class="detail-row"><span class="label">胎神</span> {{ almanacInfo.taiShen }}</div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.almanac-panel {
  width: 280px;
  background-color: var(--panel-bg);
  border-left: 1px solid var(--border-color);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.almanac-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--primary-color);
}

.big-day {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--primary-color);
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.solar-full {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-color);
}

.lunar-full {
  font-size: 0.85rem;
  color: var(--secondary-text);
}

.yi-ji {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.yi-ji .item {
  display: flex;
  gap: 12px;
}

.yi-ji .label { 
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
  font-weight: 600;
}

.yi .label { background-color: #10b981; }
.ji .label { background-color: #ef4444; }

.yi-ji .content {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-color);
}

.other-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--secondary-text);
}

.detail-row {
  display: flex;
  gap: 8px;
}

.detail-row .label {
  color: var(--primary-color);
  font-weight: 600;
  min-width: 32px;
}

.festival-section {
  padding: 12px 0;
  border-bottom: 1px dashed var(--border-color);
}

.festival-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.festival-item {
  padding: 4px 12px;
  font-size: 0.85rem;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
}

.festival-item:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.festival-lunar {
  background: #fef3c7;
  color: #b45309;
  border-color: #fbbf24;
}

.festival-solar {
  background: #dbeafe;
  color: #1e40af;
  border-color: #60a5fa;
}

.festival-term {
  background: #dcfce7;
  color: #166534;
  border-color: #4ade80;
}

.festival-international {
  background: #f3e8ff;
  color: #6b21a8;
  border-color: #a855f7;
}
</style>
