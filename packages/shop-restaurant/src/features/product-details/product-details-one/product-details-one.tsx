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
import ProductDetailItem from './product-details-item';

const QuickViewMobile = dynamic(
  () => import('features/quick-view/quick-view-mobile')
);
type ProductDetailsProps = {
  product: any;
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const ProductDetails: React.FunctionComponent<ProductDetailsProps> = ({
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
  const productGroups = groupBy(data?.products, 'type');

  const headerOffset = tablet ? -137 : -177;

  const [showModal, hideModal] = useModal(
    () => (
      <QuickViewMobile
        modalProps={currentItem}
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



  return (
    <ModalProvider>
      <ProductDetailsWrapper>
        <ProductPreview>
          <img src={data.previewUrl} alt={data.name} />
        </ProductPreview>
        <div id='cart-sticky'>
          <RestaurantMeta id='restaurantMeta'>
            <RestaurantNameAddress>
              <RestaurantName>{data.name}</RestaurantName>
              <RestaurantAddress>{data.address}</RestaurantAddress>
            </RestaurantNameAddress>

            {/* <RestaurantOtherInfos>
              <InfoBlock>
                <Label>
                  <FormattedMessage id='cuisineText' defaultMessage='Cuisine' />
                </Label>
                <Infos>{data?.categories?.join(', ')}</Infos>
              </InfoBlock>

              <InfoBlock>
                <Label>
                  <FormattedMessage
                    id='minOrderText'
                    defaultMessage='Min Order'
                  />
                </Label>
                <Infos>
                  {siteConstant.CURRENCY}
                  {data?.deliveryDetails?.minimumOrder}
                </Infos>
              </InfoBlock>

              <DeliveryOpt>
                {data?.deliveryDetails?.isFree ? '' : siteConstant.CURRENCY}
                {data?.deliveryDetails?.charge}
                <br />{' '}
                <FormattedMessage id='deliveryText' defaultMessage='Delivery' />
              </DeliveryOpt>
            </RestaurantOtherInfos> */}
          </RestaurantMeta>

          <Sticky top={tablet ? 68 : 78} innerZ={999}>
            <CategoriesWrapper>
              <CategoriesInner>
                {Object.keys(productGroups).map((item, index) => (
                  <Link
                    activeClass='active'
                    className='category'
                    to={Object.keys(productGroups)[index]}
                    offset={headerOffset}
                    spy={true}
                    smooth={true}
                    duration={500}
                    key={index}
                  >
                    {item}
                  </Link>
                ))}
              </CategoriesInner>
            </CategoriesWrapper>
          </Sticky>
        </div>

        <MainContent>
          <MenuContainer>
            {Object.values(productGroups).map((items: any, idx: number) => (
              <Element name={Object.keys(productGroups)[idx]} key={idx}>
                <ItemCategoryWrapper id={Object.keys(productGroups)[idx]}>
                  <ItemCategoryName>
                    {Object.keys(productGroups)[idx]}
                  </ItemCategoryName>
                </ItemCategoryWrapper>
                {items.map((item) => (
                  <ProductDetailItem key={item.id} product={item} deviceType={deviceType} />
                ))}
              </Element>
            ))}
          </MenuContainer>

          <CartWrapper>
            <Sticky top='#cart-sticky' innerZ={999}>
              <FixedCart
                scrollbarHeight='100vh'
                className='fixedCartBox'
                style={{
                  height: `calc(100vh - 193px)`,
                }}
                onCheckout={() => {
                  toggleRestaurant();
                  checkoutStatus.current = true;
                }}
              />
            </Sticky>
          </CartWrapper>

          <FixedCartPopup
            onCheckout={() => {
              toggleRestaurant();
              checkoutStatus.current = true;
            }}
          />
        </MainContent>
      </ProductDetailsWrapper>
    </ModalProvider>
  );
};

export default ProductDetails;
