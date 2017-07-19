import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, ConnectionBackend, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CalendarComponent } from './calendar';
import { Project, ProjectService } from '../../services/project.svc';
import { TaskService } from '../../services/task.svc';

describe('Calendar Component:', () => {
  let comp: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let de: DebugElement;

  beforeEach(() => {

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [FormsModule, RouterTestingModule.withRoutes([])],
      declarations: [CalendarComponent],
      providers: [
        ProjectService,
        TaskService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        }
      ],
    });
    fixture = TestBed.createComponent(CalendarComponent);
    fixture.detectChanges();
    comp = fixture.componentInstance;
    comp.today = new Date('06/01/2017');
    de = fixture.debugElement;
  });

  describe('.constructor()', () => {
    it('Should be defined', () => {
      expect(comp).toBeDefined();
    });
  });
  describe('.sortProjectsByStartDate()', () => {
    it('Should sort projects in asc order', () => {
      let projectsToSort = [
        { id: 1, startDate: 1498074504000 }, // 6/21/2017
        { id: 2, startDate: 1495396104000 }, // 5/21/2017
        { id: 3, startDate: 1466538504000 }, // 6/21/2016
        { id: 4, startDate: 1498074504000 }, // 6/21/2017
      ] as Project[];
      let sortedProjects = comp.sortProjectsByStartDate(projectsToSort);
      expect(sortedProjects[0].id).toEqual(3);
    });
  });
  describe('.filterProjectsByCalendarDate()', () => {
    it('Should filter projects based on a date from three months ago and nine months ahead', () => {
      let projectsToFilter = [
        { id: 1, startDate: 1498074504000, endDate:  1498074504000}, // 6/21/2017
        { id: 2, startDate: 1495396104000, endDate:  1495396104000}, // 5/21/2017
        { id: 3, startDate: 1466538504000, endDate:  1466538504000}, // 6/21/2016
        { id: 4, startDate: 1526932104000, endDate:  1526932104000}, // 5/21/2018
      ] as Project[];
      let filteredProjectIDs = comp.filterProjectsByCalendarDate(projectsToFilter).map(i => i.id);
      expect(filteredProjectIDs).toEqual([1,2]);
    });
  });
});