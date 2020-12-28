import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import ProductDetailsFood from 'features/product-details/product-details-one/product-details-one';
import { Modal } from '@redq/reuse-modal';
import { GET_VENDOR } from 'utils/graphql/query/vendor.query';
import { SEO } from 'components/seo';
import ErrorMessage from 'components/error-message/error-message';
import { Box } from 'components/box';
import { ModalProvider } from 'contexts/modal/modal.provider';
import { useEffect, useState } from 'react';
const axios = require('axios');
type Props = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const ProductPage: NextPage<Props> = ({deviceType}) => {
  const {
    query: { slug },
  } = useRouter();

  let { error, loading } = useQuery(GET_VENDOR, {
    variables: { slug },
  });
  // data = {vendor: {
  //   name: 'Bristo-C Chinese Restaurant',
  //   slug: 'bristo-c-res',
  //   previewUrl:
  //     'https://s3.amazonaws.com/redqteam.com/pickbazar/Food/bristo.jpg',
  //   thumbnailUrl:
  //     'https://s3.amazonaws.com/redqteam.com/pickbazar/Food/bristo_thumb.jpg',

  //   type: 'restaurant', // fixed don't change
  //   //must be lowercase and - separated
  //   categories: ['chinese', 'sea-food', 'caribbean', 'thai', 'fast-food'],
  //   description: 'we provide best Burger',
   
  //   promotion: '10',
  //   address: '19 Street Road, Broklyn Newyork',
  //   products: [
  //     {
  //       id: '2001',
  //       type: 'Burgers',
  //       name: 'Classic Cheese Burger',
  //       description:
  //         'Prepared with a patty, a slice of cheese and special sauce',
  //       price: 5.0,
  //       addons: [
  //         {
  //           id: '1',
  //           name: 'khang',
  //           price: 5,
  //           quantity: 0,
  //         },
  //         {
  //           id: '12',
  //           name: 'test',
  //           price: 5,
  //           quantity: 0,
  //         }
  //       ]
  //     },
  //     {
  //       id: '2002',
  //       type: 'Sandwich',

  //       name: 'Classic Cheese Sandwich',
  //       description:
  //         'Prepared with a patty, a slice of cheese and special sauce',
  //       price: 5.0,
  //     },
  //     {
  //       id: '2003',
  //       type: 'Sandwich',

  //       name: 'Grilled Chicken Sub',
  //       description:
  //         'Prepared with grilled chicken patty, salad and house signature sauce',
  //       price: 6.0,
  //     },
  //     {
  //       id: '2004',
  //       type: 'Chicken',

  //       name: 'Jerk Chicken',
  //       description:
  //         'Chicken prepared wth spices and slow-cooked over a fire or grill',
  //       price: 10.0,
  //     },
  //   ],

  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // }}
  const [data, setData] = useState(null)
  useEffect(() => {
    initDData()

  }, [])
  
  const initDData = () => {
    axios.post('https://demo.izmenu.com/api/web/store/fetch', {})
    .then(function (res) {
      const vendorInfo = res.data?.payload?.data;
      const a = {vendor: {
        name: vendorInfo.store_name,
        address: vendorInfo.account_info.Address,
        previewUrl: 'https://s3.amazonaws.com/redqteam.com/pickbazar/Food/bristo.jpg',
        thumbnailUrl: 'https://s3.amazonaws.com/redqteam.com/pickbazar/Food/bristo_thumb.jpg',
        products: vendorInfo.products.map(m => (
          {...m,
          type: vendorInfo.categories.find((cat) => cat.id === m.category_id).name,
          addons: res.addon_items
          }
        ))
      }}
      setData(a)
    })
    .catch(function (error) {
      console.log(error);
    });
   
  }
  
  if (loading) {
    return <div>loading...</div>;
  }

  if (error) return <ErrorMessage message={error.message} />;
  if (!data) {
    return null
  }
  return (
    <>
      <SEO
        title={`${data?.vendor?.name} - PickBazar`}
        description={`${data?.vendor?.name} Details`}
      />
      <ModalProvider>
        <Modal>
          <Box position="relative" bg="gray.200" pt={[60, 89, 78]} pb={60}>
            <ProductDetailsFood product={data?.vendor} deviceType={deviceType} />
          </Box>
        </Modal>
      </ModalProvider>
    </>
  );
};
export default ProductPage;
