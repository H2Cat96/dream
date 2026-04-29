import { describe, expect, it } from 'vitest';
import {
  archiveOverviewModes,
  archiveSpecimens,
  homeDreamNodes,
  interpretationMonths,
} from '../lib/prototypeData';

describe('prototypeData', () => {
  it('exposes the expected prototype data shape', () => {
    expect(interpretationMonths).toHaveLength(12);
    const monthIds = interpretationMonths.map((month) => month.id);
    expect(new Set(monthIds).size).toBe(monthIds.length);

    interpretationMonths.forEach((month) => {
      expect(month.motifs.length).toBeGreaterThanOrEqual(4);
      month.motifs.forEach((motif) => {
        expect(motif).toEqual({
          label: expect.any(String),
          note: expect.any(String),
        });
      });

      expect(month.stats).toEqual({
        total: {
          label: expect.any(String),
          value: expect.any(String),
          sublabel: expect.any(String),
          detail: expect.any(String),
        },
        explained: {
          label: expect.any(String),
          value: expect.any(String),
          sublabel: expect.any(String),
          detail: expect.any(String),
        },
        frequent: {
          label: expect.any(String),
          value: expect.any(String),
          sublabel: expect.any(String),
          detail: expect.any(String),
        },
      });
      expect(month.tarot).toEqual({
        previewAlt: expect.any(String),
        title: expect.any(String),
        subtitle: expect.any(String),
        interpretation: expect.any(String),
        tip: expect.any(String),
      });
      expect(month.distribution).toHaveLength(8);
      month.distribution.forEach((entry) => {
        expect(entry).toEqual({
          label: expect.any(String),
          value: expect.any(Number),
        });
      });
    });

    const lockedMonths = interpretationMonths.filter((month) => month.status === 'locked');
    expect(lockedMonths.length).toBeGreaterThanOrEqual(2);
    expect(lockedMonths[0].motifs).not.toBe(lockedMonths[1].motifs);
    expect(lockedMonths[0].distribution).not.toBe(lockedMonths[1].distribution);

    expect(homeDreamNodes.length).toBeGreaterThanOrEqual(4);
    homeDreamNodes.forEach((node) => {
      expect(node).toEqual({
        id: expect.any(String),
        label: expect.any(String),
        dreams: expect.any(String),
        mood: expect.any(String),
        summary: expect.any(String),
        tags: expect.any(Array),
      });
    });

    expect(archiveOverviewModes).toHaveLength(3);
    archiveOverviewModes.forEach((mode) => {
      expect(mode).toEqual({
        id: expect.any(String),
        title: expect.any(String),
        helper: expect.any(String),
      });
    });

    expect(archiveSpecimens.length).toBeGreaterThanOrEqual(4);
    archiveSpecimens.forEach((specimen) => {
      expect(specimen).toEqual({
        id: expect.any(String),
        title: expect.any(String),
        count: expect.any(String),
        lastSeen: expect.any(String),
        companions: expect.any(Array),
        meaning: expect.any(String),
        accent: expect.any(String),
      });
    });
  });
});
