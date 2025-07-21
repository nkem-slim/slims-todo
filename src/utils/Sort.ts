interface TaskWithCreatedAt {
  created_at: string | number | Date;
}

const Sort = <T extends TaskWithCreatedAt>(task: T[]): T[] => {
  return task.sort((a, b) =>
    a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0
  );
};

export default Sort;
