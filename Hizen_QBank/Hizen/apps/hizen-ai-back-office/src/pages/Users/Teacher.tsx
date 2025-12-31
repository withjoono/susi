import React from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from '@material-tailwind/react';

const Teacher = () => {
  const { uid } = useParams();

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="선생님 상세 정보" />

      <div className="flex flex-col gap-5">
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div>
                <Typography variant="h5" color="blue-gray">
                  선생님 정보
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  선생님 ID: {uid}
                </Typography>
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-auto px-0">
            <div>{/* Content will be added here */}</div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Teacher;
