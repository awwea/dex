import { Pathnames } from 'libs/routing';

export interface MenuItem {
  label: string;
  href: Pathnames;
}

export const menuItems: MenuItem[] = [
  {
    label: 'Strategy',
    href: '/',
  },
  {
    label: 'Trade',
    href: '/trade',
  },
  {
    label: 'Explore',
    href: '/explore',
  },
  {
    label: 'Scanner',
    href: 'https://explorer.daofinance.me',
  },
  // ...(!config.isSimulatorEnabled
  // ? []
  // : [{
  // label: 'Simulate',
  // href: '/simulate',
  // } as MenuItem,
  // ]),
  // ...(isProduction
  // ? []
  // : [{
  // label: 'Debug',
  // href: '/debug',
  // } as MenuItem,
  // ]),
];
