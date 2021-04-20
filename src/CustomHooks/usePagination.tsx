import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

export const usePagination = function (list: Array<any>, updateRef: any) {
  const itemsPerPage = useRef(6);
  const [page, setPage] = useState<number>(0);
  useEffect(() => {
    setPage(0);
  }, [updateRef]);
  const nextPage = useCallback(() => {
    setPage((p) => Math.min(
      p + 1,
      Math.floor(
        list.length % itemsPerPage.current === 0
          ? list.length / itemsPerPage.current - 1
          : list.length / itemsPerPage.current
      )
    )
    );
  }, [list.length]);
  const prePage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 0));
  }, []);
  const visibleList = useMemo(
    () => list.slice(
      page * itemsPerPage.current,
      (page + 1) * itemsPerPage.current 
    ),
    [list, page]
  );
  return {
    nextPage,
    hasNext: page <
      Math.floor(
        list.length % itemsPerPage.current === 0
          ? list.length / itemsPerPage.current - 1
          : list.length / itemsPerPage.current
      ),
    hasPrevious: page > 0,
    page,
    prePage,
    visibleList,
  };
};
