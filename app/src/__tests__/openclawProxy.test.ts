import { describe, expect, it } from 'vitest';
import { extractOpenClawMessageText, extractOpenClawToken, normalizeOpenClawReply } from '../../server/openclawProxy';

describe('openclaw proxy helpers', () => {
  it('extracts the gateway auth token from OpenClaw config', () => {
    expect(
      extractOpenClawToken({
        gateway: {
          auth: {
            token: 'secret-token',
          },
        },
      }),
    ).toBe('secret-token');
  });

  it('normalizes common OpenClaw send response shapes into a reply', () => {
    expect(normalizeOpenClawReply({ reply: '直接回复' })).toEqual({ reply: '直接回复' });
    expect(normalizeOpenClawReply({ message: { content: '消息内容' } })).toEqual({ reply: '消息内容' });
    expect(normalizeOpenClawReply({ data: { reply: '嵌套回复' } })).toEqual({ reply: '嵌套回复' });
  });

  it('extracts text from OpenClaw chat message payloads', () => {
    expect(extractOpenClawMessageText({ content: [{ type: 'text', text: '第一段' }, { type: 'text', text: '第二段' }] })).toBe(
      '第一段\n第二段',
    );
  });
});
