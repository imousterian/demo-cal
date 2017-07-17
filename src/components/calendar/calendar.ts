import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { Observable } from 'rxjs/Observable';

import { Project, ProjectService } from '../../services/project.svc';
import { Task, TaskService } from '../../services/task.svc';

import * as moment from 'moment';

@Component({
  selector: 'calendar',
  templateUrl: 'calendar.html'
})

export class CalendarComponent implements OnInit, OnDestroy {

  readonly dayMultiplier: number = 1.8333333333;
  readonly NUMBER_OF_DAYS_CUTOFF: number = 14;
  
  subscr: ISubscription;
  taskByProjectMap: Map<number, Array<any>> = new Map();
  projects: Project[] = [];
  calendarDates: Array<Date> = [];
  today: Date = new Date('1/1/2017');
  threeMonthsAgo: Date = new Date(this.today.getFullYear(), this.today.getMonth() - 3, 1);
  nineMonthsFromNow: Date = new Date(this.today.getFullYear(), this.today.getMonth() + 8, 1);
  todayOffset: number = 0;
  projectOffset: Map<number, number> = new Map();

  constructor(
    private projectSvc: ProjectService,
    private taskSvc: TaskService
    ) {}

  /*
    Creates an array of months
  */
  populateCalendarDates(): void {
    let monthCounter = 0;
    let newDate = new Date();
    while (monthCounter < 12) {
      newDate = new Date(this.threeMonthsAgo);
      newDate.setMonth(newDate.getMonth() + monthCounter);
      this.calendarDates.push(newDate);
      monthCounter += 1;
    }
  }

  /*
    helper method to get a diff between dates in days
  */
  getDaysInBetween(day1: Date, day2: Date): number {
    return moment.duration(moment(day2).diff(moment(day1))).asDays();
  };

  /*
    Sorts projects by start date
  */
  sortProjectsByStartDate(projects: Project[]): Project[] {
    let copy = [...projects];
    let newProjects: Project[] = copy.sort((a,b) => {
      return a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0;
    });
    return newProjects = [...newProjects];
  };

  /*
    Filters out projects outside of calendar window
  */
  filterProjectsByCalendarDate(projects: Project[]): Project[] {
    let copy = [...projects];
    let newProjects: Project[] = copy.filter(project => {
      return new Date(project.endDate) >= this.threeMonthsAgo && new Date(project.startDate) <= this.nineMonthsFromNow;
    });
    return newProjects = [...newProjects];
  };

  /*
    Remaps tasks by projects and calculates duration of each task
  */
  generateTaskByProjectMapForDisplay(tasks: Task[][]): void {
    for (let i = 0; i < tasks.length; i += 1) {
      let taskArray = tasks[i];
      let firstTask = taskArray[0];
      this.taskByProjectMap.set(firstTask.projectID, []);
      if (this.threeMonthsAgo > new Date(firstTask.startDate)) {
        this.projectOffset.set(firstTask.projectID, this.getDaysInBetween(this.threeMonthsAgo, new Date(firstTask.startDate)) * this.dayMultiplier);
      }
      for (let j = 0; j < taskArray.length; j += 1) {
        let ph = taskArray[j];
        let newObj = Object.assign(ph, {}) as any;
        newObj.width = Math.abs(this.getDaysInBetween(new Date(ph.startDate), new Date(ph.endDate)) * this.dayMultiplier - 18); // 18 is to account for arrow on phases
        newObj.daysOffsetWithMultiplier = this.getDaysInBetween(this.threeMonthsAgo, new Date(ph.startDate)) * this.dayMultiplier;
        newObj.daysOffset = this.getDaysInBetween(this.threeMonthsAgo, new Date(ph.startDate));
        this.taskByProjectMap.get(firstTask.projectID).push(newObj);
      }
    }
  }

  /*
    Initializes and gets data, and prepares data for display
  */
  ngOnInit() {
    
    this.populateCalendarDates();
    this.todayOffset = this.getDaysInBetween(this.threeMonthsAgo, this.today) * this.dayMultiplier;
    let tempProjects: Project[] = [];

    let data = this.projectSvc.getData()
      .map((projects) => {
        tempProjects = [...projects];
        return projects.map(pr => pr.id);
      })
      .mergeMap((projectIds) => {
        return Observable.forkJoin(projectIds.map((projectId) => {
          return this.taskSvc.getByID(projectId);
        }));
      });

    this.subscr = data.subscribe((finalResult) => {
      this.projects = [...tempProjects];
      this.projects = [...this.filterProjectsByCalendarDate(this.projects)];
      this.projects = [...this.sortProjectsByStartDate(this.projects)];

      this.generateTaskByProjectMapForDisplay(finalResult);
    });
  }

  ngOnDestroy() {
    this.subscr.unsubscribe();
  }

}