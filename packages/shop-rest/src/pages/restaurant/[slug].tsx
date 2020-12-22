import { NextPage } from 'next';
import { useRouter } from 'next/router';
import ProductDetailsFood from 'components/product-details/product-details-three/product-details-three';
import { Modal } from '@redq/reuse-modal';
import ProductSingleWrapper, {
  ProductSingleContainer,
} from 'assets/styles/product-single.style';
import { SEO } from 'components/seo';
import { getAllVendors, getVendorBySlug } from 'utils/api/vendor';

type Props = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
  data: any;
};

const ProductPage: NextPage<Props> = ({ data, deviceType }) => {
  const router = useRouter();

  if (router.isFallback) return <p>Loading...</p>;

  return (
    <>
      <SEO
        title={`${data?.name} - PickBazar`}
        description={`${data?.name} Details`}
      />
      <Modal>
        <ProductSingleWrapper>
          <ProductSingleContainer>
            <ProductDetailsFood product={data} deviceType={deviceType} />
          </ProductSingleContainer>
        </ProductSingleWrapper>
      </Modal>
    </>
  );
};

export async function getStaticProps({ params }) {
  // const data = await getVendorBySlug(params.slug);
  const data = {
    id: '1001',
    name: 'Bristo-C Chinese Restaurant',
    slug: 'bristo-c-res',
    previewUrl:
      'https://s3.amazonaws.com/redqteam.com/pickbazar/Food/bristo.jpg',
    thumbnailUrl:
      'https://s3.amazonaws.com/redqteam.com/pickbazar/Food/bristo_thumb.jpg',

    type: 'restaurant', // fixed don't change
    //must be lowercase and - separated
    categories: ['chinese', 'sea-food', 'caribbean', 'thai', 'fast-food'],
    description: 'we provide best Burger',
    deliveryDetails: {
      charge: 'Free',
      minimumOrder: 50,
      isFree: true,
    },
    promotion: '10',
    address: '19 Street Road, Broklyn Newyork',
    products: [
      {
        id: '2001',
        type: 'Burgers',
        name: 'Classic Cheese Burger',
        description:
          'Prepared with a patty, a slice of cheese and special sauce',
        price: 5.0,
        addons: [
          {
            id: '1',
            name: 'khang',
            price: 5,
            
          }
        ]
      },
      {
        id: '2002',
        type: 'Sandwich',

        name: 'Classic Cheese Sandwich',
        description:
          'Prepared with a patty, a slice of cheese and special sauce',
        price: 5.0,
      },
      {
        id: '2003',
        type: 'Sandwich',

        name: 'Grilled Chicken Sub',
        description:
          'Prepared with grilled chicken patty, salad and house signature sauce',
        price: 6.0,
      },
      {
        id: '2004',
        type: 'Chicken',

        name: 'Jerk Chicken',
        description:
          'Chicken prepared wth spices and slow-cooked over a fire or grill',
        price: 10.0,
      },
    ],

    createdAt: new Date(),
    updatedAt: new Date(),
  }
  return {
    props: {
      data,
    },
  };
}
export async function getStaticPaths() {
  const vendors = await getAllVendors();
  return {
    paths: vendors.slice(0, 10).map(({ slug }) => ({ params: { slug } })),
    fallback: true,
  };
}
export default ProductPage;
