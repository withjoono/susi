import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@material-tailwind/react';

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ pageName }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Typography variant="h5" color="blue-gray">
        {pageName}
      </Typography>

      <nav className="flex">
        <ol className="flex items-center gap-2">
          <li>
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              홈
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
