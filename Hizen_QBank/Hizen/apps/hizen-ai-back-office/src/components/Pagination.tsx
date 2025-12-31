import { Button, IconButton } from '@material-tailwind/react';
import { Dispatch, SetStateAction, useState } from 'react';

const Pagination = (props: {
  page: number;
  max: number;
  count: number;
  setPage: Dispatch<SetStateAction<number>>;
}) => {
  const { page, max, count, setPage } = props;

  return (
    <>
      <Button
        variant="outlined"
        size="sm"
        onClick={() => {
          setPage((e) => Math.max(0, e - 1));
        }}
      >
        Previous
      </Button>
      {max > count ? (
        <div className="flex items-center gap-2">
          <IconButton
            variant={page === 0 ? 'outlined' : 'text'}
            onClick={() => setPage(0)}
            size="sm"
          >
            1
          </IconButton>
          {page + 1 > Math.ceil(count / 2) && (
            <IconButton variant="text" size="sm">
              ...
            </IconButton>
          )}
          {Array.from({ length: count - 2 }, (v, i) => {
            let startPage = page - Math.ceil(count / 2) + 2;
            if (startPage < 1) startPage = 1;
            if (startPage + count - 1 > max) startPage = max - count + 1;
            const pageNum = startPage + i;
            return (
              <IconButton
                variant={page === pageNum ? 'outlined' : 'text'}
                onClick={() => setPage(pageNum)}
                size="sm"
              >
                {pageNum + 1}
              </IconButton>
            );
          })}
          {page + 1 < max - count / 2 && (
            <IconButton variant="text" size="sm">
              ...
            </IconButton>
          )}
          <IconButton
            variant={page === max - 1 ? 'outlined' : 'text'}
            onClick={() => setPage(max - 1)}
            size="sm"
          >
            {max}
          </IconButton>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {Array.from(
            {
              length: max,
            },
            (v, i) => i,
          ).map((i) => (
            <IconButton
              variant={page === i ? 'outlined' : 'text'}
              onClick={() => setPage(i)}
              size="sm"
            >
              {i + 1}
            </IconButton>
          ))}
        </div>
      )}
      <Button
        variant="outlined"
        onClick={() => setPage((e) => Math.min(e + 1, max - 1))}
        size="sm"
      >
        Next
      </Button>
    </>
  );
};

export default Pagination;
