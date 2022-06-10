import { useEffect } from 'react';
import { Veriff } from '@veriff/js-sdk';
import { createVeriffFrame, MESSAGES } from '@veriff/incontext-sdk';
import { nanoid } from 'nanoid';
import { useSelector, useDispatch } from 'react-redux';
import notifier from '../../service/notify.service';
import { postVeriffSessionId } from '../../service/user.service';
import { RESPONSE_MESSAGE } from './constants';

export const useVeriff = ({ show, setShow }) => {
  const dispatch = useDispatch();
  const { veriffUserId } = useSelector((state) => state?.auth?.user || '');

  useEffect(() => {
    if (!show) return;

    const storagedVendorData = veriffUserId || nanoid(30);

    const veriff = Veriff({
      apiKey: process.env.REACT_APP_VERIFF_API_KEY,
      parentId: 'veriff-root',
      onSession(err, response) {
        const { status } = response;

        if (status === RESPONSE_MESSAGE.SUCCESS) {
          const {
            verification: { url },
          } = response;

          createVeriffFrame({
            url,
            onEvent(msg) {
              // eslint-disable-next-line default-case
              switch (msg) {
                case MESSAGES.CANCELED:
                  setShow((prev) => !prev);
                  break;
                case MESSAGES.FINISHED:
                  setShow((prev) => !prev);
                  break;
              }
            },
          });
          const token = localStorage.getItem('token');

          if (!veriffUserId) {
            postVeriffSessionId({ veriffUserId: storagedVendorData, token })
              .then((data) => notifier.success(data.message))
              .catch((error) => notifier.error(error.message));
          }
        }
      },
    });

    veriff.setParams({
      vendorData: storagedVendorData,
      person: { givenName: ' ', lastName: ' ' },
    });

    veriff.mount();
  }, [dispatch, show, veriffUserId]);
};
