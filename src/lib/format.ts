export const formatPrice = (num: number, abbreviate = false): string => {
    if(num === null || num === undefined || isNaN(num)) return '-';

    if(abbreviate){
        const abs = Math.abs(num);
        let formatted = '';

        if (abs >= 1_000_000_000_000) {
            formatted = (num / 1_000_000_000_000).toFixed(2) + 'T';
        } else if (abs >= 1_000_000_000) {
            formatted = (num / 1_000_000_000).toFixed(2) + 'B';
        } else if (abs >= 1_000_000) {
            formatted = (num / 1_000_000).toFixed(2) + 'M';
        } else if (abs >= 1_000) {
            formatted = (num / 1_000).toFixed(2) + 'K';
        } else {
            formatted = num.toFixed(2);
        }

        return `$${formatted}`;
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 8,
    }).format(num);
};