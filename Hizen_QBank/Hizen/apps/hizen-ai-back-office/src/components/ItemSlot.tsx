import { Card, Typography } from '@material-tailwind/react';

const ItemSlot = (props: { id?: string; value?: number }) => {
  const { id, value } = props;
  return id ? (
    <Card
      className="relative w-10 h-10 flex items-center justify-center"
      color="cyan"
    >
      <img
        className="w-8 h-8"
        src={window.location.origin + '/ItemIcons/' + id + '.png'}
      />
      <Typography
        color="white"
        className="absolute bottom-0 inset-x-0 text-right font-bold stroke-black stroke-4"
      >
        {value}
      </Typography>
    </Card>
  ) : (
    <></>
  );
};

export default ItemSlot;
