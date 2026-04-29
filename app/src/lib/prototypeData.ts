export type HomeDreamNode = {
  id: string;
  label: string;
  dreams: string;
  mood: string;
  summary: string;
  tags: string[];
};

export type ArchiveOverviewMode = {
  id: string;
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

export type InterpretationMotif = {
  label: string;
  note: string;
};

export type InterpretationStat = {
  label: string;
  value: string;
  sublabel: string;
  detail: string;
};

export type InterpretationTarot = {
  previewAlt: string;
  title: string;
  subtitle: string;
  interpretation: string;
  tip: string;
};

export type InterpretationMonth = {
  id: string;
  label: string;
  status: 'active' | 'locked';
  color: string;
  motifs: InterpretationMotif[];
  stats: {
    total: InterpretationStat;
    explained: InterpretationStat;
    frequent: InterpretationStat;
  };
  tarot: InterpretationTarot;
  distribution: {
    label: string;
    value: number;
  }[];
};

function createLockedMotifs(): InterpretationMotif[] {
  return [
    { label: '待解锁', note: '数据尚未开放' },
    { label: '待解锁', note: '数据尚未开放' },
    { label: '待解锁', note: '数据尚未开放' },
    { label: '待解锁', note: '数据尚未开放' },
  ];
}

function createLockedDistribution() {
  return [
    { label: '现实梦', value: 0 },
    { label: '预言梦', value: 0 },
    { label: '噩梦', value: 0 },
    { label: '清醒梦', value: 0 },
    { label: '甜梦', value: 0 },
    { label: '重复梦', value: 0 },
    { label: '奇幻梦', value: 0 },
    { label: '焦虑梦', value: 0 },
  ];
}

export const homeDreamNodes: HomeDreamNode[] = [
  {
    id: 'collect',
    label: '收集梦境',
    dreams: '128',
    mood: '温柔发亮',
    summary: '把零散的梦记录成可整理的条目。',
    tags: ['夜晚', '记录', '入馆'],
  },
  {
    id: 'interpret',
    label: '解读意象',
    dreams: '42',
    mood: '好奇',
    summary: '从高频符号里找出反复出现的线索。',
    tags: ['月亮', '海浪', '线索'],
  },
  {
    id: 'archive',
    label: '档案归档',
    dreams: '26',
    mood: '安静收藏',
    summary: '把重要梦片整理进长期收藏。',
    tags: ['档案', '收藏', '归类'],
  },
  {
    id: 'reflect',
    label: '情绪回看',
    dreams: '58',
    mood: '平稳',
    summary: '回顾每个月的情绪波动与主题变化。',
    tags: ['情绪', '趋势', '月度'],
  },
  {
    id: 'spotlight',
    label: '高亮样本',
    dreams: '16',
    mood: '聚焦',
    summary: '把最值得回看的梦片单独标记。',
    tags: ['样本', '重点', '回放'],
  },
];

export const archiveOverviewModes: ArchiveOverviewMode[] = [
  {
    id: 'overview',
    title: '概览',
    helper: '快速查看本期档案总览。',
  },
  {
    id: 'timeline',
    title: '时间线',
    helper: '按日期串起梦境记录。',
  },
  {
    id: 'specimens',
    title: '样本',
    helper: '集中展示典型梦中意象。',
  },
];

export const archiveSpecimens: ArchiveSpecimen[] = [
  {
    id: 'moon',
    title: '月亮',
    count: '18 次',
    lastSeen: '今天 03:18',
    companions: ['海浪', '鲸鱼'],
    meaning: '常指向安抚、照明与被看见的愿望。',
    accent: 'from-[#ffe8ae] to-[#ffc978]',
  },
  {
    id: 'wave',
    title: '海浪',
    count: '11 次',
    lastSeen: '昨天 06:42',
    companions: ['月亮', '风'],
    meaning: '常和情绪起伏、推进感与边界变化有关。',
    accent: 'from-[#b9d6ff] to-[#7aa7ff]',
  },
  {
    id: 'stair',
    title: '楼梯',
    count: '9 次',
    lastSeen: '4 月 10 日',
    companions: ['门', '云朵'],
    meaning: '常象征阶段性变化、过渡和抵达。',
    accent: 'from-[#dbc5ff] to-[#b08cff]',
  },
  {
    id: 'whale',
    title: '鲸鱼',
    count: '7 次',
    lastSeen: '4 月 6 日',
    companions: ['海面', '月牙'],
    meaning: '常带有温柔、庞大与深层记忆的意味。',
    accent: 'from-[#9dd4ff] to-[#5ba8d8]',
  },
];

export const interpretationMonths: InterpretationMonth[] = [
  {
    id: '2026-01',
    label: '1 月',
    status: 'active',
    color: '#8aa8ff',
    motifs: [
      { label: '月亮', note: '安静照明' },
      { label: '楼梯', note: '阶段变化' },
      { label: '鲸鱼', note: '深层记忆' },
      { label: '海浪', note: '情绪推进' },
    ],
    stats: {
      total: {
        label: '总梦数',
        value: '12',
        sublabel: '条',
        detail: '1 月共整理 12 条梦境记录，平均每周会补记 3 次，夜间情绪以缓慢波动为主。',
      },
      explained: {
        label: '已解释',
        value: '8',
        sublabel: '条',
        detail: '其中 8 条已经完成释义，剩余记录主要集中在月末的连续梦境。',
      },
      frequent: {
        label: '高频意象',
        value: '月亮',
        sublabel: '本月最常出现',
        detail: '月亮和海浪经常一同出现，说明安抚、照明与情绪流动是 1 月的主线。',
      },
    },
    tarot: {
      previewAlt: '月亮与海浪塔罗牌预览',
      title: '月亮与海浪',
      subtitle: '楼梯 · 鲸鱼',
      interpretation:
        '你最近的梦像一片安静的海。月亮在旁边照着你，海浪慢慢推着你往前走。它可能在告诉你：有些心情不用急着说出来，先慢慢看见它就很好。',
      tip: '下次梦到月亮或海浪，可以记一句：我在梦里觉得安心、好奇，还是有一点害怕？',
    },
    distribution: [
      { label: '现实梦', value: 5 },
      { label: '预言梦', value: 2 },
      { label: '噩梦', value: 2 },
      { label: '清醒梦', value: 3 },
      { label: '甜梦', value: 6 },
      { label: '重复梦', value: 4 },
      { label: '奇幻梦', value: 4 },
      { label: '焦虑梦', value: 2 },
    ],
  },
  {
    id: '2026-02',
    label: '2 月',
    status: 'active',
    color: '#b792ff',
    motifs: [
      { label: '森林', note: '空间探索' },
      { label: '钥匙', note: '打开与选择' },
      { label: '窗户', note: '观看与边界' },
      { label: '风', note: '方向变化' },
    ],
    stats: {
      total: {
        label: '总梦数',
        value: '14',
        sublabel: '条',
        detail: '2 月一共记录了 14 条梦境，后半月的记录密度明显高于月初。',
      },
      explained: {
        label: '已解释',
        value: '9',
        sublabel: '条',
        detail: '已解释记录主要集中在带有探索感和寻找路径的梦，仍有 5 条待补充情境细节。',
      },
      frequent: {
        label: '高频意象',
        value: '森林',
        sublabel: '本月最常出现',
        detail: '森林、钥匙和窗户反复出现，说明 2 月更像在寻找入口与方向。',
      },
    },
    tarot: {
      previewAlt: '森林与钥匙塔罗牌预览',
      title: '森林与钥匙',
      subtitle: '窗户 · 风',
      interpretation: '你的梦像一次小探险。森林里有很多路，钥匙像是在说：你正在试着找到自己的办法。就算现在还不知道往哪走，也没关系，可以一步一步来。',
      tip: '下次梦到钥匙、门或窗户，可以记下：它是打开的，关着的，还是正在等你靠近？',
    },
    distribution: [
      { label: '现实梦', value: 4 },
      { label: '预言梦', value: 3 },
      { label: '噩梦', value: 2 },
      { label: '清醒梦', value: 5 },
      { label: '甜梦', value: 6 },
      { label: '重复梦', value: 5 },
      { label: '奇幻梦', value: 8 },
      { label: '焦虑梦', value: 3 },
    ],
  },
  {
    id: '2026-03',
    label: '3 月',
    status: 'active',
    color: '#7aa7ff',
    motifs: [
      { label: '雨', note: '清洗与落下' },
      { label: '灯塔', note: '指引与等待' },
      { label: '纸船', note: '脆弱漂流' },
      { label: '星光', note: '远处的希望' },
    ],
    stats: {
      total: {
        label: '总梦数',
        value: '34',
        sublabel: '条',
        detail: '3 月共整理了 34 条梦境记录，连续几周都保持稳定补记，是最近最完整的一个月。',
      },
      explained: {
        label: '已解释',
        value: '21',
        sublabel: '条',
        detail: '目前已有 21 条完成解释，剩余内容主要是重复出现的场景梦，适合继续归并。',
      },
      frequent: {
        label: '高频意象',
        value: '楼梯',
        sublabel: '本月最常出现',
        detail: '楼梯在 3 月反复出现，和灯塔、纸船一起构成“移动中的指引感”。',
      },
    },
    tarot: {
      previewAlt: '灯塔与楼梯塔罗牌预览',
      title: '灯塔与楼梯',
      subtitle: '纸船 · 星光',
      interpretation: '你的梦里有灯塔，也有楼梯，像是在给你一点点亮光。纸船可能有点小，但它还在往前漂。它可能在告诉你：不知道答案的时候，也可以先找到下一小步。',
      tip: '下次梦到楼梯，可以记下：我是往上走、停在原地，还是想回头看看？',
    },
    distribution: [
      { label: '现实梦', value: 8 },
      { label: '预言梦', value: 14 },
      { label: '噩梦', value: 7 },
      { label: '清醒梦', value: 10 },
      { label: '甜梦', value: 12 },
      { label: '重复梦', value: 15 },
      { label: '奇幻梦', value: 11 },
      { label: '焦虑梦', value: 9 },
    ],
  },
  {
    id: '2026-04',
    label: '4 月',
    status: 'active',
    color: '#ffd69c',
    motifs: [
      { label: '鲸鱼', note: '深海记忆' },
      { label: '阶梯', note: '持续上行' },
      { label: '云朵', note: '轻盈漂浮' },
      { label: '糖果', note: '甜度提升' },
    ],
    stats: {
      total: {
        label: '总梦数',
        value: '16',
        sublabel: '条',
        detail: '4 月累计记录 16 条，梦境数量不算最多，但主题比前几个月更集中。',
      },
      explained: {
        label: '已解释',
        value: '10',
        sublabel: '条',
        detail: '已有 10 条完成解释，其余多是同一主题下的碎片化补记。',
      },
      frequent: {
        label: '高频意象',
        value: '鲸鱼',
        sublabel: '本月最常出现',
        detail: '鲸鱼、阶梯和云朵一起出现得最频繁，整体主题偏推进、上行和明亮确认。',
      },
    },
    tarot: {
      previewAlt: '鲸鱼与阶梯塔罗牌预览',
      title: '鲸鱼与阶梯',
      subtitle: '云朵 · 糖果',
      interpretation: '鲸鱼很大，但它在梦里像一个温柔的朋友。阶梯带你往上走，云朵和糖果让路变得轻一点。这个梦可能在说：你正在长大，也在变得更勇敢。',
      tip: '下次梦到鲸鱼或阶梯，可以记下：我当时是开心、着急，还是很想知道前面有什么？',
    },
    distribution: [
      { label: '现实梦', value: 6 },
      { label: '预言梦', value: 5 },
      { label: '噩梦', value: 3 },
      { label: '清醒梦', value: 7 },
      { label: '甜梦', value: 10 },
      { label: '重复梦', value: 8 },
      { label: '奇幻梦', value: 11 },
      { label: '焦虑梦', value: 4 },
    ],
  },
  {
    id: '2026-05',
    label: '5 月',
    status: 'active',
    color: '#ff9ec2',
    motifs: [
      { label: '镜子', note: '自我观察' },
      { label: '海岸', note: '边界与潮汐' },
      { label: '风铃', note: '微小提醒' },
      { label: '门廊', note: '过渡空间' },
    ],
    stats: {
      total: {
        label: '总梦数',
        value: '13',
        sublabel: '条',
        detail: '5 月共记录 13 条梦境，分布更平均，主题呈现细小提醒与边界感。',
      },
      explained: {
        label: '已解释',
        value: '8',
        sublabel: '条',
        detail: '其中 8 条完成解释，剩余多是含有镜面和过渡空间的梦，适合合并整理。',
      },
      frequent: {
        label: '高频意象',
        value: '风铃',
        sublabel: '本月最常出现',
        detail: '风铃和镜子让 5 月显得更像一次自我观察，提示你开始注意情绪中的细节回声。',
      },
    },
    tarot: {
      previewAlt: '镜子与风铃塔罗牌预览',
      title: '镜子与风铃',
      subtitle: '海岸 · 门廊',
      interpretation: '镜子像是在帮你看看自己，风铃像是在轻轻提醒你。海岸和门廊都在边边上，说明你可能正在想：我要进去看看，还是先站在这里准备一下？',
      tip: '下次梦到镜子或门口，可以记下：我想靠近它，还是想先站远一点看看？',
    },
    distribution: [
      { label: '现实梦', value: 5 },
      { label: '预言梦', value: 3 },
      { label: '噩梦', value: 2 },
      { label: '清醒梦', value: 6 },
      { label: '甜梦', value: 7 },
      { label: '重复梦', value: 4 },
      { label: '奇幻梦', value: 8 },
      { label: '焦虑梦', value: 3 },
    ],
  },
  {
    id: '2026-06',
    label: '6 月',
    status: 'locked',
    color: '#d3d3e8',
    motifs: createLockedMotifs(),
    stats: {
      total: {
        label: '总梦数',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的记录总数会在这里展示。',
      },
      explained: {
        label: '已解释',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的解释进度会在这里展示。',
      },
      frequent: {
        label: '高频意象',
        value: '待解锁',
        sublabel: '本月最常出现',
        detail: '后续月份的高频意象会在这里展示。',
      },
    },
    tarot: {
      previewAlt: '待解锁塔罗牌预览',
      title: '待解锁',
      subtitle: '更多意象即将到来',
      interpretation: '后续月份的分析会在这里展开。',
      tip: '继续记录梦境，新的月度解读会慢慢浮现。',
    },
    distribution: createLockedDistribution(),
  },
  {
    id: '2026-07',
    label: '7 月',
    status: 'locked',
    color: '#d3d3e8',
    motifs: createLockedMotifs(),
    stats: {
      total: {
        label: '总梦数',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的记录总数会在这里展示。',
      },
      explained: {
        label: '已解释',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的解释进度会在这里展示。',
      },
      frequent: {
        label: '高频意象',
        value: '待解锁',
        sublabel: '本月最常出现',
        detail: '后续月份的高频意象会在这里展示。',
      },
    },
    tarot: {
      previewAlt: '待解锁塔罗牌预览',
      title: '待解锁',
      subtitle: '更多意象即将到来',
      interpretation: '后续月份的分析会在这里展开。',
      tip: '继续记录梦境，新的月度解读会慢慢浮现。',
    },
    distribution: createLockedDistribution(),
  },
  {
    id: '2026-08',
    label: '8 月',
    status: 'locked',
    color: '#d3d3e8',
    motifs: createLockedMotifs(),
    stats: {
      total: {
        label: '总梦数',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的记录总数会在这里展示。',
      },
      explained: {
        label: '已解释',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的解释进度会在这里展示。',
      },
      frequent: {
        label: '高频意象',
        value: '待解锁',
        sublabel: '本月最常出现',
        detail: '后续月份的高频意象会在这里展示。',
      },
    },
    tarot: {
      previewAlt: '待解锁塔罗牌预览',
      title: '待解锁',
      subtitle: '更多意象即将到来',
      interpretation: '后续月份的分析会在这里展开。',
      tip: '继续记录梦境，新的月度解读会慢慢浮现。',
    },
    distribution: createLockedDistribution(),
  },
  {
    id: '2026-09',
    label: '9 月',
    status: 'locked',
    color: '#d3d3e8',
    motifs: createLockedMotifs(),
    stats: {
      total: {
        label: '总梦数',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的记录总数会在这里展示。',
      },
      explained: {
        label: '已解释',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的解释进度会在这里展示。',
      },
      frequent: {
        label: '高频意象',
        value: '待解锁',
        sublabel: '本月最常出现',
        detail: '后续月份的高频意象会在这里展示。',
      },
    },
    tarot: {
      previewAlt: '待解锁塔罗牌预览',
      title: '待解锁',
      subtitle: '更多意象即将到来',
      interpretation: '后续月份的分析会在这里展开。',
      tip: '继续记录梦境，新的月度解读会慢慢浮现。',
    },
    distribution: createLockedDistribution(),
  },
  {
    id: '2026-10',
    label: '10 月',
    status: 'locked',
    color: '#d3d3e8',
    motifs: createLockedMotifs(),
    stats: {
      total: {
        label: '总梦数',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的记录总数会在这里展示。',
      },
      explained: {
        label: '已解释',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的解释进度会在这里展示。',
      },
      frequent: {
        label: '高频意象',
        value: '待解锁',
        sublabel: '本月最常出现',
        detail: '后续月份的高频意象会在这里展示。',
      },
    },
    tarot: {
      previewAlt: '待解锁塔罗牌预览',
      title: '待解锁',
      subtitle: '更多意象即将到来',
      interpretation: '后续月份的分析会在这里展开。',
      tip: '继续记录梦境，新的月度解读会慢慢浮现。',
    },
    distribution: createLockedDistribution(),
  },
  {
    id: '2026-11',
    label: '11 月',
    status: 'locked',
    color: '#d3d3e8',
    motifs: createLockedMotifs(),
    stats: {
      total: {
        label: '总梦数',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的记录总数会在这里展示。',
      },
      explained: {
        label: '已解释',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的解释进度会在这里展示。',
      },
      frequent: {
        label: '高频意象',
        value: '待解锁',
        sublabel: '本月最常出现',
        detail: '后续月份的高频意象会在这里展示。',
      },
    },
    tarot: {
      previewAlt: '待解锁塔罗牌预览',
      title: '待解锁',
      subtitle: '更多意象即将到来',
      interpretation: '后续月份的分析会在这里展开。',
      tip: '继续记录梦境，新的月度解读会慢慢浮现。',
    },
    distribution: createLockedDistribution(),
  },
  {
    id: '2026-12',
    label: '12 月',
    status: 'locked',
    color: '#d3d3e8',
    motifs: createLockedMotifs(),
    stats: {
      total: {
        label: '总梦数',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的记录总数会在这里展示。',
      },
      explained: {
        label: '已解释',
        value: '待解锁',
        sublabel: '条',
        detail: '后续月份的解释进度会在这里展示。',
      },
      frequent: {
        label: '高频意象',
        value: '待解锁',
        sublabel: '本月最常出现',
        detail: '后续月份的高频意象会在这里展示。',
      },
    },
    tarot: {
      previewAlt: '待解锁塔罗牌预览',
      title: '待解锁',
      subtitle: '更多意象即将到来',
      interpretation: '后续月份的分析会在这里展开。',
      tip: '继续记录梦境，新的月度解读会慢慢浮现。',
    },
    distribution: createLockedDistribution(),
  },
];
