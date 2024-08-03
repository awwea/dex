import { FC } from 'react';
import { IS_TENDERLY_FORK } from 'libs/wagmi';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { MainMenuRightWallet } from 'components/core/menu/mainMenu/MainMenuRightWallet';
import { MainMenuRightNotifications } from 'components/core/menu/mainMenu/MainMenuRightNotifications';
import { Button } from 'components/common/button';
import { useBurgerMenuItems } from './MainMenuRightBurger/useBurgerMenuItems';

const TenderlyForkAlert = () => {
    return IS_TENDERLY_FORK ? (
        <Button variant="error" size="sm">
            Fork
        </Button>
    ) : null;
};

export const MainMenuRight: FC = () => {
    const { menuMapping } = useBurgerMenuItems();
    const { aboveBreakpoint } = useBreakpoints();

    // <MainMenuRightChainSelector networks={networks} />
    // {aboveBreakpoint('md') && (
    // <MainMenuRightBurger menuMapping={menuMapping} />
    // )}
    return (
        <div className="flex items-center gap-8 sm:gap-16">
            <TenderlyForkAlert />
            <MainMenuRightNotifications />
            <MainMenuRightWallet />
        </div>
    );
};
