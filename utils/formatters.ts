export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
};

export const parseCurrencyInput = (value: string): number => {
  // Remove non-numeric characters except comma and dot
  const cleanValue = value.replace(/[^0-9,]/g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};
