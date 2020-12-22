import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { CartContext } from 'contexts/cart/cart.context';
import {
  CartPopupBody,
  PopupHeader,
  PopupItemCount,
  CloseButton,
  ItemCards,
  ItemImgWrapper,
  ItemDetails,
  ItemTitle,
  ItemPrice,
  ItemWeight,
  TotalPrice,
  PromoCode,
  DeleteButton,
  CheckoutButtonWrapper,
  CheckoutButton,
  Title,
  PriceBox,
  NoProductMsg,
  ItemWrapper,
  CouponBoxWrapper,
  CouponCode,
  ErrorMsg,
  AddonItem,
} from './CartItemCard.style';
import { CloseIcon } from 'components/AllSvgIcon';
import dynamic from 'next/dynamic';
import { ShoppingBagLarge } from 'components/AllSvgIcon';
import InputNumber from 'components/InputIncDec/InputIncDec';
import { calculateItemPrice } from 'helper/utility';
import { CURRENCY } from 'helper/constant';
import { Product } from 'interfaces';
import { FormattedMessage } from 'react-intl';
import { useDeviceType } from 'helper/useDeviceType';
import { openModal, closeModal } from '@redq/reuse-modal';

import CouponBox from 'components/CouponBox/CouponBox';

import { Scrollbars } from 'react-custom-scrollbars';

type CartItemProps = {
  product: Product;
  update: Function;
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

type CartPropsType = {
  scrollbarHeight?: string;
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
  onCloseBtnClick?: (e: any) => void;
};

const APPLY_COUPON = gql`
  mutation applyCoupon($code: String!) {
    applyCoupon(code: $code) {
      id
      code
      discountInPercent
    }
  }
`;

const QuickView = dynamic(() => import('../QuickView/QuickView'));



const CartItem: React.FC<CartItemProps> = ({ product, update, deviceType }) => {
  // Quick View Modal
  const router = useRouter();

  const handleModalClose = () => {
    const href = `${router.pathname}`;
    const as = '/';
    router.push(href, as, { shallow: true });
    closeModal();
  };
  
const handleQuickViewModal = React.useCallback(
  (modalProps: any, deviceType: any, onModalClose: any) => {

    if (router.pathname === '/product/[slug]') {
      const as = `/product/${modalProps.slug}`;
      router.push(router.pathname, as);
      return;
    }
    openModal({
      show: true,
      overlayClassName: 'quick-view-overlay',
      closeOnClickOutside: false,
      component: QuickView,
      componentProps: { modalProps, deviceType, onModalClose },
      closeComponent: 'div',
      config: {
        enableResizing: false,
        disableDragging: true,
        className: 'quick-view-modal',
        width: 900,
        y: 30,
        height: 'auto',
        transition: {
          mass: 1,
          tension: 0,
          friction: 0,
        },
      },
    });
    const href = `${router.pathname}?${modalProps.slug}`;
    const as = `/product/${modalProps.slug}`;
    router.push(href, as, { shallow: true });
  },
  []
);

  const itemPrice = calculateItemPrice(product);
  return (
    <ItemCards key={product.id}>
      {/* <InputNumber
        type='vertical'
        value={product.quantity}
        onUpdate={(value: number) => update(product.id, value)}
        style={{ marginRight: 15 }}
      /> */}

      <ItemImgWrapper>
        <img
          className='ListImage'
          src={product.image}
          height='150'
          width='150'
        />
      </ItemImgWrapper>

      <ItemDetails onClick={() => handleQuickViewModal(product, deviceType, handleModalClose)}>
        <AddonItem>
          <ItemWeight>
            {product.quantity ? product.quantity : 0} x {product.title} 
          </ItemWeight>
          <div>
            {CURRENCY}
            <span>{product.quantity ? product.quantity*(product.salePrice ? product.salePrice : product.price): 0}</span>
          </div>
        </AddonItem>
        {product.addons?.map((addon) => (
          <AddonItem>
            <ItemWeight>
              {addon.quantity ? addon.quantity : 0} x {addon.title} 
            </ItemWeight>
            <div>
              {CURRENCY}
              <span>{addon.quantity ? addon.quantity*addon.price: 0}</span>
            </div>
          </AddonItem>
        ))}
      </ItemDetails>

      <DeleteButton onClick={() => update(product.id, 0)}>
        <CloseIcon />
      </DeleteButton>
    </ItemCards>
  );
};
// For showing demo only -Ends here ... delete this codes when you work on functin code and comment out bellow codes

const Cart: React.FC<CartPropsType> = ({
  deviceType,
  onCloseBtnClick,
  scrollbarHeight,
}) => {
  const { products, totalPrice, update, addCoupon, coupon } = useContext(
    CartContext
  );
  const [couponText, setCoupon] = useState('');
  const [displayCoupon, showCoupon] = useState(false);
  const [error, setError] = useState('');
  const [applyedCoupon] = useMutation(APPLY_COUPON);

  const handleApplyCoupon = async () => {
    const {
      data: { applyCoupon },
    }: any = await applyedCoupon({
      variables: { code: couponText },
    });
    if (applyCoupon && applyCoupon.discountInPercent) {
      setError('');
      addCoupon(applyCoupon);
      setCoupon('');
    } else {
      setError('Invalid Coupon');
    }
  };

  const handleChange = (value: string) => {
    setCoupon(value);
  };

  const toggleCoupon = () => {
    showCoupon(true);
  };

  return (
    <CartPopupBody>
      <PopupHeader>
        <PopupItemCount>
          <ShoppingBagLarge width='19px' height='24px' />
          <span>
            {products && products.length}{' '}
            {products.length > 1 ? (
              <FormattedMessage id='cartItems' defaultMessage='items' />
            ) : (
              <FormattedMessage id='cartItem' defaultMessage='item' />
            )}
          </span>
        </PopupItemCount>

        <CloseButton onClick={onCloseBtnClick}>
          <CloseIcon />
        </CloseButton>
      </PopupHeader>

      <Scrollbars universal autoHide autoHeight autoHeightMax={scrollbarHeight}>
        <ItemWrapper>
          {products && products.length ? (
            products.map(item => (
              <CartItem
                deviceType={deviceType}
                key={`cartItem-${item.id}`}
                update={update}
                product={item}
              />
            ))
          ) : (
            <NoProductMsg>
              <FormattedMessage
                id='noProductFound'
                defaultMessage='No products found'
              />
            </NoProductMsg>
          )}
        </ItemWrapper>
      </Scrollbars>

      <CheckoutButtonWrapper>
        <PromoCode>
          {!coupon.discountInPercent ? (
            <>
              {!displayCoupon ? (
                <button onClick={toggleCoupon}>
                  <FormattedMessage
                    id='specialCode'
                    defaultMessage='Have a special code?'
                  />
                </button>
              ) : (
                <CouponBoxWrapper>
                  <CouponBox
                    onUpdate={handleChange}
                    value={couponText}
                    onClick={handleApplyCoupon}
                    disabled={!couponText.length || !products.length}
                    buttonTitle='Apply'
                    intlCouponBoxPlaceholder='couponPlaceholder'
                    style={{
                      boxShadow: '0 3px 6px rgba(0, 0, 0, 0.06)',
                    }}
                  />
                  {error ? <ErrorMsg>{error}</ErrorMsg> : ''}
                </CouponBoxWrapper>
              )}
            </>
          ) : (
            <CouponCode>
              <FormattedMessage
                id='couponApplied'
                defaultMessage='Coupon Applied'
              />
              <span>{coupon.code}</span>
            </CouponCode>
          )}
        </PromoCode>

        {products.length !== 0 ? (
            <CheckoutButton onClick={() => console.log(products)}>
              <>
                <Title>
                  <FormattedMessage
                    id='navlinkCheckout'
                    defaultMessage='Checkout'
                  />
                </Title>
                <PriceBox>
                  {CURRENCY}
                  {parseFloat(`${totalPrice}`).toFixed(2)}
                </PriceBox>
              </>
            </CheckoutButton>
        ) : (
          <CheckoutButton>
            <>
              <Title>
                <FormattedMessage
                  id='navlinkCheckout'
                  defaultMessage='Checkout'
                />
              </Title>
              <PriceBox>
                {CURRENCY}
                {parseFloat(`${totalPrice}`).toFixed(2)}
              </PriceBox>
            </>
          </CheckoutButton>
        )}
      </CheckoutButtonWrapper>
    </CartPopupBody>
  );
};

export default Cart;
