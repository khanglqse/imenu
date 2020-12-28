import React, { useState } from 'react';
import { Link, Element } from 'react-scroll';
import { Button } from 'components/button/button';
import {
  ProductDetailsWrapper,
  ProductPreview,
  RestaurantMeta,
  RestaurantNameAddress,
  RestaurantName,
  RestaurantAddress,
  RestaurantOtherInfos,
  InfoBlock,
  Label,
  Infos,
  DeliveryOpt,
  CategoriesWrapper,
  CategoriesInner,
  MainContent,
  MenuContainer,
  ItemCategoryWrapper,
  ItemCategoryName,
  ItemWrapper,
  ItemNameDetails,
  ItemName,
  ItemDetails,
  ItemNamePricing,
  HelpText,
  ItemPrice,
  PreviewProduct,
  CartWrapper,
} from './product-details-one.style';
import { siteConstant } from 'site-settings/site-constant';
import FixedCart from 'features/carts/fixed-cart';
import FixedCartPopup from 'features/carts/fixed-cart-popup';
import { FormattedMessage } from 'react-intl';
import Sticky from 'react-stickynode';
import { groupBy } from 'utils/group-by';
import { useCart } from 'contexts/cart/use-cart';
import { PlusOutline } from 'assets/icons/plus-outline-icon';
import { Minus } from 'assets/icons/plus-minus-icon';
import { useMedia } from 'utils/use-media';
import dynamic from 'next/dynamic';
import { useModal } from 'contexts/modal/use-modal';
import { useRouter } from 'next/router';
import { ModalProvider } from 'contexts/modal/modal.provider';

const QuickViewMobile = dynamic(
  () => import('features/quick-view/quick-view-mobile')
);
type ProductDetailItemProps = {
  product: any;
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const ProductDetailItem: React.FunctionComponent<ProductDetailItemProps> = ({
  product,
  deviceType,
}) => {
  const [currentItem, setCurrentItem] = useState({})
  const router = useRouter();
  const tablet = useMedia('(max-width: 991px)');
  const { addItem, clearCart, toggleRestaurant, isInCart } = useCart();
  const handleAddClick = (values) => {
    addItem(values);
  };
  const checkoutStatus = React.useRef(null);
  const data = product;

  React.useEffect(() => {
    clearCart();
    return () => {
      if (checkoutStatus.current === null) {
        clearCart();
      }
    };
  }, []);
  const headerOffset = tablet ? -137 : -177;

  const [showModal, hideModal] = useModal(
    () => (
      <QuickViewMobile
        modalProps={product}
        hideModal={hideModal}
        deviceType={deviceType}
      />
    ),
    {
      onClose: () => {
        const { pathname, query, asPath } = router;
        const as = asPath;
        router.push(
          {
            pathname,
            query,
          },
          as,
          {
            shallow: true,
          }
        );
      },
    }
  );

  const handleQuickViewModal = () => {
    
    
    const { pathname, query } = router;
    const as = `/${data.slug}/{item}`;

    showModal();
 
  };

  const getPreviewImage = () => {
    return product.image_url ? `https://izmenu.com/${product.image_url}`: 'https://i0.wp.com/danongonline.com.vn/wp-content/uploads/2018/02/anh-girl-xinh-9-1.jpg?fit=624%2C563&ssl=1'
  }

  return (
    <ItemWrapper key={product.id}>
      <PreviewProduct onClick={() => handleQuickViewModal()} src={getPreviewImage()} alt={product.name} />
      <ItemNameDetails onClick={() => handleQuickViewModal()}>
        <ItemName>{product.name}</ItemName>
        <ItemDetails>{product.description}</ItemDetails>
        <ItemDetails>Addons: {product.addons && product.addons.map(m => m.name).join(', ')}</ItemDetails>
      </ItemNameDetails>

      <Button
        variant='select'
        type='button'
        className={isInCart(product.id) ? 'selected' : ''}
        onClick={() => handleAddClick(product)}
      >
        <Minus width='14px' height='14px' />
      </Button>

      <ItemNamePricing>
        <HelpText>
          <FormattedMessage id='fromText' defaultMessage='From' />
          &nbsp;
        </HelpText>
        <ItemPrice>
          {siteConstant.CURRENCY}
          {product.price}
        </ItemPrice>
      </ItemNamePricing>

      <Button
        variant='select'
        type='button'
        className={isInCart(product.id) ? 'selected' : ''}
        onClick={() => handleAddClick(product)}
      >
        <PlusOutline width='14px' height='14px' />
      </Button>
    </ItemWrapper>
  )
};

export default ProductDetailItem;
