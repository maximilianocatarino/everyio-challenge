import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import UserModel from '../src/infrastructure/persistence/user';
import UserFactory from '../src/domain/user/user.factory';
import Task, { TaskData } from '../src/domain/task/task';
import TaskService from '../src/domain/task/task.service';
import TaskRepository from '../src/domain/task/task.repository';
import TaskFactory from '../src/domain/task/task.factory';
import TaskModel, {
  TaskDocumentInterface,
} from '../src/infrastructure/persistence/task';
import PermissionRepository from '../src/domain/authorization/permission.repository';
import PermissionModel, {
  PermissionDocumentInterface,
} from '../src/infrastructure/persistence/permission';
import AuthorizationManager from '../src/domain/authorization/authorization.manager';
import { ForbiddenException } from '@nestjs/common';
import User from '../src/domain/user/user';
import InvalidResourceError from '../src/domain/common/error/invalid.resource.error';
import { TaskStatusEnum } from '../src/domain/task/task.status.enum';
import TaskAlreadyArchievedError from '../src/domain/task/error/task.already.archived.error';
import exp from 'constants';

const createuser = (id: string) => {
  const user: User = new User();
  user.setId(id);
  user.setName('John Doe');
  user.setEmail('jhon.doe@domain.com');
  user.setUsername('jhon.doe');
  return user;
};

const createPermission = (user: User, ability: string, resource: string) => {
  const permission = new PermissionModel();
  permission.ability = ability;
  permission.resource = resource;
  permission.userId = new Types.ObjectId(user.getId());
  return permission;
};

const createTask = (user: User, title: string, description: string) => {
  const taskReturn = new TaskModel();
  taskReturn.title = title;
  taskReturn.description = description;
  taskReturn.user = new UserModel();
  taskReturn.user._id = new Types.ObjectId(user.getId());
  return taskReturn;
};

describe('TaskService', () => {
  let mockPermissionkModel: Model<PermissionDocumentInterface>;
  let mockTaskModel: Model<TaskDocumentInterface>;
  let permissionRepository: PermissionRepository;
  let authorizatioManager: AuthorizationManager;
  let userFactory: UserFactory;
  let taskFactory: TaskFactory;
  let taskRepository: TaskRepository;
  let taskService: TaskService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationManager,
        User,
        UserFactory,
        {
          provide: getModelToken('Permissions'),
          useValue: PermissionModel,
        },
        PermissionRepository,
        {
          provide: getModelToken('Tasks'),
          useValue: TaskModel,
        },
        TaskRepository,
        TaskFactory,
        TaskService,
      ],
    }).compile();

    mockPermissionkModel = module.get<Model<PermissionDocumentInterface>>(
      getModelToken('Permissions'),
    );

    mockTaskModel = module.get<Model<TaskDocumentInterface>>(
      getModelToken('Tasks'),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    userFactory = new UserFactory();
    taskFactory = new TaskFactory(userFactory);
    taskRepository = new TaskRepository(mockTaskModel);
    permissionRepository = new PermissionRepository(mockPermissionkModel);
    authorizatioManager = new AuthorizationManager(permissionRepository);
    taskService = new TaskService(
      taskRepository,
      taskFactory,
      authorizatioManager,
    );
  });

  it('should call getAll and throw ForbiddenException', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);
    const permission = new PermissionModel();
    const data: PermissionDocumentInterface[] = [permission];
    const spy = jest
      .spyOn(mockPermissionkModel, 'find')
      .mockResolvedValue(data);

    try {
      await taskService.getAll();
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenException);
    }

    expect(spy).toBeCalled();
  });

  it('should call getAll and return one task', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);
    const permission = createPermission(user, 'READ', 'TASK');
    const taskReturn = createTask(user, 'Title', 'Description');

    const data: PermissionDocumentInterface[] = [permission];
    const spyPermission = jest
      .spyOn(mockPermissionkModel, 'find')
      .mockResolvedValue(data);

    const spyTask = jest
      .spyOn(mockTaskModel, 'find')
      .mockResolvedValue([taskReturn]);

    const collection = await taskService.getAll();
    expect(collection).toBeDefined();
    expect(collection.length).toBe(1);

    expect(spyPermission).toBeCalled();
    expect(spyTask).toBeCalled();
  });

  it('should call getById and and throw ForbiddenException', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);

    const spyPermission = jest
      .spyOn(mockPermissionkModel, 'find')
      .mockResolvedValue([]);

    try {
      await taskService.getById('633b7325c427776d98de73cc');
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenException);
    }

    expect(spyPermission).toBeCalled();
  });

  it('should call getById and and throw ForbiddenException', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);
    const permission = createPermission(user, 'UPDATE', 'TASK');

    const spyPermission = jest
      .spyOn(mockPermissionkModel, 'find')
      .mockResolvedValue([permission]);

    try {
      await taskService.getById('633b7325c427776d98de73cc');
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenException);
    }

    expect(spyPermission).toBeCalled();
  });

  it('should call getById and and throw InvalidResourceError', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);
    const permission = createPermission(user, 'READ', 'TASK');

    const spyPermission = jest
      .spyOn(mockPermissionkModel, 'find')
      .mockResolvedValue([permission]);

    const spyTask = jest
      .spyOn(mockTaskModel, 'findById')
      .mockResolvedValue(null);

    try {
      await taskService.getById('633b7325c427776d98de73ca');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidResourceError);
    }

    expect(spyPermission).toBeCalled();
    expect(spyTask).toBeCalled();
  });

  it('should call getById and BuSereturn a task', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);
    const permission = createPermission(user, 'READ', 'TASK');
    const taskReturn = createTask(user, 'Title', 'Description');

    const spyPermission = jest
      .spyOn(mockPermissionkModel, 'find')
      .mockResolvedValue([permission]);

    const spyTask = jest
      .spyOn(mockTaskModel, 'findById')
      .mockResolvedValue(taskReturn);

    const result = await taskService.getById('633b7325c427776d98de73ca');
    expect(result).toBeInstanceOf(Task);

    expect(spyPermission).toBeCalled();
    expect(spyTask).toBeCalled();
  });

  it('should call createTaskDocument and return a task', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);

    const spy = jest
      .spyOn(TaskModel.prototype, 'save')
      .mockImplementationOnce(async () => Promise.resolve());

    const taskData = {
      title: 'Title',
      description: 'Description',
    } as TaskData;

    const result = await taskService.createTask(user, taskData);
    expect(result).toBeInstanceOf(Task);
    expect(result.getTitle()).toBe('Title');
    expect(result.getDescription()).toBe('Description');
    expect(result.getStatus()).toBe(TaskStatusEnum.ToDo);
    expect(spy).toBeCalled();
  });

  it('should call updateTask and throw InvalidResourceError', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);

    const spyTask = jest
      .spyOn(mockTaskModel, 'findById')
      .mockResolvedValue(null);

    const taskData = {
      title: 'Title',
      description: 'Description',
    } as TaskData;

    try {
      await taskService.updateTask('633b7325c427776d98de73c1', taskData);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidResourceError);
    }
    expect(spyTask).toBeCalled();
  });

  it('should call updateTask and throw TaskAlreadyArchievedError', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);

    const archived = new TaskModel();
    archived.status = TaskStatusEnum.Archived;

    const spyTask = jest
      .spyOn(mockTaskModel, 'findById')
      .mockResolvedValue(archived);

    const taskData = {
      title: 'Title',
      description: 'Description',
    } as TaskData;

    try {
      await taskService.updateTask('633b7325c427776d98de73c1', taskData);
    } catch (e) {
      expect(e).toBeInstanceOf(TaskAlreadyArchievedError);
    }
    expect(spyTask).toBeCalled();
  });

  it('should call updateTask and return the updated task', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);

    const userStub = new UserModel();
    userStub._id = new Types.ObjectId();

    const task = new TaskModel();
    task._id = new Types.ObjectId();
    task.user = userStub;
    task.status = TaskStatusEnum.InProgress;

    const saveSpy = jest
      .spyOn(task, 'save')
      .mockResolvedValue(Promise.resolve(task));

    const repositorySpy = jest
      .spyOn(mockTaskModel, 'findById')
      .mockResolvedValue(task);

    const taskData = {
      title: 'Updated',
      description: 'Updated',
    } as TaskData;

    const result = await taskService.updateTask(
      '633b7325c427776d98de73c1',
      taskData,
    );

    expect(result).toBeInstanceOf(Task);
    expect(result.getTitle()).toBe('Updated');
    expect(result.getDescription()).toBe('Updated');
    expect(saveSpy).toBeCalled();
    expect(repositorySpy).toBeCalled();
  });

  it('should call archiveTask and throw InvalidResourceError', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);

    const spyTask = jest
      .spyOn(mockTaskModel, 'findById')
      .mockResolvedValue(null);

    try {
      await taskService.archiveTask('633b7325c427776d98de73c1');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidResourceError);
    }
    expect(spyTask).toBeCalled();
  });

  it('should call archiveTask and throw TaskAlreadyArchievedError', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);

    const archived = new TaskModel();
    archived.status = TaskStatusEnum.Archived;

    const spyTask = jest
      .spyOn(mockTaskModel, 'findById')
      .mockResolvedValue(archived);

    try {
      await taskService.archiveTask('633b7325c427776d98de73c1');
    } catch (e) {
      expect(e).toBeInstanceOf(TaskAlreadyArchievedError);
    }
    expect(spyTask).toBeCalled();
  });

  it('should call archiveTask and return the updated task', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);

    const userStub = new UserModel();
    userStub._id = new Types.ObjectId();

    const mock = new TaskModel();
    mock._id = new Types.ObjectId();
    mock.user = userStub;
    mock.status = TaskStatusEnum.InProgress;

    const spyFindById = jest
      .spyOn(mockTaskModel, 'findById')
      .mockResolvedValue(mock);

    const saveSpy = jest
      .spyOn(mock, 'save')
      .mockResolvedValue(Promise.resolve(mock));

    const archived = await taskService.archiveTask('633b7325c427776d98de73c1');

    expect(archived).toBeInstanceOf(Task);
    expect(archived.getStatus()).toBe(TaskStatusEnum.Archived);
    expect(spyFindById).toBeCalled();
    expect(saveSpy).toBeCalled();
  });

  it('should call nextStatus and throw InvalidResourceError', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);

    const spyTask = jest
      .spyOn(mockTaskModel, 'findById')
      .mockResolvedValue(null);

    try {
      await taskService.nextStatus('633b7325c427776d98de73c1');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidResourceError);
    }
    expect(spyTask).toBeCalled();
  });

  it('should call nextStatus and throw TaskAlreadyArchievedError', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);

    const archived = new TaskModel();
    archived.status = TaskStatusEnum.Archived;

    const spyTask = jest
      .spyOn(mockTaskModel, 'findById')
      .mockResolvedValue(archived);

    try {
      await taskService.nextStatus('633b7325c427776d98de73c1');
    } catch (e) {
      expect(e).toBeInstanceOf(TaskAlreadyArchievedError);
    }
    expect(spyTask).toBeCalled();
  });

  it('should call nextStatus and return the updated task', async () => {
    const user: User = createuser('633b7325c427776d98de73cc');
    AuthorizationManager.setUser(user);

    const userStub = new UserModel();
    userStub._id = new Types.ObjectId();
    userStub.name = 'Jhon Doe';
    userStub.email = 'jhon.doe@domain.com';
    userStub.username = 'jhon.doe';

    const task = new TaskModel();
    task._id = new Types.ObjectId();
    task.user = userStub;
    task.title = 'Title';
    task.description = 'Description';
    task.status = TaskStatusEnum.InProgress;

    const findByIdSpy = jest
      .spyOn(mockTaskModel, 'findById')
      .mockResolvedValue(task);

    const saveSpy = jest.spyOn(task, 'save').mockResolvedValue(task);

    const result = await taskService.nextStatus('633b7325c427776d98de73c1');
    expect(result).toBeInstanceOf(Task);
    expect(result.getStatus()).toBe(TaskStatusEnum.Done);
    expect(findByIdSpy).toBeCalled();
    expect(saveSpy).toBeCalled();
  });
});
