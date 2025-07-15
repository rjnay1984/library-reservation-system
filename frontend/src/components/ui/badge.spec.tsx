import { vi, describe, beforeEach, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders with default variant', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge.nodeName).toBe('SPAN');
    expect(badge).toMatchInlineSnapshot(`
      <span
        class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90"
        data-slot="badge"
      >
        Default Badge
      </span>
    `);
  });

  test('renders asChild', () => {
    render(
      <Badge asChild>
        <div>Badge as Child</div>
      </Badge>,
    );
    const badge = screen.getByText('Badge as Child');
    expect(badge.nodeName).toBe('DIV');
    expect(badge).toMatchInlineSnapshot(`
      <div
        class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90"
        data-slot="badge"
      >
        Badge as Child
      </div>
    `);
  });
});
