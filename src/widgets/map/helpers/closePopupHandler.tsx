import { markersActions } from '@entities/marker';
import type { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import type Overlay from 'ol/Overlay';
import type { MutableRefObject } from 'react';

interface IHandleClosePopup {
	popupOverlayRef: MutableRefObject<Overlay | null>;
	dispatch: Dispatch<UnknownAction>;
}

export const closePopupHandler = ({ popupOverlayRef, dispatch }: IHandleClosePopup) => {
	if (popupOverlayRef.current) {
		popupOverlayRef.current.setPosition(undefined);
	}
	dispatch(markersActions.clearSelectedMarker());
};
