# Dream Prototype Interactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current dream app into a high-fidelity demo prototype by adding believable fake interactions, detail panels, and month-driven mock content across the home, archive, and interpretation pages.

**Architecture:** Keep the single-app structure and existing page flow intact, but move new mock data and overlay logic into focused helper files and page-local components. Reuse `framer-motion` for sheets, panels, and fake state transitions, and make month/state changes flow top-down through props so the demo feels coherent instead of like isolated one-off popups.

**Tech Stack:** React 19, TypeScript, Vite, Framer Motion, Lucide React, existing Tailwind utility styling

---

## File Map

### Create
- `app/src/lib/prototypeData.ts`
  Responsibility: central mock datasets for home dream nodes, archive detail entries, specimen descriptions, and month-driven interpretation content.
- `app/src/components/home/HomeNotificationSheet.tsx`
  Responsibility: top-right bell action sheet with last-night reminder copy and CTA.
- `app/src/components/home/DreamNodePanel.tsx`
  Responsibility: dream-node detail card for tapped home-page clusters.
- `app/src/components/home/VoiceJourneySheet.tsx`
  Responsibility: fake recording / transcription / saved flow UI.
- `app/src/components/home/PlanetStageSheet.tsx`
  Responsibility: stage explanation sheet for growth progress.
- `app/src/components/dreams/ArchiveDetailSheet.tsx`
  Responsibility: full dream archive detail overlay for tapped archive cards.
- `app/src/components/dreams/SpecimenDetailSheet.tsx`
  Responsibility: detail overlay for tapped specimen drawer cards.
- `app/src/components/analytics/InterpretationSettingsSheet.tsx`
  Responsibility: fake “释梦偏好” settings sheet.
- `app/src/components/analytics/StatDetailSheet.tsx`
  Responsibility: explanatory overlay for tapped analytics stat cards.
- `app/src/__tests__/prototypeData.test.ts`
  Responsibility: verify month data completeness and required panel mappings.
- `app/src/__tests__/prototypeInteractions.test.tsx`
  Responsibility: smoke-test the fake interaction states and month-driven prop changes.
- `app/src/test/setup.ts`
  Responsibility: shared test setup for RTL/Vitest.
- `app/vitest.config.ts`
  Responsibility: Vitest config for jsdom-based component tests.

### Modify
- `app/package.json`
  Responsibility: add test scripts and testing dependencies.
- `app/src/pages/HomePage.tsx`
  Responsibility: wire notification sheet, node selection, fake voice flow, and stage detail sheet.
- `app/src/pages/DreamsPage.tsx`
  Responsibility: wire archive overview tabs, archive detail overlay, and specimen detail overlay.
- `app/src/pages/AnalyticsPage.tsx`
  Responsibility: own selected month state, settings sheet state, stat detail state, and pass month-driven data into child components.
- `app/src/components/analytics/WeekSelector.tsx`
  Responsibility: accept month selection as props instead of owning all view state internally.
- `app/src/components/analytics/StatCard.tsx`
  Responsibility: become tappable and accept active/summary data from parent.
- `app/src/components/analytics/DreamDistributionCard.tsx`
  Responsibility: render month-driven distribution dataset from props.
- `app/src/components/analytics/MoodReflectionsCard.tsx`
  Responsibility: render month-driven motifs and interpretation copy while preserving the tarot-card expand/flip interaction.

---

### Task 1: Add Shared Prototype Data And Test Harness

**Files:**
- Create: `app/src/lib/prototypeData.ts`
- Create: `app/src/__tests__/prototypeData.test.ts`
- Create: `app/src/test/setup.ts`
- Create: `app/vitest.config.ts`
- Modify: `app/package.json`

- [ ] **Step 1: Write the failing data-shape test**

```ts
import { describe, expect, it } from 'vitest';
import {
  archiveOverviewModes,
  archiveSpecimens,
  homeDreamNodes,
  interpretationMonths,
} from '../lib/prototypeData';

describe('prototype data coverage', () => {
  it('defines twelve interpretation months with motifs and distribution values', () => {
    expect(Object.keys(interpretationMonths)).toHaveLength(12);

    Object.values(interpretationMonths).forEach((month) => {
      expect(month.motifs.length).toBeGreaterThanOrEqual(4);
      expect(month.stats).toMatchObject({
        total: expect.any(String),
        explained: expect.any(String),
        frequent: expect.any(String),
      });
      expect(month.distribution).toHaveLength(8);
    });
  });

  it('defines clickable home and archive mock records', () => {
    expect(homeDreamNodes.length).toBeGreaterThanOrEqual(4);
    expect(archiveOverviewModes).toHaveLength(3);
    expect(archiveSpecimens.length).toBeGreaterThanOrEqual(4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- prototypeData.test.ts`
Expected: FAIL with missing `vitest` setup and missing `prototypeData` module.

- [ ] **Step 3: Add testing config and scripts**

```ts
// app/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```ts
// app/src/test/setup.ts
import '@testing-library/jest-dom/vitest';
```

```json
// app/package.json (scripts + devDependencies excerpt)
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "jsdom": "^26.1.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 4: Add the central prototype dataset**

```ts
// app/src/lib/prototypeData.ts
export type HomeDreamNode = {
  id: string;
  label: string;
  dreams: number;
  mood: string;
  summary: string;
  tags: string[];
};

export type ArchiveOverviewMode = {
  id: 'motif' | 'mood' | 'weekly';
  title: string;
  helper: string;
};

export type ArchiveSpecimen = {
  id: string;
  title: string;
  count: string;
  lastSeen: string;
  companions: string[];
  meaning: string;
  accent: string;
};

export type InterpretationMonth = {
  id: string;
  label: string;
  status: 'complete' | 'locked';
  color: string;
  motifs: Array<{ label: string; note: string }>;
  tarot: {
    title: string;
    subtitle: string;
    arcana: string;
    meaning: string;
    hint: string;
  };
  stats: {
    total: string;
    totalSubLabel: string;
    explained: string;
    explainedSubLabel: string;
    frequent: string;
    frequentSubLabel: string;
  };
  statDetails: {
    total: { title: string; body: string };
    explained: { title: string; body: string };
    frequent: { title: string; body: string };
  };
  distribution: Array<{ label: string; value: number; color: string }>;
};

export const homeDreamNodes: HomeDreamNode[] = [
  {
    id: 'moon-whale',
    label: '追月亮',
    dreams: 18,
    mood: '温柔发亮',
    summary: '你昨晚梦见鲸鱼追着月亮游，海面像一层会发光的玻璃。',
    tags: ['月亮', '海浪', '鲸鱼'],
  },
  {
    id: 'cloud-classroom',
    label: '云上教室',
    dreams: 12,
    mood: '好奇',
    summary: '旋转楼梯一直通往云端，教室里的风会轻轻翻书。',
    tags: ['楼梯', '云朵', '学校'],
  },
  {
    id: 'candy-rain',
    label: '糖果雨夜',
    dreams: 14,
    mood: '甜梦',
    summary: '夜里下起糖果雨，树林里每一片叶子都在发亮。',
    tags: ['甜梦', '森林', '星光'],
  },
  {
    id: 'speaking-cloud',
    label: '会说话的云',
    dreams: 8,
    mood: '安静奇想',
    summary: '云朵慢慢开口，提醒你别忘了把梦讲给绘梦星球听。',
    tags: ['云朵', '提醒', '漂浮'],
  },
];

export const archiveOverviewModes: ArchiveOverviewMode[] = [
  {
    id: 'motif',
    title: '高频意象',
    helper: '月亮、海浪和楼梯仍然是最近最常出现的梦境主角。',
  },
  {
    id: 'mood',
    title: '常见情绪',
    helper: '这一周的梦更偏好奇和平静，噩梦比例正在下降。',
  },
  {
    id: 'weekly',
    title: '本周新增',
    helper: '最近三天记录变得更密集，说明孩子开始主动记住梦了。',
  },
];

export const archiveSpecimens: ArchiveSpecimen[] = [
  {
    id: 'moon',
    title: '月亮',
    count: '18 次',
    lastSeen: '今天 03:18',
    companions: ['海浪', '鲸鱼'],
    meaning: '月亮通常和陪伴、感受力、夜晚记忆相关，是最稳定的梦境主意象。',
    accent: 'from-[#ffe8ae] to-[#ffc978]',
  },
  {
    id: 'wave',
    title: '海浪',
    count: '11 次',
    lastSeen: '昨天 06:42',
    companions: ['月亮', '小船'],
    meaning: '海浪常常代表情绪的起伏，也意味着梦境里有“正在靠近”的感觉。',
    accent: 'from-[#b9d6ff] to-[#7aa7ff]',
  },
  {
    id: 'stairs',
    title: '楼梯',
    count: '9 次',
    lastSeen: '4 月 11 日',
    companions: ['云朵', '教室'],
    meaning: '楼梯像一种成长中的过渡，常出现在新阶段、新环境的梦里。',
    accent: 'from-[#dbc5ff] to-[#b08cff]',
  },
  {
    id: 'whale',
    title: '鲸鱼',
    count: '7 次',
    lastSeen: '4 月 9 日',
    companions: ['海浪', '深海'],
    meaning: '鲸鱼通常代表藏在更深处的想象力，也让梦有了更辽阔的空间感。',
    accent: 'from-[#9dd4ff] to-[#5ba8d8]',
  },
];

export const interpretationMonths: Record<string, InterpretationMonth> = {
  '1': {
    id: '1',
    label: '1 月',
    status: 'locked',
    color: '#121212',
    motifs: [
      { label: '雪地', note: '5 次' },
      { label: '月亮', note: '4 次' },
      { label: '狐狸', note: '3 次' },
      { label: '铃铛', note: '3 次' },
    ],
    tarot: {
      title: '月亮与雪地',
      subtitle: '狐狸 · 铃铛',
      arcana: 'ARCANA I',
      meaning: '一月的梦更安静，像在慢慢熟悉夜晚里的每一束微光。',
      hint: '如果回想起细节，可以记一记声音和颜色，它们会是这一月梦的入口。',
    },
    stats: {
      total: '18',
      totalSubLabel: '篇梦境',
      explained: '6/18',
      explainedSubLabel: '待整理 12 篇',
      frequent: '61%',
      frequentSubLabel: '月亮意象最高',
    },
    statDetails: {
      total: { title: '1 月记录总数', body: '一月刚开始建立记录习惯，梦境数量不多，但已经出现稳定主题。'},
      explained: { title: '1 月已解释', body: '目前完成了 6 篇释梦，适合继续补充声音、人物和场景线索。'},
      frequent: { title: '1 月高频意象', body: '月亮和雪地最常一起出现，说明这一月的梦更安静、更偏观察感。'},
    },
    distribution: [
      { label: '现实梦', value: 28, color: '#7FB3FF' },
      { label: '预言梦', value: 18, color: '#B48CFF' },
      { label: '噩梦', value: 12, color: '#FF8A8A' },
      { label: '甜梦', value: 42, color: '#F6C453' },
      { label: '重复梦', value: 20, color: '#8B7CFF' },
      { label: '奇幻梦', value: 46, color: '#FF9AD5' },
      { label: '飞行梦', value: 14, color: '#8ECFFF' },
      { label: '海洋梦', value: 34, color: '#FF7AA2' },
    ],
  },
  '2': {
    id: '2', label: '2 月', status: 'complete', color: '#8fb4ff', motifs: [
      { label: '月亮', note: '8 次' }, { label: '海浪', note: '6 次' }, { label: '鲸鱼', note: '5 次' }, { label: '玻璃桥', note: '4 次' },
    ], tarot: {
      title: '月亮与海浪', subtitle: '鲸鱼 · 玻璃桥', arcana: 'ARCANA II',
      meaning: '二月的梦开始带出“靠近”和“穿过”的感觉，像在试着理解更大的世界。',
      hint: '把梦里“从哪里到哪里”的路线写下来，会比单独记意象更有用。',
    }, stats: {
      total: '26', totalSubLabel: '篇梦境', explained: '11/26', explainedSubLabel: '待整理 15 篇', frequent: '74%', frequentSubLabel: '海洋主题上升',
    }, statDetails: {
      total: { title: '2 月记录总数', body: '二月开始稳定记录梦境，数量和细节都比一月更完整。'},
      explained: { title: '2 月已解释', body: '已解释的梦里，海洋与桥梁的组合反复出现，值得继续跟踪。'},
      frequent: { title: '2 月高频意象', body: '月亮、海浪、鲸鱼形成了一组稳定意象，代表梦境开始变得有连续性。'},
    }, distribution: [
      { label: '现实梦', value: 31, color: '#7FB3FF' }, { label: '预言梦', value: 24, color: '#B48CFF' }, { label: '噩梦', value: 16, color: '#FF8A8A' }, { label: '甜梦', value: 55, color: '#F6C453' },
      { label: '重复梦', value: 28, color: '#8B7CFF' }, { label: '奇幻梦', value: 51, color: '#FF9AD5' }, { label: '飞行梦', value: 18, color: '#8ECFFF' }, { label: '海洋梦', value: 63, color: '#FF7AA2' },
    ],
  },
  '3': {
    id: '3', label: '3 月', status: 'complete', color: '#cda2ff', motifs: [
      { label: '楼梯', note: '9 次' }, { label: '云朵', note: '7 次' }, { label: '学校', note: '6 次' }, { label: '月亮', note: '5 次' },
    ], tarot: {
      title: '楼梯与云朵', subtitle: '学校 · 月亮', arcana: 'ARCANA III',
      meaning: '三月的梦更像成长中的过渡，常常在向上、靠近、穿行。',
      hint: '留意梦里你是在往上走、往前跑，还是停在原地看，这些差别很重要。',
    }, stats: {
      total: '34', totalSubLabel: '篇梦境', explained: '16/34', explainedSubLabel: '待整理 18 篇', frequent: '79%', frequentSubLabel: '楼梯主题最高',
    }, statDetails: {
      total: { title: '3 月记录总数', body: '三月的梦境数量继续增长，说明记录习惯已经开始稳定。'},
      explained: { title: '3 月已解释', body: '这一月的释梦更适合结合成长场景一起看，比如学校、教室、台阶。'},
      frequent: { title: '3 月高频意象', body: '楼梯主题上升，往往意味着孩子正在处理新的阶段变化。'},
    }, distribution: [
      { label: '现实梦', value: 46, color: '#7FB3FF' }, { label: '预言梦', value: 27, color: '#B48CFF' }, { label: '噩梦', value: 20, color: '#FF8A8A' }, { label: '甜梦', value: 48, color: '#F6C453' },
      { label: '重复梦', value: 33, color: '#8B7CFF' }, { label: '奇幻梦', value: 57, color: '#FF9AD5' }, { label: '飞行梦', value: 24, color: '#8ECFFF' }, { label: '海洋梦', value: 29, color: '#FF7AA2' },
    ],
  },
  '4': {
    id: '4', label: '4 月', status: 'complete', color: '#ffd78a', motifs: [
      { label: '月亮', note: '18 次' }, { label: '海浪', note: '11 次' }, { label: '楼梯', note: '9 次' }, { label: '鲸鱼', note: '7 次' },
    ], tarot: {
      title: '月亮与海浪', subtitle: '楼梯 · 鲸鱼', arcana: 'ARCANA XVIII',
      meaning: '这组梦像一张正在靠近内心深处的牌，温柔、辽阔，也带着一点成长中的起伏。',
      hint: '如果下次又梦到这些意象，补记梦里前进的方向，会比只记场景更有解释力。',
    }, stats: {
      total: '128', totalSubLabel: '篇梦境', explained: '36/48', explainedSubLabel: '待整理 12 篇', frequent: '88%', frequentSubLabel: '最近反复出现',
    }, statDetails: {
      total: { title: '4 月记录总数', body: '四月已经累积出足够大的梦境样本，开始能看见稳定主题和节奏。'},
      explained: { title: '4 月已解释', body: '这一月的释梦完成度最高，已经能支持更完整的月度洞察。'},
      frequent: { title: '4 月高频意象', body: '月亮、海浪、楼梯与鲸鱼形成了完整的主意象星群。'},
    }, distribution: [
      { label: '现实梦', value: 51, color: '#7FB3FF' }, { label: '预言梦', value: 72, color: '#B48CFF' }, { label: '噩梦', value: 25, color: '#FF8A8A' }, { label: '甜梦', value: 85, color: '#F6C453' },
      { label: '重复梦', value: 68, color: '#8B7CFF' }, { label: '奇幻梦', value: 86, color: '#FF9AD5' }, { label: '飞行梦', value: 79, color: '#8ECFFF' }, { label: '海洋梦', value: 50, color: '#FF7AA2' },
    ],
  },
  '5': {
    id: '5', label: '5 月', status: 'locked', color: '#121212', motifs: [
      { label: '花园', note: '3 次' }, { label: '雨滴', note: '3 次' }, { label: '白鸟', note: '2 次' }, { label: '窗户', note: '2 次' },
    ], tarot: {
      title: '雨滴与花园', subtitle: '白鸟 · 窗户', arcana: 'ARCANA V',
      meaning: '五月的梦还在慢慢长出来，像刚露头的新枝。',
      hint: '继续记录开头和结尾，五月会更适合观察变化。',
    }, stats: {
      total: '9', totalSubLabel: '篇梦境', explained: '2/9', explainedSubLabel: '待整理 7 篇', frequent: '41%', frequentSubLabel: '样本仍在增长',
    }, statDetails: {
      total: { title: '5 月记录总数', body: '五月仍是起步状态，建议继续补充记录密度。'},
      explained: { title: '5 月已解释', body: '目前解释样本较少，先不急着总结长期趋势。'},
      frequent: { title: '5 月高频意象', body: '花园和雨滴刚刚冒头，后续更适合观察是否持续。'},
    }, distribution: [
      { label: '现实梦', value: 19, color: '#7FB3FF' }, { label: '预言梦', value: 11, color: '#B48CFF' }, { label: '噩梦', value: 8, color: '#FF8A8A' }, { label: '甜梦', value: 37, color: '#F6C453' },
      { label: '重复梦', value: 14, color: '#8B7CFF' }, { label: '奇幻梦', value: 33, color: '#FF9AD5' }, { label: '飞行梦', value: 9, color: '#8ECFFF' }, { label: '海洋梦', value: 12, color: '#FF7AA2' },
    ],
  },
  '6': { id: '6', label: '6 月', status: 'locked', color: '#121212', motifs: [{ label: '太阳', note: '0 次' }, { label: '草地', note: '0 次' }, { label: '小狗', note: '0 次' }, { label: '风车', note: '0 次' }], tarot: { title: '等待六月的第一张牌', subtitle: '新的意象正在生成', arcana: 'ARCANA VI', meaning: '六月还没有被点亮。', hint: '等第一条六月梦境出现后，这里会自动长出新的释梦牌。' }, stats: { total: '0', totalSubLabel: '篇梦境', explained: '0/0', explainedSubLabel: '待整理 0 篇', frequent: '0%', frequentSubLabel: '尚未开始' }, statDetails: { total: { title: '6 月记录总数', body: '六月还没有新记录。' }, explained: { title: '6 月已解释', body: '六月还没有可解释的梦境。' }, frequent: { title: '6 月高频意象', body: '六月的意象星群还未点亮。' } }, distribution: [{ label: '现实梦', value: 0, color: '#7FB3FF' }, { label: '预言梦', value: 0, color: '#B48CFF' }, { label: '噩梦', value: 0, color: '#FF8A8A' }, { label: '甜梦', value: 0, color: '#F6C453' }, { label: '重复梦', value: 0, color: '#8B7CFF' }, { label: '奇幻梦', value: 0, color: '#FF9AD5' }, { label: '飞行梦', value: 0, color: '#8ECFFF' }, { label: '海洋梦', value: 0, color: '#FF7AA2' }] },
  '7': { id: '7', label: '7 月', status: 'locked', color: '#121212', motifs: [{ label: '星星', note: '0 次' }, { label: '贝壳', note: '0 次' }, { label: '小船', note: '0 次' }, { label: '烟火', note: '0 次' }], tarot: { title: '等待七月的第一张牌', subtitle: '新的意象正在生成', arcana: 'ARCANA VII', meaning: '七月还没有被点亮。', hint: '等第一条七月梦境出现后，这里会自动长出新的释梦牌。' }, stats: { total: '0', totalSubLabel: '篇梦境', explained: '0/0', explainedSubLabel: '待整理 0 篇', frequent: '0%', frequentSubLabel: '尚未开始' }, statDetails: { total: { title: '7 月记录总数', body: '七月还没有新记录。' }, explained: { title: '7 月已解释', body: '七月还没有可解释的梦境。' }, frequent: { title: '7 月高频意象', body: '七月的意象星群还未点亮。' } }, distribution: [{ label: '现实梦', value: 0, color: '#7FB3FF' }, { label: '预言梦', value: 0, color: '#B48CFF' }, { label: '噩梦', value: 0, color: '#FF8A8A' }, { label: '甜梦', value: 0, color: '#F6C453' }, { label: '重复梦', value: 0, color: '#8B7CFF' }, { label: '奇幻梦', value: 0, color: '#FF9AD5' }, { label: '飞行梦', value: 0, color: '#8ECFFF' }, { label: '海洋梦', value: 0, color: '#FF7AA2' }] },
  '8': { id: '8', label: '8 月', status: 'locked', color: '#121212', motifs: [{ label: '灯塔', note: '0 次' }, { label: '海星', note: '0 次' }, { label: '泡泡', note: '0 次' }, { label: '月牙', note: '0 次' }], tarot: { title: '等待八月的第一张牌', subtitle: '新的意象正在生成', arcana: 'ARCANA VIII', meaning: '八月还没有被点亮。', hint: '等第一条八月梦境出现后，这里会自动长出新的释梦牌。' }, stats: { total: '0', totalSubLabel: '篇梦境', explained: '0/0', explainedSubLabel: '待整理 0 篇', frequent: '0%', frequentSubLabel: '尚未开始' }, statDetails: { total: { title: '8 月记录总数', body: '八月还没有新记录。' }, explained: { title: '8 月已解释', body: '八月还没有可解释的梦境。' }, frequent: { title: '8 月高频意象', body: '八月的意象星群还未点亮。' } }, distribution: [{ label: '现实梦', value: 0, color: '#7FB3FF' }, { label: '预言梦', value: 0, color: '#B48CFF' }, { label: '噩梦', value: 0, color: '#FF8A8A' }, { label: '甜梦', value: 0, color: '#F6C453' }, { label: '重复梦', value: 0, color: '#8B7CFF' }, { label: '奇幻梦', value: 0, color: '#FF9AD5' }, { label: '飞行梦', value: 0, color: '#8ECFFF' }, { label: '海洋梦', value: 0, color: '#FF7AA2' }] },
  '9': { id: '9', label: '9 月', status: 'locked', color: '#121212', motifs: [{ label: '落叶', note: '0 次' }, { label: '校园', note: '0 次' }, { label: '书页', note: '0 次' }, { label: '信封', note: '0 次' }], tarot: { title: '等待九月的第一张牌', subtitle: '新的意象正在生成', arcana: 'ARCANA IX', meaning: '九月还没有被点亮。', hint: '等第一条九月梦境出现后，这里会自动长出新的释梦牌。' }, stats: { total: '0', totalSubLabel: '篇梦境', explained: '0/0', explainedSubLabel: '待整理 0 篇', frequent: '0%', frequentSubLabel: '尚未开始' }, statDetails: { total: { title: '9 月记录总数', body: '九月还没有新记录。' }, explained: { title: '9 月已解释', body: '九月还没有可解释的梦境。' }, frequent: { title: '9 月高频意象', body: '九月的意象星群还未点亮。' } }, distribution: [{ label: '现实梦', value: 0, color: '#7FB3FF' }, { label: '预言梦', value: 0, color: '#B48CFF' }, { label: '噩梦', value: 0, color: '#FF8A8A' }, { label: '甜梦', value: 0, color: '#F6C453' }, { label: '重复梦', value: 0, color: '#8B7CFF' }, { label: '奇幻梦', value: 0, color: '#FF9AD5' }, { label: '飞行梦', value: 0, color: '#8ECFFF' }, { label: '海洋梦', value: 0, color: '#FF7AA2' }] },
  '10': { id: '10', label: '10 月', status: 'locked', color: '#121212', motifs: [{ label: '南瓜灯', note: '0 次' }, { label: '雾气', note: '0 次' }, { label: '猫咪', note: '0 次' }, { label: '橙色门', note: '0 次' }], tarot: { title: '等待十月的第一张牌', subtitle: '新的意象正在生成', arcana: 'ARCANA X', meaning: '十月还没有被点亮。', hint: '等第一条十月梦境出现后，这里会自动长出新的释梦牌。' }, stats: { total: '0', totalSubLabel: '篇梦境', explained: '0/0', explainedSubLabel: '待整理 0 篇', frequent: '0%', frequentSubLabel: '尚未开始' }, statDetails: { total: { title: '10 月记录总数', body: '十月还没有新记录。' }, explained: { title: '10 月已解释', body: '十月还没有可解释的梦境。' }, frequent: { title: '10 月高频意象', body: '十月的意象星群还未点亮。' } }, distribution: [{ label: '现实梦', value: 0, color: '#7FB3FF' }, { label: '预言梦', value: 0, color: '#B48CFF' }, { label: '噩梦', value: 0, color: '#FF8A8A' }, { label: '甜梦', value: 0, color: '#F6C453' }, { label: '重复梦', value: 0, color: '#8B7CFF' }, { label: '奇幻梦', value: 0, color: '#FF9AD5' }, { label: '飞行梦', value: 0, color: '#8ECFFF' }, { label: '海洋梦', value: 0, color: '#FF7AA2' }] },
  '11': { id: '11', label: '11 月', status: 'locked', color: '#121212', motifs: [{ label: '枫叶', note: '0 次' }, { label: '壁炉', note: '0 次' }, { label: '小鹿', note: '0 次' }, { label: '夜车', note: '0 次' }], tarot: { title: '等待十一月的第一张牌', subtitle: '新的意象正在生成', arcana: 'ARCANA XI', meaning: '十一月还没有被点亮。', hint: '等第一条十一月梦境出现后，这里会自动长出新的释梦牌。' }, stats: { total: '0', totalSubLabel: '篇梦境', explained: '0/0', explainedSubLabel: '待整理 0 篇', frequent: '0%', frequentSubLabel: '尚未开始' }, statDetails: { total: { title: '11 月记录总数', body: '十一月还没有新记录。' }, explained: { title: '11 月已解释', body: '十一月还没有可解释的梦境。' }, frequent: { title: '11 月高频意象', body: '十一月的意象星群还未点亮。' } }, distribution: [{ label: '现实梦', value: 0, color: '#7FB3FF' }, { label: '预言梦', value: 0, color: '#B48CFF' }, { label: '噩梦', value: 0, color: '#FF8A8A' }, { label: '甜梦', value: 0, color: '#F6C453' }, { label: '重复梦', value: 0, color: '#8B7CFF' }, { label: '奇幻梦', value: 0, color: '#FF9AD5' }, { label: '飞行梦', value: 0, color: '#8ECFFF' }, { label: '海洋梦', value: 0, color: '#FF7AA2' }] },
  '12': { id: '12', label: '12 月', status: 'locked', color: '#121212', motifs: [{ label: '雪花', note: '0 次' }, { label: '极光', note: '0 次' }, { label: '小熊', note: '0 次' }, { label: '礼物盒', note: '0 次' }], tarot: { title: '等待十二月的第一张牌', subtitle: '新的意象正在生成', arcana: 'ARCANA XII', meaning: '十二月还没有被点亮。', hint: '等第一条十二月梦境出现后，这里会自动长出新的释梦牌。' }, stats: { total: '0', totalSubLabel: '篇梦境', explained: '0/0', explainedSubLabel: '待整理 0 篇', frequent: '0%', frequentSubLabel: '尚未开始' }, statDetails: { total: { title: '12 月记录总数', body: '十二月还没有新记录。' }, explained: { title: '12 月已解释', body: '十二月还没有可解释的梦境。' }, frequent: { title: '12 月高频意象', body: '十二月的意象星群还未点亮。' } }, distribution: [{ label: '现实梦', value: 0, color: '#7FB3FF' }, { label: '预言梦', value: 0, color: '#B48CFF' }, { label: '噩梦', value: 0, color: '#FF8A8A' }, { label: '甜梦', value: 0, color: '#F6C453' }, { label: '重复梦', value: 0, color: '#8B7CFF' }, { label: '奇幻梦', value: 0, color: '#FF9AD5' }, { label: '飞行梦', value: 0, color: '#8ECFFF' }, { label: '海洋梦', value: 0, color: '#FF7AA2' }] },
};
```

- [ ] **Step 5: Install dependencies and run the data test**

Run: `npm install`
Run: `npm run test -- prototypeData.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/package.json app/package-lock.json app/vitest.config.ts app/src/test/setup.ts app/src/lib/prototypeData.ts app/src/__tests__/prototypeData.test.ts
git commit -m "test: add prototype interaction data coverage"
```

### Task 2: Build Home-Page Demo Interactions

**Files:**
- Create: `app/src/components/home/HomeNotificationSheet.tsx`
- Create: `app/src/components/home/DreamNodePanel.tsx`
- Create: `app/src/components/home/VoiceJourneySheet.tsx`
- Create: `app/src/components/home/PlanetStageSheet.tsx`
- Modify: `app/src/pages/HomePage.tsx`
- Test: `app/src/__tests__/prototypeInteractions.test.tsx`

- [ ] **Step 1: Write the failing home interaction test**

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HomePage } from '../pages/HomePage';

describe('HomePage demo interactions', () => {
  it('opens the notification sheet and fake voice flow', async () => {
    render(<HomePage onOpenParticle={() => {}} isActive />);

    fireEvent.click(screen.getByRole('button', { name: /通知/i }));
    expect(await screen.findByText('昨夜提醒')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /去讲梦/i }));
    expect(await screen.findByText('正在听你讲梦')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- prototypeInteractions.test.tsx`
Expected: FAIL because `HomePage` does not expose the new buttons or sheets yet.

- [ ] **Step 3: Implement the new home-sheet components**

```tsx
// app/src/components/home/HomeNotificationSheet.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Sparkles, X } from 'lucide-react';

interface HomeNotificationSheetProps {
  open: boolean;
  onClose: () => void;
  onStartVoice: () => void;
}

export function HomeNotificationSheet({ open, onClose, onStartVoice }: HomeNotificationSheetProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="absolute inset-0 z-[70] bg-[#090611]/60" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute left-4 right-4 top-24 rounded-[28px] border border-white/15 bg-[#151020]/92 p-4 text-white shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs text-white/82">
                <Bell className="h-3.5 w-3.5 text-[#ffe39b]" />
                昨夜提醒
              </div>
              <button aria-label="关闭提醒" onClick={onClose} className="rounded-full bg-white/8 p-2">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-lg font-semibold">你凌晨 03:18 好像做了一个很亮的梦</p>
            <p className="mt-2 text-sm leading-6 text-white/72">电子月亮、鲸鱼和一片发光的海面还留在梦境宇宙里，轻点一下就能继续讲给绘梦星球听。</p>
            <div className="mt-4 flex gap-2">
              <button onClick={onStartVoice} className="flex-1 rounded-full bg-[#ffe39b] px-4 py-3 text-sm font-semibold text-[#20152c]">去讲梦</button>
              <button onClick={onClose} className="rounded-full border border-white/12 px-4 py-3 text-sm text-white/76">稍后</button>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 text-[11px] text-white/62">
              <Sparkles className="h-3 w-3" />
              这是一个用于演示的提醒抽屉
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
```

```tsx
// app/src/components/home/VoiceJourneySheet.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, Sparkles, Wand2, X } from 'lucide-react';

export type VoiceJourneyStage = 'idle' | 'recording' | 'transcribing' | 'saved';

interface VoiceJourneySheetProps {
  open: boolean;
  stage: VoiceJourneyStage;
  transcript: string;
  onClose: () => void;
}

const stageMeta = {
  recording: { title: '正在听你讲梦', icon: Mic, helper: '把刚刚记得的画面慢慢说出来就好。' },
  transcribing: { title: '正在把梦变成文字', icon: Wand2, helper: '海浪、月亮和鲸鱼都被记下来了。' },
  saved: { title: '这条梦已经存进绘梦星球', icon: Sparkles, helper: '等会可以去档案馆继续整理成绘本。' },
};

export function VoiceJourneySheet({ open, stage, transcript, onClose }: VoiceJourneySheetProps) {
  const meta = stageMeta[stage as 'recording' | 'transcribing' | 'saved'];
  return (
    <AnimatePresence>
      {open && stage !== 'idle' ? (
        <motion.div className="absolute inset-0 z-[72] bg-[#080611]/72 backdrop-blur-md" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="absolute inset-x-4 bottom-24 rounded-[30px] border border-white/12 bg-[#120d1d]/94 p-4 text-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs text-white/78">
                <meta.icon className="h-3.5 w-3.5 text-[#ffe39b]" />
                {meta.title}
              </div>
              <button aria-label="关闭讲梦面板" onClick={onClose} className="rounded-full bg-white/8 p-2">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 flex items-end justify-center gap-1.5">
              {[24, 40, 30, 54, 26, 46, 20].map((height, index) => (
                <motion.div
                  key={height}
                  animate={{ height: [height * 0.6, height, height * 0.75] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: index * 0.08 }}
                  className="w-2 rounded-full bg-gradient-to-t from-[#8fb4ff] to-[#ffe39b]"
                  style={{ height }}
                />
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-white/72">{meta.helper}</p>
            <div className="mt-4 rounded-[22px] border border-white/10 bg-white/6 p-3 text-sm leading-6 text-white/84">
              {transcript}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Wire state into `HomePage.tsx`**

```tsx
// app/src/pages/HomePage.tsx (state excerpt)
const [showNotifications, setShowNotifications] = useState(false);
const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
const [showStageSheet, setShowStageSheet] = useState(false);
const [voiceStage, setVoiceStage] = useState<VoiceJourneyStage>('idle');

const activeNode = homeDreamNodes.find((node) => node.id === activeNodeId) ?? null;

const startVoiceJourney = () => {
  setShowNotifications(false);
  setVoiceStage('recording');
  window.clearTimeout(recordingTimer.current);
  window.clearTimeout(transcribingTimer.current);
  recordingTimer.current = window.setTimeout(() => setVoiceStage('transcribing'), 1600);
  transcribingTimer.current = window.setTimeout(() => setVoiceStage('saved'), 3200);
};
```

```tsx
// app/src/pages/HomePage.tsx (button excerpt)
<motion.button
  aria-label="通知"
  onClick={() => setShowNotifications(true)}
  className="..."
>
  <Bell className="..." />
</motion.button>

<HomeNotificationSheet
  open={showNotifications}
  onClose={() => setShowNotifications(false)}
  onStartVoice={startVoiceJourney}
/>

<VoiceJourneySheet
  open={voiceStage !== 'idle'}
  stage={voiceStage}
  transcript="昨晚我梦见一只鲸鱼在月亮下面慢慢游，海面像会发光的玻璃。"
  onClose={() => setVoiceStage('idle')}
/>
```

- [ ] **Step 5: Run the home interaction test**

Run: `npm run test -- prototypeInteractions.test.tsx`
Expected: PASS for the home-page interaction case.

- [ ] **Step 6: Commit**

```bash
git add app/src/pages/HomePage.tsx app/src/components/home/HomeNotificationSheet.tsx app/src/components/home/DreamNodePanel.tsx app/src/components/home/VoiceJourneySheet.tsx app/src/components/home/PlanetStageSheet.tsx app/src/__tests__/prototypeInteractions.test.tsx
git commit -m "feat: add home prototype interactions"
```

### Task 3: Add Archive Demo Interactions

**Files:**
- Create: `app/src/components/dreams/ArchiveDetailSheet.tsx`
- Create: `app/src/components/dreams/SpecimenDetailSheet.tsx`
- Modify: `app/src/pages/DreamsPage.tsx`
- Test: `app/src/__tests__/prototypeInteractions.test.tsx`

- [ ] **Step 1: Add a failing archive interaction test**

```tsx
it('opens archive detail and specimen detail overlays', async () => {
  render(<DreamsPage />);

  fireEvent.click(screen.getByRole('button', { name: /高频意象/i }));
  expect(screen.getByText(/月亮、海浪和楼梯/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /打开绘本档案 追着月亮奔跑的鲸鱼/i }));
  expect(await screen.findByText('继续整理')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /关闭档案详情/i }));
  fireEvent.click(screen.getByRole('button', { name: /查看标本 月亮/i }));
  expect(await screen.findByText(/最近一次出现/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- prototypeInteractions.test.tsx`
Expected: FAIL because archive buttons and overlays do not exist yet.

- [ ] **Step 3: Implement the archive overlays**

```tsx
// app/src/components/dreams/ArchiveDetailSheet.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Sparkles, X } from 'lucide-react';
import type { ArchiveEntryDetail } from '@/lib/prototypeData';

interface ArchiveDetailSheetProps {
  entry: ArchiveEntryDetail | null;
  onClose: () => void;
}

export function ArchiveDetailSheet({ entry, onClose }: ArchiveDetailSheetProps) {
  return (
    <AnimatePresence>
      {entry ? (
        <motion.div className="absolute inset-0 z-[80] bg-[#090611]/70 p-4 backdrop-blur-md" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="absolute inset-x-4 bottom-24 rounded-[30px] bg-white p-4 text-[#1c1630] shadow-[0_24px_50px_rgba(25,18,45,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f6f1ff] px-3 py-1 text-xs text-[#66598c]">
                <BookOpen className="h-3.5 w-3.5" />
                绘本档案详情
              </div>
              <button aria-label="关闭档案详情" onClick={onClose} className="rounded-full bg-[#f6f1ff] p-2">
                <X className="h-4 w-4" />
              </button>
            </div>
            <h3 className="mt-4 text-xl font-semibold">{entry.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6f667f]">{entry.longSummary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#f4efff] px-3 py-1 text-xs text-[#6b5a9e]">{tag}</span>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button className="flex-1 rounded-full bg-[#20152c] px-4 py-3 text-sm font-semibold text-white">继续整理</button>
              <button className="flex-1 rounded-full bg-[#ffe39b] px-4 py-3 text-sm font-semibold text-[#20152c]">生成绘本</button>
            </div>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f6f1ff] px-3 py-1 text-[11px] text-[#7f74a1]">
              <Sparkles className="h-3 w-3" />
              这是用于产品演示的假详情页
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Wire the archive page state**

```tsx
// app/src/pages/DreamsPage.tsx (state excerpt)
const [activeOverviewMode, setActiveOverviewMode] = useState<'motif' | 'mood' | 'weekly'>('motif');
const [activeArchiveId, setActiveArchiveId] = useState<string | null>(null);
const [activeSpecimenId, setActiveSpecimenId] = useState<string | null>(null);

const overviewMode = archiveOverviewModes.find((mode) => mode.id === activeOverviewMode)!;
const activeArchive = archiveEntryDetails.find((entry) => entry.id === activeArchiveId) ?? null;
const activeSpecimen = archiveSpecimens.find((entry) => entry.id === activeSpecimenId) ?? null;
```

```tsx
// app/src/pages/DreamsPage.tsx (button excerpt)
<button
  type="button"
  aria-label={`打开绘本档案 ${entry.title}`}
  onClick={() => setActiveArchiveId(entry.id)}
  className="group rounded-[30px] ..."
>
  ...
</button>

<button
  type="button"
  aria-label={`查看标本 ${specimen.title}`}
  onClick={() => setActiveSpecimenId(specimen.id)}
  className="rounded-[22px] ..."
>
  ...
</button>
```

- [ ] **Step 5: Run the archive interaction test**

Run: `npm run test -- prototypeInteractions.test.tsx`
Expected: PASS for archive interactions.

- [ ] **Step 6: Commit**

```bash
git add app/src/pages/DreamsPage.tsx app/src/components/dreams/ArchiveDetailSheet.tsx app/src/components/dreams/SpecimenDetailSheet.tsx app/src/__tests__/prototypeInteractions.test.tsx
git commit -m "feat: add archive prototype overlays"
```

### Task 4: Add Month-Driven Interpretation Interactions

**Files:**
- Create: `app/src/components/analytics/InterpretationSettingsSheet.tsx`
- Create: `app/src/components/analytics/StatDetailSheet.tsx`
- Modify: `app/src/pages/AnalyticsPage.tsx`
- Modify: `app/src/components/analytics/WeekSelector.tsx`
- Modify: `app/src/components/analytics/StatCard.tsx`
- Modify: `app/src/components/analytics/DreamDistributionCard.tsx`
- Modify: `app/src/components/analytics/MoodReflectionsCard.tsx`
- Test: `app/src/__tests__/prototypeInteractions.test.tsx`

- [ ] **Step 1: Write the failing interpretation interaction test**

```tsx
it('switches interpretation month and opens stat details', async () => {
  render(<AnalyticsPage onBack={vi.fn()} />);

  fireEvent.click(screen.getByRole('button', { name: /3 月/i }));
  expect(await screen.findByText('楼梯')).toBeInTheDocument();
  expect(screen.getByText('34')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /查看 记录总数 详情/i }));
  expect(await screen.findByText('3 月记录总数')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- prototypeInteractions.test.tsx`
Expected: FAIL because `AnalyticsPage` does not yet drive child components via month data.

- [ ] **Step 3: Make analytics components accept props from the selected month**

```tsx
// app/src/components/analytics/WeekSelector.tsx
interface WeekSelectorProps {
  selectedMonth: string;
  months: Array<{ id: string; label: string; color: string; status: 'complete' | 'locked' }>;
  onSelect: (monthId: string) => void;
}

export function WeekSelector({ selectedMonth, months, onSelect }: WeekSelectorProps) {
  return (
    <div className="overflow-x-auto px-5 pb-1 scrollbar-hide">
      <div className="flex min-w-max gap-2.5">
        {months.map((month) => {
          const isSelected = month.id === selectedMonth;
          const isLocked = month.status === 'locked';
          return (
            <button
              key={month.id}
              type="button"
              aria-label={month.label}
              onClick={() => onSelect(month.id)}
              className="rounded-full px-4 py-2 text-sm transition-colors"
              style={{
                backgroundColor: isLocked ? '#121212' : isSelected ? month.color : '#f3efff',
                color: isLocked || isSelected ? '#fff' : '#5c5370',
              }}
            >
              {month.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

```tsx
// app/src/components/analytics/StatCard.tsx
interface StatCardProps {
  label: string;
  value: string;
  subLabel: string;
  delay?: number;
  onClick?: () => void;
}

export function StatCard({ label, value, subLabel, delay = 0, onClick }: StatCardProps) {
  return (
    <motion.button
      type="button"
      aria-label={`查看 ${label} 详情`}
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex-1 rounded-[24px] bg-white px-3 py-3 text-left shadow-[0_10px_24px_rgba(36,24,70,0.08)]"
    >
      <p className="text-[12px] text-[#6d6280]">{label}</p>
      <p className="mt-2 text-[24px] font-semibold text-[#20152c]">{value}</p>
      <p className="mt-1 text-[11px] text-[#8c829d]">{subLabel}</p>
    </motion.button>
  );
}
```

- [ ] **Step 4: Wire month state in `AnalyticsPage.tsx`**

```tsx
// app/src/pages/AnalyticsPage.tsx
import { interpretationMonths } from '../lib/prototypeData';

const [selectedMonth, setSelectedMonth] = useState('4');
const [showSettings, setShowSettings] = useState(false);
const [activeStatKey, setActiveStatKey] = useState<'total' | 'explained' | 'frequent' | null>(null);

const currentMonth = interpretationMonths[selectedMonth];
const monthButtons = Object.values(interpretationMonths).map(({ id, label, color, status }) => ({
  id,
  label,
  color,
  status,
}));
```

```tsx
// app/src/pages/AnalyticsPage.tsx (render excerpt)
<MoodReflectionsCard
  motifs={currentMonth.motifs}
  tarot={currentMonth.tarot}
/>

<WeekSelector
  selectedMonth={selectedMonth}
  months={monthButtons}
  onSelect={setSelectedMonth}
/>

<StatCard
  label="记录总数"
  value={currentMonth.stats.total}
  subLabel={currentMonth.stats.totalSubLabel}
  onClick={() => setActiveStatKey('total')}
/>
```

- [ ] **Step 5: Run the interpretation test and full suite**

Run: `npm run test -- prototypeInteractions.test.tsx`
Run: `npm run test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/src/pages/AnalyticsPage.tsx app/src/components/analytics/WeekSelector.tsx app/src/components/analytics/StatCard.tsx app/src/components/analytics/DreamDistributionCard.tsx app/src/components/analytics/MoodReflectionsCard.tsx app/src/components/analytics/InterpretationSettingsSheet.tsx app/src/components/analytics/StatDetailSheet.tsx app/src/__tests__/prototypeInteractions.test.tsx
git commit -m "feat: add month-driven interpretation prototype interactions"
```

### Task 5: Final Verification And Demo Readiness Pass

**Files:**
- Modify: `app/src/pages/HomePage.tsx`
- Modify: `app/src/pages/DreamsPage.tsx`
- Modify: `app/src/pages/AnalyticsPage.tsx`
- Test: `app/src/__tests__/prototypeData.test.ts`
- Test: `app/src/__tests__/prototypeInteractions.test.tsx`

- [ ] **Step 1: Run lint and tests before visual verification**

Run: `npm run lint`
Run: `npm run test`
Expected: PASS.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: PASS with generated Vite assets.

- [ ] **Step 3: Verify the three demo paths manually**

Run: `npm run dev -- --host 0.0.0.0 --port 4173`
Check manually:
- 首页：通知 -> 去讲梦 -> 假录音保存 -> 点节点 -> 点成长阶段
- 档案馆：点概览卡 -> 点档案封面 -> 点标本抽屉 -> 切日期
- 释梦：切月份 -> 点统计卡 -> 点设置 -> 展开并翻面塔罗牌
Expected: all overlays stay within the phone frame and copy changes with month/state.

- [ ] **Step 4: Make any final copy/layout adjustments discovered during verification**

```tsx
// Example of acceptable final cleanups
// - tighten button labels to avoid wrapping
// - adjust overlay bottom offsets to clear the bottom nav
// - reduce helper copy if a panel exceeds the phone viewport
```

- [ ] **Step 5: Commit**

```bash
git add app/src/pages/HomePage.tsx app/src/pages/DreamsPage.tsx app/src/pages/AnalyticsPage.tsx app/src/components app/src/__tests__ app/src/lib/prototypeData.ts app/package.json app/package-lock.json app/vitest.config.ts
git commit -m "feat: complete dream prototype demo interactions"
```
