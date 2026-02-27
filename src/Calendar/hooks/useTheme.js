import { ref, computed, onMounted, watch } from 'vue';
import { useStorage } from './useStorage';
import { SolarDay } from 'tyme4ts';
import { shell } from '@ruck/sdk';

// 24节气主题配色（基于中国传统色）
export const solarTermThemes = {
  '立春': { name: '立春·春黄', color: '#E9BB4E', bgColor: '#fffbf0', accentColor: '#E9BB4E' },
  '雨水': { name: '雨水·雨绿', color: '#8FCE95', bgColor: '#f0faf1', accentColor: '#6fb876' },
  '惊蛰': { name: '惊蛰·桃红', color: '#F596AA', bgColor: '#fff5f7', accentColor: '#f47c97' },
  '春分': { name: '春分·春蓝', color: '#8DB5D8', bgColor: '#f0f7fc', accentColor: '#6a9bc7' },
  '清明': { name: '清明·桐绿', color: '#85B09A', bgColor: '#f0f7f3', accentColor: '#689b7f' },
  '谷雨': { name: '谷雨·羽紫', color: '#A98BB5', bgColor: '#f7f3f9', accentColor: '#926fa3' },
  '立夏': { name: '立夏·夏黄', color: '#F3C13A', bgColor: '#fffdf0', accentColor: '#e5b12e' },
  '小满': { name: '小满·满红', color: '#ED6D46', bgColor: '#fff5f2', accentColor: '#e55a38' },
  '芒种': { name: '芒种·麦黄', color: '#E9B96E', bgColor: '#fffdf5', accentColor: '#dda855' },
  '夏至': { name: '夏至·星云', color: '#5F8C9F', bgColor: '#f0f6f8', accentColor: '#4a7a8d' },
  '小暑': { name: '小暑·晨紫', color: '#9C89B8', bgColor: '#f7f5fa', accentColor: '#8774a6' },
  '大暑': { name: '大暑·萤黑', color: '#374047', bgColor: '#f5f6f7', accentColor: '#5a6269' },
  '立秋': { name: '立秋·蝉绿', color: '#8FB08A', bgColor: '#f5f9f4', accentColor: '#7a9e74' },
  '处暑': { name: '处暑·谷蓝', color: '#7FA8C9', bgColor: '#f3f7fc', accentColor: '#6594b7' },
  '白露': { name: '白露·鹟黄', color: '#F2BE45', bgColor: '#fffdf2', accentColor: '#e5b133' },
  '秋分': { name: '秋分·秋紫', color: '#A07CAB', bgColor: '#f8f5f9', accentColor: '#8e6899' },
  '寒露': { name: '寒露·菊红', color: '#DB8872', bgColor: '#fdf6f4', accentColor: '#cf7460' },
  '霜降': { name: '霜降·柿红', color: '#DC6B3E', bgColor: '#fff5f1', accentColor: '#d05a2e' },
  '立冬': { name: '立冬·冬黄', color: '#E0A626', bgColor: '#fffcf0', accentColor: '#d19820' },
  '小雪': { name: '小雪·雪青', color: '#B8CDD1', bgColor: '#f7fbfc', accentColor: '#9fb9be' },
  '大雪': { name: '大雪·雪白', color: '#E8E8E8', bgColor: '#fafafa', accentColor: '#a8a8a8' },
  '冬至': { name: '冬至·冬蓝', color: '#5A7C99', bgColor: '#f3f6f9', accentColor: '#4a6a81' },
  '小寒': { name: '小寒·寒青', color: '#6C8F9E', bgColor: '#f4f8f9', accentColor: '#5a7b89' },
  '大寒': { name: '大寒·寒紫', color: '#6A5988', bgColor: '#f5f3f7', accentColor: '#584a73' },
};

export const themes = [
  { id: 'auto', name: '智能动态', color: 'linear-gradient(135deg, #8DB5D8 0%, #E9BB4E 100%)' },
  { id: 'default', name: '素雅', color: '#A3D5E0' },
  { id: 'ink', name: '水墨', color: '#111827' },
  { id: 'red', name: '朱红', color: '#b91c1c' },
  { id: 'gold', name: '鎏金', color: '#b45309' },
  { id: 'cyan', name: '黛蓝', color: '#1e40af' },
];

export function useTheme() {
  const { getItem, setItem } = useStorage();
  
  const currentTheme = ref('auto');
  const colorMode = ref('auto'); // light, dark, auto
  const previewTheme = ref(null);
  const systemDarkMode = ref(false);

  // 获取当前节气
  const getCurrentSolarTerm = () => {
    const now = new Date();
    const solarDay = SolarDay.fromYmd(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const term = solarDay.getTerm();
    if (term) return term.getName();
    return solarDay.getTermDay().getSolarTerm().getName();
  };

  const isDarkMode = computed(() => {
    if (colorMode.value === 'auto') return systemDarkMode.value;
    return colorMode.value === 'dark';
  });

  const getThemeConfigById = (themeId) => {
    const isDark = isDarkMode.value;
    
    if (themeId === 'auto') {
      const solarTerm = getCurrentSolarTerm();
      const termTheme = solarTermThemes[solarTerm] || solarTermThemes['立春'];
      return {
        id: 'auto',
        primaryColor: termTheme.color,
        bgColor: isDark ? '#1a1a1a' : termTheme.bgColor,
        accentColor: termTheme.accentColor,
        name: termTheme.name,
      };
    }
    
    const themeMap = {
      'default': { primaryColor: '#A3D5E0', bgColor: isDark ? '#1a1a1a' : '#f9fafb', accentColor: '#7db4c4', name: '素雅' },
      'ink': { primaryColor: isDark ? '#9ca3af' : '#111827', bgColor: isDark ? '#111827' : '#f3f4f6', accentColor: isDark ? '#6b7280' : '#374151', name: '水墨' },
      'red': { primaryColor: '#b91c1c', bgColor: isDark ? '#1a1a1a' : '#fff1f2', accentColor: '#b91c1c', name: '朱红' },
      'gold': { primaryColor: '#b45309', bgColor: isDark ? '#1a1a1a' : '#fffbeb', accentColor: '#b45309', name: '鎏金' },
      'cyan': { primaryColor: '#1e40af', bgColor: isDark ? '#1a1a1a' : '#eff6ff', accentColor: '#1e40af', name: '黛蓝' },
    };
    
    return themeMap[themeId] || themeMap['default'];
  };

  const activeThemeConfig = computed(() => getThemeConfigById(previewTheme.value || currentTheme.value));
  const savedThemeConfig = computed(() => getThemeConfigById(currentTheme.value));
  const dynamicThemeName = computed(() => {
    const solarTerm = getCurrentSolarTerm();
    return (solarTermThemes[solarTerm] || solarTermThemes['立春']).name;
  });

  const applyTheme = () => {
    const theme = activeThemeConfig.value;
    const savedTheme = savedThemeConfig.value;
    const root = document.documentElement;
    const isDark = isDarkMode.value;
    
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--bg-color', theme.bgColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--saved-primary-color', savedTheme.primaryColor);
    
    if (isDark) {
      root.style.setProperty('--text-color', '#e5e7eb');
      root.style.setProperty('--header-bg', '#1e1e1e');
      root.style.setProperty('--cell-bg', '#262626');
      root.style.setProperty('--border-color', 'rgba(255,255,255,0.08)');
      root.style.setProperty('--hover-bg', 'rgba(255,255,255,0.05)');
      root.style.setProperty('--panel-bg', '#1e1e1e');
      root.style.setProperty('--secondary-text', '#9ca3af');
      root.style.setProperty('--scrollbar-thumb', 'rgba(255,255,255,0.2)');
    } else {
      root.style.setProperty('--text-color', '#1f2937');
      root.style.setProperty('--header-bg', '#ffffff');
      root.style.setProperty('--cell-bg', '#ffffff');
      root.style.setProperty('--border-color', 'rgba(0,0,0,0.06)');
      root.style.setProperty('--hover-bg', 'rgba(0,0,0,0.03)');
      root.style.setProperty('--panel-bg', '#ffffff');
      root.style.setProperty('--secondary-text', '#6b7280');
      root.style.setProperty('--scrollbar-thumb', 'rgba(0,0,0,0.1)');
    }
  };

  const switchTheme = async (themeId) => {
    currentTheme.value = themeId;
    await setItem('calendar-theme', themeId);
    applyTheme();
  };

  const switchColorMode = async (mode) => {
    colorMode.value = mode;
    await setItem('calendar-color-mode', mode);
    applyTheme();
  };

  const detectSystemDarkMode = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

  onMounted(async () => {
    systemDarkMode.value = detectSystemDarkMode();
    
    // 初始化时从异步存储获取主题配置
    const savedTheme = await getItem('calendar-theme', 'auto');
    const savedColorMode = await getItem('calendar-color-mode', 'auto');
    currentTheme.value = savedTheme;
    colorMode.value = savedColorMode;
    
    applyTheme();
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (colorMode.value === 'auto') {
        systemDarkMode.value = e.matches;
        applyTheme();
      }
    });
  });

  watch([isDarkMode, activeThemeConfig], () => applyTheme(), { deep: true });

  const openExternalLink = async (url) => {
    await shell.open(url);
  };

  return {
    currentTheme,
    colorMode,
    previewTheme,
    isDarkMode,
    activeThemeConfig,
    dynamicThemeName,
    switchTheme,
    switchColorMode,
    applyTheme,
    openExternalLink
  };
}
