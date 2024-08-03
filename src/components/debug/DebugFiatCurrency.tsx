import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Button } from 'components/common/button';

export const DebugFiatCurrency = () => {
    const { selectedFiatCurrency, setSelectedFiatCurrency, availableCurrencies } =
        useFiatCurrency();

    return (
        <div className="rounded-18 bg-background-900 flex flex-col items-center space-y-20 p-20">
            <h2>Fiat Currency Selection</h2>

            {availableCurrencies.map((currency) => (
                <Button
                    key={currency}
                    variant={currency === selectedFiatCurrency ? 'success' : 'white'}
                    onClick={() => setSelectedFiatCurrency(currency)}
                >
                    {currency}
                </Button>
            ))}
        </div>
    );
};
