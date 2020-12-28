import React from 'react';
import { Counter } from 'components/counter/counter';
import { CloseIcon } from 'assets/icons/close-icon';
import { siteConstant } from 'site-settings/site-constant';
import {
  ItemBox,
  Image,
  Information,
  Name,
  Price,
  Weight,
  Total,
  GroupItem,
  ItemContainer,
  RemoveButton,
} from './cart-item.style';
import { useCart } from 'contexts/cart/use-cart';
import { useModal } from 'contexts/modal/use-modal';
import dynamic from 'next/dynamic';
import { useMedia } from 'utils/use-media';
const QuickViewMobile = dynamic(
  () => import('features/quick-view/quick-view-mobile')
);
interface Props {
  data: any;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
}


export const TextCartItem: React.FC<Props> = ({
  data,
  onDecrement,
  onIncrement,
  onRemove,
}) => {
  const { name, price, salePrice, unit, quantity, addons,id } = data;
  const displayPrice = salePrice ? salePrice : price;
  const containAddon = addons.some(m => m.quantity > 0)
  const {
    updateAddon
  } = useCart();
  const mobile = useMedia('(max-width: 580px)');
  const tablet = useMedia('(max-width: 991px)');
  const desktop = useMedia('(min-width: 992px)');
  
  const [showModal, hideModal] = useModal(
    () => (
      <QuickViewMobile
        modalProps={data}
        hideModal={hideModal}
        deviceType={{mobile, tablet, desktop}}
      />
    ),
    {
      onClose: () => {
      },
    }
  );
  // const totalPrice = quantity * displayPrice;
  return (
    <ItemBox>
      <Counter
        value={quantity}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
        variant="lightVertical"
      />
      {/* <Image src={image} /> */}
      <GroupItem>
        <ItemContainer onClick={showModal}>
          <p>{name}</p>
          <Total>
            {siteConstant.CURRENCY}
            {(quantity * displayPrice).toFixed(2)}
          </Total>
          <RemoveButton onClick={onRemove}>
            <CloseIcon />
          </RemoveButton>
        </ItemContainer>
        {containAddon &&
          addons && addons.map((addon) => (
            <ItemContainer>
            <p className='w-normal'>{addon.name}</p>
            <Total>
              {siteConstant.CURRENCY}
              {((addon.quantity * addon.price) || 0).toFixed(2)}
            </Total>
            <RemoveButton onClick={() =>updateAddon(id, addon.id, 0)}>
              <CloseIcon />
            </RemoveButton>
          </ItemContainer>
        ))}
      </GroupItem>
    </ItemBox>
  );
};
