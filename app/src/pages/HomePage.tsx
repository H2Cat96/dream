import { motion } from 'framer-motion';
import { Bell, Mic, MoonStar, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { homeDreamNodes } from '../lib/prototypeData';
import { HomeNotificationSheet } from '../components/home/HomeNotificationSheet';
import { PlanetStageSheet } from '../components/home/PlanetStageSheet';
import { VoiceJourneySheet, type VoiceJourneyStage } from '../components/home/VoiceJourneySheet';
import { StatusBar } from '../components/layout/StatusBar';

type DreamParticle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  alpha: number;
  speed: number;
  phase: number;
  tint: string;
};

type DreamNode = {
  x: number;
  y: number;
  radius: number;
  pulseOffset: number;
  label: string;
  dreams: number;
};

type DreamCluster = {
  label: string;
  dreams: number;
};

const dreamClusters: DreamCluster[] = homeDreamNodes.length > 0
  ? homeDreamNodes.map((node) => ({
      label: node.label,
      dreams: Number(node.dreams) || 0,
    }))
  : [{ label: '梦境节点', dreams: 0 }];

const planetStages = [
  { name: '种子星', count: 24 },
  { name: '晨雾星', count: 64 },
  { name: '发光星球', count: 128 },
  { name: '梦境行星', count: 200 },
];

const voiceHintStorageKey = 'painting-dream-planet-voice-hint-seen';

function createParticle(width: number, height: number): DreamParticle {
  const tintPalette = ['255,255,255', '187,213,255', '204,180,255', '255,229,166'];

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    baseX: Math.random() * width,
    baseY: Math.random() * height,
    size: Math.random() * 2.8 + 1,
    alpha: Math.random() * 0.42 + 0.18,
    speed: Math.random() * 0.4 + 0.08,
    phase: Math.random() * Math.PI * 2,
    tint: tintPalette[Math.floor(Math.random() * tintPalette.length)],
  };
}

function createNode(width: number, height: number, index: number, clusters: DreamCluster[]): DreamNode {
  const cluster = clusters[index];
  if (!cluster) {
    return {
      x: width * 0.62,
      y: height * 0.5,
      radius: 4,
      pulseOffset: 0,
      label: '梦境节点',
      dreams: 0,
    };
  }
  const angle = (index / Math.max(clusters.length, 1)) * Math.PI * 2 - 0.7;
  const radius = Math.min(width, height) * (0.16 + Math.random() * 0.14);

  return {
    x: width * 0.62 + Math.cos(angle) * radius,
    y: height * 0.5 + Math.sin(angle) * radius * 0.85,
    radius: 2.8 + cluster.dreams * 0.08,
    pulseOffset: Math.random() * Math.PI * 2,
    label: cluster.label,
    dreams: cluster.dreams,
  };
}

function DreamUniverseField({ focused }: { focused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0.7, y: 0.46 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId = 0;
    let width = 0;
    let height = 0;
    let particles: DreamParticle[] = [];
    let nodes: DreamNode[] = [];
    let focusAmount = focused ? 1 : 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: 108 }, () => createParticle(width, height));
      nodes = Array.from({ length: dreamClusters.length }, (_, index) => createNode(width, height, index, dreamClusters));
    };

    const drawBackground = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const vertical = ctx.createLinearGradient(0, 0, 0, height);
      vertical.addColorStop(0, '#090611');
      vertical.addColorStop(0.35, '#110b22');
      vertical.addColorStop(0.7, '#090915');
      vertical.addColorStop(1, '#06070c');
      ctx.fillStyle = vertical;
      ctx.fillRect(0, 0, width, height);

      const centerX = width * (0.64 + Math.sin(time * 0.00012) * 0.03);
      const centerY = height * (0.5 + Math.cos(time * 0.00015) * 0.02);

      const nebula = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, width * 0.5);
      nebula.addColorStop(0, 'rgba(99, 127, 255, 0.22)');
      nebula.addColorStop(0.32, 'rgba(153, 118, 255, 0.18)');
      nebula.addColorStop(0.62, 'rgba(70, 41, 128, 0.12)');
      nebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      const mist = ctx.createRadialGradient(width * 0.25, height * 0.23, 10, width * 0.25, height * 0.23, width * 0.34);
      mist.addColorStop(0, 'rgba(255, 211, 133, 0.15)');
      mist.addColorStop(0.5, 'rgba(255, 175, 102, 0.07)');
      mist.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mist;
      ctx.fillRect(0, 0, width, height);

      const veil = ctx.createLinearGradient(0, height * 0.58, 0, height);
      veil.addColorStop(0, 'rgba(7,8,14,0)');
      veil.addColorStop(1, 'rgba(7,8,14,0.78)');
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, width, height);
    };

    const drawParticles = (time: number) => {
      const pointerX = pointerRef.current.x * width;
      const pointerY = pointerRef.current.y * height;

      particles.forEach((particle, index) => {
        const drift = time * 0.00018 * particle.speed;
        particle.x = particle.baseX + Math.cos(drift + particle.phase) * 14;
        particle.y = particle.baseY + Math.sin(drift * 1.35 + particle.phase) * 11;

        const dx = pointerX - particle.x;
        const dy = pointerY - particle.y;
        const distance = Math.hypot(dx, dy);
        const force = Math.max(0, 1 - distance / 110);
        const drawX = particle.x - dx * 0.03 * force;
        const drawY = particle.y - dy * 0.03 * force;
        const twinkle = 0.72 + Math.sin(time * 0.0016 + index) * 0.28;

        ctx.fillStyle = `rgba(${particle.tint},${particle.alpha * twinkle})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawPlanetCore = (time: number) => {
      const coreX = width * 0.62;
      const coreY = height * 0.5;
      const baseRadius = Math.min(width, height) * 0.12;

      [1.45, 1.95].forEach((scale, index) => {
        ctx.save();
        ctx.strokeStyle = `rgba(142,181,255,${index === 0 ? 0.2 : 0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(
          coreX,
          coreY,
          baseRadius * scale,
          baseRadius * scale * 0.64,
          -0.24 + index * 0.05,
          0,
          Math.PI * 2,
        );
        ctx.stroke();
        ctx.restore();
      });

      const planetGlow = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, baseRadius * 1.6);
      planetGlow.addColorStop(0, 'rgba(255,240,194,0.95)');
      planetGlow.addColorStop(0.38, 'rgba(146,177,255,0.62)');
      planetGlow.addColorStop(0.7, 'rgba(114,88,198,0.28)');
      planetGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = planetGlow;
      ctx.beginPath();
      ctx.arc(coreX, coreY, baseRadius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      const planetFill = ctx.createLinearGradient(coreX - baseRadius, coreY - baseRadius, coreX + baseRadius, coreY + baseRadius);
      planetFill.addColorStop(0, '#fff0be');
      planetFill.addColorStop(0.5, '#b9c8ff');
      planetFill.addColorStop(1, '#7359ce');
      ctx.fillStyle = planetFill;
      ctx.beginPath();
      ctx.arc(coreX, coreY, baseRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.32)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(coreX, coreY, baseRadius * 0.98, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.ellipse(coreX - baseRadius * 0.2, coreY - baseRadius * 0.25, baseRadius * 0.34, baseRadius * 0.2, -0.45, 0, Math.PI * 2);
      ctx.fill();

      const seedAngle = time * 0.0004;
      const seedX = coreX + Math.cos(seedAngle) * baseRadius * 1.5;
      const seedY = coreY + Math.sin(seedAngle) * baseRadius * 0.9;
      ctx.fillStyle = '#ffe39b';
      ctx.beginPath();
      ctx.arc(seedX, seedY, 4.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawNodes = (time: number) => {
      const coreX = width * 0.62;
      const coreY = height * 0.5;

      ctx.strokeStyle = 'rgba(133, 193, 255, 0.16)';
      ctx.lineWidth = 1;

      nodes.forEach((node, index) => {
        const next = nodes[(index + 1) % nodes.length];
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.quadraticCurveTo(
          coreX + Math.sin(time * 0.0003 + index) * 12,
          coreY + Math.cos(time * 0.00035 + index) * 12,
          next.x,
          next.y,
        );
        ctx.stroke();
      });

      nodes.forEach((node, index) => {
        const pulse = 0.85 + Math.sin(time * 0.002 + node.pulseOffset) * 0.25;
        const glowRadius = node.radius * 4.6 * pulse;

        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
        glow.addColorStop(0, 'rgba(255,255,255,0.96)');
        glow.addColorStop(0.32, index % 2 === 0 ? 'rgba(115, 183, 255, 0.52)' : 'rgba(198, 147, 255, 0.45)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff0c2';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '11px sans-serif';
        ctx.textAlign = node.x > width * 0.64 ? 'right' : 'left';
        ctx.fillText(node.label, node.x + (node.x > width * 0.64 ? -10 : 10), node.y - 8);
        ctx.font = '10px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.48)';
        ctx.fillText(`${node.dreams} 个梦`, node.x + (node.x > width * 0.64 ? -10 : 10), node.y + 12);
      });
    };

    const drawMoon = (time: number) => {
      const moonX = width * 0.76 + Math.cos(time * 0.00035) * 18;
      const moonY = height * 0.26 + Math.sin(time * 0.0004) * 10;
      const glow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 42);
      glow.addColorStop(0, 'rgba(255,240,185,0.95)');
      glow.addColorStop(0.45, 'rgba(255,209,99,0.28)');
      glow.addColorStop(1, 'rgba(255,209,99,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 42, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffe6a0';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 10, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (time: number) => {
      if (!width || !height) resize();
      focusAmount += ((focused ? 1 : 0) - focusAmount) * 0.06;

      ctx.save();
      const zoom = 1 + focusAmount * 0.22;
      const focusX = width * 0.62;
      const focusY = height * 0.5;
      ctx.translate(focusX, focusY);
      ctx.scale(zoom, zoom);
      ctx.translate(-focusX, -focusY);
      drawBackground(time);
      drawParticles(time);
      drawPlanetCore(time);
      drawNodes(time);
      drawMoon(time);
      ctx.restore();
      frameId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current = { x: 0.7, y: 0.46 };
    };

    resize();
    frameId = window.requestAnimationFrame(animate);
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [focused]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

interface HomePageProps {
  onOpenParticle: () => void;
}

export function HomePage({ onOpenParticle }: HomePageProps) {
  const currentDreamCount = 128;
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isPlanetStageSheetOpen, setIsPlanetStageSheetOpen] = useState(false);
  const [voiceJourneyOpen, setVoiceJourneyOpen] = useState(false);
  const [voiceJourneyStage, setVoiceJourneyStage] = useState<VoiceJourneyStage>('idle');
  const [showVoiceHint, setShowVoiceHint] = useState(false);
  const [isNebulaFocused, setIsNebulaFocused] = useState(false);
  const activeStageIndex = planetStages.findIndex((stage, index) => {
    const next = planetStages[index + 1];
    return currentDreamCount >= stage.count && (!next || currentDreamCount < next.count);
  });
  const activeStage = planetStages[Math.max(activeStageIndex, 0)];
  const nextStage = planetStages[Math.min(Math.max(activeStageIndex, 0) + 1, planetStages.length - 1)];
  const stageProgress = nextStage.count === activeStage.count
    ? 1
    : (currentDreamCount - activeStage.count) / (nextStage.count - activeStage.count);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (!window.localStorage.getItem(voiceHintStorageKey)) {
        setShowVoiceHint(true);
      }
    } catch {
      setShowVoiceHint(false);
    }
  }, []);

  const dismissVoiceHint = () => {
    setShowVoiceHint(false);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(voiceHintStorageKey, 'true');
      } catch {
        // Ignore storage failures in restricted environments.
      }
    }
  };

  useEffect(() => {
    if (!voiceJourneyOpen) return;
    if (voiceJourneyStage !== 'transcribing') return;

    const timers: number[] = [];

    timers.push(window.setTimeout(() => setVoiceJourneyStage('saved'), 1200));

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [voiceJourneyOpen, voiceJourneyStage]);

  useEffect(() => {
    const handleVoiceHoldStart = () => {
      setShowVoiceHint(false);
      setNotificationOpen(false);
      setIsPlanetStageSheetOpen(false);
      setVoiceJourneyOpen(true);
      setVoiceJourneyStage('recording');
    };

    window.addEventListener('dream-voice-hold-start', handleVoiceHoldStart);

    return () => {
      window.removeEventListener('dream-voice-hold-start', handleVoiceHoldStart);
    };
  }, []);

  const openNotificationSheet = () => {
    setIsPlanetStageSheetOpen(false);
    setVoiceJourneyOpen(false);
    setVoiceJourneyStage('idle');
    setNotificationOpen(true);
  };

  const closeNotificationSheet = () => {
    setNotificationOpen(false);
  };

  const openVoiceJourney = () => {
    setNotificationOpen(false);
    setIsPlanetStageSheetOpen(false);
    setVoiceJourneyOpen(true);
    setVoiceJourneyStage('recording');
  };

  const closeVoiceJourney = () => {
    setVoiceJourneyOpen(false);
    setVoiceJourneyStage('idle');
  };

  const saveVoiceJourney = () => {
    if (voiceJourneyStage === 'saved') {
      closeVoiceJourney();
      return;
    }
    setVoiceJourneyStage('transcribing');
  };

  const openPlanetStageSheet = () => {
    setIsPlanetStageSheetOpen(true);
    setNotificationOpen(false);
    setVoiceJourneyOpen(false);
    setVoiceJourneyStage('idle');
  };

  const closePlanetStageSheet = () => {
    setIsPlanetStageSheetOpen(false);
  };

  const handleNebulaClick = () => {
    if (isNebulaFocused) {
      onOpenParticle?.();
      return;
    }
    setIsNebulaFocused(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="relative h-full min-h-[852px] overflow-hidden bg-[#07070d] text-white"
    >
      <motion.div
        animate={{
          scale: isNebulaFocused ? 1.1 : 1,
          x: isNebulaFocused ? -18 : 0,
          y: isNebulaFocused ? -8 : 0,
        }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
        style={{ transformOrigin: '62% 50%' }}
      >
        <DreamUniverseField focused={isNebulaFocused} />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_24%),linear-gradient(180deg,rgba(9,7,20,0.04)_0%,rgba(7,8,12,0.16)_52%,rgba(7,8,12,0.72)_100%)]" />
      <button
        onClick={handleNebulaClick}
        className="absolute left-[28%] top-[16%] z-30 h-[52%] w-[60%] rounded-[44%]"
        aria-label={isNebulaFocused ? '进入梦境粒子示例' : '聚焦梦境星云'}
      />

      <motion.div
        animate={{
          scale: isNebulaFocused ? 0.82 : 1,
          opacity: isNebulaFocused ? 0 : 1,
          y: isNebulaFocused ? 18 : 0,
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex h-full flex-col"
        style={{ transformOrigin: '50% 55%' }}
      >
        <div className="pointer-events-none flex h-full flex-col">
          <StatusBar />

          <div className="px-5 pt-2.5 flex items-center justify-between">
          <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/74 backdrop-blur-md">
            绘梦星球已经收下 128 个梦境光点
            </div>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={openNotificationSheet}
              className="pointer-events-auto h-9 w-9 rounded-full border border-white/10 bg-white/7 flex items-center justify-center backdrop-blur-md"
              aria-label="通知中心"
            >
              <Bell className="h-4.5 w-4.5 text-white" />
            </motion.button>
          </div>

          <div className="px-5 pt-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/72 backdrop-blur-md">
              <MoonStar className="h-3.5 w-3.5 text-[#ffe59a]" />
              梦境宇宙
            </div>
            <h1 className="mt-3 max-w-[60%] text-[24px] font-bold leading-[1.15] tracking-[-0.03em] text-white">
              把昨晚的梦
              <br />
              讲给绘梦星球听
            </h1>
          </div>

          {!isPlanetStageSheetOpen && (
            <button
              type="button"
              onClick={openPlanetStageSheet}
              aria-label="打开星球成长记录"
              className="pointer-events-auto absolute bottom-32 right-0 flex flex-col items-center gap-1.5 rounded-l-2xl border border-r-0 border-white/12 bg-black/24 px-2.5 py-3 text-white/82 backdrop-blur-xl"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#ffe7a1]" />
              <span className="flex flex-col items-center text-[11px] font-medium leading-[1.05] tracking-[0.08em]">
                <span>成</span>
                <span>长</span>
              </span>
            </button>
          )}
        </div>
      </motion.div>

      {isNebulaFocused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute left-1/2 top-8 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-black/18 px-3 py-1.5 text-[11px] text-white/72 backdrop-blur-md"
        >
          梦境内部已放大，再点一次进入粒子示例
        </motion.div>
      )}

      {showVoiceHint && !isNebulaFocused && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="absolute inset-x-5 bottom-36 z-20"
        >
          <div className="relative rounded-[26px] border border-white/12 bg-[linear-gradient(135deg,rgba(255,239,179,0.98)_0%,rgba(255,214,124,0.94)_100%)] px-4 py-3 text-neutral-black shadow-[0_18px_36px_rgba(255,206,102,0.24)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <Mic className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-neutral-black/60">首次进入提示</p>
                <p className="mt-1 text-[17px] font-semibold">按住中间按钮，讲昨晚的梦</p>
                <p className="mt-1 text-sm leading-5 text-neutral-black/70">
                  绘梦星球会把你的描述变成新的梦境光点和绘本封面。
                </p>
              </div>
            </div>
            <button
              onClick={dismissVoiceHint}
              className="mt-3 rounded-full bg-neutral-black px-3 py-1.5 text-xs font-medium text-white"
            >
              知道了
            </button>
            <div className="absolute left-1/2 top-full h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-white/12 bg-[#ffd773]" />
          </div>
        </motion.div>
      )}

      <HomeNotificationSheet
        open={notificationOpen}
        onClose={closeNotificationSheet}
        onStartVoiceJourney={openVoiceJourney}
      />

      <VoiceJourneySheet
        open={voiceJourneyOpen}
        stage={voiceJourneyStage}
        transcript="我梦到自己在海面上跑，浪花像大滑梯一样好玩。一头巨鲸朝我喷水，喷出来的全是彩虹，它带我游了很远很远，海水喝起来甜甜的，像冰汽水一样。"
        onClose={closeVoiceJourney}
        onSave={saveVoiceJourney}
      />

      <PlanetStageSheet
        open={isPlanetStageSheetOpen}
        stageName={activeStage.name}
        currentDreamCount={currentDreamCount}
        nextStageCount={nextStage.count}
        progress={stageProgress}
        onClose={closePlanetStageSheet}
      />
    </motion.div>
  );
}
