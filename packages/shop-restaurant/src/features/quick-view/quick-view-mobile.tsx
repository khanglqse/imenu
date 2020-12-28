import React from 'react';
import Router from 'next/router';
// import { closeModal } from '@redq/reuse-modal';
import { Button } from 'components/button/button';
import {
  QuickViewWrapper,
  ProductDetailsWrapper,
  ProductPreview,
  DiscountPercent,
  ProductInfoWrapper,
  ProductInfo,
  ProductTitlePriceWrapper,
  ProductTitle,
  ProductWeight,
  ProductDescription,
  ButtonText,
  ProductMeta,
  ProductCartWrapper,
  ProductPriceWrapper,
  ProductPrice,
  SalePrice,
  ProductCartBtn,
  MetaSingle,
  MetaItem,
  PriceContainer,
  ModalClose,
  StyledCounter,
} from './quick-view.style';
import { CloseIcon } from 'assets/icons/CloseIcon';
import { CartIcon } from 'assets/icons/CartIcon';

import ReadMore from 'components/truncate/truncate';
import CarouselWithCustomDots from 'components/multi-carousel/multi-carousel';
import { useLocale } from 'contexts/language/language.provider';
import { useCart } from 'contexts/cart/use-cart';
import { FormattedMessage } from 'react-intl';
const CURRENCY = '$'
type QuickViewProps = {
  modalProps: any;
  onModalClose?: any;
  hideModal: () => void;
  deviceType: any;
};

const QuickViewMobile: React.FunctionComponent<QuickViewProps> = ({
  modalProps,
  onModalClose,
  hideModal,
  deviceType,
}) => {
  const { addItem, removeItem, isInCart, getItem, getAddon, updateAddon } = useCart();
  const {
    id,
    type,
    name,
    unit,
    price,
    discountInPercent,
    salePrice,
    description,
    gallery,
    categories,
    addons
  } = modalProps;
  console.log(modalProps)
  const { isRtl } = useLocale();

  const handleAddClick = (e: any) => {
    e.stopPropagation();
    addItem(modalProps);
  };

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItem(modalProps);
  };
  function onCategoryClick(slug) {
    Router.push({
      pathname: `/${type.toLowerCase()}`,
      query: { category: slug },
    }).then(() => window.scrollTo(0, 0));
    hideModal();
  }
  const handleAddOn = (a,b,c) => {
    updateAddon(a,b,c)
  }
  const getPreviewImage = () => {
    return modalProps.image_url ? `https://izmenu.com/${modalProps.image_url}`: 'https://i0.wp.com/danongonline.com.vn/wp-content/uploads/2018/02/anh-girl-xinh-9-1.jpg?fit=624%2C563&ssl=1'
  }
  return (
    <>
      {/* <ModalClose onClick={onModalClose}>
        <CloseIcon />
      </ModalClose> */}
      <QuickViewWrapper className='quick-view-mobile-wrapper'>
        <ProductDetailsWrapper className='product-card' dir='ltr'>
          {!isRtl && (
            <ProductPreview>
              <img src={getPreviewImage()}/>
              {/* <CarouselWithCustomDots items={gallery} deviceType={deviceType} />
              {!!discountInPercent && (
                <DiscountPercent>{discountInPercent}%</DiscountPercent>
              )} */}
            </ProductPreview>
          )}
          <ProductInfoWrapper dir={isRtl ? 'rtl' : 'ltr'}>
            <ProductInfo>
              <ProductTitlePriceWrapper>
                <ProductTitle>{name}</ProductTitle>
              </ProductTitlePriceWrapper>

              <ProductWeight>{unit}</ProductWeight>
              <ProductDescription>
                <ReadMore character={600}>{description}</ReadMore>
              </ProductDescription>

              <ProductMeta>
                <MetaSingle>
                  {categories
                    ? categories.map((item: any) => (
                        <MetaItem
                          onClick={() => onCategoryClick(item.slug)}
                          key={item.id}
                        >
                          {item.title}
                        </MetaItem>
                      ))
                    : ''}
                </MetaSingle>
              </ProductMeta>

              <ProductCartWrapper>
                <ProductDescription>
                  {name}
                </ProductDescription>
                <PriceContainer>
                  

                  <ProductCartBtn>
                    {!isInCart(id) ? (
                      <Button
                        className='cart-button'
                        variant='secondary'
                        borderRadius={100}
                        onClick={handleAddClick}
                      >
                        <CartIcon mr={2} />
                        <ButtonText>
                          <FormattedMessage
                            id='addCartButton'
                            defaultMessage='Cart'
                          />
                        </ButtonText>
                      </Button>
                    ) : (
                      <StyledCounter
                        value={getItem(id).quantity}
                        onDecrement={handleRemoveClick}
                        onIncrement={handleAddClick}
                      />
                    )}
                  </ProductCartBtn>
                  <ProductPriceWrapper>
                    <ProductPrice>
                      {CURRENCY}
                      {salePrice ? salePrice : price}
                    </ProductPrice>

                    {discountInPercent ? (
                      <SalePrice>
                        {CURRENCY}
                        {price}
                      </SalePrice>
                    ) : null}
                  </ProductPriceWrapper>
                </PriceContainer>
              </ProductCartWrapper>
              {addons && addons.length && (
                <React.Fragment>
                  <ProductDescription>
                    Addons:
                  </ProductDescription>
                  
                  {addons.map(addon => (
                    <ProductCartWrapper>
                      <p>
                        {addon.name}
                      </p>
                      <PriceContainer>
                        

                        <ProductCartBtn>
                          <StyledCounter
                            className={!isInCart(id) && 'disabled'}
                            value={getAddon(id, addon.id).quantity || 0}
                            onIncrement={() => handleAddOn(id, addon.id, (getAddon(id, addon.id).quantity || 0) + 1)}
                            onDecrement={() => {
                              if(addon.quantity === 0 ){
                                return;
                              } else {
                                handleAddOn(id, addon.id, (getAddon(id, addon.id).quantity || 0) - 1)
                              }
                            }}
                          />
                        </ProductCartBtn>
                        <ProductPriceWrapper>
                          <ProductPrice>
                            {CURRENCY}
                            {addon.salePrice ? addon.salePrice : addon.price}
                          </ProductPrice>

                          {discountInPercent ? (
                            <SalePrice>
                              {CURRENCY}
                              {addon.price}
                            </SalePrice>
                          ) : null}
                        </ProductPriceWrapper>
                      </PriceContainer>
                    </ProductCartWrapper>
                  ))}
                </React.Fragment>
              )}
              
            </ProductInfo>
          </ProductInfoWrapper>

          {isRtl && (
            <ProductPreview>
              <CarouselWithCustomDots items={gallery} deviceType={deviceType} />
              {!!discountInPercent && (
                <DiscountPercent>{discountInPercent}%</DiscountPercent>
              )}
            </ProductPreview>
          )}
        </ProductDetailsWrapper>
      </QuickViewWrapper>
    </>
  );
};

export default QuickViewMobile;
