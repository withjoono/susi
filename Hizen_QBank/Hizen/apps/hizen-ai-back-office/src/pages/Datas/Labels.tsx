import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import { Button, Card, CardHeader, Input } from '@material-tailwind/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Labels = () => {
  const [labels, setLabels] = useState<{ [key: string]: LabelDto }>({});

  const [keyword, setKeyword] = useState('');

  return (
    <>
      <Breadcrumb pageName="Labels" />

      <Card className="w-full overflow-hidden">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="my-4 flex flex-col gap-8 md:flex-row md:items-center">
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
            </div>

            <span className="m-auto" />
          </div>
        </CardHeader>
      </Card>
    </>
  );
};

export default Labels;
