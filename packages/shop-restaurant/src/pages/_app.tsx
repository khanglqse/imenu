import dynamic from 'next/dynamic';
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from 'site-settings/site-theme/default';
import { AppProvider } from 'contexts/app/app.provider';
import { AuthProvider } from 'contexts/auth/auth.provider';
import { LanguageProvider } from 'contexts/language/language.provider';
import { useApollo } from 'utils/apollo';
import { CartProvider } from 'contexts/cart/use-cart';

// Language translation messages
import { GlobalStyle } from 'assets/styles/global.style';
import { messages } from 'site-settings/site-translation/messages';
import 'rc-drawer/assets/index.css';
import 'react-multi-carousel/lib/styles.css';
import 'react-spring-modal/dist/index.css';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import 'components/scrollbar/scrollbar.css';
import '@redq/reuse-modal/lib/index.css';
import 'typeface-lato';
import 'typeface-poppins';
import { useMedia } from 'utils/use-media';
const AppLayout = dynamic(() => import('layouts/app-layout'));


export default function CustomApp({ Component, pageProps }: AppProps) {
  const mobile = useMedia('(max-width: 580px)');
  const tablet = useMedia('(max-width: 991px)');
  const desktop = useMedia('(min-width: 992px)');
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyle />
        <CartProvider>
          <AppProvider>
            <LanguageProvider messages={messages}>
              <AuthProvider>
                <AppLayout>
                  <Component {...pageProps} deviceType={{ mobile, tablet, desktop }}/>
                </AppLayout>
              </AuthProvider>
            </LanguageProvider>
          </AppProvider>
        </CartProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
