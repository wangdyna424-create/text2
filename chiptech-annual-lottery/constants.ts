import { PrizeLevel, PrizeConfig } from './types';

export const RAW_NAMES = "唐启武;曹朋辉;杜秋霞;范栋;胡可斌;胡苗;胡小龙;康林;康雅伟;廖静怡;林秀萍;刘玉;李燕敏;吕明萍;饶小珊;舒坦;唐开华;王德祥;王泽巨;吴邦正;熊启强;杨艳;叶峰;叶鑫伟;余小红;曾静兰;曾振平;张累;周新乐";

export const CANDIDATES_LIST = RAW_NAMES.split(';').filter(name => name.trim().length > 0);

export const PRIZE_CONFIGS: Record<PrizeLevel, PrizeConfig> = {
  [PrizeLevel.Third]: {
    id: PrizeLevel.Third,
    label: '三等奖 - 晶圆级封装奖',
    count: 10,
    color: 'text-emerald-400',
    icon: 'cpu'
  },
  [PrizeLevel.Second]: {
    id: PrizeLevel.Second,
    label: '二等奖 - 光刻先锋奖',
    count: 5,
    color: 'text-cyan-400',
    icon: 'microchip'
  },
  [PrizeLevel.First]: {
    id: PrizeLevel.First,
    label: '一等奖 - 架构宗师奖',
    count: 2,
    color: 'text-purple-400',
    icon: 'zap'
  },
  [PrizeLevel.Grand]: {
    id: PrizeLevel.Grand,
    label: '特等奖 - 摩尔定律突破奖',
    count: 1,
    color: 'text-yellow-400',
    icon: 'award'
  }
};

// Order of drawing: 3rd -> 2nd -> 1st -> Grand
export const DRAW_ORDER = [
  PrizeLevel.Third,
  PrizeLevel.Second,
  PrizeLevel.First,
  PrizeLevel.Grand
];