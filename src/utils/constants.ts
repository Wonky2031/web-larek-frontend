import type { TCategory, TCategoryClass } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const categoryMap: Record<TCategory, TCategoryClass> = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	дополнительное: 'additional',
	кнопка: 'button',
	другое: 'other',
};

export const settings = {};
