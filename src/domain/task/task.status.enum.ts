export enum TaskStatusEnum {
  ToDo = 1,
  InProgress = 2,
  Done = 3,
  Archived = 4,
}

export const taskStatusEnumValues = [1, 2, 3, 4];

export const taskStatusEnumDescripiton = [
  'To Do',
  'In Progress',
  'Done',
  'Archived',
];

export const getEnumByValue = function (value: number): TaskStatusEnum {
  if (taskStatusEnumValues.includes(value)) {
    const text = `${value}`;
    const list: any = {
      '1': 'ToDo',
      '2': 'InProgress',
      '3': 'Done',
      '4': 'Archived',
    };
    const key = list[text] as keyof typeof TaskStatusEnum;
    return TaskStatusEnum[key];
  }
  return TaskStatusEnum.ToDo;
};
