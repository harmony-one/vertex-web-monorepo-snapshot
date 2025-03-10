import { DEFAULT_TOAST_TTL } from 'client/components/Toast/consts';
import { SignaturePendingNotification } from 'client/modules/notifications/components/SignaturePendingNotification';
import { asyncResult } from '@vertex-protocol/web-common';
import { createToastId } from 'client/utils/createToastId';
import { isUserDeniedError } from 'client/utils/errors/isUserDeniedError';
import { getExecuteErrorMessage } from 'client/utils/errors/getExecuteErrorMessage';
import toast from 'react-hot-toast';
import { ClosePositionErrorNotification } from '../components/positions/ClosePositionErrorNotification';
import { ClosePositionSuccessNotification } from '../components/positions/ClosePositionSuccessNotification';
import {
  ClosePositionNotificationData,
  NotificationDispatchContext,
} from '../types';

export async function handleClosePositionNotificationDispatch(
  closePositionNotificationData: ClosePositionNotificationData,
  context: NotificationDispatchContext,
) {
  const toastId = createToastId('closePosition');
  const { closePositionParams } = closePositionNotificationData;

  if (!context.isSingleSignature) {
    toast.custom(
      (t) => {
        return (
          <SignaturePendingNotification
            action="close_position"
            visible={t.visible}
            onDismiss={() => {
              toast.dismiss(t.id);
            }}
          />
        );
      },
      { id: toastId, duration: Infinity },
    );
  }

  const verifyOrderActionResult = async () => {
    const orderActionResult = await closePositionNotificationData.executeResult;
    if (orderActionResult?.status === 'failure') {
      throw new Error('Server execution result failed');
    }
    return orderActionResult?.status;
  };

  const [, orderActionError] = await asyncResult(verifyOrderActionResult());
  toast.dismiss(toastId);

  if (!orderActionError) {
    toast.custom(
      (t) => {
        return (
          <ClosePositionSuccessNotification
            data={closePositionParams}
            ttl={DEFAULT_TOAST_TTL}
            visible={t.visible}
            onDismiss={() => {
              toast.dismiss(t.id);
            }}
          />
        );
      },
      { id: toastId, duration: DEFAULT_TOAST_TTL },
    );
  } else if (!isUserDeniedError(orderActionError)) {
    toast.custom(
      (t) => {
        return (
          <ClosePositionErrorNotification
            ttl={DEFAULT_TOAST_TTL}
            visible={t.visible}
            error={getExecuteErrorMessage(orderActionError)}
            onDismiss={() => {
              toast.dismiss(t.id);
            }}
          />
        );
      },
      { id: toastId, duration: DEFAULT_TOAST_TTL },
    );
  }
}
