import styled from 'styled-components';
import css from '@styled-system/css';
import { justifyContent } from 'styled-system';
export const ItemBox = styled.div(
  css({
    fontSize: 'base',
    fontWeight: 'bold',
    py: 15,
    px: 25,
    borderBottom: `1px solid`,
    borderBottomColor: 'gray.200',
    justifyContent: 'space-between',
  }),
  {
    display: 'flex',
    alignItems: 'center',
  }
);
export const Information = styled.div({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '15px',
});
export const Image = styled.img({
  width: 60,
  height: 60,
  objectFit: 'cover',
  margin: '0 15px',
});
export const Name = styled.span(
  css({
    fontWeight: 'md',
    color: 'text.bold',
    mb: '0px',
    lineHeight: 1.5,
  })
);
export const GroupItem = styled.div(
  css({
    display: 'flex',
    flexDirection: 'column',
    'flex-basis': '80%',
  })
)
export const ItemContainer = styled.div(
  css({
    display: 'flex',
    justifyContent: 'space-between'
  })
)
export const ItemCount = styled.div(
  css({
    fontSize: '0.8em',
    marginLeft: '8px'
  })
)
export const Title = styled.div(
  css({
    display: 'flex',
    alignItems: 'flex-end'
  })
)

export const Price = styled.span(
  css({
    color: 'primary.regular',
    mt: '10px',
    mb: '10px',
  })
);
export const Weight = styled.span(
  css({
    fontSize: 'sm',
    fontWeight: 'regular',
    color: 'text.regular',
    mb: '5px',
  })
);
export const Total = styled.span(
  css({
    color: 'text.bold',
    ml: 'auto',
  })
);

export const RemoveButton = styled.button({
  padding: '5px',
  border: 0,
  outline: 0,
  marginLeft: '15px',
  cursor: 'pointer',
  color: 'rgba(0, 0, 0, 0.25)',
  transition: 'all 0.4s ease',
  backgroundColor: 'transparent',

  '&:hover': {
    color: 'red',
  },
});
