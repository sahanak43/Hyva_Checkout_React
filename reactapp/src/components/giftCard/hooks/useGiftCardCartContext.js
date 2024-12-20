import useCartContext from '../../../hook/useCartContext';

export default function useGiftCardCartContext() {
  const { cart, applyGiftCard, removeGiftCard, balanceGiftCard } =
    useCartContext();

  return {
    applyGiftCard,
    removeGiftCard,
    balanceGiftCard,
    giftCard: cart?.giftCard,
  };
}
