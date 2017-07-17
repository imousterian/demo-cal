import { Observable } from 'rxjs/Observable';

export class Task {
  id: number;
  name: string;
  projectID: number;
  startDate: number;
  endDate: number;
}

export class TaskService {

  tasks: Task[];

  constructor() {
    this.tasks = [
      { 
        id: 1, name: 'Task1', projectID: 1, startDate: 1481516469000, endDate: 1484194869000
      },
      { 
        id: 2, name: 'Task2', projectID: 1, startDate: 1484367669000, endDate: 1487046069000
      },
      { 
        id: 3, name: 'Task3', projectID: 1, startDate:1487046069000, endDate: 1492143669000
      },
      { 
        id: 4, name: 'Task4', projectID: 1, startDate: 1492575669000, endDate: 1497241269000
      },
      { 
        id: 5, name: 'Task1', projectID: 2, startDate:1479183669000, endDate: 1481775669000
      },
      { 
        id: 6, name: 'Task2', projectID: 2, startDate: 1482034869000, endDate: 1484713269000
      },
      {
        id: 7, name: 'Task3', projectID: 2, startDate:1487391669000, endDate: 1489292469000
      },
      { 
        id: 8, name: 'Task4', projectID: 2, startDate: 1489292469000, endDate: 1502511669000
      },
      { 
        id: 9, name: 'Task1', projectID: 3, startDate: 1481516469000, endDate: 1484194869000
      },
      { 
        id: 10, name: 'Task2', projectID: 3, startDate: 1484367669000, endDate: 1487046069000
      },
      { 
        id: 11, name: 'Task3', projectID: 3, startDate:1487046069000, endDate: 1492143669000
      },
      { 
        id: 12, name: 'Task4', projectID: 3, startDate: 1492575669000, endDate: 1497241269000
      },
    ];
  }

  getByID(projectID: number): Observable<Task[]> {
    let _tasks: Task[] = this.tasks.filter(t => t.projectID === projectID);
    return Observable.of(_tasks);
  }

  getData(): Observable<Task[]> {
    return Observable.of(this.tasks);
  }
}