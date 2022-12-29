import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import OrderDetails from "../components/OrderDetails";

export default function SwipeableEdgeDrawer({ handleClose, order }) {
  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={order}
        onClose={handleClose}
        onOpen={handleClose}
        transitionDuration={2000}
      >
        <OrderDetails handleClose={handleClose} order={order} />
      </SwipeableDrawer>
    </>
  );
}
