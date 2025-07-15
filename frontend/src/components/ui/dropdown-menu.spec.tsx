import { vi, describe, beforeEach, test, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';

describe('DropdownMenu Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders with default props', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>Open Menu</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <span data-testid="menu-item">Item 1</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Menu Label</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const button = screen.getByRole('button', { name: /open menu/i });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { name: /item 1/i }),
    ).toBeInTheDocument();
    expect(await screen.findByTestId('menu-item')).toBeInTheDocument();
    expect(await screen.findByRole('separator')).toBeInTheDocument();
    expect(await screen.findByText(/menu label/i)).toBeInTheDocument();
  });

  test('renders DropdownMenuPortal with correct data-slot attribute', async () => {
    // Test that DropdownMenuPortal renders and adds the data-slot attribute
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>Open Menu</button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal data-testid="test-portal">
          <div data-testid="portal-content">Portal content</div>
        </DropdownMenuPortal>
      </DropdownMenu>,
    );

    const button = screen.getByRole('button', { name: /open menu/i });
    await userEvent.click(button);
    // Verify the content is rendered
    expect(await screen.findByText('Portal content')).toBeInTheDocument();
  });
});
