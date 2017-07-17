import { Observable } from 'rxjs/Observable';

export class Project {
  id: number;
  name: string;
  startDate: number;
  endDate: number;
}

export class ProjectService {

  projects: Project[];

  constructor() {
    this.projects = [
      { 
        id: 1, name: 'P1', startDate:1481516469000, endDate: 1497241269000
      },
      {
        id: 2, name: 'P2', startDate: 1479183669000, endDate: 1502511669000
      },
      {
        id: 3, name: 'P3', startDate: 1481516469000, endDate: 1497241269000
      },
    ];
  }

  getData(): Observable<Project[]> {
    return Observable.of(this.projects);
  }
}