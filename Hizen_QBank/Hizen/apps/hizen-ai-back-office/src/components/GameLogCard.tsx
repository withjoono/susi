import { ArrowRightIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Card, Tooltip, Typography } from '@material-tailwind/react';

import TowerDataTable from '../tables/TowerDataTable.json';
import AbilityDataTable from '../tables/BattleAbilityDataTable.json';
import RarityColors from '../common/RarityColors';

import KillIcon from '../images/icon/kill.png';
import { TowerTypeIcons } from '../common/Images';

import AdsSpeedIcon from '../images/icon/ads_speed.png';
import AdsGoodsIcon from '../images/icon/ads_goods.png';
import AdsCannonIcon from '../images/icon/ads_cannon.png';
import AdsPromotionIcon from '../images/icon/ads_promotion.png';
import { ItemIds } from '../common/Utils';

const GameLogCard = (props: { log: GameLogDto }) => {
  const { log } = props;

  return (
    <Tooltip content={JSON.stringify(log)}>
      <div className="min-h-20 w-full h-full flex items-center gap-2">
        <div className="w-60 flex items-center gap-4">
          <ClockIcon className="w-6 h-6 text-black" />
          <Typography variant="h6" className="text-left">
            {log.time.toFixed(2)}
          </Typography>
          <Typography variant="h6" className="text-left">
            {log.log}
          </Typography>
        </div>
        {log.log === 'item' && (
          <div className="flex flex-col p-8">
            <div className="flex items-center gap-2">
              <img
                src={window.location.origin + '/ItemIcons/' + log.id + '.png'}
                className="w-6 h-6 object-contain"
              />
              <Typography variant="h5" className="text-left">
                {log.value}
              </Typography>
            </div>
            <Typography variant="h6" className="text-left">
              {log.message}
            </Typography>
          </div>
        )}
        {log.log === 'spawn_tower' && (
          <div className="flex items-center gap-4 p-8">
            <img
              src={
                window.location.origin +
                '/TowerImages/' +
                TowerDataTable.datas.find((e) => e.id === log.id)!.icon +
                '.png'
              }
              className="w-20 h-20 -translate-y-[20%] scale-150 object-contain"
            />
            <div
              className="w-10 h-10"
              style={{ backgroundColor: RarityColors[log.rarity] }}
            />
            <Typography variant="h6">Slot: {log.slot_number}</Typography>
          </div>
        )}
        {log.log === 'kill_monster' && (
          <div className="flex items-center gap-4 p-8">
            <img src={KillIcon} className="w-10 h-10 object-contain" />
            <Typography variant="h6">Wave: {log.wave}</Typography>
          </div>
        )}
        {log.log === 'sell_tower' && (
          <div className="flex items-center gap-4 p-8">
            <img
              src={
                window.location.origin +
                '/TowerImages/' +
                TowerDataTable.datas.find((e) => e.id === log.id)!.icon +
                '.png'
              }
              className="w-20 h-20 -translate-y-[20%] scale-150 object-contain"
            />
            <div
              className="w-10 h-10"
              style={{
                backgroundColor:
                  RarityColors[
                    TowerDataTable.datas.find((e) => e.id === log.id)?.rarity!
                  ],
              }}
            />
            <Typography variant="h6">Slot: {log.slot_number}</Typography>
          </div>
        )}
        {log.log === 'ascend_tower' && (
          <div className="flex items-center gap-4 p-8">
            <img
              src={
                window.location.origin +
                '/TowerImages/' +
                TowerDataTable.datas.find((e) => e.id === log.before_id)!.icon +
                '.png'
              }
              className="w-20 h-20 -translate-y-[20%] scale-150 object-contain"
            />
            <div
              className="w-10 h-10"
              style={{
                backgroundColor:
                  RarityColors[
                    TowerDataTable.datas.find((e) => e.id === log.before_id)
                      ?.rarity!
                  ],
              }}
            />
            <ArrowRightIcon className="w-6 h-6 object-contain" />
            <img
              src={
                window.location.origin +
                '/TowerImages/' +
                TowerDataTable.datas.find((e) => e.id === log.after_id)!.icon +
                '.png'
              }
              className="w-20 h-20 -translate-y-[20%] scale-150 object-contain"
            />
            <div
              className="w-10 h-10"
              style={{
                backgroundColor:
                  RarityColors[
                    TowerDataTable.datas.find((e) => e.id === log.after_id)
                      ?.rarity!
                  ],
              }}
            />
            <Typography variant="h6">Slot: {log.slot_number}</Typography>
          </div>
        )}
        {log.log === 'upgrade_tower' && (
          <div className="flex items-center gap-4 p-8">
            <img
              src={TowerTypeIcons[log.type]}
              className="w-10 h-10 object-contain"
            />
            <Typography variant="h6">
              Level: {log.level_before}
              {' > '}
              {log.level_after}
            </Typography>
          </div>
        )}
        {log.log === 'watch_ads' && (
          <div className="flex items-center gap-4 p-8">
            <img
              src={
                log.id === 'speed'
                  ? AdsSpeedIcon
                  : log.id === 'goods'
                  ? AdsGoodsIcon
                  : log.id === 'cannon'
                  ? AdsCannonIcon
                  : AdsPromotionIcon
              }
              alt={log.id}
              className="w-15 h-15 object-contain"
            />
            <img
              className="w-10 h-10 object-contain"
              src={
                window.location.origin +
                '/ItemIcons/' +
                ItemIds.AdsTicketId +
                '.png'
              }
            />
            <Typography variant="h6">
              UseTicket:
              {log.use_ticket === true ? ' -1' : ' X'}
            </Typography>
          </div>
        )}
        {log.log === 'select_ability' && (
          <div className="flex items-center gap-4 p-8">
            {log.options.map((option: string) => (
              <img
                className={
                  option === log.select
                    ? 'w-20 h-20 object-contain'
                    : 'w-10 h-10 object-contain grayscale'
                }
                src={
                  window.location.origin +
                  '/AbilityImages/' +
                  AbilityDataTable.datas.find((e) => e.id === option)
                    ?.iconPath +
                  '.png'
                }
              />
            ))}
            <Typography variant="h6">
              {AbilityDataTable.datas.find((e) => e.id === log.select)?.title}
            </Typography>
          </div>
        )}
      </div>
    </Tooltip>
  );
};

export default GameLogCard;
