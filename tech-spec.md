# Mood Tracker App - 技术规格文档

## 组件清单

### shadcn/ui 组件
- Button - 按钮组件
- Card - 卡片组件
- Avatar - 头像组件
- Badge - 标签组件
- Progress - 进度条组件

### 自定义组件

**布局组件：**
- MobileFrame - 手机外框容器
- StatusBar - 状态栏
- BottomNav - 底部导航栏

**页面组件：**
- HomePage - 首页
- AnalyticsPage - 分析页

**功能组件：**
- HealthInsuranceCard - 健康保险卡片
- PlanCard - 今日计划卡片
- SatisfactionChart - 满意度图表
- MoodReflectionsCard - 情绪反思卡片
- WeekSelector - 周日历选择器
- StatCard - 统计卡片
- MoodTipCard - 情绪提示卡片

**3D角色组件：**
- Character3D - 3D角色展示组件

## 动画实现方案

| 动画效果 | 实现库 | 实现方式 | 复杂度 |
|---------|--------|---------|--------|
| 页面切换滑动 | Framer Motion | AnimatePresence + motion.div | 中 |
| 底部导航选中 | Framer Motion | motion.button + layoutId | 中 |
| 按钮点击缩放 | CSS/Tailwind | active:scale-95 | 低 |
| 卡片悬浮效果 | CSS/Tailwind | hover:scale-102 hover:shadow-lg | 低 |
| 图表柱子生长 | Framer Motion | motion.div + initial/animate height | 中 |
| 数字滚动动画 | Framer Motion | useSpring + useMotionValue | 中 |
| 横向滚动 | CSS | overflow-x-auto scroll-smooth | 低 |

## 项目文件结构

```
src/
├── components/
│   ├── ui/                    # shadcn/ui 组件
│   ├── layout/
│   │   ├── MobileFrame.tsx    # 手机外框
│   │   ├── StatusBar.tsx      # 状态栏
│   │   └── BottomNav.tsx      # 底部导航
│   ├── home/
│   │   ├── HealthInsuranceCard.tsx
│   │   ├── PlanCard.tsx
│   │   └── SatisfactionChart.tsx
│   ├── analytics/
│   │   ├── MoodReflectionsCard.tsx
│   │   ├── WeekSelector.tsx
│   │   ├── StatCard.tsx
│   │   └── MoodTipCard.tsx
│   └── shared/
│       └── Character3D.tsx    # 3D角色组件
├── pages/
│   ├── HomePage.tsx
│   └── AnalyticsPage.tsx
├── hooks/
│   └── usePageTransition.ts   # 页面切换hook
├── types/
│   └── index.ts
├── lib/
│   └── utils.ts
├── assets/
│   └── characters/            # 3D角色图片
├── App.tsx
└── main.tsx
```

## 依赖清单

**核心依赖：**
- react
- react-dom
- typescript
- vite
- tailwindcss

**动画库：**
- framer-motion

**图标库：**
- lucide-react

**UI组件：**
- @radix-ui/* (shadcn依赖)
- class-variance-authority
- clsx
- tailwind-merge

## 颜色配置 (tailwind.config.js)

```javascript
colors: {
  background: '#F5E6E8',
  primary: {
    pink: '#F8C8DC',
    'pink-dark': '#F4A4C0',
    purple: '#D4A5E0',
    'purple-dark': '#B8A5E0',
  },
  accent: {
    orange: '#F5B895',
    blue: '#A5C8E0',
    red: '#E8889A',
    green: '#A5E0C8',
    yellow: '#F5E6A5',
  },
  neutral: {
    black: '#1A1A1A',
    white: '#FFFFFF',
    gray: '#9CA3AF',
    'gray-light': '#F3F4F6',
  }
}
```

## 响应式断点

```javascript
screens: {
  'mobile': '375px',
  'mobile-lg': '428px',
}
```

## 性能优化

- 使用 `will-change` 优化动画性能
- 图片懒加载
- 组件代码分割
- 动画使用 GPU 加速 (transform, opacity)
