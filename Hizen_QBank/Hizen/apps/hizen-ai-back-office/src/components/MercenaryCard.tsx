import { useMemo } from 'react';
import RarityColors from '../common/RarityColors';
import MercenaryDataTable from '../tables/MercenaryDataTable.json';
import SkillDataTable from '../tables/SkillDataTable.json';
import { Card, Tooltip, Typography } from '@material-tailwind/react';

import StarGray from '../images/icon/star_gray.png';
import Star from '../images/icon/star.png';

const MercenaryCard = (props: { mercenary?: MercenaryDto }) => {
  const { mercenary } = props;

  const data = useMemo(() => {
    if (!mercenary) return null;
    const data = MercenaryDataTable.datas.find((e) => e.id == mercenary.id);
    return data;
  }, [mercenary]);

  return mercenary ? (
    <Tooltip
      content={
        <div className="w-auto">
          <Typography color="white" className="font-medium">
            Skills
          </Typography>
          {mercenary.skill_ids.map((id, i) => {
            const skillData = SkillDataTable.datas.find((e) => e.id === id);
            const skillTier = mercenary.skill_tiers[i];
            return (
              <Typography
                variant="small"
                color="white"
                className="font-normal opacity-80"
              >
                {skillData?.description.replace(
                  '{0}',
                  skillData.values[5 - skillTier].toString(),
                )}
              </Typography>
            );
          })}
        </div>
      }
    >
      <Card
        className="relative w-18 h-25 flex flex-col items-center overflow-hidden justify-between"
        style={{ backgroundColor: RarityColors[data?.rarity!] }}
      >
        {(mercenary.slot_number === null ? -1 : mercenary.slot_number) > -1 && (
          <div className="absolute z-20 inset-x-0 top-0 h-5 bg-[#00000092] flex flex-col align-center text-[#ffffff] text-center text-xs">
            Equiped
          </div>
        )}
        <img
          src={window.location.origin + '/TowerImages/' + data?.icon + '.png'}
          className="w-full h-[70%] -translate-y-[5%] scale-150 object-contain"
        />
        <p className="w-full h-[30%] z-10 bg-[#00000092] p-1 flex flex-col justify-center items-center text-center text-[#ffffff] text-xs p-1">
          <div className="flex items-center justify-center">
            {Array.from(
              { length: Math.ceil((data?.rarity ?? 0) / 2) + 1 },
              (v, i) => i,
            ).map((i) => (
              <img
                src={i < mercenary.star ? Star : StarGray}
                className="w-3 h-3 object-contain"
              />
            ))}
          </div>
          Lv.{mercenary.level}
        </p>
      </Card>
    </Tooltip>
  ) : (
    <Card className="w-18 h-25 bg-[#eeeeee] flex items-center justify-center">
      <p className="text-[#2b2b2b]">Empty</p>
    </Card>
  );
};

export default MercenaryCard;
